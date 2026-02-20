import React from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../../../routes/paths";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const StoryCard = ({ story }) => {
  /**
   * Tính toán thời gian tương đối từ JSON
   */
  const getTimeAgo = (date) => {
    if (!date) return "";
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi })
        .replace("khoảng ", "")
        .replace("khoảng", "");
    } catch (error) { return ""; }
  };

  return (
    <div className="group bg-[#111827]/40 border border-white/5 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 flex flex-col h-full shadow-md">
      
      {/* 1. THUMBNAIL: Tỉ lệ 3:4 nén gọn */}
      <Link 
        to={PATHS.STORY_DETAIL.replace(":slug", story.slug)} 
        className="relative block aspect-[3/4] overflow-hidden bg-[#0b0f1a]"
      >
        <img 
          src={story.thumbnail} 
          alt={story.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-transparent to-transparent opacity-20" />
      </Link>

      <div className="p-2.5 flex flex-col flex-1">
        {/* Tiêu đề: Giữ nguyên text từ JSON, không in đậm/hoa */}
        <Link 
          to={PATHS.STORY_DETAIL.replace(":slug", story.slug)}
          className="block text-[13px] text-gray-200 truncate hover:text-purple-400 transition-colors mb-2"
          title={story.title}
        >
          {story.title}
        </Link>

        {/* 3 Chương gần nhất: Tối ưu không gian dọc */}
        <div className="flex-1 space-y-1.5 border-t border-white/5 pt-2">
          {story.recentChapters?.slice(0, 3).map((chap) => (
            <Link 
              key={chap.chapterId}
              to={`${PATHS.STORY_DETAIL.replace(":slug", story.slug)}/${chap.slug}`}
              className="flex items-center justify-between text-[10px] text-gray-500 hover:text-purple-300 transition-all group/chap"
            >
              <div className="flex items-center truncate max-w-[65%]">
                {/* Dấu chấm đỏ trước chapter */}
                <span className="w-1.5 h-1.5 rounded-full bg-red-500/80 mr-2 shrink-0 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                <span className="truncate italic">{chap.title}</span>
              </div>
              <span className="text-[9px] text-gray-600 shrink-0 font-medium">
                {getTimeAgo(chap.createAt)}
              </span>
            </Link>
          ))}
          {(!story.recentChapters || story.recentChapters.length === 0) && (
            <p className="text-[10px] text-gray-700 italic">Sắp ra mắt...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryCard;