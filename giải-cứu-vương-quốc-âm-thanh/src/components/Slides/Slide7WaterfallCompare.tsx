/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, ArrowRight, HelpCircle, CheckCircle2 } from 'lucide-react';
import { ASSET_IMAGES, KEY_SHARDS } from '../../data/gameData.ts';
import { soundSynthesizer } from '../../services/soundSynthesizer.ts';
import { speechNarrator } from '../../services/speechNarrator.ts';

interface Slide7WaterfallCompareProps {
  onNextStage: () => void;
}

export const Slide7WaterfallCompare: React.FC<Slide7WaterfallCompareProps> = ({
  onNextStage,
}) => {
  const [playingA, setPlayingA] = useState(false);
  const [playingB, setPlayingB] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<'rain' | 'ocean' | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    soundSynthesizer.playOceanWaves();
  }, []);

  const handlePlayRain = () => {
    setPlayingA(true);
    soundSynthesizer.playRain();
    setTimeout(() => setPlayingA(false), 3000);
  };

  const handlePlayOcean = () => {
    setPlayingB(true);
    soundSynthesizer.playOceanWaves();
    setTimeout(() => setPlayingB(false), 3000);
  };

  const handlePickAnswer = (choice: 'rain' | 'ocean') => {
    setSelectedAnswer(choice);
    if (choice === 'rain') {
      soundSynthesizer.playCorrect();
      setTimeout(() => soundSynthesizer.playKeyShardUnlock(), 400);
      setIsUnlocked(true);

      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
      });

      const msg = 'Đúng rồi! Tiếng mưa rơi rơi tí tách từng giọt nhỏ. Con đã nhận được Giọt Nước Phép Thuật!';
      speechNarrator.speak(msg);
    } else {
      soundSynthesizer.playIncorrect();
      const msg = 'Sóng biển cuộn từng đợt rì rào cơ! Con thử nghe lại tiếng mưa tí tách nhé!';
      speechNarrator.speak(msg);
    }
  };

  const shard = KEY_SHARDS.water;

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 rounded-3xl border-4 border-cyan-400 bg-gradient-to-b from-sky-50 via-teal-50 to-blue-50 shadow-2xl overflow-y-auto">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-30">
        <img
          src={ASSET_IMAGES.nature}
          alt="Thanh âm thiên nhiên tươi mát"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-200 pb-2">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-cyan-600 text-white font-extrabold text-xs sm:text-sm">
            👂 KHÁM PHÁ ĐẶC BIỆT
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-800">
            Lắng Nghe & So Sánh Hai Âm Thanh Tự Nhiên
          </h2>
        </div>
        <span className="text-xs font-bold text-cyan-800 bg-cyan-100 px-3 py-1 rounded-full">
          Phát triển thính giác tinh tế
        </span>
      </div>

      {/* Side-by-side Sound comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
        {/* Sound A: Rain */}
        <div className="flex flex-col items-center bg-white/90 p-4 rounded-3xl border-2 border-sky-300 shadow-md text-center">
          <span className="text-4xl mb-1">🌧️</span>
          <h3 className="text-base font-black text-sky-900">Tiếng Mưa Rơi</h3>
          <p className="text-xs text-slate-600 mt-1 mb-3">
            Những hạt mưa nhỏ rơi đều đặn: <span className="font-bold text-sky-700">"Tí tách, tí tách..."</span>
          </p>
          <button
            onClick={handlePlayRain}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer ${
              playingA ? 'ring-4 ring-sky-300 animate-pulse' : ''
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{playingA ? 'Đang phát tiếng mưa...' : 'Nghe Tiếng Mưa'}</span>
          </button>
        </div>

        {/* Sound B: Ocean Waves */}
        <div className="flex flex-col items-center bg-white/90 p-4 rounded-3xl border-2 border-cyan-300 shadow-md text-center">
          <span className="text-4xl mb-1">🌊</span>
          <h3 className="text-base font-black text-cyan-900">Tiếng Sóng Biển</h3>
          <p className="text-xs text-slate-600 mt-1 mb-3">
            Sóng biển cuộn tròn vỗ vào bờ cát: <span className="font-bold text-cyan-700">"Rì rào, ào ào..."</span>
          </p>
          <button
            onClick={handlePlayOcean}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer ${
              playingB ? 'ring-4 ring-cyan-300 animate-pulse' : ''
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{playingB ? 'Đang phát tiếng sóng...' : 'Nghe Tiếng Sóng Biển'}</span>
          </button>
        </div>
      </div>

      {/* Quiz / Assessment question */}
      <div className="bg-white/95 border-2 border-cyan-300 rounded-2xl p-4 shadow-md text-center max-w-xl mx-auto w-full">
        <div className="flex items-center justify-center gap-1.5 text-xs font-black text-cyan-900 uppercase mb-1">
          <HelpCircle className="w-4 h-4 text-cyan-600" />
          Câu Hỏi Cho Bé:
        </div>
        <p className="text-sm font-extrabold text-slate-800">
          "Âm thanh nào nghe tí tách từng giọt rơi xuống lá cây?"
        </p>

        <div className="flex items-center justify-center gap-3 mt-3">
          <button
            onClick={() => handlePickAnswer('rain')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black border-2 transition-all cursor-pointer ${
              selectedAnswer === 'rain'
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-105'
                : 'bg-sky-50 hover:bg-sky-100 text-sky-900 border-sky-300'
            }`}
          >
            <span>🌧️ Tiếng mưa rơi tí tách</span>
            {selectedAnswer === 'rain' && <CheckCircle2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => handlePickAnswer('ocean')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black border-2 transition-all cursor-pointer ${
              selectedAnswer === 'ocean'
                ? 'bg-rose-100 text-rose-800 border-rose-300'
                : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border-cyan-300'
            }`}
          >
            <span>🌊 Tiếng sóng biển</span>
          </button>
        </div>
      </div>

      {/* Reward Unlock Banner */}
      {isUnlocked && (
        <div className="mt-3 bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-500 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-3">
            <span className="text-3xl bg-white/20 p-1.5 rounded-xl">{shard.icon}</span>
            <div>
              <span className="text-xs uppercase font-extrabold text-cyan-100">
                MẢNH GHÉP SỐ 2 ĐÃ MỞ KHÓA!
              </span>
              <h4 className="text-base font-black">{shard.name}</h4>
            </div>
          </div>

          <button
            onClick={onNextStage}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-cyan-900 font-black text-xs sm:text-sm shadow-md hover:bg-cyan-50 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Sang Màn 3</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Footer if not yet answered */}
      {!isUnlocked && (
        <div className="flex justify-end pt-2">
          <button
            onClick={() => handlePickAnswer('rain')}
            className="text-xs font-bold text-cyan-700 hover:text-cyan-900 underline cursor-pointer"
          >
            Bấm nhanh nhận Giọt Nước Phép Thuật & Sang Màn 3 →
          </button>
        </div>
      )}
    </div>
  );
};
