import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { filterStoriesApi } from "../storyService";
import { getAllCategoryApi } from "../../../services/categoryService";
import SearchStoryCard from "../components/SearchStoryCard";
import Pagination from "../../../components/common/Pagination";
import { 
  IoSearchOutline, IoFilterOutline, IoChevronDownOutline, 
  IoChevronUpOutline, IoReloadOutline, IoCalendarOutline, IoLayersOutline 
} from "react-icons/io5";
import { toast } from "react-toastify";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [results, setResults] = useState({ items: [], totalPages: 0, pageIndex: 1, totalCount: 0 });
  const [loading, setLoading] = useState(false);
  const [showGenreList, setShowGenreList] = useState(false);
  
  // Ref để cuộn đến đúng vị trí lưới kết quả thay vì tận đầu trang
  const resultsRef = useRef(null);

  const [tempFilters, setTempFilters] = useState({
    SearchTerm: searchParams.get("name") || "",
    CategorySlugs: searchParams.get("genres")?.split(",").filter(Boolean) || [],
    ReleaseYear: searchParams.get("year") || "",
    MinChapters: searchParams.get("minChapters") || "0",
    SortBy: searchParams.get("sort") || "updateAt",
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getAllCategoryApi();
        setCategories(res);
      } catch { toast.error("Lỗi tải thể loại"); }
    };
    loadCategories();
  }, []);

  const handleApplyFilter = (page = 1) => {
    const params = {};
    if (tempFilters.SearchTerm) params.name = tempFilters.SearchTerm;
    if (tempFilters.CategorySlugs.length > 0) params.genres = tempFilters.CategorySlugs.join(",");
    if (tempFilters.ReleaseYear) params.year = tempFilters.ReleaseYear;
    if (tempFilters.MinChapters !== "0") params.minChapters = tempFilters.MinChapters;
    if (tempFilters.SortBy !== "updateAt") params.sort = tempFilters.SortBy;
    params.page = page;
    setSearchParams(params);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Bắt đầu phủ lớp mờ
      const queryParams = {
        SearchTerm: searchParams.get("name") || "",
        CategorySlugs: searchParams.get("genres")?.split(",").filter(Boolean) || [], 
        ReleaseYear: searchParams.get("year") ? parseInt(searchParams.get("year")) : null,
        MinChapters: parseInt(searchParams.get("minChapters")) || 0,
        SortBy: searchParams.get("sort") || "updateAt",
        PageIndex: parseInt(searchParams.get("page")) || 1,
        PageSize: 30
      };

      try {
        const res = await filterStoriesApi(queryParams);
        setResults(res);
        setTempFilters(prev => ({...prev, ...queryParams}));
        
        // CHỈ CUỘN LÊN KHI ĐÃ CÓ DATA
        // Cuộn lên sát khối lọc để người dùng thấy kết quả mới ngay lập tức
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
      } catch { toast.error("Lỗi tìm kiếm"); }
      finally { setLoading(false); }
    };

    fetchData();
  }, [searchParams]);

  const years = Array.from({ length: 2026 - 1980 + 1 }, (_, i) => 2026 - i);

  return (
    <div className="max-w-[1440px] mx-auto pt-2 pb-12 px-4 md:px-8 font-plus-jakarta text-slate-900 dark:text-gray-100 transition-all">
      
      {/* 1. KHỐI LỌC COMPACT SÁT HEADER */}
      <div className="bg-white/80 dark:bg-[#111827]/90 border border-slate-200 dark:border-white/10 rounded-2xl p-4 md:p-6 mb-6 shadow-xl backdrop-blur-xl transition-all">
        <div className="relative mb-4 group">
          <input type="text" placeholder="Tìm theo tên truyện hoặc tác giả..." className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-11 pr-5 text-sm outline-none focus:border-purple-500 transition-all shadow-inner" value={tempFilters.SearchTerm} onChange={(e) => setTempFilters({...tempFilters, SearchTerm: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter(1)} />
          <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500" size={18} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <select className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-[12px] focus:border-purple-500 cursor-pointer outline-none dark:text-white" value={tempFilters.MinChapters} onChange={(e) => setTempFilters({...tempFilters, MinChapters: e.target.value})}>
            <option value="0" className="bg-white dark:bg-[#1a1f2e] text-slate-900 dark:text-white">Số chương: Tất cả</option>
            {[10, 20, 30, 50, 100, 500, 1000].map(n => <option key={n} value={n} className="bg-white dark:bg-[#1a1f2e]">{`>= ${n} chương`}</option>)}
          </select>

          <select className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-[12px] focus:border-purple-500 cursor-pointer outline-none dark:text-white" value={tempFilters.ReleaseYear} onChange={(e) => setTempFilters({...tempFilters, ReleaseYear: e.target.value})}>
            <option value="" className="bg-white dark:bg-[#1a1f2e] text-slate-900 dark:text-white">Năm: Tất cả</option>
            {years.map(y => <option key={y} value={y} className="bg-white dark:bg-[#1a1f2e]">{y}</option>)}
          </select>

          <select className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-[12px] focus:border-purple-500 cursor-pointer font-bold text-purple-600 dark:text-purple-400 outline-none" value={tempFilters.SortBy} onChange={(e) => setTempFilters({...tempFilters, SortBy: e.target.value})}>
            <option value="updateAt" className="bg-white dark:bg-[#1a1f2e] text-slate-900 dark:text-white">Mới nhất</option>
            <option value="views" className="bg-white dark:bg-[#1a1f2e]">Lượt xem</option>
            <option value="rating" className="bg-white dark:bg-[#1a1f2e]">Đánh giá</option>
          </select>
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
          <button type="button" onClick={() => setShowGenreList(!showGenreList)} className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-purple-500 transition-colors">
            <IoFilterOutline size={14} /> Thể loại {showGenreList ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
          </button>
          
          <div className="flex gap-2">
              <button onClick={() => { setTempFilters({ SearchTerm: "", CategorySlugs: [], ReleaseYear: "", MinChapters: "0", SortBy: "updateAt" }); setSearchParams({}); }} className="px-4 py-1.5 bg-slate-100 dark:bg-white/5 text-slate-500 font-bold rounded-lg text-[10px] uppercase hover:bg-slate-200 transition-all">Xóa</button>
              <button onClick={() => handleApplyFilter(1)} className="px-6 py-1.5 bg-purple-600 text-white font-black rounded-lg text-[10px] uppercase hover:bg-purple-500 shadow-lg active:scale-95 transition-all">Lọc ngay</button>
          </div>
        </div>

        {showGenreList && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
              {categories.map(cat => (
                <button key={cat.categoryId} type="button" onClick={() => {
                  const newCats = tempFilters.CategorySlugs.includes(cat.slug) ? tempFilters.CategorySlugs.filter(s => s !== cat.slug) : [...tempFilters.CategorySlugs, cat.slug];
                  setTempFilters({...tempFilters, CategorySlugs: newCats});
                }} className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all border truncate ${tempFilters.CategorySlugs.includes(cat.slug) ? "bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/20" : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:border-purple-500/50"}`}>{cat.name}</button>
              ))}
            </div>
        )}
      </div>

      {/* 2. LƯỚI KẾT QUẢ VỚI OVERLAY MƯỢT MÀ */}
      <div className="relative min-h-[600px]" ref={resultsRef}>
        
        {/* Lớp phủ mờ khi đang tải (Không làm mất nội dung cũ) */}
        {loading && (
          <div className="absolute inset-0 z-50 bg-white/40 dark:bg-[#0b0f1a]/40 backdrop-blur-[2px] flex items-center justify-center rounded-3xl animate-in fade-in duration-300">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-purple-600 font-black italic text-[10px] uppercase tracking-widest">Đang quét Đa Vũ Trụ...</p>
            </div>
          </div>
        )}

        <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-7 transition-opacity duration-500 ${loading ? 'opacity-30' : 'opacity-100'}`}>
          {results.items?.map(story => (
            <SearchStoryCard key={story.storyId} story={story} />
          ))}
        </div>

        {/* Thông báo nếu không thấy kết quả */}
        {!loading && results.items?.length === 0 && (
          <div className="text-center py-40 text-gray-500 italic animate-in fade-in">Rất tiếc, không tìm thấy kết quả phù hợp...</div>
        )}

        {/* Phân trang (Nằm ngoài lớp phủ để luôn có thể tương tác) */}
        <div className="mt-10">
          <Pagination pageIndex={results.pageIndex} totalPages={results.totalPages} onPageChange={(p) => handleApplyFilter(p)} />
        </div>
      </div>
    </div>
  );
};

export default Search;