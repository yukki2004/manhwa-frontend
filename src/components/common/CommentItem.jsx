import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { 
  IoEllipsisVertical, IoArrowRedoOutline, IoFlagOutline, 
  IoCreateOutline, IoTrashOutline, IoEyeOffOutline, IoEyeOutline,
  IoChevronDownOutline 
} from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";

const CommentItem = ({ 
  comment, onReply, onEdit, onDelete, onHide, onPublish, onReport, 
  repliesData = {}, loadReplies, isReply = false 
}) => {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const isOwner = user?.username === comment.userName;

  // Lấy danh sách con dựa trên ID của comment hiện tại
  const childReplies = repliesData[comment.commentId] || [];

  return (
    <div id={`comment-${comment.commentId}`} className={`${isReply ? "ml-6 md:ml-10 mt-4 border-l-2 border-slate-200 dark:border-white/10 pl-4" : "mb-8 animate-in fade-in"}`}>
      <div className="flex gap-3">
        <img src={comment.userAvatar} className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border border-purple-500/20 shadow-sm" alt="avt" />
        
        <div className="flex-1 min-w-0 text-left">
          {/* KHỐI NỘI DUNG - Tối ưu 2 theme */}
          <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-3 md:p-3.5 border border-slate-200 dark:border-white/5 group relative transition-all hover:bg-slate-100 dark:hover:bg-white/[0.08]">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12.5px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-tight">{comment.userName}</span>
                <span className="px-1.5 py-0 bg-purple-600 text-white text-[7px] font-black rounded uppercase">Lv.{comment.level}</span>
                {comment.chapterNumber && (
                  <span className="text-[8px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-1.5 py-0.5 rounded font-black border border-cyan-500/20 uppercase">Chap {comment.chapterNumber}</span>
                )}
                <span className="text-[9px] text-slate-400 dark:text-gray-500 font-medium">
                  {formatDistanceToNow(new Date(comment.createAt), { addSuffix: true, locale: vi }).replace("khoảng ", "")}
                </span>
              </div>

              {/* MENU HÀNH ĐỘNG - Fix Ẩn/Sửa/Xóa/Báo cáo */}
              <div className="relative">
                <button onClick={() => setShowMenu(!showMenu)} className="p-1 text-slate-400 hover:text-purple-500 transition-colors">
                  <IoEllipsisVertical size={14} />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-[#1a1f2e] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in zoom-in-95">
                    {isOwner ? (
                      <>
                        <button onClick={() => { onEdit(comment); setShowMenu(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[10px] font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all uppercase"><IoCreateOutline size={14}/> Sửa</button>
                        <button onClick={() => { onHide(comment.commentId); setShowMenu(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[10px] font-bold text-amber-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all uppercase"><IoEyeOffOutline size={14}/> Ẩn</button>
                        <button onClick={() => { onPublish(comment.commentId); setShowMenu(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[10px] font-bold text-cyan-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all uppercase"><IoEyeOutline size={14}/> Hiện</button>
                        <button onClick={() => { onDelete(comment.commentId); setShowMenu(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[10px] font-bold text-red-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all border-t border-slate-100 dark:border-white/5 uppercase"><IoTrashOutline size={14}/> Xóa</button>
                      </>
                    ) : (
                      <button onClick={() => { onReport(comment.commentId, 2); setShowMenu(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[10px] font-bold text-orange-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all uppercase"><IoFlagOutline size={14}/> Báo cáo</button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <p className="text-[13.5px] text-slate-700 dark:text-gray-200 leading-relaxed break-words font-medium">
              {comment.repliedToUserName && <span className="text-purple-500 font-bold mr-1">@{comment.repliedToUserName}</span>}
              {comment.content}
            </p>
          </div>

          {/* NÚT TRẢ LỜI & XEM THÊM */}
          <div className="flex items-center gap-4 mt-1 ml-2">
            <button onClick={() => onReply(comment)} className="text-[10px] font-black text-slate-400 hover:text-purple-500 uppercase tracking-widest flex items-center gap-1 transition-all">
              <IoArrowRedoOutline size={12} /> Trả lời
            </button>

            {comment.replyCount > 0 && childReplies.length === 0 && (
              <button onClick={() => loadReplies(comment.commentId)} className="text-[10px] font-black text-purple-500 uppercase flex items-center gap-1 hover:text-purple-400 transition-all">
                <IoChevronDownOutline size={14} /> Xem {comment.replyCount} phản hồi
              </button>
            )}
          </div>
          
          {/* ĐỆ QUY VÔ HẠN CẤP */}
          <div className="replies-list">
            {childReplies.map(reply => (
              <CommentItem 
                key={reply.commentId}
                comment={reply}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                onHide={onHide}
                onPublish={onPublish}
                onReport={onReport}
                repliesData={repliesData}
                loadReplies={loadReplies}
                isReply={true}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;