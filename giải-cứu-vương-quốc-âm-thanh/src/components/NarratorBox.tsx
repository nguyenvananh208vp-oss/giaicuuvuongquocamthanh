/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Sparkles, Mic, Heart, Radio, PlusCircle, CheckCircle2 } from 'lucide-react';
import { speechNarrator, SpeechStatus } from '../services/speechNarrator.ts';
import { teacherVoiceStore } from '../services/teacherVoiceStore.ts';
import { TeacherVoiceStudioModal } from './TeacherVoiceStudioModal.tsx';
import { ASSET_IMAGES } from '../data/gameData.ts';

interface NarratorBoxProps {
  text: string;
  slideNumber?: number;
  autoSpeak?: boolean;
  className?: string;
}

export const NarratorBox: React.FC<NarratorBoxProps> = ({
  text,
  slideNumber,
  autoSpeak = true,
  className = '',
}) => {
  const [speechStatus, setSpeechStatus] = useState<SpeechStatus>(speechNarrator.getStatus());
  const [isMuted, setIsMuted] = useState(speechNarrator.getVoiceMuted());
  const [hasRecordedVoice, setHasRecordedVoice] = useState(
    slideNumber ? teacherVoiceStore.hasRecordedVoice(slideNumber) : false
  );
  const [isLiveTeaching, setIsLiveTeaching] = useState(teacherVoiceStore.getLiveTeachingMode());
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  useEffect(() => {
    const unsubSpeech = speechNarrator.subscribe((status) => {
      setSpeechStatus(status);
    });

    const unsubVoiceStore = teacherVoiceStore.subscribe(() => {
      if (slideNumber) {
        setHasRecordedVoice(teacherVoiceStore.hasRecordedVoice(slideNumber));
      }
      setIsLiveTeaching(teacherVoiceStore.getLiveTeachingMode());
    });

    if (slideNumber) {
      setHasRecordedVoice(teacherVoiceStore.hasRecordedVoice(slideNumber));
    }
    setIsLiveTeaching(teacherVoiceStore.getLiveTeachingMode());

    // Auto-play ONLY if a real user-uploaded or recorded voice exists
    if (autoSpeak && !isMuted && slideNumber && teacherVoiceStore.hasRecordedVoice(slideNumber) && !teacherVoiceStore.getLiveTeachingMode()) {
      const timer = setTimeout(() => {
        speechNarrator.speak(text, false, slideNumber);
      }, 400);
      return () => {
        clearTimeout(timer);
        unsubSpeech();
        unsubVoiceStore();
      };
    }

    return () => {
      unsubSpeech();
      unsubVoiceStore();
    };
  }, [text, slideNumber, autoSpeak, isMuted]);

  const handlePlayVoice = () => {
    if (hasRecordedVoice) {
      speechNarrator.speak(text, true, slideNumber);
    } else {
      // Prompt user to record or upload their file
      setIsStudioOpen(true);
    }
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    speechNarrator.setVoiceMuted(next);
  };

  const handleToggleLiveTeaching = () => {
    const next = !isLiveTeaching;
    setIsLiveTeaching(next);
    teacherVoiceStore.setLiveTeachingMode(next);
    if (next) {
      speechNarrator.stop();
    }
  };

  const isSpeaking = speechStatus.isSpeaking;

  return (
    <>
      <div
        className={`relative flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-gradient-to-r from-rose-50/95 via-amber-50/95 to-sky-50/95 backdrop-blur-md border-2 border-rose-300 rounded-3xl p-3 sm:p-4 shadow-xl shadow-rose-950/10 ${className}`}
      >
        {/* Teacher Avatar */}
        <div className="relative shrink-0 flex items-center gap-3 sm:gap-0">
          <div
            onClick={handlePlayVoice}
            title={
              hasRecordedVoice
                ? 'Bấm để nghe Giọng Thật Của Cô đã thu âm/nạp file'
                : 'Bấm để ghi âm hoặc nạp file MP3 giọng thật của cô'
            }
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-3 border-rose-400 bg-white shadow-md cursor-pointer transition-all duration-300 ${
              isSpeaking
                ? 'scale-105 ring-4 ring-rose-400/50 animate-bounce'
                : 'hover:scale-105 hover:ring-2 hover:ring-rose-300'
            }`}
          >
            <img
              src={ASSET_IMAGES.teacher}
              alt="Cô Giáo Mầm Non Kể Chuyện"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            {/* Animated sound ripple overlay */}
            {isSpeaking && (
              <div className="absolute inset-0 bg-rose-400/15 backdrop-blur-[0.5px] flex items-center justify-center">
                <div className="flex items-end gap-1 h-6">
                  <span className="w-1.5 bg-rose-600 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-3"></span>
                  <span className="w-1.5 bg-rose-600 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-6"></span>
                  <span className="w-1.5 bg-rose-600 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-4"></span>
                </div>
              </div>
            )}
          </div>

          {isSpeaking && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-rose-500 items-center justify-center text-[10px] text-white font-black shadow-xs">
                ♪
              </span>
            </span>
          )}
        </div>

        {/* Story Prose & Dialogue Bubble */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="text-xs sm:text-sm font-extrabold text-rose-950 tracking-wide flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-400" />
              {isLiveTeaching ? (
                <span className="text-amber-800 font-black">🗣️ Chế Độ Cô Tự Giảng Trực Tiếp:</span>
              ) : hasRecordedVoice ? (
                <span className="text-emerald-800 font-black">✨ Giọng Thật Của Cô:</span>
              ) : (
                <span className="text-rose-900 font-black">👩‍🏫 Lời Cô Giáo Kể:</span>
              )}
            </span>

            {/* Status indicators */}
            {hasRecordedVoice && !isLiveTeaching && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full shadow-xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                100% Giọng Thật Của Cô (Đã nạp file)
              </span>
            )}

            {!hasRecordedVoice && !isLiveTeaching && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full shadow-xs">
                Cô giảng trực tiếp trên lớp (hoặc bấm Micro để nạp file)
              </span>
            )}

            {isLiveTeaching && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full shadow-xs">
                <Radio className="w-3 h-3 text-amber-600" />
                Cô Đang Giảng Trực Tiếp Cho Bé
              </span>
            )}

            {isSpeaking && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Đang phát Giọng Thật của cô... 🎙️
              </span>
            )}
          </div>

          <p className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
            "{text}"
          </p>
        </div>

        {/* Voice Controls Cluster */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-1.5 shrink-0">
          {/* Main Action Button */}
          {!isLiveTeaching && (
            <button
              onClick={handlePlayVoice}
              title={
                hasRecordedVoice
                  ? 'Bấm để nghe giọng thật của cô giáo'
                  : 'Bấm để ghi âm hoặc nạp file MP3 giọng thật cho slide này'
              }
              className={`flex items-center gap-1.5 px-3.5 py-2 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md active:scale-95 transition-all cursor-pointer whitespace-nowrap ${
                hasRecordedVoice
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-700'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
              }`}
            >
              {hasRecordedVoice ? (
                <>
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce text-yellow-200' : ''}`} />
                  <span>{isSpeaking ? 'Cô Đang Giảng...' : 'Nghe Giọng Thật 🎙️'}</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Nạp File Giọng Cô</span>
                </>
              )}
            </button>
          )}

          {/* Quick Toggle: Cô Tự Giảng Trực Tiếp */}
          <button
            onClick={handleToggleLiveTeaching}
            title={
              isLiveTeaching
                ? 'Tắt chế độ tự giảng trực tiếp'
                : 'Bật Chế Độ Tự Giảng: Cô nói trực tiếp trong lớp, phần mềm chỉ phát âm thanh hiệu ứng & trò chơi'
            }
            className={`flex items-center gap-1 px-2.5 py-2 rounded-2xl font-black text-xs border transition-all active:scale-95 cursor-pointer whitespace-nowrap ${
              isLiveTeaching
                ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300'
                : 'bg-white hover:bg-amber-50 text-amber-900 border-amber-300 shadow-xs'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{isLiveTeaching ? 'Đang Tự Giảng' : 'Cô Tự Giảng'}</span>
          </button>

          {/* Full Studio Launcher: Thu âm hoặc tải file MP3 người thật cho 12 slide */}
          <button
            onClick={() => setIsStudioOpen(true)}
            title="Mở Phòng Thu Giọng Thật Của Cô: Thu âm trực tiếp bằng micro hoặc tải file MP3 giọng thật cho từng slide"
            className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-xs rounded-2xl shadow-md active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Phòng Thu Giọng</span>
          </button>

          {/* Mute Voice */}
          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Bật lại tiếng nói' : 'Tắt tiếng nói'}
            className="p-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Global Teacher Voice Studio Modal */}
      <TeacherVoiceStudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        initialSlideNumber={slideNumber || 1}
      />
    </>
  );
};
