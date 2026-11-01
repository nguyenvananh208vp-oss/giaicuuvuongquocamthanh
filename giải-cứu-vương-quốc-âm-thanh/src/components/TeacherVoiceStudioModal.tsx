/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Play,
  Pause,
  Trash2,
  Check,
  Upload,
  Volume2,
  X,
  Sparkles,
  AlertCircle,
  Heart,
  Download,
  Settings2,
  Layers,
  Radio,
} from 'lucide-react';
import { SLIDES_CONFIG } from '../data/gameData.ts';
import { teacherVoiceStore } from '../services/teacherVoiceStore.ts';
import { soundSynthesizer } from '../services/soundSynthesizer.ts';
import { speechNarrator } from '../services/speechNarrator.ts';

interface TeacherVoiceStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSlideNumber?: number;
}

export const TeacherVoiceStudioModal: React.FC<TeacherVoiceStudioModalProps> = ({
  isOpen,
  onClose,
  initialSlideNumber = 1,
}) => {
  const [activeSlide, setActiveSlide] = useState(initialSlideNumber);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [playingSlideNum, setPlayingSlideNum] = useState<number | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [recordedSlides, setRecordedSlides] = useState<number[]>([]);
  const [isLiveTeaching, setIsLiveTeaching] = useState(teacherVoiceStore.getLiveTeachingMode());
  const [preferReal, setPreferReal] = useState(teacherVoiceStore.isPreferRealVoice());

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const batchFileInputRef = useRef<HTMLInputElement | null>(null);
  const jsonImportRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      refreshState();
      setActiveSlide(initialSlideNumber);
    } else {
      stopPreview();
    }
  }, [isOpen, initialSlideNumber]);

  const refreshState = () => {
    setRecordedSlides(teacherVoiceStore.getAllRecordedSlides());
    setIsLiveTeaching(teacherVoiceStore.getLiveTeachingMode());
    setPreferReal(teacherVoiceStore.isPreferRealVoice());
    const existing = teacherVoiceStore.getRecordedVoice(activeSlide);
    setCurrentAudioUrl(existing);
  };

  useEffect(() => {
    const existing = teacherVoiceStore.getRecordedVoice(activeSlide);
    setCurrentAudioUrl(existing);
    stopPreview();
    setMicError(null);
    setIsRecording(false);
  }, [activeSlide]);

  const stopPreview = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
      setIsPlayingPreview(false);
      setPlayingSlideNum(null);
    }
  };

  const startRecording = async () => {
    stopPreview();
    setMicError(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result as string;
          setCurrentAudioUrl(base64Data);
          teacherVoiceStore.saveAudioDataUrl(activeSlide, base64Data);
          teacherVoiceStore.setPreferRealVoice(true);
          refreshState();
          soundSynthesizer.playCorrect();
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('Microphone access failed:', msg);
      setMicError('Không thể mở micro. Bạn vui lòng cấp quyền cho micro hoặc tải tệp MP3 lên nhé!');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handlePlayVoice = (slideNum: number, url?: string | null) => {
    const audioUrlToPlay = url || teacherVoiceStore.getRecordedVoice(slideNum);
    if (!audioUrlToPlay) return;

    if (isPlayingPreview && playingSlideNum === slideNum) {
      stopPreview();
      return;
    }

    stopPreview();
    const audio = new Audio(audioUrlToPlay);
    previewAudioRef.current = audio;
    setPlayingSlideNum(slideNum);
    setIsPlayingPreview(true);

    audio.onended = () => {
      setIsPlayingPreview(false);
      setPlayingSlideNum(null);
    };
    audio.onerror = () => {
      setIsPlayingPreview(false);
      setPlayingSlideNum(null);
    };
    audio.play().catch(() => {
      setIsPlayingPreview(false);
      setPlayingSlideNum(null);
    });
  };

  const handleDeleteVoice = (slideNum: number) => {
    stopPreview();
    teacherVoiceStore.deleteRecordedVoice(slideNum);
    if (slideNum === activeSlide) {
      setCurrentAudioUrl(null);
    }
    refreshState();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetSlide: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      teacherVoiceStore.saveAudioDataUrl(targetSlide, result);
      teacherVoiceStore.setPreferRealVoice(true);
      if (targetSlide === activeSlide) {
        setCurrentAudioUrl(result);
      }
      refreshState();
      soundSynthesizer.playCorrect();
    };
    reader.readAsDataURL(file);
    // Reset file input
    e.target.value = '';
  };

  const handleBatchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      // Check if filename contains slide number e.g. "slide_1.mp3", "slide 2.mp3", "1.mp3"
      const match = file.name.match(/(?:slide[_\s-]*)?([1-9]|1[0-2])\b/i);
      const targetSlide = match ? parseInt(match[1], 10) : null;

      if (targetSlide && targetSlide >= 1 && targetSlide <= 12) {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          teacherVoiceStore.saveAudioDataUrl(targetSlide, result);
          refreshState();
        };
        reader.readAsDataURL(file);
      }
    });

    teacherVoiceStore.setPreferRealVoice(true);
    soundSynthesizer.playKeyShardUnlock();
    e.target.value = '';
  };

  const handleExportBackup = async () => {
    const json = await teacherVoiceStore.exportAllVoicesJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Giong_That_Co_Giao_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const content = reader.result as string;
      const count = await teacherVoiceStore.importVoicesJson(content);
      if (count > 0) {
        teacherVoiceStore.setPreferRealVoice(true);
        refreshState();
        soundSynthesizer.playKeyShardUnlock();
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleToggleLiveTeaching = (val: boolean) => {
    setIsLiveTeaching(val);
    teacherVoiceStore.setLiveTeachingMode(val);
    if (val) {
      speechNarrator.stop();
    }
  };

  const handleTogglePreferReal = (val: boolean) => {
    setPreferReal(val);
    teacherVoiceStore.setPreferRealVoice(val);
  };

  const currentSlideConfig = SLIDES_CONFIG.find((s) => s.number === activeSlide) || SLIDES_CONFIG[0];
  const activeSlideHasRecording = recordedSlides.includes(activeSlide);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[94vh] bg-white rounded-3xl shadow-2xl border-3 border-rose-300 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl shadow-inner">
              🎙️
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wide leading-tight flex items-center gap-1.5">
                Phòng Thu & Quản Lý Giọng Người Thật Của Cô
                <Heart className="w-4 h-4 fill-white text-white" />
              </h2>
              <p className="text-xs text-rose-100 font-medium">
                100% Giọng Thật của cô giáo / cha mẹ truyền cảm cho bé 4–5 tuổi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector & Quick Tools Bar */}
        <div className="bg-rose-50/90 border-b border-rose-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-extrabold text-slate-700">Chế độ giảng bài:</span>

            {/* Mode 1: Real human voice */}
            <button
              onClick={() => {
                handleToggleLiveTeaching(false);
                handleTogglePreferReal(true);
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                !isLiveTeaching && preferReal
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phát Giọng Thật Của Cô</span>
            </button>

            {/* Mode 2: Live teacher teaching in person */}
            <button
              onClick={() => handleToggleLiveTeaching(true)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                isLiveTeaching
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white hover:bg-amber-50 text-amber-900 border border-amber-300'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Cô Tự Giảng Trực Tiếp</span>
            </button>

            {/* Mode 3: AI helper */}
            <button
              onClick={() => {
                handleToggleLiveTeaching(false);
                handleTogglePreferReal(false);
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                !isLiveTeaching && !preferReal
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white hover:bg-rose-50 text-rose-900 border border-rose-300'
              }`}
            >
              <span>Giọng Mẫu Tạm Thời</span>
            </button>
          </div>

          {/* Backup & Import Tools */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => batchFileInputRef.current?.click()}
              title="Tải lên nhiều tệp MP3 cùng lúc (đặt tên slide_1.mp3, slide_2.mp3...)"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-rose-100 text-rose-900 font-bold rounded-xl border border-rose-300 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-rose-600" />
              <span>Tải Nhiều MP3</span>
            </button>
            <input
              ref={batchFileInputRef}
              type="file"
              multiple
              accept="audio/*"
              className="hidden"
              onChange={handleBatchUpload}
            />

            <button
              onClick={handleExportBackup}
              title="Xuất file sao lưu tất cả giọng thu"
              className="p-1.5 bg-white hover:bg-rose-100 text-rose-800 rounded-xl border border-rose-300 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => jsonImportRef.current?.click()}
              title="Khôi phục giọng thu từ file .json"
              className="p-1.5 bg-white hover:bg-rose-100 text-rose-800 rounded-xl border border-rose-300 transition-colors cursor-pointer"
            >
              <Layers className="w-4 h-4" />
            </button>
            <input
              ref={jsonImportRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportBackup}
            />
          </div>
        </div>

        {/* Main Body: 2 Columns (Left: Slide list, Right: Active Slide Recording Console) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0">
          {/* Left: 12 Slides navigation list */}
          <div className="md:col-span-5 border-r border-slate-200 overflow-y-auto p-3 space-y-2 bg-slate-50">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1 mb-1">
              <span>Danh sách 12 Slide ({recordedSlides.length}/12 đã thu thật)</span>
              {recordedSlides.length === 12 && (
                <span className="text-emerald-700 font-black">🎉 Hoàn tất 12/12!</span>
              )}
            </div>

            {SLIDES_CONFIG.map((slide) => {
              const hasVoice = recordedSlides.includes(slide.number);
              const isSelected = activeSlide === slide.number;

              return (
                <div
                  key={slide.number}
                  onClick={() => setActiveSlide(slide.number)}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-rose-100/90 border-rose-400 ring-2 ring-rose-300 shadow-sm'
                      : 'bg-white hover:bg-rose-50/60 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                        hasVoice
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : isSelected
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {hasVoice ? '✓' : slide.number}
                    </span>

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        Màn {slide.number}: {slide.title}
                      </p>
                      <p className="text-[11px] text-slate-700 truncate">
                        {slide.narrationText}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {hasVoice && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayVoice(slide.number);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isPlayingPreview && playingSlideNum === slide.number
                            ? 'bg-emerald-600 text-white animate-pulse'
                            : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                        }`}
                        title="Nghe giọng thật slide này"
                      >
                        {isPlayingPreview && playingSlideNum === slide.number ? (
                          <Pause className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Active Slide Studio & Recording Desk */}
          <div className="md:col-span-7 flex flex-col p-4 sm:p-6 overflow-y-auto space-y-4">
            {/* Slide Header Info */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-black uppercase text-rose-500 tracking-wider">
                  Đang chọn Slide {currentSlideConfig.number} / 12
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {currentSlideConfig.title}
                </h3>
              </div>

              {activeSlideHasRecording ? (
                <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Đã có Giọng Thật Của Cô
                </span>
              ) : (
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  Chưa thu giọng thật
                </span>
              )}
            </div>

            {/* Script to read */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200 rounded-2xl p-4 shadow-inner relative">
              <span className="text-[11px] font-black uppercase text-rose-600 block mb-1">
                Lời thoại mẫu cho cô giáo đọc:
              </span>
              <p className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed italic">
                "{currentSlideConfig.narrationText}"
              </p>
            </div>

            {/* Mic Error */}
            {micError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{micError}</span>
              </div>
            )}

            {/* Live Recording Console */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-dashed border-rose-200 rounded-3xl">
              {isRecording ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 text-rose-600 font-black text-sm animate-pulse">
                    <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping"></span>
                    Đang ghi âm giọng cô... {String(Math.floor(recordingSeconds / 60)).padStart(2, '0')}:
                    {String(recordingSeconds % 60).padStart(2, '0')}
                  </div>

                  {/* Sound Wave Bars */}
                  <div className="flex items-end gap-1.5 h-12 py-1">
                    {[6, 12, 18, 28, 22, 34, 40, 24, 30, 18, 12, 16, 26, 14].map((h, i) => (
                      <span
                        key={i}
                        style={{ height: `${h}px` }}
                        className="w-1.5 bg-rose-500 rounded-full animate-pulse"
                      ></span>
                    ))}
                  </div>

                  <button
                    onClick={stopRecording}
                    className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-base rounded-2xl shadow-lg shadow-rose-600/30 active:scale-95 transition-all cursor-pointer"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>Dừng & Lưu Giọng Cô</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 w-full">
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={startRecording}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-rose-500/25 active:scale-95 transition-all cursor-pointer"
                    >
                      <Mic className="w-5 h-5 animate-bounce" />
                      <span>{activeSlideHasRecording ? 'Thu Lại Giọng Cô' : 'Bắt Đầu Thu Giọng Cô'}</span>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-rose-50 text-rose-900 font-extrabold text-sm rounded-2xl border-2 border-rose-300 shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-rose-600" />
                      <span>Tải Tệp MP3 / WAV</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, activeSlide)}
                    />
                  </div>

                  <p className="text-xs text-slate-700 font-medium text-center">
                    💡 Hãy nói thật dịu dàng, ngắt nghỉ tự nhiên để các bé thích thú lắng nghe!
                  </p>
                </div>
              )}
            </div>

            {/* Audio Preview & Status */}
            {activeSlideHasRecording && !isRecording && (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handlePlayVoice(activeSlide, currentAudioUrl)}
                    className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
                  >
                    {isPlayingPreview && playingSlideNum === activeSlide ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 fill-white" />
                    )}
                  </button>
                  <div>
                    <span className="text-sm font-black text-emerald-950 block">
                      ✨ Giọng Thật Của Cô Cho Slide Này Đã Sẵn Sàng!
                    </span>
                    <span className="text-xs text-emerald-700">
                      Bấm Play để nghe lại hoặc bấm Thu Lại nếu muốn đổi
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteVoice(activeSlide)}
                    className="p-2 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                    title="Xóa bản thu này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs font-bold text-slate-600">
            {isLiveTeaching ? (
              <span className="text-amber-700">
                🗣️ Đang bật Chế độ Cô Tự Giảng Trực Tiếp (Âm thanh máy tạm dừng để cô tương tác trực tiếp với bé)
              </span>
            ) : preferReal ? (
              <span className="text-emerald-700">
                ✨ Ưu tiên phát 100% Giọng Thật của cô (tự động chuyển slide khi nghe xong)
              </span>
            ) : (
              <span className="text-amber-700">
                👩‍🏫 Slide chưa nạp file: Cô giảng trực tiếp trong lớp
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
          >
            Đóng & Tiếp Tục Bài Học
          </button>
        </div>
      </div>
    </div>
  );
};
