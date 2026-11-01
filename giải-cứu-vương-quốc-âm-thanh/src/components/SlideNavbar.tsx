/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Music,
  BookOpen,
  X,
  Sparkles,
} from 'lucide-react';
import { SlideNumber } from '../types.ts';
import { SLIDES_CONFIG } from '../data/gameData.ts';
import { soundSynthesizer } from '../services/soundSynthesizer.ts';

interface SlideNavbarProps {
  currentSlide: SlideNumber;
  totalSlides: number;
  onSelectSlide: (slide: SlideNumber) => void;
  onNextSlide: () => void;
  onPrevSlide: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const SlideNavbar: React.FC<SlideNavbarProps> = ({
  currentSlide,
  totalSlides,
  onSelectSlide,
  onNextSlide,
  onPrevSlide,
  isMuted,
  onToggleMute,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTeacherGuide, setShowTeacherGuide] = useState(false);
  const [isBgmOn, setIsBgmOn] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleToggleBgm = () => {
    const next = soundSynthesizer.toggleBgm();
    setIsBgmOn(next);
  };

  const currentSlideInfo = SLIDES_CONFIG.find((s) => s.number === currentSlide);

  return (
    <>
      <nav
        aria-label="Điều khiển bài giảng"
        className="w-full bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 shadow-lg z-30"
      >
        {/* Left: Slide Selector Dropdown / Info */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-black text-amber-900 bg-amber-100 px-2 py-1 rounded-lg">
              Trang {currentSlide}/{totalSlides}
            </span>
          </div>

          <select
            value={currentSlide}
            onChange={(e) => onSelectSlide(Number(e.target.value) as SlideNumber)}
            aria-label="Chọn trang bài học"
            className="text-xs sm:text-sm font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 max-w-[140px] sm:max-w-[260px] truncate focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
          >
            {SLIDES_CONFIG.map((slide) => (
              <option key={slide.number} value={slide.number}>
                Trang {slide.number}: {slide.title}
              </option>
            ))}
          </select>
        </div>

        {/* Center: Slide Prev / Next controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onPrevSlide}
            disabled={currentSlide === 1}
            aria-label="Trang trước"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-all cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Trang trước</span>
          </button>

          <button
            onClick={onNextSlide}
            disabled={currentSlide === totalSlides}
            aria-label="Trang tiếp theo"
            className="flex items-center gap-1 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <span className="hidden sm:inline">Trang sau</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Teacher Guide, Music, Audio, Fullscreen */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => setShowTeacherGuide(true)}
            aria-label="Xem gợi ý giáo án mầm non"
            title="Gợi ý sư phạm cho giáo viên mầm non"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden md:inline">Giáo Án Gợi Ý</span>
          </button>

          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            title={isMuted ? 'Bật âm thanh hiệu ứng' : 'Tắt âm thanh hiệu ứng'}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>

          <button
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình trình chiếu'}
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình trình chiếu'}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Teacher Guide Modal */}
      {showTeacherGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border-4 border-amber-300 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500 text-white font-black text-sm">
                  📚 GIÁO ÁN ĐIỆN TỬ
                </span>
                <h3 className="text-lg font-black text-slate-800">
                  Hướng Dẫn Sư Phạm Cho Giáo Viên Mầm Non
                </h3>
              </div>
              <button
                onClick={() => setShowTeacherGuide(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div>
                <h4 className="font-extrabold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Mục tiêu phát triển cho trẻ 4–5 tuổi:
                </h4>
                <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-600">
                  <li>
                    <strong>Nhận thức:</strong> Trẻ nhận biết, phân biệt âm thanh đặc trưng của 3 nhóm (động vật quen thuộc, hiện tượng tự nhiên, và đồ vật trong đời sống).
                  </li>
                  <li>
                    <strong>Ngôn ngữ:</strong> Rèn luyện thính giác, tập diễn đạt từ ngữ mô phỏng âm thanh (gâu gâu, tí tách, kính coong, đoong đoong).
                  </li>
                  <li>
                    <strong>Tư duy logic:</strong> Phân loại nhóm âm thanh tại Màn 4 và xâu chuỗi nhiệm vụ qua việc sưu tập 4 mảnh ghép chìa khóa.
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-amber-900 flex items-center gap-1.5">
                  💡 Lời khuyên khi cô tổ chức trò chơi trên lớp:
                </h4>
                <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-600">
                  <li>Cho trẻ nghe âm thanh 2-3 lần trước khi mời trẻ lên chọn hình ảnh trên màn hình tương tác.</li>
                  <li>Khuyến khích cả lớp cùng bắt chước lại tiếng kêu (ví dụ: cùng làm tiếng mưa rơi tí tách).</li>
                  <li>Tận dụng Màn 2 để so sánh sự khác biệt giữa hai âm thanh thiên nhiên (tiếng mưa vs tiếng sóng).</li>
                  <li>Cuối buổi, in hoặc tải giấy khen để tuyên dương các "Nhà thám hiểm âm thanh nhí".</li>
                </ul>
              </div>

              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
                <span className="font-bold text-amber-900">Trang hiện tại: Trang {currentSlide}</span>
                <p className="mt-1 text-slate-700 font-medium">
                  {currentSlideInfo?.title} · {currentSlideInfo?.subtitle}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTeacherGuide(false)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md cursor-pointer"
              >
                Đã Hiểu & Tiếp Tục Bài Học
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
