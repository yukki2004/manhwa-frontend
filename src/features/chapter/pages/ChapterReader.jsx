import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getChapterDetailApi } from "../chapterService";
import { getStoryDetailBySlugApi } from "../../story/storyService";
import { 
  getChapterCommentsApi, getCommentRepliesApi, postCommentApi, 
  deleteCommentApi, hideCommentApi, publishCommentApi, updateCommentApi 
} from "../../interaction/interactionService";
import { postReportApi } from "../../../services/reportService";
import { PATHS } from "../../../routes/paths";
import { 
  IoChevronBackOutline, IoChevronForwardOutline, IoHomeOutline, 
  IoFlagOutline, IoChatbubbleEllipsesOutline, IoSend, IoChevronDownOutline, 
  IoSearchOutline, IoCloseOutline, IoListOutline, IoChevronForward, IoLayersOutline, IoSquareOutline, IoArrowBackOutline
} from "react-icons/io5";
import { toast } from "react-toastify";
import CommentItem from "../../../components/common/CommentItem";
import Pagination from "../../../components/common/Pagination";
import { format } from "date-fns";

const ChapterReader = () => {
  const { storySlug, chapterSlug } = useParams();
  const navigate = useNavigate();
  const touchStartX = useRef(0); 
  

  const [chapter, setChapter] = useState(null);
  const [storyInfo, setStoryInfo] = useState(null);
  const [allChapters, setAllChapters] = useState([]); 
  const [loading, setLoading] = useState(true);
  

  const [readingMode, setReadingMode] = useState("webtoon"); 
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showFloatingNav, setShowFloatingNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [chapterSearch, setChapterSearch] = useState("");
  

  const [comments, setComments] = useState({ items: [], totalPages: 0, pageIndex: 1, totalCount: 0 });
  const [replies, setReplies] = useState({});
  const [commentInput, setCommentInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [replyTarget, setReplyTarget] = useState({ parentId: null, rootId: null, userName: "" });
  const [isReportOpen, setIsReportOpen] = useState({ show: false, targetId: null, targetType: 1, reason: "" });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [chapRes, storyRes] = await Promise.all([
        getChapterDetailApi(storySlug, chapterSlug),
        getStoryDetailBySlugApi(storySlug, 1, 1000) 
      ]);
      setChapter(chapRes);
      setStoryInfo(storyRes);
      setAllChapters(storyRes.chapters.items || []);
      setCurrentPageIndex(0);
      window.scrollTo(0, 0);
    } catch {
      toast.error("Lỗi dữ liệu chương");
      navigate(PATHS.STORY_DETAIL.replace(":slug", storySlug));
    } finally { setLoading(false); }
  }, [storySlug, chapterSlug, navigate]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) setShowFloatingNav(true);
      else if (currentScrollY > lastScrollY) setShowFloatingNav(false); 
      else setShowFloatingNav(true); 
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) < 50) return; 

    if (diff > 0) { 
      currentPageIndex < chapter.imageUrls.length - 1 && setCurrentPageIndex(p => p + 1);
    } else { 
      currentPageIndex > 0 && setCurrentPageIndex(p => p - 1);
    }
  };

  const filteredChapters = useMemo(() => {
    return allChapters.filter(c => 
      c.title.toLowerCase().includes(chapterSearch.toLowerCase()) || 
      c.chapterNumber.toString().includes(chapterSearch)
    );
  }, [allChapters, chapterSearch]);

  const { prevChap, nextChap } = useMemo(() => {
    if (!allChapters.length || !chapter) return { prevChap: null, nextChap: null };
    const idx = allChapters.findIndex(c => c.chapterId === chapter.chapterId);
    return {
      prevChap: idx < allChapters.length - 1 ? allChapters[idx + 1] : null,
      nextChap: idx > 0 ? allChapters[idx - 1] : null
    };
  }, [allChapters, chapter]);

  const handleSwitchChapter = (targetSlug) => {
    setIsSelectOpen(false);
    navigate(PATHS.READING.replace(":storySlug", storySlug).replace(":chapterSlug", targetSlug));
  };

  const loadComments = async (p = 1) => {
    const res = await getChapterCommentsApi(storySlug, chapterSlug, p, 10);
    setComments(res);
  };
  const loadReplies = async (parentId) => {
    const res = await getCommentRepliesApi(parentId, 1, 100);
    setReplies(prev => ({ ...prev, [parentId]: res.items }));
  };
  useEffect(() => { if (chapter) loadComments(); }, [chapter, chapterSlug]);

  const handlePostComment = async () => {
    if (!commentInput.trim()) return;
    try {
      if (editingId) await updateCommentApi(editingId, commentInput);
      else {
        const res = await postCommentApi({ storyId: chapter.storyId, chapterId: chapter.chapterId, content: commentInput, parentId: replyTarget.parentId });
        setTimeout(() => document.getElementById(`comment-${res.commentId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 500);
      }
      setCommentInput(""); setReplyTarget({ parentId: null, rootId: null, userName: "" }); setEditingId(null);
      replyTarget.rootId ? loadReplies(replyTarget.rootId) : loadComments(1);
      toast.success("Thành công");
    } catch { toast.error("Vui lòng đăng nhập"); }
  };

  const handleAction = async (action, id, parentId = null) => {
    try {
      if (action === 'delete') await deleteCommentApi(id);
      if (action === 'hide') await hideCommentApi(id);
      if (action === 'publish') await publishCommentApi(id);
      toast.success("Đã thực hiện");
      parentId ? loadReplies(parentId) : loadComments(comments.pageIndex);
    } catch { toast.error("Lỗi thực thi"); }
  };

  const handleSendReport = async () => {
    if (!isReportOpen.reason?.trim()) return toast.warning("Nhập lý do");
    try {
      await postReportApi(isReportOpen.targetId, isReportOpen.targetType, isReportOpen.reason);
      toast.success("Đã báo cáo");
      setIsReportOpen({ show: false, targetId: null, targetType: 1, reason: "" });
    } catch { toast.error("Gửi thất bại"); }
  };

  if (loading || !chapter) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a]">
      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f1a] transition-all font-plus-jakarta select-none overflow-x-hidden">
      <header className={`fixed top-0 left-0 right-0 z-[130] transition-transform duration-500 ${showFloatingNav ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="bg-white/95 dark:bg-[#0b0f1a]/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 shadow-2xl h-14 md:h-16">
          <div className="max-w-[1440px] mx-auto px-4 h-full flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-2 text-[11px] md:text-[13px] font-bold text-slate-500 dark:text-slate-400 overflow-hidden min-w-0">
              <Link to={PATHS.HOME} className="hover:text-purple-500 transition-colors shrink-0">TruyenVerse</Link>
              <IoChevronForward className="shrink-0 opacity-20" size={12}/>
              <Link to={PATHS.STORY_DETAIL.replace(":slug", chapter.storySlug)} className="truncate hover:text-purple-500 transition-colors">
                {chapter.storyTitle}
              </Link>
              <IoChevronForward className="shrink-0 opacity-20" size={12}/>
              
              <button 
                onClick={() => setIsSelectOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 hover:bg-purple-600 hover:text-white transition-all group shrink-0"
              >
                <span className="uppercase tracking-tighter truncate max-w-[80px] md:max-w-none font-black">{chapter.title}</span>
                <IoChevronDownOutline size={14}/>
              </button>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => setReadingMode(readingMode === 'webtoon' ? 'page' : 'webtoon')}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-500 hover:text-purple-500 border border-transparent hover:border-purple-500/30 transition-all"
              >
                {readingMode === 'webtoon' ? <><IoLayersOutline size={18}/><span className="text-[10px] font-black uppercase">Cuộn dọc</span></> : <><IoSquareOutline size={18}/><span className="text-[10px] font-black uppercase">Từng trang</span></>}
              </button>
              <button onClick={() => setReadingMode(readingMode === 'webtoon' ? 'page' : 'webtoon')} className="md:hidden p-2.5 text-slate-500 bg-slate-100 dark:bg-white/5 rounded-xl"><IoLayersOutline size={20}/></button>

              <button 
                onClick={() => setIsReportOpen({show: true, targetId: chapter.chapterId, targetType: 1, reason: ""})} 
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm"
              >
                <IoFlagOutline size={14}/> Báo cáo chương
              </button>
              <button onClick={() => setIsReportOpen({show: true, targetId: chapter.chapterId, targetType: 1, reason: ""})} className="md:hidden p-2.5 text-red-500 bg-red-500/10 rounded-xl"><IoFlagOutline size={20}/></button>
            </div>
          </div>
        </div>
      </header>
      {isSelectOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300" style={{ top: 0 }}>
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[75vh] mt-14 animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-100 dark:border-white/5 text-left">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-600 rounded-2xl text-white shadow-lg"><IoListOutline size={22}/></div>
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm text-left">Chọn chương</h3>
                  </div>
                  <button onClick={() => setIsSelectOpen(false)} className="p-2 text-slate-400 hover:text-purple-500"><IoCloseOutline size={30}/></button>
               </div>
               <div className="relative group">
                  <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20}/>
                  <input type="text" placeholder="Tìm số chương (ví dụ: 160)..." className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-purple-500 transition-all text-slate-800 dark:text-white font-medium" value={chapterSearch} onChange={(e) => setChapterSearch(e.target.value)} autoFocus />
               </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1 text-left">
              {filteredChapters.length > 0 ? filteredChapters.map((c) => (
                <button key={c.chapterId} onClick={() => handleSwitchChapter(c.slug)} className={`w-full text-left px-6 py-4 rounded-[22px] transition-all flex items-center justify-between group ${c.chapterId === chapter.chapterId ? 'bg-purple-600 shadow-xl !text-white' : 'text-slate-600 dark:text-gray-400 hover:bg-purple-500/10'}`}>
                  <span className="font-bold text-[13.5px] uppercase tracking-tight">{c.title}</span>
                  {c.chapterId === chapter.chapterId && <span className="text-[9px] font-black uppercase bg-white/20 px-2.5 py-1 rounded-lg">Đang đọc</span>}
                </button>
              )) : <div className="py-20 text-center text-slate-400 text-sm italic">Vũ trụ chưa có chương này...</div>}
            </div>
            <button onClick={() => setIsSelectOpen(false)} className="w-full py-5 bg-slate-50 dark:bg-white/5 font-black text-[11px] uppercase tracking-[0.2em] text-slate-400 hover:text-purple-500 border-t border-slate-100 dark:border-white/5">Hủy bỏ</button>
          </div>
        </div>
      )}
      <main className="max-w-[850px] mx-auto pt-14 md:pt-16 bg-black shadow-[0_0_150px_rgba(0,0,0,0.9)] overflow-hidden relative min-h-screen">
        {readingMode === 'webtoon' ? (
          <div className="flex flex-col items-center">
            {chapter.imageUrls.map((img) => (
              <img key={img.orderIndex} src={img.url} alt={`Trang ${img.orderIndex}`} loading="lazy" className="w-full h-auto block opacity-0 animate-in fade-in duration-1000 fill-mode-forwards" onLoad={(e) => e.target.style.opacity = 1} onContextMenu={(e) => e.preventDefault()} />
            ))}
          </div>
        ) : (
          <div className="min-h-[85vh] flex flex-col items-center relative py-6 px-2 touch-pan-y" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div className="relative group w-full flex justify-center items-center cursor-pointer active:scale-[0.99] transition-transform">
              <img src={chapter.imageUrls[currentPageIndex].url} className="max-h-[90vh] w-auto object-contain shadow-[0_0_50px_rgba(255,255,255,0.05)] select-none" alt="page" onClick={(e) => {
                  const x = e.clientX;
                  if (x > window.innerWidth / 2) currentPageIndex < chapter.imageUrls.length - 1 && setCurrentPageIndex(p => p + 1);
                  else currentPageIndex > 0 && setCurrentPageIndex(p => p - 1);
              }} />
              <div className="absolute inset-y-0 left-0 w-16 md:w-24 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"><div className="p-3 bg-black/40 rounded-full text-white backdrop-blur-md shadow-xl"><IoChevronBackOutline size={40}/></div></div>
              <div className="absolute inset-y-0 right-0 w-16 md:w-24 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"><div className="p-3 bg-black/40 rounded-full text-white backdrop-blur-md shadow-xl"><IoChevronForwardOutline size={40}/></div></div>
            </div>
            <div className="mt-8 flex flex-col items-center gap-3">
              <div className="bg-purple-600/20 backdrop-blur-xl border border-purple-500/30 px-8 py-2 rounded-full text-purple-400 font-black text-[10px] uppercase tracking-[0.3em] shadow-lg">Trang {currentPageIndex + 1} / {chapter.imageUrls.length}</div>
              <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${((currentPageIndex + 1) / chapter.imageUrls.length) * 100}%` }} /></div>
            </div>
          </div>
        )}
      </main>

      <nav className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-2 p-2.5 bg-[#0b0f1a]/85 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.8)] transition-all duration-700 ${showFloatingNav ? 'translate-y-0 opacity-100' : 'translate-y-40 opacity-0'}`}>
        <button disabled={!prevChap} onClick={() => handleSwitchChapter(prevChap.slug)} className="p-4 md:p-5 bg-white/5 rounded-[28px] text-slate-400 hover:text-white disabled:opacity-5 transition-all"><IoChevronBackOutline size={26}/></button>
        <button onClick={() => setIsSelectOpen(true)} className="px-12 py-4 md:py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-[28px] font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-purple-600/30 active:scale-95 transition-all border-t border-white/20">Chương {chapter.chapterNumber}</button>
        <button disabled={!nextChap} onClick={() => handleSwitchChapter(nextChap.slug)} className="p-4 md:p-5 bg-white/5 rounded-[28px] text-slate-400 hover:text-white disabled:opacity-5 transition-all"><IoChevronForwardOutline size={26}/></button>
      </nav>

      <div className="max-w-[850px] mx-auto py-16 px-4">
        <section id="comment-area" className="bg-white/90 dark:bg-[#111827]/80 border border-slate-200 dark:border-white/5 rounded-[48px] p-6 md:p-12 backdrop-blur-2xl text-left shadow-2xl transition-all">
          <div className="flex items-center gap-4 mb-10 text-left">
            <div className="p-4 bg-purple-600 rounded-[24px] shadow-lg shadow-purple-600/30 text-white"><IoChatbubbleEllipsesOutline size={28}/></div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">Cộng đồng thảo luận</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{comments.totalCount} bình luận</p>
            </div>
          </div>
          <div className="mb-14 relative bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[32px] p-6 focus-within:border-purple-500/50 transition-all shadow-inner text-left">
             {replyTarget.parentId && <div className="flex items-center justify-between px-3 mb-4 animate-in slide-in-from-top-2"><p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.1em]">Đang phản hồi @{replyTarget.userName}</p><button onClick={() => setReplyTarget({parentId: null, rootId: null, userName: ""})} className="text-[10px] text-slate-400 uppercase font-black hover:text-red-500 transition-all">Hủy bỏ</button></div>}
             <textarea value={commentInput} onChange={(e) => setCommentInput(e.target.value)} placeholder="Nhập cảm nhận của bạn về chương truyện này..." className="w-full bg-transparent border-none outline-none text-[15px] min-h-[100px] text-slate-700 dark:text-gray-200 placeholder:text-slate-400 leading-relaxed font-medium" />
             <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-white/5 mt-3"><button onClick={handlePostComment} className="flex items-center gap-3 px-10 py-4 bg-purple-600 text-white text-[11px] font-black uppercase rounded-2xl hover:bg-purple-500 shadow-xl shadow-purple-600/20 transition-all active:scale-95"><IoSend /> Gửi ý kiến</button></div>
          </div>

          <div className="space-y-2">
            {comments.items.map(cmt => (
              <CommentItem key={cmt.commentId} comment={cmt} repliesData={replies} loadReplies={loadReplies}
                onReply={(c) => { setReplyTarget({ parentId: c.commentId, rootId: cmt.commentId, userName: c.userName }); window.scrollTo({ top: document.getElementById('comment-area').offsetTop - 30, behavior: 'smooth' }); }}
                onEdit={(c) => { setEditingId(c.commentId); setCommentInput(c.content); window.scrollTo({ top: document.getElementById('comment-area').offsetTop - 30, behavior: 'smooth' }); }}
                onReport={(id, type) => setIsReportOpen({show: true, targetId: id, targetType: type, reason: ""})}
                onDelete={(id) => handleAction('delete', id, cmt.commentId)}
              />
            ))}
          </div>
          <Pagination pageIndex={comments.pageIndex} totalPages={comments.totalPages} onPageChange={(p) => { loadComments(p); window.scrollTo({top: document.getElementById('comment-area').offsetTop - 100, behavior: 'smooth'}); }} />
        </section>
      </div>

      {isReportOpen.show && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-[#0b0f1a] border border-slate-200 dark:border-white/10 rounded-[48px] p-8 md:p-12 w-full max-w-md shadow-2xl relative text-left">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-red-500/10 text-red-500 rounded-3xl"><IoFlagOutline size={32}/></div>
              <div><h3 className="text-xl font-black uppercase tracking-widest text-slate-900 dark:text-white">Báo cáo vi phạm</h3><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Chúng tôi sẽ kiểm duyệt nội dung này</p></div>
            </div>
            <textarea className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-sm outline-none focus:border-red-500 transition-all min-h-[180px] text-slate-700 dark:text-white font-medium shadow-inner" placeholder="Mô tả cụ thể lỗi..." value={isReportOpen.reason || ""} onChange={(e) => setIsReportOpen({...isReportOpen, reason: e.target.value})} />
            <div className="flex gap-4 mt-10">
              <button onClick={() => setIsReportOpen({show: false, targetId: null, targetType: 1, reason: ""})} className="flex-1 py-5 bg-slate-100 dark:bg-white/5 rounded-2xl font-bold uppercase text-[11px] text-slate-400 hover:bg-slate-200 transition-all">Quay lại</button>
              <button onClick={handleSendReport} className="flex-1 py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-[11px] shadow-lg shadow-red-600/30 hover:bg-red-500 transition-all active:scale-95">Gửi báo cáo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterReader;