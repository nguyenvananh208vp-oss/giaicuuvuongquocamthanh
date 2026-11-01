/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { ANIMAL_SOUNDS, ASSET_IMAGES } from '../../data/gameData.ts';
import { AudioPlayerButton } from '../AudioPlayerButton.tsx';
import { soundSynthesizer } from '../../services/soundSynthesizer.ts';
import { speechNarrator } from '../../services/speechNarrator.ts';
import { SoundItem } from '../../types.ts';

interface Slide4ForestGameProps {
  onCompleteStage1: () => void;
}

export const Slide4ForestGame: React.FC<Slide4ForestGameProps> = ({
  onCompleteStage1,
}) => {
  // We can cycle through 3 animals or allow children to rescue them
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [rescuedAnimals, setRescuedAnimals] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<{
    type: 'idle' | 'correct' | 'incorrect';
    message: string;
  }>({
    type: 'idle',
    message: 'Bé hãy chạm vào chiếc loa để lắng nghe tiếng kêu bí ẩn nhé!',
  });

  // Pick target questions from ANIMAL_SOUNDS
  const questionTargets: SoundItem[] = [
    ANIMAL_SOUNDS[0], // Dog
    ANIMAL_SOUNDS[1], // Cat
    ANIMAL_SOUNDS[2], // Rooster
  ];

  const targetAnimal = questionTargets[currentQuestionIndex] || questionTargets[0];

  const handleSelectAnimal = (animal: SoundItem) => {
    if (animal.id === targetAnimal.id) {
      // Correct!
      soundSynthesizer.playSoundById(animal.id);
      setTimeout(() => soundSynthesizer.playCorrect(), 300);

      const nextRescued = new Set(rescuedAnimals);
      nextRescued.add(animal.id);
      setRescuedAnimals(nextRescued);

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
      });

      const praise = `Chính xác rồi! Bé yêu của cô giỏi quá, đã tìm lại tiếng kêu cho bạn ${animal.name} rồi!`;
      setFeedback({
        type: 'correct',
        message: praise,
      });
      speechNarrator.speak(praise);

      // Auto advance or complete
      setTimeout(() => {
        if (currentQuestionIndex < questionTargets.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setFeedback({
            type: 'idle',
            message: 'Tuyệt vời lắm! Cô mời các con hãy lắng nghe tiếng kêu của bạn thú tiếp theo nào!',
          });
        }
      }, 1800);
    } else {
      // Incorrect
      soundSynthesizer.playIncorrect();
      const encouragement = `Chưa đúng rồi con yêu ơi. Con hãy cùng cô lắng nghe lại chiếc loa xem là tiếng của bạn nào nhé!`;
      setFeedback({
        type: 'incorrect',
        message: encouragement,
      });
      speechNarrator.speak(encouragement);
    }
  };

  const isAllDone = rescuedAnimals.size >= questionTargets.length;

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setRescuedAnimals(new Set());
    setFeedback({
      type: 'idle',
      message: 'Bé hãy chạm vào chiếc loa để lắng nghe lại từ đầu nhé!',
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 rounded-3xl border-4 border-emerald-400 bg-gradient-to-b from-emerald-50 via-green-50 to-amber-50 shadow-2xl overflow-y-auto">
      {/* Background illustration subtle watermark */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-20">
        <img
          src={ASSET_IMAGES.forest}
          alt="Khu rừng tiếng hát"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-xs">
            🐦 MÀN 1
          </span>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-800">
              Khu Rừng Tiếng Hát
            </h2>
            <p className="text-xs text-emerald-800 font-medium">
              Chủ đề: Nhận biết âm thanh của các con vật quen thuộc
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-full border border-emerald-300 shadow-xs">
          <span className="text-xs font-bold text-slate-700">Đã giải cứu:</span>
          <div className="flex items-center gap-1">
            {questionTargets.map((q, idx) => {
              const isSaved = rescuedAnimals.has(q.id);
              return (
                <span
                  key={q.id}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isSaved
                      ? 'bg-emerald-500 text-white scale-110 shadow-xs'
                      : idx === currentQuestionIndex
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

      {/* Center Audio Player Challenge */}
      <div className="my-2 sm:my-4 flex flex-col items-center text-center">
        {!isAllDone ? (
          <>
            <AudioPlayerButton
              soundId={targetAnimal.id}
              label="Bấm vào chiếc loa để nghe tiếng con vật"
              hintText={`Câu hỏi ${currentQuestionIndex + 1}/${questionTargets.length}: Tiếng kêu này của bạn nào?`}
            />

            {/* Feedback Message */}
            <div
              className={`mt-3 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
                feedback.type === 'correct'
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-800 animate-bounce'
                  : feedback.type === 'incorrect'
                  ? 'bg-rose-100 border-rose-300 text-rose-800'
                  : 'bg-white/90 border-amber-300 text-slate-700 shadow-xs'
              }`}
            >
              {feedback.message}
            </div>
          </>
        ) : (
          <div className="bg-white/95 border-2 border-emerald-400 rounded-3xl p-6 text-center shadow-xl max-w-md animate-bounce">
            <span className="text-4xl">🎉</span>
            <h3 className="text-xl font-black text-emerald-900 mt-2">
              Khu Rừng Đã Hát Trở Lại!
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 mt-1">
              Con đã xuất sắc tìm lại tiếng sủa, tiếng meo meo và tiếng gáy vang dội cho muôn thú!
            </p>
            <button
              onClick={onCompleteStage1}
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-base shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Nhận Lông Vũ Âm Thanh</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Animal Selection Grid (6 familiar animals: chó, mèo, gà, vịt, lợn, bò) */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
        {ANIMAL_SOUNDS.map((animal) => {
          const isRescued = rescuedAnimals.has(animal.id);
          const isTarget = animal.id === targetAnimal.id;

          return (
            <button
              key={animal.id}
              onClick={() => handleSelectAnimal(animal)}
              disabled={isAllDone}
              className={`group relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 active:scale-95 cursor-pointer ${
                isRescued
                  ? 'bg-emerald-100/90 border-emerald-400 shadow-md ring-2 ring-emerald-300'
                  : 'bg-white hover:bg-amber-50/80 border-slate-200 hover:border-amber-400 shadow-sm'
              }`}
            >
              <span
                className={`text-3xl sm:text-4xl transition-transform ${
                  isRescued ? 'animate-bounce' : 'group-hover:scale-110'
                }`}
              >
                {animal.icon}
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-slate-800 mt-1.5">
                {animal.name}
              </span>
              <span className="text-[10px] font-semibold text-emerald-700">
                {animal.soundLabel}
              </span>

              {isRescued && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Footer Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-emerald-200">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white/70 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Chơi lại màn này</span>
        </button>

        {isAllDone && (
          <button
            onClick={onCompleteStage1}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs sm:text-sm shadow-md hover:bg-emerald-700 transition-all cursor-pointer"
          >
            <span>Nhận Thưởng Lông Vũ & Sang Màn 2</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
