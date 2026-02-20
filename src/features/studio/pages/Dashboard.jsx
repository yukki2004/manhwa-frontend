import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { IoAddOutline, IoBookOutline } from "react-icons/io5";
import { getMyStoriesApi } from "../../story/storyService";
import { PATHS } from "../../../routes/paths";
import StudioStoryCard from "../components/StudioStoryCard";
import Pagination from "../../../components/common/Pagination"; // Component bạn đã gửi

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ items: [], totalPages: 0, pageIndex: 1 });
  const [loading, setLoading] = useState(true);

  const fetchMyStories = useCallback(async (page) => {
    setLoading(true);
    try {
      const response = await getMyStoriesApi(page, 10);
      setData(response);
    } catch (err) {
      console.error("Lỗi fetch Dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyStories(1);
  }, [fetchMyStories]);

  return (
    <div className="w-full">
      {/* Header Dashboard */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-2">
            Truyện của bạn
          </h1>
          <p className="text-gray-500 text-sm font-medium tracking-wide">
            Quản lý nội dung và theo dõi hiệu quả các tác phẩm.
          </p>
        </div>

        <button 
          onClick={() => navigate(PATHS.CREATE_STORY)}
          className="flex items-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-[20px] font-black text-xs uppercase transition-all shadow-xl shadow-purple-600/30 active:scale-95"
        >
          <IoAddOutline size={20} /> Tạo truyện mới
        </button>
      </div>

      {/* Danh sách truyện (Phân trang) */}
      <div className="flex flex-col gap-5 min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
             <span className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Đang tải dữ liệu...</span>
          </div>
        ) : data.items.length > 0 ? (
          data.items.map((story) => (
            <StudioStoryCard 
              key={story.storyId} 
              story={story} 
              onRefresh={() => fetchMyStories(data.pageIndex)} 
            />
          ))
        ) : (
          <div className="py-20 flex flex-col items-center gap-4 bg-white/5 rounded-[40px] border-2 border-dashed border-white/5">
             <IoBookOutline size={48} className="text-gray-800" />
             <p className="text-gray-500 font-bold">Bạn chưa đăng tác phẩm nào.</p>
          </div>
        )}
      </div>

      {/* Phân trang */}
      {!loading && data.totalPages > 1 && (
        <Pagination 
          pageIndex={data.pageIndex} 
          totalPages={data.totalPages} 
          onPageChange={(page) => fetchMyStories(page)} 
        />
      )}
    </div>
  );
};

export default Dashboard;