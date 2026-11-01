/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, Music, Volume2 } from 'lucide-react';
import { ASSET_IMAGES, KEY_SHARDS } from '../../data/gameData.ts';
import { soundSynthesizer } from '../../services/soundSynthesizer.ts';

interface Slide5ForestRewardProps {
  onNextStage: () => void;
}

export const Slide5ForestReward: React.FC<Slide5ForestRewardProps> = ({ onNextStage }) => {
  useEffect(() => {
    soundSynthesizer.playKeyShardUnlock();
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.55 },
    });
  }, []);

  const handlePlayForestSoundtrack = () => {
    soundSynthesizer.playRoosterCrow();
    setTimeout(() => soundSynthesizer.playDogBark(), 600);
    setTimeout(() => soundSynthesizer.playCatMeow(), 1200);
  };

  const shard = KEY_SHARDS.feather;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-8 rounded-3xl border-4 border-emerald-400 bg-gradient-to-b from-emerald-100 via-teal-50 to-amber-50 shadow-2xl overflow-hidden">
      {/* Background illustration */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-30">
        <img
          src={ASSET_IMAGES.forest}
          alt="Khu rừng bừng sáng"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover scale-105"
        />
      </div>

      {/* Top Banner */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500 text-white rounded-full font-black text-xs sm:text-sm shadow-md">
        <Sparkles className="w-4 h-4 fill-white" />
        <span>HOÀN THÀNH MÀN 1 · KHU RỪNG TIẾNG HÁT</span>
      </div>

      {/* Center Key Shard Display */}
      <div className="my-auto flex flex-col items-center text-center max-w-lg z-10">
        {/* Floating Golden Halo with Feather */}
        <div className="relative mb-4">
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 to-amber-300 rounded-full blur-xl opacity-75 animate-pulse"></div>
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-br from-emerald-400 via-teal-400 to-amber-300 p-1 shadow-2xl flex items-center justify-center border-4 border-white">
            <div className="w-full h-full bg-white/95 rounded-[22px] flex flex-col items-center justify-center p-2">
              <span className="text-5xl sm:text-6xl animate-bounce">{shard.icon}</span>
              <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider mt-1">
                MẢNH GHÉP SỐ 1
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
          Con Đã Nhận Được: <br />
          <span className="text-emerald-600 drop-shadow-sm">{shard.name}!</span>
        </h2>

        <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed bg-white/80 p-3 rounded-2xl border border-emerald-200">
          {shard.description}
          <br />
          <span className="text-emerald-800 font-bold">
            🌸 Tiếng chim chóc và thú rừng đã rộn vang khắp mọi nẻo đường!
          </span>
        </p>

        {/* Audio Replay Chorus Button */}
        <button
          onClick={handlePlayForestSoundtrack}
          className="mt-3 flex items-center gap-2 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs"
        >
          <Volume2 className="w-4 h-4 text-emerald-700" />
          <span>Nghe Lại Bản Hợp Ca Thú Rừng</span>
        </button>
      </div>

      {/* Navigation CTA */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md z-10">
        <button
          onClick={onNextStage}
          className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-600 text-white font-black text-base sm:text-lg shadow-xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white/50"
        >
          <span>Tiến Tới Màn 2: Thanh Âm Thiên Nhiên</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
