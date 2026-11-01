/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Printer, RotateCcw, Volume2, Sparkles, Star } from 'lucide-react';
import { ALL_SOUNDS, ASSET_IMAGES } from '../../data/gameData.ts';
import { soundSynthesizer } from '../../services/soundSynthesizer.ts';
import { speechNarrator } from '../../services/speechNarrator.ts';

interface Slide12CelebrationProps {
  onRestartGame: () => void;
}

export const Slide12Celebration: React.FC<Slide12CelebrationProps> = ({
  onRestartGame,
}) => {
  const [childName, setChildName] = useState('Bé Thông Thái');
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    soundSynthesizer.playVictoryFanfare();
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.5 },
    });
    speechNarrator.speak(
      'Xin chúc mừng Nhà thám hiểm âm thanh nhí tài ba! Con đã xuất sắc hoàn thành tất cả thử thách và giải cứu Vương Quốc Âm Thanh!'
    );
  }, []);

  const handlePrintCertificate = () => {
    window.print();
  };

  const handlePlaySound = (soundId: string) => {
    soundSynthesizer.playSoundById(soundId);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 rounded-3xl border-4 border-amber-400 bg-gradient-to-b from-amber-50 via-purple-50 to-pink-50 shadow-2xl overflow-y-auto">
      {/* Background illustration */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-25">
        <img
          src={ASSET_IMAGES.cover}
          alt="Vương quốc phục hồi"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-amber-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-amber-500 text-white font-extrabold text-xs sm:text-sm">
            🏆 TỔNG KẾT & TRAO HUY HIỆU
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800">
            Lễ Vinh Danh Nhà Thám Hiểm Âm Thanh
          </h2>
        </div>
        <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
          Xuất Sắc Hoàn Thành 4 Màn Chơi
        </span>
      </div>

      {/* Certificate Card Section */}
      <div className="my-2 bg-gradient-to-br from-amber-100 via-white to-amber-50 p-4 sm:p-6 rounded-3xl border-4 border-amber-400 shadow-xl max-w-2xl mx-auto w-full text-center relative print:border-none print:shadow-none">
        {/* Decorative corner stars */}
        <Star className="absolute top-3 left-3 w-6 h-6 text-amber-400 fill-amber-300" />
        <Star className="absolute top-3 right-3 w-6 h-6 text-amber-400 fill-amber-300" />

        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-500 text-white font-black text-xs uppercase mb-2 shadow-xs">
          <Award className="w-4 h-4 fill-white" />
          CHỨNG NHẬN VINH DANH
        </div>

        <h3 className="text-xl sm:text-3xl font-black text-slate-800 tracking-tight">
          NHÀ THÁM HIỂM ÂM THANH KỲ TÀI
        </h3>

        <p className="text-xs text-slate-600 mt-1">
          Học liệu số mầm non · Lĩnh vực Phát triển Nhận Thức & Ngôn Ngữ
        </p>

        {/* Editable Child Name Input */}
        <div className="my-3 flex items-center justify-center gap-2">
          <span className="text-xs font-bold text-slate-600">Trao tặng cho:</span>
          {isEditingName ? (
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              autoFocus
              className="text-base sm:text-lg font-black text-purple-700 border-b-2 border-purple-500 bg-transparent text-center focus:outline-none px-2"
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              title="Nhấn để đổi tên bé"
              className="text-base sm:text-xl font-black text-purple-700 underline decoration-dotted hover:text-purple-900 cursor-pointer"
            >
              {childName} ✏️
            </button>
          )}
        </div>

        <p className="text-xs sm:text-sm text-slate-700 max-w-md mx-auto leading-relaxed">
          Đã xuất sắc vượt qua 4 thử thách: <strong>Khu Rừng Tiếng Hát</strong>,{' '}
          <strong>Thanh Âm Thiên Nhiên</strong>, <strong>Thung Lũng Cuộc Sống</strong> và{' '}
          <strong>Lâu Đài Hòa Âm</strong>, khôi phục niềm vui rộn rã cho toàn Vương Quốc Âm Thanh!
        </p>

        {/* 4 Medals Shards Icons */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mt-4 pt-3 border-t border-amber-200">
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl">🪶</span>
            <span className="text-[10px] font-bold text-slate-700 mt-1">Động Vật</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl">💧</span>
            <span className="text-[10px] font-bold text-slate-700 mt-1">Thiên Nhiên</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl">🔔</span>
            <span className="text-[10px] font-bold text-slate-700 mt-1">Cuộc Sống</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl">🗝️</span>
            <span className="text-[10px] font-bold text-slate-700 mt-1">Chìa Khóa Vàng</span>
          </div>
        </div>
      </div>

      {/* Sound Board Mini-Playground: Tap to review any sound */}
      <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border-2 border-purple-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-purple-900 uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Góc Ôn Tập Âm Thanh (Bé chạm vào để nghe lại):
          </span>
          <span className="text-[11px] text-slate-500 font-semibold hidden sm:inline">
            16 âm thanh phong phú
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
          {ALL_SOUNDS.map((item) => (
            <button
              key={item.id}
              onClick={() => handlePlaySound(item.id)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-amber-100 border border-slate-200 text-xs font-bold text-slate-700 hover:text-amber-900 active:scale-95 transition-all cursor-pointer"
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
              <Volume2 className="w-3 h-3 text-amber-600" />
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-200">
        <button
          onClick={handlePrintCertificate}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
        >
          <Printer className="w-4 h-4 text-purple-600" />
          <span>In / Lưu Phiếu Khen</span>
        </button>

        <button
          onClick={onRestartGame}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs sm:text-sm font-black shadow-md cursor-pointer active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Chơi Lại Từ Đầu</span>
        </button>
      </div>
    </div>
  );
};
