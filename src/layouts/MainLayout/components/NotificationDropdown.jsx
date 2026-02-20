import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getNotificationsApi, 
  markNotificationAsReadApi, 
  markAllNotificationsAsReadApi 
} from "../../../features/notification/notificationService";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
// IMPORT ICON THIẾU ĐỂ FIX TRẮNG TRANG
import { IoNotificationsOutline } from "react-icons/io5";

const NotificationDropdown = ({ onClose, onUpdateCount }) => { // Nhận callback từ cha
  const [notifications, setNotifications] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async (isLoadMore = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const nextPage = isLoadMore ? pageIndex + 1 : 1;
      const response = await getNotificationsApi(nextPage, 8); 
      
      const newItems = response.items;
      setNotifications(prev => isLoadMore ? [...prev, ...newItems] : newItems);
      setPageIndex(nextPage);
      setHasMore(nextPage < response.totalPages);
    } catch (err) {
      console.error("Lỗi tải thông báo:", err);
    } finally {
      setLoading(false);
    }
  }, [pageIndex, loading]);

  useEffect(() => {
    fetchNotifications();
    // Socket Sync logic
    const handleNewNoti = (event) => {
      setNotifications(prev => [event.detail, ...prev]);
    };
    window.addEventListener("new-notification", handleNewNoti);
    return () => window.removeEventListener("new-notification", handleNewNoti);
  }, []);

  // HÀM XỬ LÝ CLICK TỪNG TIN: Call API Read -> Call Callback Refresh Badge Count
  const handleNotiClick = async (noti) => {
    try {
      if (!noti.isRead) {
        await markNotificationAsReadApi(noti.notificationId); // Gọi API PATCH
        
        // 1. Cập nhật UI nội bộ trong Dropdown
        setNotifications(prev => 
          prev.map(item => item.notificationId === noti.notificationId ? { ...item, isRead: true } : item)
        );
        
        // 2. ĐỒNG BỘ: Gọi lại API đếm ở Header để giảm badge đỏ ngay lập tức
        if (onUpdateCount) onUpdateCount(); 
      }
      onClose(); 
      navigate(noti.redirectUrl);
    } catch (err) {
      console.error("Lỗi xử lý thông báo:", err);
    }
  };

  // HÀM XỬ LÝ ĐỌC TẤT CẢ: Call API ReadAll -> Refresh Badge Count
  const handleReadAll = async () => {
    try {
      await markAllNotificationsAsReadApi();
      // 1. Load lại danh sách tin nhắn để cập nhật trạng thái "đã xem"
      fetchNotifications();
      // 2. ĐỒNG BỘ: Cập nhật Badge đỏ trên Header
      if (onUpdateCount) onUpdateCount();
    } catch (err) {
      console.error("Lỗi đánh dấu tất cả:", err);
    }
  };

  return (
    <div className="absolute right-0 mt-3 w-80 md:w-[420px] bg-[#0f172a] border border-white/10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/5">
        <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Thông báo</h3>
        <button 
          onClick={handleReadAll} 
          className="text-[9px] text-purple-400 hover:text-purple-300 font-black uppercase tracking-widest transition-colors"
        >
          Đọc tất cả
        </button>
      </div>

      <div className="max-h-[480px] overflow-y-auto custom-scrollbar bg-[#0f172a]">
        {notifications.length > 0 ? (
          notifications.map((noti) => (
            <div 
              key={noti.notificationId}
              onClick={() => handleNotiClick(noti)}
              className={`p-4 border-b border-white/5 cursor-pointer flex gap-4 transition-all hover:bg-white/5 text-left
                ${!noti.isRead ? 'bg-purple-500/5 border-l-4 border-l-purple-500' : 'opacity-60 grayscale-[0.3]'}`}
            >
              <div className="relative shrink-0">
                <img 
                  src={noti.senderAvatar} 
                  alt="sender" 
                  className="w-11 h-11 rounded-2xl object-cover ring-1 ring-white/10 shadow-lg"
                />
                {!noti.isRead && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-purple-600 rounded-full border-2 border-[#0f172a] shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={`text-xs text-white leading-snug truncate ${!noti.isRead ? 'font-black' : 'font-medium'}`}>
                  {noti.title}
                </h4>
                <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${!noti.isRead ? 'text-gray-200 font-bold' : 'text-gray-500'}`}>
                  {noti.content}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-[9px] text-gray-600 font-black uppercase tracking-tighter">
                    {formatDistanceToNow(new Date(noti.createdAt), { addSuffix: true, locale: vi })}
                  </span>
                  <span className="text-[8px] text-purple-400/50 font-black italic">#{noti.type}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center flex flex-col items-center gap-3 text-gray-500">
            {/* ICON ĐÃ ĐƯỢC IMPORT ĐỂ FIX TRẮNG TRANG */}
            <IoNotificationsOutline size={40} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Vũ trụ chưa có tin mới</p>
          </div>
        )}
      </div>

      {hasMore && (
        <button 
          onClick={(e) => { e.stopPropagation(); fetchNotifications(true); }}
          disabled={loading}
          className="w-full p-4 text-[10px] font-black text-gray-500 hover:text-purple-400 bg-white/[0.02] hover:bg-white/[0.05] transition-all uppercase tracking-[0.3em] disabled:opacity-30 border-t border-white/5"
        >
          {loading ? "Đang triệu hồi..." : "Xem thêm thông báo cũ"}
        </button>
      )}
    </div>
  );
};

export default NotificationDropdown;