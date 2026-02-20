import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  followStoryApi, unfollowStoryApi, rateStoryApi, 
  getStoryCommentsApi, getCommentRepliesApi, postCommentApi, 
  deleteCommentApi, hideCommentApi, publishCommentApi, updateCommentApi 
} from "../../interaction/interactionService";
import { getStoryDetailBySlugApi } from "../storyService";
import { postReportApi } from "../../../services/reportService";
import { PATHS } from "../../../routes/paths";
import { IoHeart, IoHeartOutline, IoStar, IoFlag, IoBookOutline, IoEyeOutline, IoListOutline, IoSend, IoChevronDownOutline } from "react-icons/io5";
import { format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "react-toastify";
import CommentItem from "../../../components/common/CommentItem";
import Pagination from "../../../components/common/Pagination";

const StoryDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [chapterPage, setChapterPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  
  // Comment States
  const [comments, setComments] = useState({ items: [], totalPages: 0, pageIndex: 1, totalCount: 0 });
  const [replies, setReplies] = useState({}); 
  const [commentInput, setCommentInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [replyTarget, setReplyTarget] = useState({ parentId: null, rootId: null, userName: "" });
  const [isReportOpen, setIsReportOpen] = useState({ show: false, targetId: null, targetType: 0, reason: "" });

  const statusMap = { 0: "Đang ra", 1: "Hoàn thành", 2: "Tạm ngưng" };

  const loadInitData = useCallback(async () => {
    try {
      const res = await getStoryDetailBySlugApi(slug, 1, 20);
      setStory(res);
      setChapters(res.chapters.items);
    } catch { toast.error("Lỗi tải truyện"); }
    finally { setLoading(false); }
  }, [slug]);

  const loadMainComments = async (page = 1) => {
    try {
      const res = await getStoryCommentsApi(slug, page, 10);
      setComments(res);
    } catch { toast.error("Lỗi bình luận"); }
  };

  const loadReplies = async (parentId) => {
    try {
      const res = await getCommentRepliesApi(parentId, 1, 100); // Load nhiều hơn để hiện full đệ quy
      setReplies(prev => ({ ...prev, [parentId]: res.items }));
    } catch { toast.error("Lỗi phản hồi"); }
  };

  useEffect(() => { loadInitData(); loadMainComments(); }, [loadInitData]);

  // HÀM NHẢY ĐẾN BÌNH LUẬN
  const scrollToComment = (id) => {
    setTimeout(() => {
      const el = document.getElementById(`comment-${id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);
  };

  const handlePostComment = async () => {
    if (!commentInput.trim()) return;
    try {
      if (editingId) {
        await updateCommentApi(editingId, commentInput);
        toast.success("Đã cập nhật");
        setEditingId(null);
      } else {
        const res = await postCommentApi({ storyId: story.storyId, content: commentInput, parentId: replyTarget.parentId });
        toast.success("Thành công");
        if (res.commentId) scrollToComment(res.commentId); // Nhảy đến cmt mới
      }
      setCommentInput("");
      const pId = replyTarget.parentId;
      const rId = replyTarget.rootId;
      setReplyTarget({ parentId: null, rootId: null, userName: "" });
      
      // Load lại dữ liệu: Nếu là reply thì load lại thread đó, nếu không load page 1
      pId ? loadReplies(rId || pId) : loadMainComments(1);
    } catch { toast.error("Thất bại"); }
  };

  const handleAction = async (action, id, parentId = null) => {
    try {
      if (action === 'delete') await deleteCommentApi(id);
      if (action === 'hide') await hideCommentApi(id);
      if (action === 'publish') await publishCommentApi(id);
      toast.success("Đã thực hiện");
      // Tự động fetch lại đúng vùng dữ liệu
      parentId ? loadReplies(parentId) : loadMainComments(comments.pageIndex);
    } catch { toast.error("Thất bại"); }
  };

  const handleSendReport = async () => {
    if (!isReportOpen.reason.trim()) return toast.warning("Nhập lý do");
    try {
      await postReportApi(isReportOpen.targetId, isReportOpen.targetType, isReportOpen.reason);
      toast.success("Đã báo cáo");
      setIsReportOpen({ show: false, targetId: null, targetType: 0, reason: "" });
    } catch { toast.error("Gửi lỗi"); }
  };

  if (loading || !story) return <div className="py-40 text-center text-purple-500 font-black animate-pulse">TRUYÊNVERSE...</div>;

  return (
    <div className="max-w-[1100px] mx-auto py-2 md:py-6 px-4 font-plus-jakarta text-slate-900 dark:text-gray-100 transition-all">
      
      {/* 1. INFO HEADER - GIỮ NGUYÊN STYLE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 mb-8 text-left">
        <div className="md:col-span-4 lg:col-span-3">
          <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden shadow-2xl border border-white/10 group">
            <img src={story.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="thumb" />
            <div className="absolute top-3 left-3 px-2 py-0.5 bg-cyan-500 text-white text-[8px] font-black rounded-full uppercase shadow-lg">TruyenVerse</div>
          </div>
        </div>
        <div className="md:col-span-8 lg:col-span-9 flex flex-col pt-2">
          <h1 className="text-2xl md:text-3xl font-black mb-4 leading-tight tracking-tighter">{story.title}</h1>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div><p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Tác giả</p><p className="text-[13px] font-bold text-purple-500">{story.author}</p></div>
            <div><p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Trạng thái</p><p className="text-[13px] font-bold text-cyan-500">{statusMap[story.status]}</p></div>
            <div><p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Lượt xem</p><p className="text-[13px] font-bold">{story.totalView.toLocaleString()}</p></div>
            <div><p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Năm XB</p><p className="text-[13px] font-bold">{story.realease_year}</p></div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {story.genres.slice(0, 8).map(g => <span key={g.slug} className="px-2.5 py-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-colors">{g.name}</span>)}
          </div>
        </div>
      </div>

      {/* 2. DESCRIPTION & RATING */}
      <section className="bg-white/80 dark:bg-[#111827]/60 border border-slate-200 dark:border-white/5 rounded-[32px] p-6 md:p-8 backdrop-blur-xl mb-8 text-left shadow-xl relative">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2"><IoBookOutline size={16}/> Giới thiệu truyện</h3>
        <div className={`text-[14.5px] text-slate-600 dark:text-gray-300 leading-relaxed italic transition-all duration-300 ${!isDescExpanded ? 'line-clamp-3' : ''}`}>
          {story.description}
        </div>
        <button onClick={() => setIsDescExpanded(!isDescExpanded)} className="mt-2 text-[10px] font-black text-purple-500 uppercase tracking-widest hover:underline">{isDescExpanded ? "Thu gọn" : "Xem thêm"}</button>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
           {/* RATING SÁNG THEO DỮ LIỆU */}
           <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => (
                  <IoStar key={s} size={24} onClick={() => rateStoryApi(story.storyId, s).then(() => {setStory({...story, currentUserRating: s}); toast.success("Cảm ơn!");})}
                    className={`cursor-pointer transition-all active:scale-75 ${s <= (story.currentUserRating || 0) ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" : "text-slate-200 dark:text-gray-800 hover:text-amber-400/40"}`} />
                ))}
              </div>
              <span className="text-sm font-black text-slate-400">{(story.rateAvg || 0).toFixed(1)}/5.0</span>
           </div>
           
           <div className="flex gap-3">
              <button onClick={() => story.isFavorite ? unfollowStoryApi(story.storyId).then(() => setStory({...story, isFavorite: false})) : followStoryApi(story.storyId).then(() => setStory({...story, isFavorite: true}))} 
                className={`flex items-center gap-2 px-8 py-2.5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${story.isFavorite ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-500/20"}`}>
                {story.isFavorite ? <IoHeart size={18}/> : <IoHeartOutline size={18}/>} {story.isFavorite ? "Đã thích" : "Yêu thích"}
              </button>
              <button onClick={() => setIsReportOpen({show: true, targetId: story.storyId, targetType: 0, reason: ""})} className="p-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-400 hover:text-red-500 transition-all shadow-sm"><IoFlag size={18}/></button>
           </div>
        </div>
      </section>

      {/* 3. CHAPTER LIST (STYLE MẪU image_5e6058.png) */}
      <section className="bg-white/80 dark:bg-[#111827]/60 border border-slate-200 dark:border-white/5 rounded-[32px] p-6 md:p-8 backdrop-blur-xl mb-8 text-left shadow-xl">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-6 flex items-center gap-2"><IoListOutline size={18}/> Danh sách chương ({story.totalChapters})</h3>
          <div className="border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-inner">
            <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
              {chapters.map((chap, index) => (
                <div key={chap.chapterId} onClick={() => navigate(PATHS.READING.replace(":storySlug", slug).replace(":chapterSlug", chap.slug))} className={`group flex items-center justify-between px-6 py-4 transition-all cursor-pointer ${index % 2 === 0 ? "bg-slate-50/50 dark:bg-white/[0.02]" : "bg-transparent"} hover:bg-purple-50 dark:hover:bg-purple-500/10 border-b border-slate-100 dark:border-white/5 last:border-none`}>
                  <p className="text-[14px] font-bold text-slate-700 dark:text-gray-300 group-hover:text-purple-500 transition-colors">{chap.title}</p>
                  <div className="flex items-center gap-6 text-[10px] text-slate-400 dark:text-gray-500 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><IoEyeOutline size={14}/> 1.2K</span>
                    <span>{format(new Date(chap.createAt), "dd/MM/yyyy")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {chapterPage < story.chapters.totalPages && (
            <button onClick={() => {
              const next = chapterPage + 1;
              getStoryDetailBySlugApi(slug, next, 20).then(res => {setChapters([...chapters, ...res.chapters.items]); setChapterPage(next);});
            }} className="w-full mt-6 py-3.5 bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl font-black text-[9px] uppercase text-slate-400 hover:text-purple-500 transition-all">Tải thêm chương cũ</button>
          )}
      </section>

      {/* 4. COMMENTS AREA */}
      <section id="comment-area" className="bg-white dark:bg-[#111827]/80 border border-slate-200 dark:border-white/5 rounded-[32px] p-6 md:p-10 backdrop-blur-xl text-left shadow-2xl">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-8">Thảo luận cộng đồng</h3>
          
          <div className="mb-12 relative bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-4 focus-within:border-purple-500/50 transition-all shadow-inner">
             {replyTarget.parentId && <div className="flex items-center justify-between px-2 mb-2 animate-in slide-in-from-top-1"><p className="text-[9px] font-black text-purple-500 uppercase">Đang phản hồi @{replyTarget.userName}</p><button onClick={() => setReplyTarget({parentId: null, rootId: null, userName: ""})} className="text-[9px] text-slate-400 uppercase font-black hover:text-red-500">Hủy</button></div>}
             {editingId && <div className="flex items-center justify-between px-2 mb-2 animate-in slide-in-from-top-1"><p className="text-[9px] font-black text-cyan-500 uppercase">Đang chỉnh sửa bình luận</p><button onClick={() => {setEditingId(null); setCommentInput("");}} className="text-[9px] text-slate-400 uppercase font-black hover:text-red-500">Hủy</button></div>}
             
             <textarea value={commentInput} onChange={(e) => setCommentInput(e.target.value)} placeholder="Nhập ý kiến của bạn về bộ truyện này..." className="w-full bg-transparent border-none outline-none text-[15px] min-h-[90px] text-slate-700 dark:text-gray-200 placeholder:text-slate-400 font-medium leading-relaxed" />
             <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-white/5 mt-2"><button onClick={handlePostComment} className="flex items-center gap-2 px-8 py-2.5 bg-purple-600 text-white text-[10px] font-black uppercase rounded-2xl hover:bg-purple-500 shadow-xl transition-all active:scale-95"><IoSend /> {editingId ? "Cập nhật" : "Gửi bình luận"}</button></div>
          </div>

          <div className="space-y-2">
            {comments.items.map(cmt => (
              <CommentItem 
                key={cmt.commentId} comment={cmt} repliesData={replies} loadReplies={loadReplies}
                onReply={(c) => { setReplyTarget({ parentId: c.commentId, rootId: cmt.commentId, userName: c.userName }); window.scrollTo({ top: document.getElementById('comment-area').offsetTop - 50, behavior: 'smooth' }); }}
                onEdit={(c) => { setEditingId(c.commentId); setCommentInput(c.content); window.scrollTo({ top: document.getElementById('comment-area').offsetTop - 50, behavior: 'smooth' }); }}
                onReport={(id, type) => setIsReportOpen({show: true, targetId: id, targetType: type, reason: ""})}
                onDelete={(id) => handleAction('delete', id, cmt.commentId)}
                onHide={(id) => handleAction('hide', id, cmt.commentId)}
                onPublish={(id) => handleAction('publish', id, cmt.commentId)}
              />
            ))}
          </div>
          <Pagination pageIndex={comments.pageIndex} totalPages={comments.totalPages} onPageChange={(p) => loadMainComments(p)} />
      </section>

      {/* REPORT MODAL (FIXED TYPES: Story=0, Chapter=1, Comment=2) */}
      {isReportOpen.show && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-[#0b0f1a] border border-slate-200 dark:border-white/10 rounded-[40px] p-8 w-full max-w-md shadow-2xl relative">
            <h3 className="text-xl font-black uppercase tracking-widest mb-6 text-slate-900 dark:text-white">Báo cáo vi phạm</h3>
            <textarea className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-5 text-sm outline-none focus:border-red-500 transition-all min-h-[160px] text-slate-700 dark:text-white" placeholder="Mô tả lý do..." value={isReportOpen.reason} onChange={(e) => setIsReportOpen({...isReportOpen, reason: e.target.value})} />
            <div className="flex gap-4 mt-8">
              <button onClick={() => setIsReportOpen({show: false, targetId: null, targetType: 0, reason: ""})} className="flex-1 py-4 bg-slate-100 dark:bg-white/5 rounded-2xl font-bold uppercase text-[11px] text-slate-400">Hủy</button>
              <button onClick={handleSendReport} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-[11px] shadow-lg shadow-red-600/30 active:scale-95 transition-all">Gửi báo cáo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryDetail;