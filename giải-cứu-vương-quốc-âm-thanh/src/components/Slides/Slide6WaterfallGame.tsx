/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { NATURE_SOUNDS, ASSET_IMAGES } from '../../data/gameData.ts';
import { AudioPlayerButton } from '../AudioPlayerButton.tsx';
import { soundSynthesizer } from '../../services/soundSynthesizer.ts';
import { speechNarrator } from '../../services/speechNarrator.ts';
import { SoundItem } from '../../types.ts';

interface Slide6WaterfallGameProps {
  onCompleteStage2: () => void;
}

export const Slide6WaterfallGame: React.FC<Slide6WaterfallGameProps> = ({
  onCompleteStage2,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [rescuedNature, setRescuedNature] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<{
    type: 'idle' | 'correct' | 'incorrect';
    message: string;
  }>({
    type: 'idle',
    message: 'Bé hãy chạm vào chiếc loa để lắng nghe âm thanh của thiên nhiên nhé!',
  });

  // Nature targets: rain, wind, thunder, ocean
  const targets: SoundItem[] = [
    NATURE_SOUNDS[0], // Rain
    NATURE_SOUNDS[1], // Wind
    NATURE_SOUNDS[2], // Thunder
  ];

  const currentTarget = targets[currentIdx] || targets[0];

  const handleSelectNature = (item: SoundItem) => {
    if (item.id === currentTarget.id) {
      soundSynthesizer.playSoundById(item.id);
      setTimeout(() => soundSynthesizer.playCorrect(), 300);

      const nextSet = new Set(rescuedNature);
      nextSet.add(item.id);
      setRescuedNature(nextSet);

      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
      });

      const praise = `Chính xác rồi! Bé yêu của cô giỏi quá, đã tìm thấy tiếng ${item.name} rồi! Thiên nhiên bừng nở reo vui!`;
      setFeedback({
        type: 'correct',
        message: praise,
      });
      speechNarrator.speak(praise);

      setTimeout(() => {
        if (currentIdx < targets.length - 1) {
          setCurrentIdx((prev) => prev + 1);
          setFeedback({
            type: 'idle',
            message: 'Bé yêu của cô giỏi lắm! Cùng cô lắng nghe âm thanh thiên nhiên tiếp theo nào!',
          });
        }
      }, 1900);
    } else {
      soundSynthesizer.playIncorrect();
      const encouragement = 'Chưa đúng rồi con yêu ơi. Con hãy cùng cô lắng nghe lại chiếc loa xem là âm thanh nào nhé!';
      setFeedback({
        type: 'incorrect',
        message: encouragement,
      });
      speechNarrator.speak(encouragement);
    }
  };

  const isAllRescued = rescuedNature.size >= targets.length;

  const handleReset = () => {
    setCurrentIdx(0);
    setRescuedNature(new Set());
    setFeedback({
      type: 'idle',
      message: 'Bé hãy chạm vào chiếc loa để lắng nghe lại từ đầu nhé!',
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 rounded-3xl border-4 border-cyan-400 bg-gradient-to-b from-cyan-50 via-sky-50 to-teal-50 shadow-2xl overflow-y-auto">
      {/* Dynamic Nature Meadow Background (No waterfall) */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-30">
        <img
          src={ASSET_IMAGES.nature}
          alt="Thanh âm thiên nhiên kỳ thú"
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-all duration-700 ${
            rescuedNature.size > 0 ? 'filter saturate-150' : 'filter grayscale'
          }`}
        />
      </div>

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-cyan-600 text-white font-extrabold text-xs sm:text-sm shadow-xs">
            🌿 MÀN 2
          </span>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-800">
              Thanh Âm Thiên Nhiên Kỳ Thú
            </h2>
            <p className="text-xs text-cyan-800 font-medium">
              Chủ đề: Khám phá thế giới âm thanh mưa, gió, sấm chớp và sóng biển
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-full border border-cyan-300 shadow-xs">
          <span className="text-xs font-bold text-slate-700">Đã khơi mở:</span>
          <div className="flex items-center gap-1">
            {targets.map((q, idx) => {
              const isSaved = rescuedNature.has(q.id);
              return (
                <span
                  key={q.id}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isSaved
                      ? 'bg-cyan-600 text-white scale-110 shadow-xs'
                      : idx === currentIdx
                      ? 'bg-amber-400 text-amber-900 animate-pulse'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isSaved ? '✓' : idx + 1}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Center Challenge Player */}
      <div className="my-2 sm:my-4 flex flex-col items-center text-center">
        {!isAllRescued ? (
          <>
            <AudioPlayerButton
              soundId={currentTarget.id}
              label="Bấm loa để nghe tiếng thiên nhiên"
              hintText={`Thử thách ${currentIdx + 1}/${targets.length}: Đây là tiếng gì của tự nhiên?`}
            />

            {/* Feedback Message */}
            <div
              className={`mt-3 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
                feedback.type === 'correct'
                  ? 'bg-cyan-100 border-cyan-300 text-cyan-900 animate-bounce'
                  : feedback.type === 'incorrect'
                  ? 'bg-rose-100 border-rose-300 text-rose-800'
                  : 'bg-white/90 border-cyan-300 text-slate-700 shadow-xs'
              }`}
            >
              {feedback.message}
            </div>
          </>
        ) : (
          <div className="bg-white/95 border-2 border-cyan-400 rounded-3xl p-6 text-center shadow-xl max-w-md animate-bounce">
            <span className="text-4xl">🌈</span>
            <h3 className="text-xl font-black text-cyan-900 mt-2">
              Thiên Nhiên Đã Bừng Tỉnh Reo Ca!
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 mt-1">
              Gió mát thổi qua hàng cây, mưa rào mát rượi và sóng vỗ dạt dào đã trở về! Cùng khám phá phần so sánh âm thanh đặc biệt nhé!
            </p>
            <button
              onClick={onCompleteStage2}
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-base shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Khám Phá So Sánh Âm Thanh</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Nature Sounds Grid (rain, wind, thunder, ocean - No waterfall) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto w-full">
        {NATURE_SOUNDS.map((item) => {
          const isDone = rescuedNature.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => handleSelectNature(item)}
              disabled={isAllRescued}
              className={`group relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 active:scale-95 cursor-pointer ${
                isDone
                  ? 'bg-cyan-100/90 border-cyan-400 shadow-md ring-2 ring-cyan-300'
                  : 'bg-white hover:bg-sky-50 border-slate-200 hover:border-cyan-300 shadow-sm'
              }`}
            >
              <span
                className={`text-4xl transition-transform ${
                  isDone ? 'animate-bounce' : 'group-hover:scale-110'
                }`}
              >
                {item.icon}
              </span>
              <span className="text-sm font-extrabold text-slate-800 mt-2 text-center">
                {item.name}
              </span>
              <span className="text-xs font-semibold text-cyan-700 text-center">
                {item.soundLabel}
              </span>

              {isDone && (
                <span className="absolute -top-1.5 -right-1.5 bg-cyan-600 text-white rounded-full p-0.5 shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer controls */}
      <div className="flex items-center justify-between pt-2 border-t border-cyan-200">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white/70 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Chơi lại màn này</span>
        </button>

        {isAllRescued && (
          <button
            onClick={onCompleteStage2}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-600 text-white font-extrabold text-xs sm:text-sm shadow-md hover:bg-cyan-700 transition-all cursor-pointer"
          >
            <span>Tiếp Tục So Sánh & Nhận Giọt Nước</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
