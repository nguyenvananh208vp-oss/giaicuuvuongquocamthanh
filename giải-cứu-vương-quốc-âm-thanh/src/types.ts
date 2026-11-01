/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SoundCategory = 'animal' | 'nature' | 'life';

export interface SoundItem {
  id: string;
  name: string;
  category: SoundCategory;
  categoryName: string;
  description: string;
  soundLabel: string; // e.g. "Gâu gâu!", "Rào rào...", "Kính coong!"
  icon: string; // SVG or emoji descriptor
  color: string;
  imageHint?: string;
  audioUrl?: string;
  pedagogicalNote?: string;
}

export interface KeyShard {
  id: 'feather' | 'water' | 'bell' | 'emblem';
  name: string;
  stageName: string;
  icon: string;
  color: string;
  description: string;
}

export type SlideNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface SlideInfo {
  number: SlideNumber;
  title: string;
  subtitle: string;
  section: string;
  narrationText: string;
}
