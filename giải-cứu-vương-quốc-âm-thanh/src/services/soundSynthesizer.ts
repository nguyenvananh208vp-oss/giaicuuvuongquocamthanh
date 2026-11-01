/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { soundStore } from './soundStore.ts';

class SoundSynthesizer {
  private isMuted = false;
  private currentPlayingAudio: HTMLAudioElement | null = null;

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAudio();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public stopAudio() {
    if (this.currentPlayingAudio) {
      try {
        this.currentPlayingAudio.pause();
        this.currentPlayingAudio.currentTime = 0;
      } catch {}
      this.currentPlayingAudio = null;
    }
  }

  /**
   * Play an audio file with strict duration limiting (3.0 seconds for preschool puzzles)
   * Strictly uses REAL audio files only. Zero AI / synthetic oscillator generation.
   */
  public playCappedAudio(url: string, maxDurationSec = 3.0) {
    if (this.isMuted || !url) return;

    if (this.currentPlayingAudio) {
      try {
        this.currentPlayingAudio.pause();
        this.currentPlayingAudio.currentTime = 0;
      } catch {}
      this.currentPlayingAudio = null;
    }

    try {
      const audio = new Audio(url);
      this.currentPlayingAudio = audio;
      audio.volume = 0.95;

      audio.play().then(() => {
        // Enforce 3.0 second duration cap with smooth fade out in the last 350ms
        const fadeStartMs = Math.max(1500, (maxDurationSec - 0.35) * 1000);
        const stopMs = maxDurationSec * 1000;

        setTimeout(() => {
          if (this.currentPlayingAudio === audio) {
            const fadeInterval = setInterval(() => {
              if (audio.volume > 0.12) {
                audio.volume = Math.max(0, audio.volume - 0.15);
              } else {
                clearInterval(fadeInterval);
                audio.pause();
                audio.currentTime = 0;
              }
            }, 25);
          }
        }, fadeStartMs);

        setTimeout(() => {
          try {
            audio.pause();
            audio.currentTime = 0;
            if (this.currentPlayingAudio === audio) {
              this.currentPlayingAudio = null;
            }
          } catch {}
        }, stopMs + 40);
      }).catch((err) => {
        console.warn('Audio playback not permitted or file unavailable:', url, err);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // === ANIMAL SOUNDS (REAL FILES ONLY - 3.0S) ===

  public playDogBark() {
    this.playCappedAudio(soundStore.getSoundUrl('dog'), 3.0);
  }

  public playCatMeow() {
    this.playCappedAudio(soundStore.getSoundUrl('cat'), 3.0);
  }

  public playRoosterCrow() {
    this.playCappedAudio(soundStore.getSoundUrl('rooster'), 3.0);
  }

  public playDuckQuack() {
    this.playCappedAudio(soundStore.getSoundUrl('duck'), 3.0);
  }

  public playPigOink() {
    this.playCappedAudio(soundStore.getSoundUrl('pig'), 3.0);
  }

  public playCowMoo() {
    this.playCappedAudio(soundStore.getSoundUrl('cow'), 3.0);
  }

  // === NATURE SOUNDS (REAL FILES ONLY - 3.0S) ===

  public playWaterfall() {
    this.playCappedAudio(soundStore.getSoundUrl('waterfall'), 3.0);
  }

  public playRain() {
    this.playCappedAudio(soundStore.getSoundUrl('rain'), 3.0);
  }

  public playWind() {
    this.playCappedAudio(soundStore.getSoundUrl('wind'), 3.0);
  }

  public playThunder() {
    this.playCappedAudio(soundStore.getSoundUrl('thunder'), 3.0);
  }

  public playOceanWaves() {
    this.playCappedAudio(soundStore.getSoundUrl('ocean'), 3.0);
  }

  // === LIFE & OBJECT SOUNDS (REAL FILES ONLY - 3.0S) ===

  public playSchoolBell() {
    this.playCappedAudio(soundStore.getSoundUrl('school_bell'), 3.0);
  }

  public playBicycleBell() {
    this.playCappedAudio(soundStore.getSoundUrl('bicycle_bell'), 3.0);
  }

  public playTelephone() {
    this.playCappedAudio(soundStore.getSoundUrl('telephone'), 3.0);
  }

  public playAlarmClock() {
    this.playCappedAudio(soundStore.getSoundUrl('alarm_clock'), 3.0);
  }

  public playClapping() {
    this.playCappedAudio(soundStore.getSoundUrl('clapping'), 3.0);
  }

  // === GAMEPLAY FEEDBACK (REAL AUDIO ONLY) ===

  public playCorrect() {
    // Play cheerful real applause
    this.playCappedAudio(soundStore.getSoundUrl('clapping'), 1.8);
  }

  public playIncorrect() {
    // Gentle feedback
  }

  public playKeyShardUnlock() {
    // Play celebratory chime / bicycle bell tone
    this.playCappedAudio(soundStore.getSoundUrl('bicycle_bell'), 1.5);
  }

  public playVictoryFanfare() {
    this.playCappedAudio(soundStore.getSoundUrl('clapping'), 3.0);
  }

  // Master Sound Trigger by Sound ID - 100% real files, duration 3.0s
  public playSoundById(id: string) {
    const url = soundStore.getSoundUrl(id);
    if (url) {
      this.playCappedAudio(url, 3.0);
    }
  }

  public toggleBgm(): boolean {
    return false; // Background AI music disabled
  }

  public startBgm() {}
  public stopBgm() {}
}

export const soundSynthesizer = new SoundSynthesizer();
