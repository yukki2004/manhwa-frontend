import React from "react";
import { Link } from "react-router-dom";
import { IoTimeOutline, IoPlayCircleOutline } from "react-icons/io5";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { PATHS } from "../../../routes/paths";

const HistoryCard = ({ item }) => {
  /**
   * Xử lý thời gian từ trường "lastReadAt" trong JSON
   * Ví dụ: "2026-02-03T17:45:05..." -> "9 ngày trước"
   */
  const getTimeAgo = (dateString) => {
    if (!dateString) return "Không rõ";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: vi })
        .replace("khoảng ", "")
        .replace("khoảng", "");
    } catch (error) {
      return "Vừa xong";
    }
  };

  return (
    <div className="flex gap-4 p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group relative overflow-hidden">
      
      {/* 1. THUMBNAIL: Sử dụng trường "thumbnail" từ JSON */}
      <Link 
        to={PATHS.STORY_DETAIL.replace(":slug", item.storySlug)} 
        className="shrink-0 w-16 h-24 rounded-xl overflow-hidden border border-white/5 shadow-lg bg-[#0b0f1a]"
      >
        <img 
          src={item.thumbnail} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          alt={item.storyTitle} 
        />
      </Link>

      {/* 2. INFO SECTION: Mapping chuẩn storyTitle & chapterTitle */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
        
        {/* Tiêu đề truyện: lowercase + capitalize cho tinh tế */}
        <Link 
          to={PATHS.STORY_DETAIL.replace(":slug", item.storySlug)} 
          className="text-[13px] font-black text-white truncate hover:text-purple-400 transition-colors uppercase tracking-tight"
        >
          {item.storyTitle}
        </Link>

        {/* Thông tin chương đang đọc: Mapping chapterTitle & chapterSlug */}
        <Link 
          to={PATHS.READING.replace(":storySlug", item.storySlug).replace(":chapterSlug", item.chapterSlug)}
          className="flex items-center gap-2 text-purple-400 text-[11px] font-bold hover:text-purple-300 transition-colors"
        >
          <IoPlayCircleOutline size={14} className="shrink-0" />
          <span className="truncate italic">Đang đọc: {item.chapterTitle}</span>
        </Link>

        {/* Thời gian đọc gần nhất: Mapping lastReadAt */}
        <div className="text-[10px] text-gray-500 flex items-center gap-1.5 mt-0.5 font-medium">
          <IoTimeOutline size={12} className="text-gray-600" />
          <span>{getTimeAgo(item.lastReadAt)}</span>
        </div>
      </div>

      {/* Hiệu ứng trang trí góc (Tùy chọn cho sang trọng) */}
      <div className="absolute -right-2 -bottom-2 w-8 h-8 bg-purple-600/5 rounded-full blur-xl group-hover:bg-purple-600/20 transition-all" />
    </div>
  );
};

export default HistoryCard;