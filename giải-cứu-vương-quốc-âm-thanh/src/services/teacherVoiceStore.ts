/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

type VoiceStoreListener = () => void;

interface StoredVoice {
  slideNumber: number;
  dataUrl: string;
  duration?: number;
  timestamp: number;
}

class TeacherVoiceStore {
  private listeners: VoiceStoreListener[] = [];
  private memoryCache = new Map<number, string>();
  private preferRealVoice = true;
  private isLiveTeachingMode = false; // When true: teacher speaks live in person, app mutes narration voice
  private dbPromise: Promise<IDBDatabase | null> | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedPref = localStorage.getItem('vn_sound_prefer_real_teacher_voice');
      if (savedPref !== null) {
        this.preferRealVoice = savedPref === 'true';
      }
      const savedLive = localStorage.getItem('vn_sound_live_teaching_mode');
      if (savedLive !== null) {
        this.isLiveTeachingMode = savedLive === 'true';
      }

      // Initialize IndexedDB
      this.initIndexedDB();
    }
  }

  private initIndexedDB(): Promise<IDBDatabase | null> {
    if (this.dbPromise) return this.dbPromise;

    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      this.dbPromise = Promise.resolve(null);
      return this.dbPromise;
    }

    this.dbPromise = new Promise((resolve) => {
      try {
        const req = indexedDB.open('SoundKingdomTeacherVoicesDB', 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains('voices')) {
            db.createObjectStore('voices', { keyPath: 'slideNumber' });
          }
        };
        req.onsuccess = () => {
          const db = req.result;
          // Hydrate memory cache
          this.loadAllFromDB(db);
          resolve(db);
        };
        req.onerror = () => {
          console.warn('IndexedDB open failed, using fallback storage');
          resolve(null);
        };
      } catch (err) {
        console.warn('IndexedDB error:', err);
        resolve(null);
      }
    });

    return this.dbPromise;
  }

  private loadAllFromDB(db: IDBDatabase) {
    try {
      const tx = db.transaction('voices', 'readonly');
      const store = tx.objectStore('voices');
      const req = store.getAll();
      req.onsuccess = () => {
        const records: StoredVoice[] = req.result || [];
        records.forEach((rec) => {
          if (rec.slideNumber && rec.dataUrl) {
            this.memoryCache.set(rec.slideNumber, rec.dataUrl);
          }
        });
        this.notify();
      };
    } catch (err) {
      console.warn('Failed to load voices from IndexedDB:', err);
    }
  }

  public subscribe(fn: VoiceStoreListener) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public setPreferRealVoice(prefer: boolean) {
    this.preferRealVoice = prefer;
    localStorage.setItem('vn_sound_prefer_real_teacher_voice', String(prefer));
    this.notify();
  }

  public isPreferRealVoice(): boolean {
    return this.preferRealVoice;
  }

  public setLiveTeachingMode(active: boolean) {
    this.isLiveTeachingMode = active;
    localStorage.setItem('vn_sound_live_teaching_mode', String(active));
    this.notify();
  }

  public getLiveTeachingMode(): boolean {
    return this.isLiveTeachingMode;
  }

  public hasRecordedVoice(slideNumber: number): boolean {
    if (this.memoryCache.has(slideNumber)) {
      return true;
    }
    // Check localStorage fallback
    try {
      const data = localStorage.getItem(`vn_sound_teacher_voice_slide_${slideNumber}`);
      return Boolean(data && data.startsWith('data:audio/'));
    } catch {
      return false;
    }
  }

  public getRecordedVoice(slideNumber: number): string | null {
    if (this.memoryCache.has(slideNumber)) {
      return this.memoryCache.get(slideNumber)!;
    }
    try {
      return localStorage.getItem(`vn_sound_teacher_voice_slide_${slideNumber}`);
    } catch {
      return null;
    }
  }

  public async saveRecordedVoice(slideNumber: number, audioBlob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          const dataUrl = reader.result as string;
          this.saveAudioDataUrl(slideNumber, dataUrl);
          resolve(dataUrl);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });
  }

  public async saveAudioDataUrl(slideNumber: number, dataUrl: string): Promise<void> {
    this.memoryCache.set(slideNumber, dataUrl);

    // Try save to IndexedDB
    try {
      const db = await this.initIndexedDB();
      if (db) {
        const tx = db.transaction('voices', 'readwrite');
        const store = tx.objectStore('voices');
        store.put({
          slideNumber,
          dataUrl,
          timestamp: Date.now(),
        });
      }
    } catch (err) {
      console.warn('IndexedDB save failed:', err);
    }

    // Try localStorage backup if small
    try {
      if (dataUrl.length < 2_000_000) {
        localStorage.setItem(`vn_sound_teacher_voice_slide_${slideNumber}`, dataUrl);
      }
    } catch {}

    this.notify();
  }

  public async deleteRecordedVoice(slideNumber: number): Promise<void> {
    this.memoryCache.delete(slideNumber);

    try {
      const db = await this.initIndexedDB();
      if (db) {
        const tx = db.transaction('voices', 'readwrite');
        const store = tx.objectStore('voices');
        store.delete(slideNumber);
      }
    } catch {}

    try {
      localStorage.removeItem(`vn_sound_teacher_voice_slide_${slideNumber}`);
    } catch {}

    this.notify();
  }

  public getAllRecordedSlides(): number[] {
    const recorded: number[] = [];
    for (let i = 1; i <= 12; i++) {
      if (this.hasRecordedVoice(i)) {
        recorded.push(i);
      }
    }
    return recorded;
  }

  public async exportAllVoicesJson(): Promise<string> {
    const data: Record<number, string> = {};
    for (let i = 1; i <= 12; i++) {
      const v = this.getRecordedVoice(i);
      if (v) {
        data[i] = v;
      }
    }
    return JSON.stringify(data);
  }

  public async importVoicesJson(jsonString: string): Promise<number> {
    try {
      const data = JSON.parse(jsonString);
      let count = 0;
      for (const [key, val] of Object.entries(data)) {
        const num = Number(key);
        if (num >= 1 && num <= 12 && typeof val === 'string' && val.startsWith('data:audio/')) {
          await this.saveAudioDataUrl(num, val);
          count++;
        }
      }
      return count;
    } catch (err) {
      console.error('Import failed:', err);
      return 0;
    }
  }
}

export const teacherVoiceStore = new TeacherVoiceStore();
