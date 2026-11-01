/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CustomSoundEntry {
  id: string;
  dataUrl: string;
  fileName: string;
  fileSize: number;
  timestamp: number;
}

export const DEFAULT_SOUND_ASSETS: Record<string, string> = {
  dog: '/assets/aistudio/dragon-studio-barking-dog-cute-sound-463192_c2caa182.mp3',
  cat: '/assets/aistudio/dragon-studio-kitten-sfx-405457_01ab5fb6.mp3',
  rooster: '/assets/aistudio/dragon-studio-cartoon-rooster-sounds-487663_afdc183a.mp3',
  duck: '/assets/audio/effects/duck.mp3',
  pig: '/assets/audio/effects/pig.mp3',
  cow: '/assets/audio/effects/cow.mp3',
  rain: '/assets/audio/effects/rain.mp3',
  wind: '/assets/audio/effects/wind.mp3',
  thunder: '/assets/audio/effects/thunder.mp3',
  ocean: '/assets/audio/effects/ocean.mp3',
  waterfall: '/assets/audio/effects/waterfall.mp3',
  school_bell: '/assets/audio/effects/school_bell.mp3',
  bicycle_bell: '/assets/audio/effects/bicycle_bell.mp3',
  telephone: '/assets/audio/effects/telephone.mp3',
  alarm_clock: '/assets/audio/effects/alarm_clock.mp3',
  clapping: '/assets/audio/effects/clapping.mp3',
};

type SoundStoreListener = () => void;

class SoundStore {
  private customSounds = new Map<string, CustomSoundEntry>();
  private listeners: SoundStoreListener[] = [];
  private dbPromise: Promise<IDBDatabase | null> | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
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
        const req = indexedDB.open('SoundKingdomCustomSFXDB', 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains('sounds')) {
            db.createObjectStore('sounds', { keyPath: 'id' });
          }
        };
        req.onsuccess = () => {
          const db = req.result;
          this.loadAllFromDB(db);
          this.isInitialized = true;
          resolve(db);
        };
        req.onerror = () => {
          console.warn('IndexedDB failed to open for custom SFX');
          resolve(null);
        };
      } catch (err) {
        console.warn('IndexedDB init error:', err);
        resolve(null);
      }
    });

    return this.dbPromise;
  }

  private loadAllFromDB(db: IDBDatabase) {
    try {
      const tx = db.transaction('sounds', 'readonly');
      const store = tx.objectStore('sounds');
      const req = store.getAll();
      req.onsuccess = () => {
        const records: CustomSoundEntry[] = req.result || [];
        records.forEach((r) => {
          this.customSounds.set(r.id, r);
        });
        this.notify();
      };
    } catch (e) {
      console.warn('Failed to load custom sounds from DB:', e);
    }
  }

  public subscribe(listener: SoundStoreListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (e) {
        console.error(e);
      }
    });
  }

  /**
   * Get active audio URL (custom user file or realistic default file)
   */
  public getSoundUrl(id: string): string {
    const custom = this.customSounds.get(id);
    if (custom?.dataUrl) {
      return custom.dataUrl;
    }
    return DEFAULT_SOUND_ASSETS[id] || '';
  }

  public hasCustomSound(id: string): boolean {
    return this.customSounds.has(id);
  }

  public getCustomSoundEntry(id: string): CustomSoundEntry | undefined {
    return this.customSounds.get(id);
  }

  public getAllCustomSounds(): Map<string, CustomSoundEntry> {
    return new Map(this.customSounds);
  }

  public async setCustomSound(id: string, dataUrl: string, fileName = 'custom_sound.mp3', fileSize = 0): Promise<void> {
    const entry: CustomSoundEntry = {
      id,
      dataUrl,
      fileName,
      fileSize,
      timestamp: Date.now(),
    };

    this.customSounds.set(id, entry);
    this.notify();

    const db = await this.initIndexedDB();
    if (db) {
      try {
        const tx = db.transaction('sounds', 'readwrite');
        const store = tx.objectStore('sounds');
        store.put(entry);
      } catch (e) {
        console.warn('Failed to save custom sound in IndexedDB:', e);
      }
    }
  }

  public async removeCustomSound(id: string): Promise<void> {
    this.customSounds.delete(id);
    this.notify();

    const db = await this.initIndexedDB();
    if (db) {
      try {
        const tx = db.transaction('sounds', 'readwrite');
        const store = tx.objectStore('sounds');
        store.delete(id);
      } catch (e) {
        console.warn('Failed to delete custom sound from IndexedDB:', e);
      }
    }
  }

  public async resetAllCustomSounds(): Promise<void> {
    this.customSounds.clear();
    this.notify();

    const db = await this.initIndexedDB();
    if (db) {
      try {
        const tx = db.transaction('sounds', 'readwrite');
        const store = tx.objectStore('sounds');
        store.clear();
      } catch (e) {
        console.warn('Failed to clear custom sounds in IndexedDB:', e);
      }
    }
  }

  /**
   * Match filename to known sound IDs
   */
  public matchFileNameToSoundId(filename: string): string | null {
    const name = filename.toLowerCase();

    // Nature sounds
    if (name.includes('rain') || name.includes('mưa') || name.includes('mua') || name.includes('188158')) return 'rain';
    if (name.includes('wind') || name.includes('gió') || name.includes('gio') || name.includes('gust') || name.includes('386158')) return 'wind';
    if (name.includes('thunder') || name.includes('sấm') || name.includes('sam') || name.includes('set') || name.includes('clap') || name.includes('521194')) return 'thunder';
    if (name.includes('ocean') || name.includes('wave') || name.includes('sóng') || name.includes('song') || name.includes('biển') || name.includes('bien') || name.includes('376898')) return 'ocean';
    if (name.includes('waterfall') || name.includes('thác') || name.includes('thac')) return 'waterfall';

    // Life sounds
    if (name.includes('school') || name.includes('trường') || name.includes('truong') || name.includes('199584')) return 'school_bell';
    if (name.includes('bicycle') || name.includes('xe đạp') || name.includes('xedap') || name.includes('bike') || name.includes('32072')) return 'bicycle_bell';
    if (name.includes('phone') || name.includes('ringing') || name.includes('điện thoại') || name.includes('dienthoai') || name.includes('382734')) return 'telephone';
    if (name.includes('applause') || name.includes('clap') || name.includes('vỗ tay') || name.includes('votay') || name.includes('383901')) return 'clapping';
    if (name.includes('alarm') || name.includes('báo thức') || name.includes('baothuc') || name.includes('clock')) return 'alarm_clock';

    // Animal sounds
    if (name.includes('dog') || name.includes('bark') || name.includes('chó') || name.includes('cho') || name.includes('463192')) return 'dog';
    if (name.includes('cat') || name.includes('meow') || name.includes('kitten') || name.includes('mèo') || name.includes('meo') || name.includes('405457')) return 'cat';
    if (name.includes('rooster') || name.includes('crow') || name.includes('gà') || name.includes('ga') || name.includes('487663')) return 'rooster';
    if (name.includes('duck') || name.includes('quack') || name.includes('vịt') || name.includes('vit')) return 'duck';
    if (name.includes('pig') || name.includes('oink') || name.includes('lợn') || name.includes('lon') || name.includes('heo')) return 'pig';
    if (name.includes('cow') || name.includes('moo') || name.includes('bò') || name.includes('bo')) return 'cow';

    return null;
  }

  /**
   * Batch process uploaded files
   */
  public async batchImportFiles(files: FileList | File[]): Promise<{ matched: number; unmatched: string[] }> {
    let matchedCount = 0;
    const unmatchedNames: string[] = [];

    const fileList = Array.from(files);
    for (const file of fileList) {
      const soundId = this.matchFileNameToSoundId(file.name);
      if (soundId) {
        try {
          const dataUrl = await this.readFileAsDataUrl(file);
          await this.setCustomSound(soundId, dataUrl, file.name, file.size);
          matchedCount++;
        } catch (e) {
          console.warn('Failed to read file:', file.name, e);
          unmatchedNames.push(file.name);
        }
      } else {
        unmatchedNames.push(file.name);
      }
    }

    return { matched: matchedCount, unmatched: unmatchedNames };
  }

  public readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }
}

export const soundStore = new SoundStore();
