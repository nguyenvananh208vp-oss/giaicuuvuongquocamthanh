/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Key, CheckCircle, ArrowRight, Music } from 'lucide-react';
import { ASSET_IMAGES, KEY_SHARDS } from '../../data/gameData.ts';
import { soundSynthesizer } from '../../services/soundSynthesizer.ts';
import { speechNarrator } from '../../services/speechNarrator.ts';

interface Slide11CastleAssemblyProps {
  onUnlockCelebration: () => void;
}

export const Slide11CastleAssembly: React.FC<Slide11CastleAssemblyProps> = ({
  onUnlockCelebration,
}) => {
  const [isAssembled, setIsAssembled] = useState(false);

  const handleAssemble = () => {
    setIsAssembled(true);
    soundSynthesizer.playVictoryFanfare();

    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
    });

    const msg = 'Kỳ diệu quá! 4 mảnh ghép đã hợp nhất thành Chiếc Chìa Khóa Khải Hoàn! Cánh cổng lâu đài đang mở ra đón chào con!';
    speechNarrator.speak(msg);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-8 rounded-3xl border-4 border-amber-400 bg-gradient-to-b from-purple-900 via-indigo-900 to-slate-900 text-white shadow-2xl overflow-hidden">
      {/* Background illustration */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-40">
        <img
          src={ASSET_IMAGES.castle}
          alt="Cổng Lâu Đài Hòa Âm"
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-all duration-1000 ${
            isAssembled ? 'scale-110 filter brightness-125' : 'scale-100'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-purple-950/70" />
      </div>

      {/* Top Banner */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 rounded-full font-black text-xs sm:text-sm shadow-lg z-10">
        <Sparkles className="w-4 h-4 fill-slate-950" />
        <span>KHOẢNH KHẮC HỢP NHẤT · MỞ CÁNH CỔNG VƯƠNG QUỐC</span>
      </div>

      {/* Center Assembly Ritual */}
      <div className="my-auto flex flex-col items-center text-center max-w-xl z-10">
        {!isAssembled ? (
          <>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-300 drop-shadow-md">
              Ghép 4 Mảnh Chìa Khóa Phép Thuật
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-200 font-medium">
              Con đã xuất sắc tìm lại đủ 4 mảnh âm thanh từ Khu Rừng, Thiên Nhiên, Thung Lũng và Lâu Đài!
            </p>

            {/* 4 Shards Circle Array */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 w-full">
              {/* Shard 1 */}
              <div className="flex flex-col items-center bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-emerald-400/50 shadow-inner">
                <span className="text-3xl animate-bounce">{KEY_SHARDS.feather.icon}</span>
                <span className="text-[11px] font-black text-emerald-300 mt-1">Lông Vũ</span>
                <span className="text-[9px] text-slate-300">Khu Rừng</span>
              </div>
              {/* Shard 2 */}
              <div className="flex flex-col items-center bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-cyan-400/50 shadow-inner">
                <span className="text-3xl animate-bounce">{KEY_SHARDS.water.icon}</span>
                <span className="text-[11px] font-black text-cyan-300 mt-1">Giọt Nước</span>
                <span className="text-[9px] text-slate-300">Thiên Nhiên</span>
              </div>
              {/* Shard 3 */}
              <div className="flex flex-col items-center bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-yellow-400/50 shadow-inner">
                <span className="text-3xl animate-bounce">{KEY_SHARDS.bell.icon}</span>
                <span className="text-[11px] font-black text-yellow-300 mt-1">Chuông Vàng</span>
                <span className="text-[9px] text-slate-300">Thung Lũng</span>
              </div>
              {/* Shard 4 */}
              <div className="flex flex-col items-center bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-purple-400/50 shadow-inner">
                <span className="text-3xl animate-bounce">{KEY_SHARDS.emblem.icon}</span>
                <span className="text-[11px] font-black text-purple-300 mt-1">Huy Hiệu</span>
                <span className="text-[9px] text-slate-300">Lâu Đài</span>
              </div>
            </div>

            <button
              onClick={handleAssemble}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-slate-950 font-black text-base sm:text-lg shadow-2xl shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white animate-pulse"
            >
              <Key className="w-6 h-6" />
              <span>Chạm Vào Đây Để Ghép Chìa Khóa!</span>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center animate-scaleIn">
            <div className="relative mb-4">
              <div className="absolute -inset-6 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 rounded-full blur-2xl opacity-80 animate-spin"></div>
              <div className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-amber-300 to-yellow-400 flex items-center justify-center border-4 border-white shadow-2xl">
                <span className="text-6xl animate-bounce">🗝️</span>
              </div>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black text-amber-300 tracking-tight drop-shadow-lg">
              Cánh Cổng Vương Quốc Đã Mở!
            </h3>
            <p className="mt-2 text-sm sm:text-base text-slate-100 max-w-md font-medium leading-relaxed">
              Những âm thanh kỳ diệu đã bay về khắp muôn nơi! Vương quốc Âm Thanh lại rộn ràng lời ca tiếng hát!
            </p>

            <button
              onClick={onUnlockCelebration}
              className="mt-6 flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-green-500 text-slate-950 font-black text-base sm:text-lg shadow-2xl shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white"
            >
              <CheckCircle className="w-6 h-6 text-slate-950" />
              <span>Nhận Huy Hiệu & Giấy Khen Danh Dự</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="text-center z-10 text-xs text-amber-200/80 font-semibold">
        Học liệu số mầm non · Giúp trẻ liên kết chuỗi nhiệm vụ và đạt được mục tiêu lớn
      </div>
    </div>
  );
};
