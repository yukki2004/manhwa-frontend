import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination as SwiperPag, Autoplay, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IoFlame, IoTimeOutline, IoChevronForward, IoStar, 
  IoBookOutline, IoTrendingUpOutline, IoFlashOutline, IoRibbonOutline 
} from "react-icons/io5";

// Services
import { getHotStoriesApi, filterStoriesApi, getStoryRankingApi } from "../storyService";
import { PATHS } from "../../../routes/paths";

// Components
import SearchStoryCard from "../components/SearchStoryCard";

// CSS Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hotStories, setHotStories] = useState([]);
  const [latestUpdates, setLatestUpdates] = useState([]);
  const [rankings, setRankings] = useState({ daily: [], weekly: [], monthly: [], allTime: [] });
  const [activeRankTab, setActiveRankTab] = useState("weekly");

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const [hotRes, latestRes, rankingRes] = await Promise.all([
          getHotStoriesApi(),
          filterStoriesApi({ PageSize: 30 }), // Lấy 30 truyện mới nhất
          getStoryRankingApi()
        ]);
        setHotStories(hotRes || []);
        setLatestUpdates(latestRes.items || []);
        setRankings(rankingRes || { daily: [], weekly: [], monthly: [], allTime: [] });
      } catch (err) {
        console.error("Lỗi tải trang chủ:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a]">
      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white font-plus-jakarta pb-20 overflow-x-hidden">
      
      {/* 1. LAYERED HOT BANNER (Phong cách Waka cải tiến) */}
      <section className="relative w-full overflow-hidden">
        <Swiper
          modules={[Navigation, SwiperPag, Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 6000 }}
          navigation={{ className: 'custom-nav' }}
          pagination={{ clickable: true }}
          className="h-[500px] md:h-[650px] w-full group"
        >
          {hotStories.map((story) => (
            <SwiperSlide key={story.storyId}>
              <div className="relative w-full h-full">
                {/* Background Blur Layer */}
                <div className="absolute inset-0 z-0 scale-110">
                  <img src={story.thumbnailUrl} className="w-full h-full object-cover blur-[80px] opacity-30" alt="bg" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-[#0b0f1a]/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f1a] via-transparent to-transparent" />
                </div>

                <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 h-full flex flex-col md:flex-row items-center justify-center md:justify-between gap-12 pt-10 md:pt-0">
                  
                  {/* Left Content (Mobile: Order 2) */}
                  <div className="flex-1 max-w-2xl text-center md:text-left order-2 md:order-1">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                      <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-purple-400 text-[10px] font-black uppercase rounded-full tracking-[0.2em] mb-6 inline-block border border-white/10 shadow-lg">
                        <IoRibbonOutline className="inline mr-2" /> TruyenVerse Đề Xuất
                      </span>
                      <h1 className="text-3xl md:text-6xl font-black mb-6 leading-[1.1] uppercase italic tracking-tighter drop-shadow-2xl">
                        {story.title}
                      </h1>
                      <p className="text-gray-400 text-xs md:text-base line-clamp-3 mb-10 leading-relaxed font-medium italic opacity-80 max-w-xl mx-auto md:mx-0">
                        {story.description}
                      </p>
                      <div className="flex items-center justify-center md:justify-start gap-4">
                        <Link to={PATHS.STORY_DETAIL.replace(":slug", story.slug)} className="px-10 py-4 bg-purple-600 hover:bg-white hover:text-purple-600 rounded-full font-black text-[11px] uppercase flex items-center gap-3 transition-all shadow-[0_20px_40px_-10px_rgba(147,51,234,0.5)] active:scale-95 group/btn">
                          <IoBookOutline size={20} className="group-hover/btn:scale-110 transition-transform" /> Đọc ngay
                        </Link>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Layered Image (Waka Style Stack) */}
                  <div className="relative w-[220px] md:w-[450px] shrink-0 order-1 md:order-2">
                    <motion.div 
                      initial={{ rotateY: 20, opacity: 0, x: 50 }}
                      animate={{ rotateY: -10, opacity: 1, x: 0 }}
                      transition={{ duration: 1, type: "spring" }}
                      className="relative perspective-1000"
                    >
                      {/* Layer 3 (Deep Shadow/Ghost) */}
                      <div className="absolute top-10 left-10 w-[180px] md:w-[320px] aspect-[3/4] bg-white/5 rounded-2xl border border-white/5 -z-20 blur-sm" />
                      
                      {/* Layer 2 (Second Book) */}
                      <div className="absolute top-5 left-5 w-[180px] md:w-[320px] aspect-[3/4] bg-white/10 rounded-2xl border border-white/10 -z-10 shadow-2xl overflow-hidden">
                         <img src={story.thumbnailUrl} className="w-full h-full object-cover opacity-40 blur-[2px]" alt="stack" />
                      </div>

                      {/* Main Image Layer */}
                      <img 
                        src={story.thumbnailUrl} 
                        className="w-[180px] md:w-[320px] aspect-[3/4] object-cover rounded-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] border border-white/20 relative z-20" 
                        alt={story.title} 
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 mt-[-40px] relative z-30">
        
        {/* 2. DAILY HIGHLIGHTS (Top Ngày - Ngay dưới Banner) */}
        <section className="mb-20">
          <div className="bg-[#111827]/60 backdrop-blur-2xl border border-white/5 p-8 rounded-[40px] shadow-2xl">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-gradient-to-br from-orange-400 to-red-600 rounded-2xl shadow-xl shadow-orange-500/20"><IoFlashOutline size={28} className="text-white"/></div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-widest leading-none italic">Bùng nổ hôm nay</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-widest">Xu hướng đa vũ trụ trong 24h qua</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
              {rankings.daily?.map((item, index) => (
                <Link key={item.storyId} to={PATHS.STORY_DETAIL.replace(":slug", item.slug)} className="group flex flex-col gap-4">
                  <div className="relative aspect-[3/4.5] rounded-2xl overflow-hidden border border-white/5 shadow-2xl transition-all group-hover:border-orange-500/50 group-hover:translate-y-[-8px]">
                    <img src={item.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    <div className="absolute top-3 left-3 w-10 h-10 bg-orange-600 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-2xl border border-white/10">
                      {index + 1}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-80" />
                  </div>
                  <h3 className="text-[13px] font-black uppercase tracking-tight truncate px-1 group-hover:text-orange-500 transition-colors">{item.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 3. MAIN CONTENT: LATEST (LEFT) & RANKING (RIGHT) */}
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* LEFT: MỚI CẬP NHẬT (30 ITEMS) */}
          <section className="flex-1">
            <div className="flex items-center justify-between mb-12 pb-6 border-b border-white/5">
              <div className="flex items-center gap-4">
                <IoTimeOutline className="text-cyan-400" size={32}/>
                <h2 className="text-2xl font-black uppercase tracking-[0.1em] italic">Mới cập nhật</h2>
              </div>
              <Link to={PATHS.SEARCH} className="group flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-purple-600 transition-all">
                <span className="text-[10px] font-black uppercase tracking-widest">Xem tất cả</span>
                <IoChevronForward className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-y-12 gap-x-6">
              {latestUpdates.map(story => (
                <SearchStoryCard key={story.storyId} story={story} />
              ))}
            </div>

            {/* Pagination / View More */}
            <div className="mt-20 flex justify-center">
               <button 
                  onClick={() => navigate(PATHS.SEARCH)}
                  className="group px-16 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-white hover:to-white hover:text-purple-600 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-2xl shadow-purple-600/20 active:scale-95"
               >
                  Vào page tìm kiếm để xem thêm
               </button>
            </div>
          </section>

          {/* RIGHT: BẢNG XẾP HẠNG (Tuần/Tháng/Tất cả) */}
          <aside className="w-full lg:w-[380px] shrink-0">
            <div className="bg-[#111827]/40 backdrop-blur-3xl border border-white/5 rounded-[48px] p-8 sticky top-24 shadow-2xl">
              <div className="flex items-center gap-3 mb-10">
                <IoFlame className="text-red-500" size={32}/>
                <h2 className="text-xl font-black uppercase tracking-widest leading-none">BXH Đa Vũ Trụ</h2>
              </div>

              {/* Custom Tabs */}
              <div className="flex bg-black/40 p-1.5 rounded-2xl mb-10 border border-white/10">
                {['weekly', 'monthly', 'allTime'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveRankTab(tab)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeRankTab === tab ? 'bg-purple-600 text-white shadow-xl' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {tab === 'weekly' ? 'Tuần' : tab === 'monthly' ? 'Tháng' : 'Tất cả'}
                  </button>
                ))}
              </div>

              {/* Ranking List Item */}
              <div className="space-y-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeRankTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-2"
                  >
                    {rankings[activeRankTab]?.slice(0, 10).map((story, index) => (
                      <Link 
                        key={story.storyId} 
                        to={PATHS.STORY_DETAIL.replace(":slug", story.slug)}
                        className="flex items-center gap-5 group p-3 rounded-3xl hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5"
                      >
                        <div className={`w-10 h-10 shrink-0 flex items-center justify-center font-black italic text-2xl ${
                          index === 0 ? 'text-amber-400 scale-125' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-orange-500' : 'text-gray-700'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="relative shrink-0">
                          <img src={story.thumbnail} className="w-14 h-20 object-cover rounded-xl shadow-lg border border-white/5 group-hover:scale-110 transition-transform duration-500" alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[13px] font-black uppercase tracking-tight truncate group-hover:text-purple-400 transition-colors leading-tight">
                            {story.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                            <span className="flex items-center gap-1"><IoStar className="text-amber-500"/> {story.rateAvg || "5.0"}</span>
                            <span className="opacity-40">|</span>
                            <span>{story.release}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
};

export default Home;