/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { LIFE_SOUNDS, ASSET_IMAGES } from '../../data/gameData.ts';
import { AudioPlayerButton } from '../AudioPlayerButton.tsx';
import { soundSynthesizer } from '../../services/soundSynthesizer.ts';
import { speechNarrator } from '../../services/speechNarrator.ts';
import { SoundItem } from '../../types.ts';

interface Slide8ValleyGameProps {
  onCompleteStage3: () => void;
}

export const Slide8ValleyGame: React.FC<Slide8ValleyGameProps> = ({
  onCompleteStage3,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [rescuedItems, setRescuedItems] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<{
    type: 'idle' | 'correct' | 'incorrect';
    message: string;
  }>({
    type: 'idle',
    message: 'Bé hãy chạm vào chiếc loa để lắng nghe âm thanh đồ vật quen thuộc nhé!',
  });

  const targets: SoundItem[] = [
    LIFE_SOUNDS[0], // School bell
    LIFE_SOUNDS[1], // Bicycle bell
    LIFE_SOUNDS[3], // Alarm clock
  ];

  const currentTarget = targets[currentIdx] || targets[0];

  const handleSelectItem = (item: SoundItem) => {
    if (item.id === currentTarget.id) {
      soundSynthesizer.playSoundById(item.id);
      setTimeout(() => soundSynthesizer.playCorrect(), 350);

      const nextSet = new Set(rescuedItems);
      nextSet.add(item.id);
      setRescuedItems(nextSet);

      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
      });

      const praise = `Chính xác rồi! Bé yêu của cô giỏi quá, đã đánh thức tiếng reo vang của ${item.name} rồi!`;
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
            message: 'Tuyệt vời lắm! Cùng cô lắng nghe đồ vật quen thuộc tiếp theo nào!',
          });
        }
      }, 1900);
    } else {
      soundSynthesizer.playIncorrect();
      const encouragement = 'Chưa đúng rồi con yêu ơi. Con hãy cùng cô lắng nghe lại chiếc loa xem là đồ vật nào nhé!';
      setFeedback({
        type: 'incorrect',
        message: encouragement,
      });
      speechNarrator.speak(encouragement);
    }
  };

  const isAllRescued = rescuedItems.size >= targets.length;

  const handleReset = () => {
    setCurrentIdx(0);
    setRescuedItems(new Set());
    setFeedback({
      type: 'idle',
      message: 'Bé hãy chạm vào chiếc loa để lắng nghe lại từ đầu nhé!',
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 rounded-3xl border-4 border-amber-400 bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-50 shadow-2xl overflow-y-auto">
      {/* Background illustration */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-25">
        <img
          src={ASSET_IMAGES.valley}
          alt="Thung lũng âm thanh cuộc sống"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-amber-500 text-white font-extrabold text-xs sm:text-sm shadow-xs">
            🔔 MÀN 3
          </span>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-800">
              Thung Lũng Âm Thanh Cuộc Sống
            </h2>
            <p className="text-xs text-amber-800 font-medium">
              Chủ đề: Đánh thức âm thanh từ các hoạt động & đồ vật quen thuộc
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-full border border-amber-300 shadow-xs">
          <span className="text-xs font-bold text-slate-700">Đã đánh thức:</span>
          <div className="flex items-center gap-1">
            {targets.map((q, idx) => {
              const isSaved = rescuedItems.has(q.id);
              return (
                <span
                  key={q.id}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isSaved
                      ? 'bg-amber-500 text-white scale-110 shadow-xs'
                      : idx === currentIdx
                      ? 'bg-orange-400 text-white animate-pulse'
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
              label="Bấm loa để nghe tiếng đồ vật"
              hintText={`Câu hỏi ${currentIdx + 1}/${targets.length}: Đồ vật nào phát ra âm thanh này?`}
            />

            {/* Feedback Message */}
            <div
              className={`mt-3 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
                feedback.type === 'correct'
                  ? 'bg-amber-100 border-amber-400 text-amber-900 animate-bounce'
                  : feedback.type === 'incorrect'
                  ? 'bg-rose-100 border-rose-300 text-rose-800'
                  : 'bg-white/90 border-amber-300 text-slate-700 shadow-xs'
              }`}
            >
              {feedback.message}
            </div>
          </>
        ) : (
          <div className="bg-white/95 border-2 border-amber-400 rounded-3xl p-6 text-center shadow-xl max-w-md animate-bounce">
            <span className="text-4xl">🔔</span>
            <h3 className="text-xl font-black text-amber-900 mt-2">
              Thung Lũng Bừng Tỉnh Reo Vui!
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 mt-1">
              Tiếng chuông xe đạp kính coong, tiếng chuông trường đoong đoong đã ngân nga trở lại!
            </p>
            <button
              onClick={onCompleteStage3}
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-base shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Nhận Chiếc Chuông Vàng</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Life Objects Grid (5 items) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
        {LIFE_SOUNDS.map((item) => {
          const isDone = rescuedItems.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => handleSelectItem(item)}
              disabled={isAllRescued}
              className={`group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-2 transition-all duration-300 active:scale-95 cursor-pointer ${
                isDone
                  ? 'bg-amber-100/90 border-amber-400 shadow-md ring-2 ring-amber-300'
                  : 'bg-white hover:bg-amber-50 border-slate-200 hover:border-amber-300 shadow-sm'
              }`}
            >
              <span
                className={`text-3xl sm:text-4xl transition-transform ${
                  isDone ? 'animate-bounce' : 'group-hover:scale-110'
                }`}
              >
                {item.icon}
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-slate-800 mt-1.5 text-center">
                {item.name}
              </span>
              <span className="text-[10px] font-semibold text-amber-800 text-center">
                {item.soundLabel}
              </span>

              {isDone && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white rounded-full p-0.5 shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer controls */}
      <div className="flex items-center justify-between pt-2 border-t border-amber-200">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white/70 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Chơi lại màn này</span>
        </button>

        {isAllRescued && (
          <button
            onClick={onCompleteStage3}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-md hover:bg-amber-700 transition-all cursor-pointer"
          >
            <span>Nhận Chuông Vàng & Tới Màn 4</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
