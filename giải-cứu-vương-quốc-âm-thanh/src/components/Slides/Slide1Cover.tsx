/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Play, BookOpen, Music, Volume2 } from 'lucide-react';
import { ASSET_IMAGES } from '../../data/gameData.ts';
import { soundSynthesizer } from '../../services/soundSynthesizer.ts';

import { speechNarrator } from '../../services/speechNarrator.ts';

interface Slide1CoverProps {
  onStartGame: () => void;
  onExploreMap: () => void;
}

export const Slide1Cover: React.FC<Slide1CoverProps> = ({
  onStartGame,
  onExploreMap,
}) => {
  const handleTestSound = () => {
    soundSynthesizer.playCorrect();
    speechNarrator.speak('Cô chào tất cả các con yêu quý! Giọng kể chuyện của cô giáo đã sẵn sàng rồi nhé! Cô mời các con cùng lắng nghe nào!', true);
  };

  const handleStart = () => {
    soundSynthesizer.playCorrect();
    speechNarrator.speak('Cô và các con cùng lên đường đến Khu Rừng Tiếng Hát nào!', true);
    onStartGame();
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-8 rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-50">
      {/* Background illustration with soft overlay */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src={ASSET_IMAGES.cover}
          alt="Vương quốc Âm Thanh"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-35 scale-105 filter blur-[0.5px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-sky-100/60" />
      </div>

      {/* Top Header Badge */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 z-10">
        <span className="px-4 py-1.5 rounded-full bg-amber-500/90 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-sm flex items-center gap-1.5">
          <span>🌈</span>
          HỌC LIỆU SỐ MẦM NON · ĐỘ TUỔI 4–5 TUỔI
        </span>
        <span className="px-3 py-1 rounded-full bg-white/90 text-sky-800 font-bold text-xs border border-sky-200 shadow-xs">
          Lĩnh vực: Phát triển Nhận Thức & Ngôn Ngữ
        </span>
      </div>

      {/* Main Title Centerpiece */}
      <div className="text-center my-auto z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-amber-100 text-amber-900 rounded-full font-black text-xs sm:text-sm mb-3 border border-amber-300">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
          TRÒ CHƠI TƯƠNG TÁC ÂM THANH KỲ DIỆU
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight drop-shadow-sm">
          GIẢI CỨU VƯƠNG QUỐC <br />
          <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            ÂM THANH
          </span>
        </h1>

        <p className="mt-4 text-base sm:text-lg font-semibold text-slate-700 max-w-xl mx-auto leading-relaxed">
          Cùng Thỏ Bông vượt qua 4 vùng đất huyền ảo, lắng nghe và tìm lại những tiếng kêu rộn rã đã bị phù thủy Gió Xoáy cuốn đi!
        </p>

        {/* 4 Lands Preview Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 max-w-2xl mx-auto">
          <div className="bg-white/80 border border-emerald-300 rounded-2xl p-2.5 text-center shadow-xs">
            <span className="text-2xl">🐦</span>
            <p className="text-xs font-bold text-emerald-900 mt-1">Khu Rừng Tiếng Hát</p>
            <span className="text-[10px] text-emerald-700 font-medium">Âm thanh động vật</span>
          </div>
          <div className="bg-white/80 border border-cyan-300 rounded-2xl p-2.5 text-center shadow-xs">
            <span className="text-2xl">🌿</span>
            <p className="text-xs font-bold text-cyan-900 mt-1">Thanh Âm Thiên Nhiên</p>
            <span className="text-[10px] text-cyan-700 font-medium">Âm thanh tự nhiên</span>
          </div>
          <div className="bg-white/80 border border-amber-300 rounded-2xl p-2.5 text-center shadow-xs">
            <span className="text-2xl">🔔</span>
            <p className="text-xs font-bold text-amber-900 mt-1">Thung Lũng Cuộc Sống</p>
            <span className="text-[10px] text-amber-700 font-medium">Đồ vật quen thuộc</span>
          </div>
          <div className="bg-white/80 border border-purple-300 rounded-2xl p-2.5 text-center shadow-xs">
            <span className="text-2xl">🎼</span>
            <p className="text-xs font-bold text-purple-900 mt-1">Lâu Đài Hòa Âm</p>
            <span className="text-[10px] text-purple-700 font-medium">Phối hợp âm thanh</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 z-10 w-full max-w-md">
        <button
          onClick={handleStart}
          className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white font-black text-lg sm:text-xl shadow-xl shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white/50"
        >
          <Play className="w-6 h-6 fill-white" />
          Bắt Đầu Thám Hiểm!
        </button>

        <button
          onClick={onExploreMap}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-white/95 hover:bg-white text-slate-800 font-bold text-base shadow-md border-2 border-amber-200 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <BookOpen className="w-5 h-5 text-amber-600" />
          Xem Cốt Truyện
        </button>

        <button
          onClick={handleTestSound}
          title="Thử loa phát thanh"
          className="p-4 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300 transition-all cursor-pointer"
        >
          <Volume2 className="w-5 h-5 text-amber-700" />
        </button>
      </div>
    </div>
  );
};
