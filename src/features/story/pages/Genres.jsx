import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { filterStoriesApi } from "../storyService";
import { getAllCategoryApi } from "../../../services/categoryService";
import SearchStoryCard from "../components/SearchStoryCard";
import Pagination from "../../../components/common/Pagination";
import { PATHS } from "../../../routes/paths";
import { IoGridOutline, IoChevronForwardOutline } from "react-icons/io5";
import { toast } from "react-toastify";

const Genres = () => {
  const { slug } = useParams(); // Lấy slug thể loại từ URL
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [results, setResults] = useState({ items: [], totalPages: 0, pageIndex: 1, totalCount: 0 });
  const [loading, setLoading] = useState(false);

  const currentPage = parseInt(searchParams.get("page")) || 1;

  // 1. Load danh sách thể loại để làm menu chuyển đổi nhanh
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getAllCategoryApi();
        setCategories(res);
      } catch { toast.error("Không tải được danh mục"); }
    };
    loadCategories();
  }, []);

  // 2. Logic fetch truyện theo thể loại và phân trang
  useEffect(() => {
    const fetchStoriesByGenre = async () => {
      setLoading(true);
      const queryParams = {
        CategorySlugs: slug ? [slug] : [], // Lọc theo slug hiện tại trên URL
        PageIndex: currentPage,
        PageSize: 30, // Đảm bảo số lượng đồng nhất với trang tìm kiếm
        SortBy: "updateAt"
      };

      try {
        const res = await filterStoriesApi(queryParams);
        setResults(res);
        
        // CUỘN LÊN ĐẦU TRANG MƯỢT MÀ KHI DATA VỀ
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        toast.error("Lỗi tải danh sách truyện");
      } finally {
        setLoading(false);
      }
    };

    fetchStoriesByGenre();
  }, [slug, currentPage]);

  const currentCategory = categories.find(c => c.slug === slug);

  return (
    <div className="max-w-[1440px] mx-auto pt-4 pb-12 px-4 md:px-8 font-plus-jakarta text-slate-900 dark:text-gray-100 transition-all">
      
      {/* 1. HEADER PAGE & DANH MỤC NHANH */}
      <div className="mb-8 space-y-6">
        <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-widest font-bold">
          <span>TruyenVerse</span>
          <IoChevronForwardOutline />
          <span className="text-purple-500">Thể loại</span>
          {currentCategory && (
            <>
              <IoChevronForwardOutline />
              <span className="text-purple-600 dark:text-purple-400">{currentCategory.name}</span>
            </>
          )}
        </div>

        {/* Danh sách thể loại ngang để chuyển nhanh */}
        <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-200 dark:border-white/5">
          {categories.map((cat) => (
            <button
              key={cat.categoryId}
              onClick={() => navigate(`/the-loai/${cat.slug}`)}
              className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all border ${
                slug === cat.slug
                  ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/30"
                  : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500 hover:border-purple-500/50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. LƯỚI KẾT QUẢ VỚI OVERLAY */}
      <div className="relative min-h-[600px]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-black flex items-center gap-3">
            <IoGridOutline className="text-purple-500" />
            {currentCategory ? `Truyện Thể Loại ${currentCategory.name}` : "Tất Cả Truyện"}
            <span className="ml-2 text-xs font-medium text-slate-400 italic">
              ({results.totalCount.toLocaleString()} bộ)
            </span>
          </h2>
        </div>

        {/* Lớp phủ mờ khi đang tải (Không nhảy khung) */}
        {loading && (
          <div className="absolute inset-0 z-50 bg-white/40 dark:bg-[#0b0f1a]/40 backdrop-blur-[2px] flex items-center justify-center rounded-3xl animate-in fade-in duration-300">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-purple-600 font-black italic text-[10px] uppercase tracking-widest">
                Đang triệu hồi dữ liệu...
              </p>
            </div>
          </div>
        )}

        <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-7 transition-opacity duration-500 ${loading ? 'opacity-30' : 'opacity-100'}`}>
          {results.items?.map(story => (
            <SearchStoryCard key={story.storyId} story={story} />
          ))}
        </div>

        {/* Trường hợp không có dữ liệu */}
        {!loading && results.items?.length === 0 && (
          <div className="text-center py-40 text-slate-500 italic">
            Chưa có truyện nào trong thể loại này...
          </div>
        )}

        {/* PHÂN TRANG */}
        <div className="mt-12">
          <Pagination 
            pageIndex={results.pageIndex} 
            totalPages={results.totalPages} 
            onPageChange={(p) => setSearchParams({ page: p })} 
          />
        </div>
      </div>
    </div>
  );
};

export default Genres;