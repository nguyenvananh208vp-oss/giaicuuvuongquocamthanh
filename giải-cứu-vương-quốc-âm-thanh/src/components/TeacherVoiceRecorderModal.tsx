/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Check, Upload, Volume2, X, Sparkles, AlertCircle, Heart } from 'lucide-react';
import { teacherVoiceStore } from '../services/teacherVoiceStore.ts';
import { soundSynthesizer } from '../services/soundSynthesizer.ts';

interface TeacherVoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  slideNumber: number;
  slideTitle: string;
  narrationScript: string;
  onSaved: () => void;
}

export const TeacherVoiceRecorderModal: React.FC<TeacherVoiceRecorderModalProps> = ({
  isOpen,
  onClose,
  slideNumber,
  slideTitle,
  narrationScript,
  onSaved,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [hasSavedVoice, setHasSavedVoice] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setHasSavedVoice(teacherVoiceStore.hasRecordedVoice(slideNumber));
      const existing = teacherVoiceStore.getRecordedVoice(slideNumber);
      if (existing) {
        setAudioUrl(existing);
      } else {
        setAudioUrl(null);
      }
      setRecordingSeconds(0);
      setIsRecording(false);
      setMicError(null);
    } else {
      stopPreview();
    }
  }, [isOpen, slideNumber]);

  const stopPreview = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
      setIsPlayingPreview(false);
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
        const localUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(localUrl);
        // Also convert to data URI for quick storage readiness
        const reader = new FileReader();
        reader.onloadend = () => {
          setAudioUrl(reader.result as string);
        };
        reader.readAsDataURL(audioBlob);

        // Stop all audio tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn('Microphone access failed:', errorMsg);
      setMicError('Không thể mở micro. Vui lòng cho phép quyền truy cập Micro trên trình duyệt hoặc tải tệp âm thanh lên!');
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
      soundSynthesizer.playCorrect();
    }
  };

  const togglePreview = () => {
    if (!audioUrl) return;

    if (isPlayingPreview) {
      stopPreview();
    } else {
      stopPreview();
      const audio = new Audio(audioUrl);
      previewAudioRef.current = audio;
      audio.onended = () => setIsPlayingPreview(false);
      audio.onerror = () => setIsPlayingPreview(false);
      audio.play().catch(() => setIsPlayingPreview(false));
      setIsPlayingPreview(true);
    }
  };

  const handleSave = () => {
    if (!audioUrl) return;
    teacherVoiceStore.saveAudioDataUrl(slideNumber, audioUrl);
    teacherVoiceStore.setPreferRealVoice(true);
    setHasSavedVoice(true);
    soundSynthesizer.playKeyShardUnlock();
    onSaved();
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleDelete = () => {
    teacherVoiceStore.deleteRecordedVoice(slideNumber);
    setHasSavedVoice(false);
    setAudioUrl(null);
    stopPreview();
    onSaved();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAudioUrl(result);
      teacherVoiceStore.saveAudioDataUrl(slideNumber, result);
      teacherVoiceStore.setPreferRealVoice(true);
      setHasSavedVoice(true);
      soundSynthesizer.playCorrect();
      onSaved();
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-2 border-rose-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl shadow-inner">
              🎙️
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-wide leading-tight flex items-center gap-1.5">
                Thu Âm Lời Giảng Của Cô Giáo
                <Heart className="w-4 h-4 fill-white text-white" />
              </h3>
              <p className="text-xs text-rose-100 font-medium">
                Slide {slideNumber}: {slideTitle}
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Pedagogical Hint */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs sm:text-sm text-amber-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="font-extrabold text-amber-950">Bí quyết cô giáo mầm non:</strong> Hãy đọc thật truyền cảm, giọng điệu ngọt ngào, tươi vui, ngắt nhịp nhẹ nhàng ở các câu gọi "Các con ơi...", "nhé!" để các bé hào hứng tương tác!
            </p>
          </div>

          {/* Script Card to read out loud */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-50/50 border-2 border-rose-200 rounded-2xl p-4 sm:p-5 relative shadow-inner">
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-500 block mb-1">
              Lời giảng mẫu của cô cho slide này:
            </span>
            <p className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed italic">
              "{narrationScript}"
            </p>
          </div>

          {/* Error Message */}
          {micError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{micError}</span>
            </div>
          )}

          {/* Main Recording Console */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            {isRecording ? (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-rose-600 font-black text-sm animate-pulse">
                  <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping"></span>
                  Đang ghi âm giọng cô... {String(Math.floor(recordingSeconds / 60)).padStart(2, '0')}:{String(recordingSeconds % 60).padStart(2, '0')}
                </div>

                {/* Animated sound wave bars */}
                <div className="flex items-end gap-1.5 h-10 py-1">
                  {[4, 8, 12, 18, 14, 20, 24, 16, 22, 14, 8, 12].map((height, idx) => (
                    <span
                      key={idx}
                      style={{ height: `${height}px` }}
                      className="w-1.5 bg-rose-500 rounded-full animate-pulse"
                    ></span>
                  ))}
                </div>

                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-2xl shadow-lg shadow-rose-600/30 active:scale-95 transition-all cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>Xong & Lưu Giọng Cô</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={startRecording}
                  className="flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-rose-500/25 active:scale-95 transition-all cursor-pointer"
                >
                  <Mic className="w-5 h-5 text-white animate-bounce" />
                  <span>{audioUrl ? 'Thu Âm Lại Giọng Cô' : 'Bắt Đầu Thu Âm Giọng Cô'}</span>
                </button>

                <p className="text-xs text-slate-700 font-medium">
                  Bấm để nói trực tiếp qua mic điện thoại hoặc máy tính
                </p>
              </div>
            )}
          </div>

          {/* Audio Preview & Actions */}
          {audioUrl && !isRecording && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={togglePreview}
                  className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  {isPlayingPreview ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                </button>
                <div>
                  <span className="text-xs font-black text-emerald-900 block">
                    {hasSavedVoice ? '✨ Bản thu giọng cô đang hoạt động!' : 'Bản thu sẵn sàng để lưu:'}
                  </span>
                  <span className="text-xs text-emerald-700">
                    Bấm nút Play để nghe lại trước khi lưu
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleSave}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu Vào Slide</span>
                </button>

                <button
                  onClick={handleDelete}
                  title="Xóa bản thu và dùng lại giọng trợ giảng AI"
                  className="p-2 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* File Upload Option */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700">
            <span>Hoặc nếu cô có sẵn file ghi âm trên máy:</span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Tải file ghi âm (.mp3/.wav/.m4a)</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs font-semibold text-slate-700">
            {hasSavedVoice ? '🌸 Slide này đang dùng giọng thật của cô' : '🤖 Slide này đang dùng giọng trợ giảng'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-black rounded-xl transition-colors cursor-pointer"
          >
            Đóng Lại
          </button>
        </div>
      </div>
    </div>
  );
};
