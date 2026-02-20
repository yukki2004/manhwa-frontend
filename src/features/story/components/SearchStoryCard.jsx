import React from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../../../routes/paths";
import { IoStar, IoPersonOutline } from "react-icons/io5";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const SearchStoryCard = ({ story }) => {
  const getTimeAgo = (date) => {
    if (!date) return "";
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi }).replace("khoảng ", "");
    } catch { return ""; }
  };

  return (
    <div className="group relative">
      {/* 1. CARD CHÍNH - LUÔN HIỆN 3 CHƯƠNG */}
      <div className="bg-white dark:bg-[#111827]/40 border border-gray-200 dark:border-white/5 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 flex flex-col h-full shadow-sm">
        
        {/* THUMBNAIL CONTAINER */}
        <Link 
          to={PATHS.STORY_DETAIL.replace(":slug", story.slug)} 
          className="relative block aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-[#0b0f1a]"
        >
          {/* TAG TRUYENVERSE (Dựa trên thiết kế tag thời gian) */}
          <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-cyan-400 text-white text-[9px] font-black rounded-md uppercase tracking-tight shadow-lg border border-white/10">
            TruyenVerse
          </div>

          <img 
            src={story.thumbnail} 
            alt={story.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            loading="lazy" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-30" />
        </Link>

        <div className="p-2.5 flex flex-col flex-1">
          {/* Tiêu đề truyện nguyên bản */}
          <Link 
            to={PATHS.STORY_DETAIL.replace(":slug", story.slug)} 
            className="block text-[13px] text-gray-800 dark:text-gray-200 truncate hover:text-purple-500 mb-2 font-medium"
          >
            {story.title}
          </Link>

          {/* 3 Chương gần nhất kèm dấu chấm đỏ */}
          <div className="flex-1 space-y-1.5 border-t border-gray-100 dark:border-white/5 pt-2">
            {story.recentChapters && story.recentChapters.length > 0 ? (
              story.recentChapters.slice(0, 3).map((chap) => (
                <div key={chap.chapterId} className="flex items-center justify-between text-[10px] text-gray-500">
                  <div className="flex items-center truncate max-w-[65%] italic">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 shrink-0 shadow-sm" />
                    {chap.title}
                  </div>
                  <span className="text-[9px] text-gray-400 shrink-0 font-medium">{getTimeAgo(chap.createAt)}</span>
                </div>
              ))
            ) : (
              <p className="text-[10px] text-gray-400 italic">Dữ liệu đang cập nhật...</p>
            )}
          </div>
        </div>
      </div>

      {/* 2. POPUP THÔNG TIN (CAO BẰNG CARD - CHỈ PC) */}
      <div className="absolute z-[110] left-full ml-3 top-0 w-72 h-full p-5 bg-[#1a1f2e] border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none hidden lg:flex flex-col backdrop-blur-md">
        <h3 className="text-white font-bold text-sm mb-2 leading-tight">{story.title}</h3>
        
        <div className="flex items-center gap-4 text-[11px] text-purple-400 font-bold mb-4 uppercase">
            <span className="flex items-center gap-1"><IoStar className="text-amber-500" /> {story.rateAvg?.toFixed(1) || "0.0"}</span>
            <span className="flex items-center gap-1"><IoPersonOutline /> {story.author}</span>
        </div>

        {/* Thể loại bóc từ JSON */}
        <div className="flex flex-wrap gap-1.5 mb-4 max-h-[60px] overflow-hidden">
          {story.genres?.map((g, i) => (
            <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-gray-300 font-medium">{g}</span>
          ))}
        </div>

        <div className="flex-1 border-t border-white/5 pt-4 overflow-hidden text-left">
          <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-[7] italic">
            {story.shortDescription}
          </p>
        </div>
        
        <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-purple-500 font-black uppercase text-center italic tracking-widest">
            Click để đọc ngay
        </div>
      </div>
    </div>
  );
};

export default SearchStoryCard;