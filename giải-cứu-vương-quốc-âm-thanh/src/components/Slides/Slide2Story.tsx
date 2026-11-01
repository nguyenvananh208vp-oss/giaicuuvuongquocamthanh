/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, ArrowRight, Wind, ShieldAlert, HeartHandshake } from 'lucide-react';
import { ASSET_IMAGES } from '../../data/gameData.ts';
import { soundSynthesizer } from '../../services/soundSynthesizer.ts';

interface Slide2StoryProps {
  onNextSlide: () => void;
}

export const Slide2Story: React.FC<Slide2StoryProps> = ({ onNextSlide }) => {
  const handleHearWind = () => {
    soundSynthesizer.playWind();
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-br from-amber-50 via-purple-50 to-sky-50 rounded-3xl border-4 border-purple-200 shadow-xl overflow-y-auto">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-purple-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-purple-100 text-purple-700 font-extrabold text-sm">
            📖 CỐT TRUYỆN MỞ ĐẦU
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            Biến Cố Tại Vương Quốc Âm Thanh
          </h2>
        </div>
        <button
          onClick={handleHearWind}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold transition-all cursor-pointer"
        >
          <Wind className="w-4 h-4 text-purple-600" />
          <span>Nghe Gió Xoáy Thổi</span>
        </button>
      </div>

      {/* Two Character Showcase Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto">
        {/* Villain Card */}
        <div className="relative flex flex-col items-center bg-white/90 p-4 sm:p-5 rounded-3xl border-2 border-purple-300 shadow-md">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-purple-400 bg-purple-100 shadow-inner mb-3">
            <img
              src={ASSET_IMAGES.witch}
              alt="Phù Thủy Gió Xoáy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-black mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            PHÙ THỦY GIÓ XOÁY
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-800 text-center">
            Kẻ Cuốn Đi Mọi Âm Thanh
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 text-center mt-2 leading-relaxed">
            Phù thủy đã tạo ra những cơn gió lốc ma thuật, gom hết tiếng kêu của muôn thú, tiếng suối reo và chuông reo cất vào chiếc hộp phong ấn!
          </p>
        </div>

        {/* Hero Card */}
        <div className="relative flex flex-col items-center bg-white/90 p-4 sm:p-5 rounded-3xl border-2 border-emerald-300 shadow-md">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-emerald-400 bg-emerald-100 shadow-inner mb-3">
            <img
              src={ASSET_IMAGES.teacher}
              alt="Cô Giáo Mầm Non Kể Chuyện"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1 right-1 w-9 h-9 rounded-xl overflow-hidden border-2 border-white shadow-md">
              <img
                src={ASSET_IMAGES.bunny}
                alt="Thỏ Bông"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black mb-1">
            <HeartHandshake className="w-3.5 h-3.5" />
            CÔ GIÁO & BẠN THỎ BÔNG
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-800 text-center">
            Người Dẫn Đường Dịu Dàng Của Bé
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 text-center mt-2 leading-relaxed">
            "Các con yêu 4–5 tuổi ơi! Với đôi tai thính và sự thông minh của mình, các con hãy cùng cô và bạn Thỏ Bông vượt qua 4 vùng đất để tìm lại âm thanh cho vương quốc nhé!"
          </p>
        </div>
      </div>

      {/* Quest Roadmap Banner */}
      <div className="bg-amber-100/90 border border-amber-300 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <span className="text-xs sm:text-sm font-bold text-amber-900">
            Nhiệm vụ của bé: Thu thập 4 mảnh chìa khóa (Lông Vũ, Giọt Nước, Chuông Vàng, Huy Hiệu) để mở cổng lâu đài!
          </span>
        </div>

        <button
          onClick={onNextSlide}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          <span>Xem Cách Chơi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
