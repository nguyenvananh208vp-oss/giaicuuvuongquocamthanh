/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, Volume2 } from 'lucide-react';
import { ASSET_IMAGES, KEY_SHARDS } from '../../data/gameData.ts';
import { soundSynthesizer } from '../../services/soundSynthesizer.ts';

interface Slide9ValleyRewardProps {
  onNextStage: () => void;
}

export const Slide9ValleyReward: React.FC<Slide9ValleyRewardProps> = ({ onNextStage }) => {
  useEffect(() => {
    soundSynthesizer.playKeyShardUnlock();
    confetti({
      particleCount: 75,
      spread: 85,
      origin: { y: 0.55 },
    });
  }, []);

  const handlePlayBells = () => {
    soundSynthesizer.playBicycleBell();
    setTimeout(() => soundSynthesizer.playSchoolBell(), 400);
  };

  const shard = KEY_SHARDS.bell;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-8 rounded-3xl border-4 border-amber-400 bg-gradient-to-b from-amber-100 via-yellow-50 to-orange-50 shadow-2xl overflow-hidden">
      {/* Background illustration */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-30">
        <img
          src={ASSET_IMAGES.valley}
          alt="Thung lũng âm thanh bừng sáng"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover scale-105"
        />
      </div>

      {/* Top Banner */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500 text-white rounded-full font-black text-xs sm:text-sm shadow-md">
        <Sparkles className="w-4 h-4 fill-white" />
        <span>HOÀN THÀNH MÀN 3 · THUNG LŨNG CUỘC SỐNG</span>
      </div>

      {/* Center Key Shard Display */}
      <div className="my-auto flex flex-col items-center text-center max-w-lg z-10">
        <div className="relative mb-4">
          <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full blur-xl opacity-75 animate-pulse"></div>
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 p-1 shadow-2xl flex items-center justify-center border-4 border-white">
            <div className="w-full h-full bg-white/95 rounded-[22px] flex flex-col items-center justify-center p-2">
              <span className="text-5xl sm:text-6xl animate-bounce">{shard.icon}</span>
              <span className="text-[11px] font-black text-amber-800 uppercase tracking-wider mt-1">
                MẢNH GHÉP SỐ 3
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
          Con Đã Nhận Được: <br />
          <span className="text-amber-600 drop-shadow-sm">{shard.name}!</span>
        </h2>

        <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed bg-white/80 p-3 rounded-2xl border border-amber-200">
          {shard.description}
          <br />
          <span className="text-amber-800 font-bold">
            🌟 Đã có 3 mảnh chìa khóa phép thuật! Cổng Lâu Đài Hòa Âm chỉ còn 1 bước nữa thôi!
          </span>
        </p>

        <button
          onClick={handlePlayBells}
          className="mt-3 flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs"
        >
          <Volume2 className="w-4 h-4 text-amber-700" />
          <span>Nghe Tiếng Chuông Reo Vui</span>
        </button>
      </div>

      {/* Navigation CTA */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md z-10">
        <button
          onClick={onNextStage}
          className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 text-white font-black text-base sm:text-lg shadow-xl shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white/50"
        >
          <span>Tiến Vào Màn 4: Lâu Đài Hòa Âm</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
