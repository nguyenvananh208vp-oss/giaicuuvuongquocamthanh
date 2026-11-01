/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Volume2, CheckCircle2, Key, ArrowRight, Sparkles } from 'lucide-react';
import { soundSynthesizer } from '../../services/soundSynthesizer.ts';

interface Slide3HowToPlayProps {
  onStartStage1: () => void;
}

export const Slide3HowToPlay: React.FC<Slide3HowToPlayProps> = ({ onStartStage1 }) => {
  const [demoSelected, setDemoSelected] = useState<string | null>(null);
  const [demoFeedback, setDemoFeedback] = useState<string>('Bé hãy bấm vào chiếc loa ở Bước 1 thử xem nào!');

  const handlePlayDemoSound = () => {
    soundSynthesizer.playCatMeow();
    setDemoFeedback('Âm thanh vừa kêu: "Meo meo~". Bạn nào kêu meo meo thế nhỉ?');
  };

  const handlePickAnimal = (animal: 'dog' | 'cat') => {
    setDemoSelected(animal);
    if (animal === 'cat') {
      soundSynthesizer.playCatMeow();
      setTimeout(() => soundSynthesizer.playCorrect(), 600);
      setDemoFeedback('🎉 Hoan hô con! Đúng là bạn Mèo con kêu meo meo rồi!');
    } else {
      soundSynthesizer.playDogBark();
      setDemoFeedback('Bạn chó kêu gâu gâu cơ! Con hãy lắng nghe lại chiếc loa nhé!');
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-br from-emerald-50 via-amber-50 to-sky-50 rounded-3xl border-4 border-emerald-300 shadow-xl overflow-y-auto">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-sm">
            💡 HƯỚNG DẪN
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            Cách Chơi Thật Đơn Giản Cho Bé
          </h2>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full">
          Dành cho trẻ 4–5 tuổi
        </span>
      </div>

      {/* 3 Steps Visual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 my-auto">
        {/* Step 1 */}
        <div className="flex flex-col items-center bg-white p-4 rounded-3xl border-2 border-amber-300 shadow-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl font-black mb-2 shadow-md">
            1
          </div>
          <div className="p-3 bg-amber-100 rounded-2xl mb-2 text-amber-700">
            <Volume2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-slate-800">Chạm Vào Chiếc Loa</h3>
          <p className="text-xs text-slate-600 mt-1">
            Con hãy giữ trật tự và chăm chú lắng nghe âm thanh kỳ diệu phát ra từ chiếc loa nhé!
          </p>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center bg-white p-4 rounded-3xl border-2 border-sky-300 shadow-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-xl font-black mb-2 shadow-md">
            2
          </div>
          <div className="p-3 bg-sky-100 rounded-2xl mb-2 text-sky-700">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-slate-800">Chọn Đúng Hình Ảnh</h3>
          <p className="text-xs text-slate-600 mt-1">
            Nhìn các bức tranh trên màn hình và chạm vào bạn thú hoặc đồ vật tương ứng!
          </p>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center bg-white p-4 rounded-3xl border-2 border-emerald-300 shadow-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl font-black mb-2 shadow-md">
            3
          </div>
          <div className="p-3 bg-emerald-100 rounded-2xl mb-2 text-emerald-700">
            <Key className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-slate-800">Nhận Mảnh Chìa Khóa</h3>
          <p className="text-xs text-slate-600 mt-1">
            Mỗi khi cứu được một vùng đất, con sẽ nhận được 1 mảnh ghép để mở cổng Lâu Đài!
          </p>
        </div>
      </div>

      {/* Interactive Try-it Sandbox */}
      <div className="bg-white/95 border-2 border-amber-300 rounded-2xl p-4 shadow-md">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span className="text-xs font-black text-amber-900 uppercase tracking-wide">
            Bé Tập Thử Ngay Tại Đây:
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Audio Button */}
          <button
            onClick={handlePlayDemoSound}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md cursor-pointer active:scale-95 transition-all"
          >
            <Volume2 className="w-5 h-5 animate-pulse" />
            <span>1. Bấm nghe âm thanh thử</span>
          </button>

          {/* 2 Choices */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">2. Chọn hình:</span>
            <button
              onClick={() => handlePickAnimal('dog')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-xs font-extrabold transition-all cursor-pointer ${
                demoSelected === 'dog'
                  ? 'border-rose-400 bg-rose-50 text-rose-800'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="text-base">🐶</span>
              <span>Chú chó</span>
            </button>

            <button
              onClick={() => handlePickAnimal('cat')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-xs font-extrabold transition-all cursor-pointer ${
                demoSelected === 'cat'
                  ? 'border-emerald-500 bg-emerald-100 text-emerald-900 ring-2 ring-emerald-300'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="text-base">🐱</span>
              <span>Mèo con</span>
            </button>
          </div>
        </div>

        <p className="mt-2 text-xs font-semibold text-emerald-800 bg-emerald-50/80 p-2 rounded-xl border border-emerald-200">
          {demoFeedback}
        </p>
      </div>

      {/* Start Stage 1 CTA */}
      <div className="flex items-center justify-end pt-2">
        <button
          onClick={onStartStage1}
          className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white font-black text-base shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span>Bắt Đầu Màn 1: Khu Rừng Tiếng Hát</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
