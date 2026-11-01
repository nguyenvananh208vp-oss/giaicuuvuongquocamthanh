/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { ANIMAL_SOUNDS, NATURE_SOUNDS, LIFE_SOUNDS, ASSET_IMAGES } from '../../data/gameData.ts';
import { AudioPlayerButton } from '../AudioPlayerButton.tsx';
import { soundSynthesizer } from '../../services/soundSynthesizer.ts';
import { speechNarrator } from '../../services/speechNarrator.ts';
import { SoundCategory, SoundItem } from '../../types.ts';

interface Slide10CastleGameProps {
  onCompleteStage4: () => void;
}

interface CastleChallenge {
  step: number;
  item: SoundItem;
  category: SoundCategory;
}

export const Slide10CastleGame: React.FC<Slide10CastleGameProps> = ({
  onCompleteStage4,
}) => {
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<SoundCategory | null>(null);
  const [solvedChallenges, setSolvedChallenges] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{
    type: 'idle' | 'correct' | 'incorrect';
    message: string;
  }>({
    type: 'idle',
    message: 'Bé hãy chạm vào chiếc loa để lắng nghe âm thanh thử thách nhé!',
  });

  const challenges: CastleChallenge[] = [
    { step: 1, item: ANIMAL_SOUNDS[2], category: 'animal' }, // Rooster
    { step: 2, item: NATURE_SOUNDS[0], category: 'nature' }, // Rain
    { step: 3, item: LIFE_SOUNDS[1], category: 'life' },     // Bicycle bell
  ];

  const currentChallenge = challenges[challengeIdx] || challenges[0];

  const handleSelectCategory = (cat: SoundCategory) => {
    if (cat === currentChallenge.category) {
      soundSynthesizer.playCorrect();
      setSelectedCategory(cat);
      const msg = `Rất chuẩn xác! Bé yêu của cô giỏi quá, đây đúng là nhóm ${
        cat === 'animal' ? 'Động vật' : cat === 'nature' ? 'Thiên nhiên' : 'Cuộc sống'
      }. Bây giờ con hãy chọn hình ảnh phát ra âm thanh giúp cô nhé!`;
      setFeedback({
        type: 'correct',
        message: msg,
      });
      speechNarrator.speak(msg);
    } else {
      soundSynthesizer.playIncorrect();
      const catName = cat === 'animal' ? 'Động vật' : cat === 'nature' ? 'Thiên nhiên' : 'Cuộc sống';
      const msg = `Chưa phải nhóm ${catName} rồi con yêu ơi. Con hãy cùng cô lắng nghe lại chiếc loa xem nhé!`;
      setFeedback({
        type: 'incorrect',
        message: msg,
      });
      speechNarrator.speak(msg);
    }
  };

  const handleSelectItem = (item: SoundItem) => {
    if (item.id === currentChallenge.item.id) {
      soundSynthesizer.playSoundById(item.id);
      setTimeout(() => soundSynthesizer.playCorrect(), 350);

      const nextSolved = [...solvedChallenges, currentChallenge.step];
      setSolvedChallenges(nextSolved);

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });

      const praise = `Tuyệt vời quá! Bé yêu của cô đã nhận ra đúng bạn ${item.name} rồi!`;
      setFeedback({
        type: 'correct',
        message: praise,
      });
      speechNarrator.speak(praise);

      setTimeout(() => {
        if (challengeIdx < challenges.length - 1) {
          setChallengeIdx((prev) => prev + 1);
          setSelectedCategory(null);
          setFeedback({
            type: 'idle',
            message: 'Tiếp tục cùng cô làm thử thách tiếp theo để mở cổng thành nào!',
          });
        }
      }, 1900);
    } else {
      soundSynthesizer.playIncorrect();
      const msg = 'Chưa đúng hình này rồi con yêu. Con hãy cùng cô lắng nghe lại chiếc loa nhé!';
      setFeedback({
        type: 'incorrect',
        message: msg,
      });
      speechNarrator.speak(msg);
    }
  };

  const isAllSolved = solvedChallenges.length >= challenges.length;

  const handleReset = () => {
    setChallengeIdx(0);
    setSelectedCategory(null);
    setSolvedChallenges([]);
    setFeedback({
      type: 'idle',
      message: 'Bé hãy chạm vào chiếc loa để nghe lại thử thách nhé!',
    });
  };

  // Get current candidate options based on selected category
  const candidateItems = selectedCategory
    ? selectedCategory === 'animal'
      ? ANIMAL_SOUNDS.slice(0, 4)
      : selectedCategory === 'nature'
      ? NATURE_SOUNDS.slice(0, 4)
      : LIFE_SOUNDS.slice(0, 4)
    : [];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 rounded-3xl border-4 border-purple-400 bg-gradient-to-b from-purple-50 via-pink-50 to-amber-50 shadow-2xl overflow-y-auto">
      {/* Background illustration */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-25">
        <img
          src={ASSET_IMAGES.castle}
          alt="Cổng Lâu Đài Hòa Âm"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-purple-600 text-white font-extrabold text-xs sm:text-sm shadow-xs">
            🎼 MÀN 4
          </span>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-800">
              Lâu Đài Hòa Âm Kỳ Diệu
            </h2>
            <p className="text-xs text-purple-800 font-medium">
              Chủ đề: Nhận biết, phân loại và phối hợp các nhóm âm thanh đã học
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-full border border-purple-300 shadow-xs">
          <span className="text-xs font-bold text-slate-700">Khóa cổng:</span>
          <div className="flex items-center gap-1">
            {challenges.map((c, idx) => {
              const isDone = solvedChallenges.includes(c.step);
              return (
                <span
                  key={c.step}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isDone
                      ? 'bg-purple-600 text-white scale-110 shadow-xs'
                      : idx === challengeIdx
                      ? 'bg-pink-400 text-white animate-pulse'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isDone ? '✓' : idx + 1}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Center Challenge Player */}
      <div className="my-2 sm:my-3 flex flex-col items-center text-center">
        {!isAllSolved ? (
          <>
            <AudioPlayerButton
              soundId={currentChallenge.item.id}
              label="Bấm loa để nghe âm thanh bí ẩn"
              hintText={`Nhiệm vụ ${challengeIdx + 1}/${challenges.length}: Âm thanh này thuộc nhóm nào và của ai?`}
            />

            {/* Feedback Message */}
            <div
              className={`mt-2.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
                feedback.type === 'correct'
                  ? 'bg-purple-100 border-purple-300 text-purple-900 animate-bounce'
                  : feedback.type === 'incorrect'
                  ? 'bg-rose-100 border-rose-300 text-rose-800'
                  : 'bg-white/90 border-purple-300 text-slate-700 shadow-xs'
              }`}
            >
              {feedback.message}
            </div>
          </>
        ) : (
          <div className="bg-white/95 border-2 border-purple-400 rounded-3xl p-6 text-center shadow-xl max-w-md animate-bounce">
            <span className="text-4xl">🎼</span>
            <h3 className="text-xl font-black text-purple-900 mt-2">
              Hoàn Thành Thử Thách Phân Loại!
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 mt-1">
              Bé đã nhận biết xuất sắc cả 3 nhóm âm thanh! Giờ là lúc hợp nhất 4 mảnh chìa khóa để mở toang Cổng Lâu Đài!
            </p>
            <button
              onClick={onCompleteStage4}
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-black text-base shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Ghép 4 Mảnh Chìa Khóa Ngay</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Two-step Interaction Area */}
      {!isAllSolved && (
        <div className="space-y-3">
          {/* Step 1: Categorize into Groups */}
          <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border-2 border-purple-300 shadow-sm text-center">
            <span className="text-xs font-black text-purple-900 uppercase tracking-wide block mb-2">
              Bước 1: Chọn nhóm âm thanh phù hợp
            </span>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                onClick={() => handleSelectCategory('animal')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 rounded-xl border-2 font-black text-xs sm:text-sm transition-all cursor-pointer ${
                  selectedCategory === 'animal'
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <span className="text-xl">🐾</span>
                <span>Động Vật</span>
              </button>

              <button
                onClick={() => handleSelectCategory('nature')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 rounded-xl border-2 font-black text-xs sm:text-sm transition-all cursor-pointer ${
                  selectedCategory === 'nature'
                    ? 'bg-cyan-500 text-white border-cyan-600 shadow-md ring-2 ring-cyan-300'
                    : 'bg-cyan-50 text-cyan-900 border-cyan-200 hover:bg-cyan-100'
                }`}
              >
                <span className="text-xl">🌿</span>
                <span>Thiên Nhiên</span>
              </button>

              <button
                onClick={() => handleSelectCategory('life')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 rounded-xl border-2 font-black text-xs sm:text-sm transition-all cursor-pointer ${
                  selectedCategory === 'life'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300'
                    : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <span className="text-xl">🔔</span>
                <span>Cuộc Sống</span>
              </button>
            </div>
          </div>

          {/* Step 2: Choose Exact Item */}
          {selectedCategory && (
            <div className="bg-white/95 p-3 rounded-2xl border-2 border-pink-300 shadow-sm text-center animate-fadeIn">
              <span className="text-xs font-black text-pink-900 uppercase tracking-wide block mb-2">
                Bước 2: Tìm đúng hình ảnh phát ra tiếng kêu
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {candidateItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl border-2 border-slate-200 hover:border-pink-400 bg-white hover:bg-pink-50 transition-all cursor-pointer active:scale-95"
                  >
                    <span className="text-2xl sm:text-3xl">{item.icon}</span>
                    <span className="text-xs font-bold text-slate-800 mt-1">{item.name}</span>
                    <span className="text-[10px] text-pink-700">{item.soundLabel}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer controls */}
      <div className="flex items-center justify-between pt-2 border-t border-purple-200">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white/70 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Làm lại thử thách</span>
        </button>

        {isAllSolved && (
          <button
            onClick={onCompleteStage4}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-600 text-white font-extrabold text-xs sm:text-sm shadow-md hover:bg-purple-700 transition-all cursor-pointer"
          >
            <span>Lắp Ráp Chìa Khóa Ma Thuật</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
