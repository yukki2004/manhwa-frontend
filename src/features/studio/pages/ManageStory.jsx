import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  IoChevronBack, IoCloudUploadOutline, IoAddOutline, 
  IoPencilOutline, IoEyeOffOutline, IoTrashOutline, 
  IoCheckmarkCircleOutline, IoStatsChartOutline, IoEyeOutline 
} from "react-icons/io5";
import { toast } from "react-toastify";

// Services
import { 
  getManagementStoriesApi, updateStoryApi, updateStoryAvatarApi,
  setStoryOngoingApi, setStoryDroppedApi, setStoryCompletedApi
} from "../../story/storyService";
import { 
  publishChapterApi, hideChapterApi, deleteChapterApi 
} from "../../chapter/chapterService"; // Kiên nhớ kiểm tra đúng đường dẫn này
import { getAllCategoryApi } from "../../../services/categoryService";
import { PATHS } from "../../../routes/paths";

// Components
import Pagination from "../../../components/common/Pagination";

const ManageStory = () => {
  const { id } = useParams(); // Lấy StoryId từ URL
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [editForm, setEditForm] = useState({
    title: "", authorName: "", description: "", releaseYear: 0, categoryIds: []
  });

  // 1. FETCH DỮ LIỆU
  const loadData = useCallback(async (pageIndex = 1) => {
    if (!id) return; // Bảo vệ nếu id bị null
    try {
      // FIX LỖI: Đảm bảo URL truyền ID đúng (api.get(`/api/story/${id}/...`))
      const [storyRes, catRes] = await Promise.all([
        getManagementStoriesApi(id, pageIndex, 10),
        getAllCategoryApi()
      ]);

      if (!storyRes) throw new Error("No data");

      setStory(storyRes);
      setCategories(catRes);
      setEditForm({
        title: storyRes.title,
        authorName: storyRes.author || "",
        description: storyRes.description,
        releaseYear: storyRes.releaseYear || 0,
        categoryIds: [] 
      });
      setLoading(false);
    } catch (err) {
      console.error("Redirect Error:", err);
      toast.error("Không tìm thấy tác phẩm!");
      navigate(PATHS.STUDIO_DASHBOARD); // CHỈ REDIRECT KHI THẬT SỰ LỖI
    }
  }, [id, navigate]);

  useEffect(() => { loadData(page); }, [loadData, page]);

  // 2. XỬ LÝ ACTIONS TRÊN STORY
  const handleStatusChange = async (newStatus) => {
    try {
      if (newStatus === "Ongoing") await setStoryOngoingApi(id);
      else if (newStatus === "Dropped") await setStoryDroppedApi(id);
      else if (newStatus === "Complete") await setStoryCompletedApi(id);
      toast.success("Cập nhật trạng thái truyện!");
      loadData(page);
    } catch (err) { toast.error("Lỗi cập nhật trạng thái."); }
  };

  // 3. XỬ LÝ ACTIONS TRÊN CHAPTER
  const handleChapterAction = async (chapterId, actionApi, message) => {
    setIsProcessing(true);
    try {
      await actionApi(chapterId);
      toast.success(message);
      loadData(page); // Làm mới bảng chapter
    } catch (err) {
      toast.error("Thao tác thất bại.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper Map Color Chapter
  const getChapterStatusUI = (status) => {
    switch (status) {
      case "Published": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "Hidden": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "Deleted": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  if (loading || !story) return <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center"><div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="w-full font-plus-jakarta animate-in fade-in duration-500 pb-20">
      {/* HEADER QUẢN LÝ */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-5">
          <button onClick={() => navigate(PATHS.STUDIO_DASHBOARD)} className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white transition-all border border-white/5">
            <IoChevronBack size={24} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter">
              Quản lý: <span className="text-purple-500">{story.title}</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Story ID: {id}</span>
            </div>
          </div>
        </div>
        <button onClick={() => updateStoryApi(id, editForm).then(() => toast.success("Đã lưu!"))} className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase shadow-xl transition-all active:scale-95">
          Lưu tất cả thay đổi
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* CỘT TRÁI: THÔNG TIN TRUYỆN */}
        <aside className="w-full lg:w-[420px] shrink-0">
          <div className="bg-[#111827]/60 backdrop-blur-3xl border border-white/5 rounded-[48px] p-8 shadow-2xl sticky top-24">
            <div className="relative group w-full aspect-[3/4] mb-8 overflow-hidden rounded-[32px] border border-white/10 shadow-2xl">
              <img src={story.thumbnail} className="w-full h-full object-cover" alt="cover" />
              <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm">
                <IoCloudUploadOutline size={48} className="text-purple-400 mb-2" />
                <span className="text-[11px] font-black text-white uppercase tracking-widest">Thay đổi bìa</span>
                <input type="file" hidden onChange={(e) => updateStoryAvatarApi(id, e.target.files[0]).then(() => loadData(page))} />
              </label>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3 block">Trạng thái bộ truyện</label>
                <select value={story.status} onChange={(e) => handleStatusChange(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-purple-500 transition-all cursor-pointer">
                  <option value="Ongoing">🟢 Đang tiến hành (Ongoing)</option>
                  <option value="Complete">🔵 Đã hoàn thành (Complete)</option>
                  <option value="Dropped">🔴 Đã tạm ngưng (Dropped)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-600 uppercase mb-2 block">Tác giả</label>
                  <input type="text" value={editForm.authorName} onChange={(e) => setEditForm({...editForm, authorName: e.target.value})} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 text-xs font-bold outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-600 uppercase mb-2 block">Năm phát hành</label>
                  <input type="number" value={editForm.releaseYear} onChange={(e) => setEditForm({...editForm, releaseYear: parseInt(e.target.value)})} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 text-xs font-bold outline-none focus:border-purple-500" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-600 uppercase mb-2 block">Mô tả tóm tắt</label>
                <textarea rows="6" value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} className="w-full bg-black/40 border border-white/10 text-white rounded-2xl p-5 text-[13px] font-medium leading-relaxed outline-none focus:border-purple-500" />
              </div>
            </div>
          </div>
        </aside>

        {/* CỘT PHẢI: BẢNG CHƯƠNG */}
        <main className="flex-1 min-w-0">
          <div className="bg-[#111827]/40 backdrop-blur-3xl border border-white/5 rounded-[56px] p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div>
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Danh sách chương đã đăng</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-[0.2em]">Cập nhật trạng thái từng chương tại đây</p>
              </div>
              <button onClick={() => navigate(PATHS.CREATE_CHAPTER.replace(":id", id))} className="flex items-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-[20px] font-black text-xs uppercase shadow-xl shadow-purple-600/20 transition-all active:scale-95">
                <IoAddOutline size={22} /> Thêm Chương Mới
              </button>
            </div>

            <div className={`overflow-x-auto ${isProcessing ? 'opacity-40 pointer-events-none' : ''}`}>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="pb-6 px-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">STT</th>
                    <th className="pb-6 px-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Tên chương</th>
                    <th className="pb-6 px-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Trạng thái</th>
                    <th className="pb-6 px-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Lượt xem</th>
                    <th className="pb-6 px-4 text-right text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {story.chapters.items.map((chap) => (
                    <tr key={chap.chapterId} className="group hover:bg-white/[0.02] transition-all">
                      <td className="py-7 px-4 text-sm font-black text-purple-500/80 italic">{chap.chapterNumber}</td>
                      <td className="py-7 px-4 min-w-[200px]">
                        <span className="text-[14px] font-bold text-gray-200 group-hover:text-purple-400 transition-colors cursor-default">{chap.title}</span>
                        <p className="text-[9px] text-gray-600 font-bold mt-1 uppercase tracking-tighter">Ngày đăng: {new Date(chap.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="py-7 px-4">
                        {/* BADGE TRẠNG THÁI CHAPTER */}
                        <span className={`px-2.5 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest ${getChapterStatusUI(chap.status)}`}>
                          {chap.status === "Published" ? "Công Khai" : chap.status === "Hidden" ? "Đang Ẩn" : "Đã Xóa"}
                        </span>
                      </td>
                      <td className="py-7 px-4">
                         <div className="flex items-center gap-1.5 text-xs font-black text-gray-400 tracking-tighter"><IoStatsChartOutline size={14} className="text-gray-600"/> {chap.totalView?.toLocaleString()}</div>
                      </td>
                      <td className="py-7 px-4">
                        <div className="flex items-center justify-end gap-2.5">
                          {/* 1. NÚT SỬA */}
                          <button onClick={() => navigate(PATHS.EDIT_CHAPTER.replace(":id", id).replace(":chapterId", chap.chapterId))} className="p-2.5 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-purple-600 transition-all border border-white/5" title="Sửa ảnh chương"><IoPencilOutline size={18} /></button>
                          
                          {/* 2. NÚT PUBLISH / HIDE THEO TRẠNG THÁI */}
                          {chap.status === "Hidden" || chap.status === "Deleted" ? (
                            <button onClick={() => handleChapterAction(chap.chapterId, publishChapterApi, "Chương đã được công khai!")} className="p-2.5 bg-emerald-600/10 rounded-xl text-emerald-500 hover:bg-emerald-600 hover:text-white transition-all border border-emerald-500/20" title="Công khai chương"><IoCloudUploadOutline size={18} /></button>
                          ) : (
                            <button onClick={() => handleChapterAction(chap.chapterId, hideChapterApi, "Chương đã được ẩn!")} className="p-2.5 bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all border border-white/5" title="Ẩn chương"><IoEyeOffOutline size={18} /></button>
                          )}

                          {/* 3. NÚT XÓA */}
                          <button onClick={() => window.confirm("Xóa vĩnh viễn chương này?") && handleChapterAction(chap.chapterId, deleteChapterApi, "Đã thực hiện xóa chương.")} className="p-2.5 bg-red-600/10 rounded-xl text-red-500 hover:bg-red-600 hover:text-white transition-all border border-red-500/20" title="Xóa chương"><IoTrashOutline size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-10 pt-10 border-t border-white/5">
              <Pagination pageIndex={story.chapters.pageIndex} totalPages={story.chapters.totalPages} onPageChange={(p) => setPage(p)} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageStory;