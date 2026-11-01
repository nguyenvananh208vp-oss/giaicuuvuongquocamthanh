/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { soundSynthesizer } from '../services/soundSynthesizer.ts';

interface AudioPlayerButtonProps {
  soundId: string;
  label?: string;
  hintText?: string;
  className?: string;
  autoPlayOnMount?: boolean;
}

export const AudioPlayerButton: React.FC<AudioPlayerButtonProps> = ({
  soundId,
  label = 'Bấm loa để nghe nhé!',
  hintText,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlaySound = () => {
    setIsPlaying(true);
    soundSynthesizer.playSoundById(soundId);
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <button
        onClick={handlePlaySound}
        className={`group relative flex items-center justify-center gap-3 px-6 py-4 rounded-3xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-white font-extrabold text-lg sm:text-xl shadow-xl shadow-orange-500/30 border-4 border-amber-200 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ${
          isPlaying ? 'ring-8 ring-amber-300/60 scale-105 animate-pulse' : ''
        }`}
      >
        {/* Pulsing halo */}
        <span className="absolute -inset-1 rounded-3xl bg-amber-400 opacity-30 group-hover:opacity-60 blur-md transition-opacity -z-10 animate-ping"></span>

        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white text-orange-600 shadow-inner group-hover:rotate-12 transition-transform">
          <Volume2 className={`w-7 h-7 ${isPlaying ? 'scale-125 text-amber-500 animate-bounce' : ''}`} />
        </div>

        <div className="flex flex-col text-left">
          <span className="drop-shadow-sm flex items-center gap-1.5">
            {label}
            <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200" />
          </span>
          <span className="text-xs font-semibold text-amber-100 opacity-90">
            {isPlaying ? 'Âm thanh đang vang lên...' : 'Chạm vào đây để lắng nghe'}
          </span>
        </div>
      </button>

      {hintText && (
        <span className="text-xs font-semibold text-slate-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          💡 {hintText}
        </span>
      )}
    </div>
  );
};
