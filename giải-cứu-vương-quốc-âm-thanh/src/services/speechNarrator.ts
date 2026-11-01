/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { teacherVoiceStore } from './teacherVoiceStore.ts';

export interface SpeechStatus {
  isSpeaking: boolean;
  isLoading: boolean;
  currentText: string;
  source: 'teacher_custom_recording' | 'none';
}

type SpeechListener = (status: SpeechStatus) => void;

class SpeechNarrator {
  private listeners: SpeechListener[] = [];
  private status: SpeechStatus = {
    isSpeaking: false,
    isLoading: false,
    currentText: '',
    source: 'none',
  };

  private isVoiceMuted = false;
  private currentAudio: HTMLAudioElement | null = null;
  private playbackSpeed = 1.0;
  private volume = 1.0;

  public subscribe(fn: SpeechListener) {
    this.listeners.push(fn);
    fn(this.status);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private updateStatus(newStatus: Partial<SpeechStatus>) {
    this.status = { ...this.status, ...newStatus };
    this.listeners.forEach((l) => l(this.status));
  }

  public setVoiceMuted(muted: boolean) {
    this.isVoiceMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  public getVoiceMuted(): boolean {
    return this.isVoiceMuted;
  }

  public setSpeed(speed: number) {
    this.playbackSpeed = speed;
    if (this.currentAudio) {
      this.currentAudio.playbackRate = speed;
    }
  }

  public getSpeed(): number {
    return this.playbackSpeed;
  }

  public stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {}
      this.currentAudio = null;
    }

    this.updateStatus({
      isSpeaking: false,
      isLoading: false,
      currentText: '',
      source: 'none',
    });
  }

  public async preload(text: string, slideNumber?: number): Promise<void> {
    // No-op: Only user-provided files are played, no AI background prefetching needed
  }

  /**
   * Speak narrative text - ONLY plays user-provided or recorded files.
   * NEVER plays any AI, TTS, or robotic synthesizer voice.
   */
  public async speak(
    text: string,
    force = false,
    slideNumber?: number
  ): Promise<void> {
    if (this.isVoiceMuted && !force) {
      return;
    }

    this.stop();

    if (!slideNumber) {
      this.updateStatus({
        isSpeaking: false,
        isLoading: false,
        currentText: text,
        source: 'none',
      });
      return;
    }

    // In Live Classroom Mode, teacher speaks live in person
    if (teacherVoiceStore.getLiveTeachingMode() && !force) {
      this.updateStatus({
        isLoading: false,
        isSpeaking: false,
        currentText: text,
        source: 'none',
      });
      return;
    }

    // Check if the user/teacher uploaded or recorded a voice for this slide
    if (teacherVoiceStore.hasRecordedVoice(slideNumber)) {
      const customUrl = teacherVoiceStore.getRecordedVoice(slideNumber);
      if (customUrl) {
        this.playAudioUrl(customUrl, text);
        return;
      }
    }

    // NO AI FALLBACK - If the user has not provided a file for this slide, stay silent
    // so the teacher speaks in person or children read along without any robotic voice.
    this.updateStatus({
      isSpeaking: false,
      isLoading: false,
      currentText: text,
      source: 'none',
    });
  }

  private playAudioUrl(url: string, originalText: string) {
    try {
      const audio = new Audio(url);
      audio.volume = this.volume;
      audio.playbackRate = this.playbackSpeed;

      audio.onplay = () => {
        this.updateStatus({
          isLoading: false,
          isSpeaking: true,
          currentText: originalText,
          source: 'teacher_custom_recording',
        });
      };

      audio.onended = () => {
        this.updateStatus({
          isSpeaking: false,
          isLoading: false,
          currentText: '',
          source: 'none',
        });
      };

      audio.onerror = () => {
        this.updateStatus({
          isSpeaking: false,
          isLoading: false,
          currentText: '',
          source: 'none',
        });
      };

      this.currentAudio = audio;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          this.updateStatus({
            isSpeaking: false,
            isLoading: false,
            currentText: '',
            source: 'none',
          });
        });
      }
    } catch {
      this.updateStatus({
        isSpeaking: false,
        isLoading: false,
        currentText: '',
        source: 'none',
      });
    }
  }

  public getStatus(): SpeechStatus {
    return this.status;
  }
}

export const speechNarrator = new SpeechNarrator();
