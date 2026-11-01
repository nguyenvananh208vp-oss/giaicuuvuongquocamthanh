/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Mic, Volume2 } from 'lucide-react';
import { SlideNumber } from './types.ts';
import { SLIDES_CONFIG } from './data/gameData.ts';
import { soundSynthesizer } from './services/soundSynthesizer.ts';
import { NarratorBox } from './components/NarratorBox.tsx';
import { KeyShardsHud } from './components/KeyShardsHud.tsx';
import { SlideNavbar } from './components/SlideNavbar.tsx';
import { TeacherVoiceStudioModal } from './components/TeacherVoiceStudioModal.tsx';
import { SoundEffectsStudioModal } from './components/SoundEffectsStudioModal.tsx';

import { Slide1Cover } from './components/Slides/Slide1Cover.tsx';
import { Slide2Story } from './components/Slides/Slide2Story.tsx';
import { Slide3HowToPlay } from './components/Slides/Slide3HowToPlay.tsx';
import { Slide4ForestGame } from './components/Slides/Slide4ForestGame.tsx';
import { Slide5ForestReward } from './components/Slides/Slide5ForestReward.tsx';
import { Slide6WaterfallGame } from './components/Slides/Slide6WaterfallGame.tsx';
import { Slide7WaterfallCompare } from './components/Slides/Slide7WaterfallCompare.tsx';
import { Slide8ValleyGame } from './components/Slides/Slide8ValleyGame.tsx';
import { Slide9ValleyReward } from './components/Slides/Slide9ValleyReward.tsx';
import { Slide10CastleGame } from './components/Slides/Slide10CastleGame.tsx';
import { Slide11CastleAssembly } from './components/Slides/Slide11CastleAssembly.tsx';
import { Slide12Celebration } from './components/Slides/Slide12Celebration.tsx';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState<SlideNumber>(1);
  const [unlockedShards, setUnlockedShards] = useState<Set<string>>(new Set());
  const [isMuted, setIsMuted] = useState(soundSynthesizer.getMuted());
  const [isGlobalStudioOpen, setIsGlobalStudioOpen] = useState(false);
  const [isSoundEffectsStudioOpen, setIsSoundEffectsStudioOpen] = useState(false);

  // Slide navigation handlers
  const goToSlide = useCallback((slideNum: SlideNumber) => {
    setCurrentSlide(slideNum);
  }, []);

  const nextSlide = useCallback(() => {
    if (currentSlide < 12) {
      setCurrentSlide((prev) => (prev + 1) as SlideNumber);
    }
  }, [currentSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 1) {
      setCurrentSlide((prev) => (prev - 1) as SlideNumber);
    }
  }, [currentSlide]);

  // Stage unlocks
  const handleCompleteStage1 = () => {
    const next = new Set(unlockedShards);
    next.add('feather');
    setUnlockedShards(next);
    goToSlide(5);
  };

  const handleCompleteStage2 = () => {
    const next = new Set(unlockedShards);
    next.add('water');
    setUnlockedShards(next);
    goToSlide(7);
  };

  const handleCompleteStage3 = () => {
    const next = new Set(unlockedShards);
    next.add('bell');
    setUnlockedShards(next);
    goToSlide(9);
  };

  const handleCompleteStage4 = () => {
    const next = new Set(unlockedShards);
    next.add('emblem');
    setUnlockedShards(next);
    goToSlide(11);
  };

  const handleRestartGame = () => {
    setUnlockedShards(new Set());
    goToSlide(1);
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundSynthesizer.setMuted(next);
  };

  // Keyboard navigation for interactive whiteboards and classrooms
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const currentSlideInfo = SLIDES_CONFIG.find((s) => s.number === currentSlide);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-900 text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Bar following Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="flex items-center justify-between gap-8 px-4 sm:px-6 py-2.5 bg-white/95 border-b border-amber-200 z-20 shrink-0">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => goToSlide(1)}
          className="text-base sm:text-lg font-black tracking-tight text-amber-900 whitespace-nowrap shrink-0 flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <span className="text-xl">🌈</span>
          <span>Vương Quốc Âm Thanh</span>
        </button>

        {/* Zone 2: Clean single-line navigation links for 4 lands */}
        <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-bold text-slate-600">
          <button
            onClick={() => goToSlide(4)}
            className={`hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentSlide === 4 || currentSlide === 5 ? 'text-emerald-700 underline underline-offset-4' : ''
            }`}
          >
            Khu Rừng Tiếng Hát
          </button>
          <button
            onClick={() => goToSlide(6)}
            className={`hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentSlide === 6 || currentSlide === 7 ? 'text-cyan-700 underline underline-offset-4' : ''
            }`}
          >
            Thanh Âm Thiên Nhiên
          </button>
          <button
            onClick={() => goToSlide(8)}
            className={`hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentSlide === 8 || currentSlide === 9 ? 'text-amber-700 underline underline-offset-4' : ''
            }`}
          >
            Thung Lũng Cuộc Sống
          </button>
          <button
            onClick={() => goToSlide(10)}
            className={`hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentSlide === 10 || currentSlide === 11 ? 'text-purple-700 underline underline-offset-4' : ''
            }`}
          >
            Lâu Đài Hòa Âm
          </button>
        </nav>

        {/* Zone 3: Primary action / HUD key tracker & Studio buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsSoundEffectsStudioOpen(true)}
            title="Kho Âm Thanh Câu Đố (Nghe thử & Thay thế bằng file của bạn, chuẩn 3s)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Âm Thanh Câu Đố</span>
            <span className="sm:hidden">Kho Âm</span>
          </button>

          <button
            onClick={() => setIsGlobalStudioOpen(true)}
            title="Mở Phòng Thu & Quản Lý Giọng Thật Của Cô Cho 12 Slide"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Phòng Thu Giọng Cô</span>
            <span className="sm:hidden">Thu Giọng</span>
          </button>

          <KeyShardsHud
            unlockedShards={unlockedShards}
            onShardClick={(shardId) => {
              if (shardId === 'feather') goToSlide(4);
              else if (shardId === 'water') goToSlide(6);
              else if (shardId === 'bell') goToSlide(8);
              else if (shardId === 'emblem') goToSlide(10);
            }}
          />
        </div>
      </header>

      {/* Storyteller Voiceover Narration Bar */}
      {currentSlideInfo && (
        <div className="px-3 sm:px-6 pt-2 shrink-0 z-10">
          <NarratorBox
            text={currentSlideInfo.narrationText}
            slideNumber={currentSlideInfo.number}
            autoSpeak={true}
          />
        </div>
      )}

      {/* Main Slide Interactive Stage */}
      <main className="flex-1 min-h-0 p-2 sm:p-4 relative">
        <div className="w-full h-full max-w-6xl mx-auto relative flex flex-col">
          {currentSlide === 1 && (
            <Slide1Cover
              onStartGame={() => goToSlide(4)}
              onExploreMap={() => goToSlide(2)}
            />
          )}

          {currentSlide === 2 && (
            <Slide2Story onNextSlide={() => goToSlide(3)} />
          )}

          {currentSlide === 3 && (
            <Slide3HowToPlay onStartStage1={() => goToSlide(4)} />
          )}

          {currentSlide === 4 && (
            <Slide4ForestGame onCompleteStage1={handleCompleteStage1} />
          )}

          {currentSlide === 5 && (
            <Slide5ForestReward onNextStage={() => goToSlide(6)} />
          )}

          {currentSlide === 6 && (
            <Slide6WaterfallGame onCompleteStage2={handleCompleteStage2} />
          )}

          {currentSlide === 7 && (
            <Slide7WaterfallCompare onNextStage={() => goToSlide(8)} />
          )}

          {currentSlide === 8 && (
            <Slide8ValleyGame onCompleteStage3={handleCompleteStage3} />
          )}

          {currentSlide === 9 && (
            <Slide9ValleyReward onNextStage={() => goToSlide(10)} />
          )}

          {currentSlide === 10 && (
            <Slide10CastleGame onCompleteStage4={handleCompleteStage4} />
          )}

          {currentSlide === 11 && (
            <Slide11CastleAssembly onUnlockCelebration={() => goToSlide(12)} />
          )}

          {currentSlide === 12 && (
            <Slide12Celebration onRestartGame={handleRestartGame} />
          )}
        </div>
      </main>

      {/* Bottom PowerPoint Style Navigation Bar */}
      <SlideNavbar
        currentSlide={currentSlide}
        totalSlides={12}
        onSelectSlide={goToSlide}
        onNextSlide={nextSlide}
        onPrevSlide={prevSlide}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Global Teacher Voice Studio Modal */}
      <TeacherVoiceStudioModal
        isOpen={isGlobalStudioOpen}
        onClose={() => setIsGlobalStudioOpen(false)}
        initialSlideNumber={currentSlide}
      />

      {/* Global Sound Effects Studio Modal */}
      <SoundEffectsStudioModal
        isOpen={isSoundEffectsStudioOpen}
        onClose={() => setIsSoundEffectsStudioOpen(false)}
      />
    </div>
  );
}
