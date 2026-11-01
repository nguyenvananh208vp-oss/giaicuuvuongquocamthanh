/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  X,
  Upload,
  Play,
  Square,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Music,
  FolderOpen,
  Info,
} from 'lucide-react';
import { ALL_SOUNDS } from '../data/gameData.ts';
import { soundStore, CustomSoundEntry } from '../services/soundStore.ts';
import { soundSynthesizer } from '../services/soundSynthesizer.ts';

interface SoundEffectsStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSoundId?: string;
}

export const SoundEffectsStudioModal: React.FC<SoundEffectsStudioModalProps> = ({
  isOpen,
  onClose,
  initialSoundId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'animal' | 'nature' | 'life'>('all');
  const [customMap, setCustomMap] = useState<Map<string, CustomSoundEntry>>(soundStore.getAllCustomSounds());
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [batchNotice, setBatchNotice] = useState<string | null>(null);
  const [isDragOverBatch, setIsDragOverBatch] = useState(false);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const batchInputRef = useRef<HTMLInputElement | null>(null);
  const playTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const unsub = soundStore.subscribe(() => {
      setCustomMap(soundStore.getAllCustomSounds());
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!isOpen && playingId) {
      soundSynthesizer.stopAudio();
      setPlayingId(null);
    }
  }, [isOpen, playingId]);

  if (!isOpen) return null;

  const filteredSounds = ALL_SOUNDS.filter((s) => {
    if (selectedCategory === 'all') return true;
    return s.category === selectedCategory;
  });

  const handlePlaySound = (soundId: string) => {
    if (playingId === soundId) {
      soundSynthesizer.stopAudio();
      setPlayingId(null);
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
        playTimeoutRef.current = null;
      }
      return;
    }

    setPlayingId(soundId);
    soundSynthesizer.playSoundById(soundId);

    // Audio is strictly capped to ~3.0s
    if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
    playTimeoutRef.current = window.setTimeout(() => {
      setPlayingId(null);
    }, 3100);
  };

  const handleFileChange = async (soundId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await soundStore.readFileAsDataUrl(file);
      await soundStore.setCustomSound(soundId, dataUrl, file.name, file.size);
      setBatchNotice(`Đã thay âm thanh cho "${ALL_SOUNDS.find(s => s.id === soundId)?.name || soundId}" bằng file ${file.name}`);
      setTimeout(() => setBatchNotice(null), 4000);
    } catch (e) {
      console.error(e);
    }
    // Reset input
    event.target.value = '';
  };

  const handleResetSound = async (soundId: string) => {
    await soundStore.removeCustomSound(soundId);
  };

  const handleResetAll = async () => {
    if (window.confirm('Khôi phục tất cả âm thanh về bộ âm thanh chuẩn 3 giây mặc định?')) {
      await soundStore.resetAllCustomSounds();
      setBatchNotice('Đã khôi phục toàn bộ âm thanh về mặc định 3 giây!');
      setTimeout(() => setBatchNotice(null), 3000);
    }
  };

  const handleBatchDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverBatch(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const res = await soundStore.batchImportFiles(files);
      setBatchNotice(`Đã tự động nạp thành công ${res.matched} file âm thanh!`);
      setTimeout(() => setBatchNotice(null), 5000);
    }
  };

  const handleBatchFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const res = await soundStore.batchImportFiles(files);
      setBatchNotice(`Đã tự động nạp thành công ${res.matched} file âm thanh!`);
      setTimeout(() => setBatchNotice(null), 5000);
      e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-inner">
              🔊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-wide">Kho Âm Thanh Câu Đố</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/25 text-white">
                  Thời lượng chuẩn 3 Giây
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-100 font-medium">
                Nghe thử và thay thế âm thanh câu đố bằng các file mp3 của bạn bất cứ lúc nào!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 transition-all flex items-center justify-center text-white"
            title="Đóng cửa sổ"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Batch Dropzone & Filter Navigation */}
        <div className="p-4 sm:p-5 bg-amber-50/70 border-b border-amber-200/80 flex flex-col gap-3">
          {/* Batch upload area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOverBatch(true);
            }}
            onDragLeave={() => setIsDragOverBatch(false)}
            onDrop={handleBatchDrop}
            className={`border-2 border-dashed rounded-2xl p-3 sm:p-4 text-center transition-all flex flex-col sm:flex-row items-center justify-between gap-3 ${
              isDragOverBatch
                ? 'border-orange-500 bg-orange-100/80 scale-[1.01]'
                : 'border-amber-300 bg-white hover:border-orange-400'
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-gray-800">
                  📁 Kéo thả một hoặc nhiều file âm thanh của bạn vào đây (MP3, WAV...)
                </p>
                <p className="text-xs text-gray-500">
                  Tự động nhận diện tên file: mưa (rain), gió (wind), sấm (thunder), sóng biển (ocean), chuông trường, chuông xe đạp, điện thoại, vỗ tay...
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <input
                ref={batchInputRef}
                type="file"
                multiple
                accept="audio/*"
                className="hidden"
                onChange={handleBatchFileSelect}
              />
              <button
                onClick={() => batchInputRef.current?.click()}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                Chọn File Từ Máy
              </button>
            </div>
          </div>

          {/* Notice banner */}
          {batchNotice && (
            <div className="p-2.5 px-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2 animate-bounce-subtle">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{batchNotice}</span>
            </div>
          )}

          {/* Category tabs */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
            <div className="flex items-center gap-1.5 bg-amber-200/50 p-1 rounded-xl">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-orange-500 text-white shadow'
                    : 'text-amber-900 hover:bg-amber-200'
                }`}
              >
                Tất Cả ({ALL_SOUNDS.length})
              </button>
              <button
                onClick={() => setSelectedCategory('animal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === 'animal'
                    ? 'bg-orange-500 text-white shadow'
                    : 'text-amber-900 hover:bg-amber-200'
                }`}
              >
                🐾 Động Vật
              </button>
              <button
                onClick={() => setSelectedCategory('nature')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === 'nature'
                    ? 'bg-orange-500 text-white shadow'
                    : 'text-amber-900 hover:bg-amber-200'
                }`}
              >
                🌧️ Thiên Nhiên
              </button>
              <button
                onClick={() => setSelectedCategory('life')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === 'life'
                    ? 'bg-orange-500 text-white shadow'
                    : 'text-amber-900 hover:bg-amber-200'
                }`}
              >
                🔔 Cuộc Sống
              </button>
            </div>

            <button
              onClick={handleResetAll}
              className="text-xs font-bold text-gray-500 hover:text-red-600 flex items-center gap-1 hover:underline transition-colors ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Khôi phục tất cả về gốc
            </button>
          </div>
        </div>

        {/* Sound Cards List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 bg-gradient-to-b from-amber-50/20 to-orange-50/40">
          {filteredSounds.map((sound) => {
            const customEntry = customMap.get(sound.id);
            const isPlaying = playingId === sound.id;

            return (
              <div
                key={sound.id}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 ${
                  isPlaying
                    ? 'border-orange-500 bg-orange-50/90 shadow-lg ring-2 ring-orange-300'
                    : customEntry
                    ? 'border-emerald-300 bg-emerald-50/40 shadow-sm hover:shadow-md'
                    : 'border-amber-200 bg-white shadow-sm hover:shadow-md hover:border-amber-300'
                }`}
              >
                {/* Sound Info Row */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                    {sound.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-gray-900 text-base">{sound.name}</h3>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {sound.soundLabel}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{sound.description}</p>

                    {/* Source Tag */}
                    <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                      {customEntry ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3" />
                          File của bạn: <span className="truncate max-w-[140px]">{customEntry.fileName}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                          <Music className="w-3 h-3" />
                          Âm thanh chuẩn thực tế
                        </span>
                      )}
                      <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                        ⏱️ Giới hạn 3 Giây
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                  {/* Play preview */}
                  <button
                    onClick={() => handlePlaySound(sound.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                      isPlaying
                        ? 'bg-red-500 text-white shadow animate-pulse'
                        : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm active:scale-95'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" /> Dừng (3s)
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" /> Nghe Thử
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* Hidden file input */}
                    <input
                      ref={(el) => {
                        fileInputRefs.current[sound.id] = el;
                      }}
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(sound.id, e)}
                    />

                    {/* Upload button */}
                    <button
                      onClick={() => fileInputRefs.current[sound.id]?.click()}
                      className="px-3 py-1.5 rounded-xl font-bold text-xs border border-orange-300 text-orange-700 hover:bg-orange-100 active:scale-95 transition-all flex items-center gap-1"
                      title="Tải lên file âm thanh mới"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {customEntry ? 'Đổi File' : 'Thay File'}
                    </button>

                    {/* Reset button if custom */}
                    {customEntry && (
                      <button
                        onClick={() => handleResetSound(sound.id)}
                        className="px-2 py-1.5 rounded-xl font-bold text-xs text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        title="Khôi phục âm thanh gốc"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 bg-amber-100/70 border-t border-amber-200 flex items-center justify-between text-xs text-amber-900 font-medium">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              💡 <strong>Thời lượng chuẩn:</strong> Mọi âm thanh khi phát trong các bài đố đều tự động kéo dài 3 giây với fade-out nhẹ nhàng, giúp các bé mầm non lắng nghe rõ ràng và phân biệt chính xác.
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white text-xs shadow-md transition-all active:scale-95 ml-4 shrink-0"
          >
            Đã Xong
          </button>
        </div>
      </div>
    </div>
  );
};
