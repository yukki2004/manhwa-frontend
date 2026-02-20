import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { PATHS } from "../../../routes/paths";
import { useDebounce } from "../../../hooks/useDebounce";
import { getAllCategoryApi } from "../../../services/categoryService";
import { filterStoriesApi } from "../../../features/story/storyService";
import { getUnreadNotificationCountApi } from "../../../features/notification/notificationService";
import { createPortal } from "react-dom";
import * as signalR from "@microsoft/signalr"; 
import { toast } from "react-toastify";

// Components & Icons
import NotificationDropdown from "../components/NotificationDropdown";
import logoImg from "../../../assets/truyenverse.png";
import guestImg from "../../../assets/guest.png";
import { 
  IoNotificationsOutline, IoSearch, IoMoonOutline, IoSunnyOutline, 
  IoChevronDown, IoLogOutOutline, IoPersonOutline, IoColorPaletteOutline, 
  IoOptionsOutline, IoMenuOutline, IoCloseOutline, IoSparklesOutline, IoHomeOutline, IoGridOutline
} from "react-icons/io5";

const MainHeader = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const headerRef = useRef(null);

  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null); 
  const [categories, setCategories] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileGenreOpen, setIsMobileGenreOpen] = useState(false);
  
  const debouncedSearch = useDebounce(searchTerm, 500);

  // LOGIC ĐẾM THÔNG BÁO: Hàm này sẽ được gọi lại mỗi khi có tin mới hoặc tin được đọc
  const fetchUnreadCount = useCallback(() => {
    if (user) {
      getUnreadNotificationCountApi()
        .then(res => setUnreadCount(res.unreadCount))
        .catch(() => {});
    }
  }, [user]);

  // 1. Tải dữ liệu ban đầu
  useEffect(() => {
    getAllCategoryApi().then(setCategories).catch(console.error);
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // 2. Kết nối Real-time SignalR
  useEffect(() => {
    let connection = null;
    if (user) {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://localhost:7082/api'; 
        const baseHost = apiUrl.replace(/\/api$/, ''); 
        const hubUrl = `${baseHost}/hubs/notifications`;
      connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, { withCredentials: true })
        .withAutomaticReconnect()
        .build();

      connection.start()
        .then(() => {
          connection.on("ReceiveNotification", (notification) => {
            // Khi có tin nhắn mới -> Gọi API đếm lại con số thực tế từ DB
            fetchUnreadCount(); 
            window.dispatchEvent(new CustomEvent("new-notification", { detail: notification }));
            toast.info(`🔔 ${notification.title}`, { position: "top-right", theme: isDarkMode ? "dark" : "light" });
          });
        })
        .catch(err => console.error("SignalR Error:", err));
    }
    return () => { if (connection) connection.stop(); };
  }, [user, isDarkMode, fetchUnreadCount]);

  // 3. Logic Tìm kiếm suggestions
  useEffect(() => {
    if (debouncedSearch.trim()) {
      filterStoriesApi({ SearchTerm: debouncedSearch, PageSize: 5 })
        .then(res => setSuggestions(res.items || []))
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearch]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      setActiveDropdown(null);
      navigate(`${PATHS.SEARCH}?q=${encodeURIComponent(searchTerm.trim())}`);
      setSuggestions([]);
    }
  };

  // 4. Click-outside & Mobile lock
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setActiveDropdown(null);
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 w-full z-[120] bg-[#0b0f1a]/95 backdrop-blur-2xl border-b border-white/5 h-16 md:h-18 flex items-center shadow-2xl transition-all font-plus-jakarta" ref={headerRef}>
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 flex items-center justify-between gap-4">
        {/* LOGO & NAV */}
        <div className="flex items-center gap-6 shrink-0">
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-white hover:bg-white/5 rounded-xl transition-all"><IoMenuOutline size={32} /></button>
          <Link to={PATHS.HOME} className="shrink-0 flex items-center"><img src={logoImg} alt="TruyenVerse" className="h-9 sm:h-10 md:h-11 lg:h-12 w-auto object-contain drop-shadow-[0_0_16px_rgba(168,85,247,0.6)] transition-transform duration-300 hover:scale-105" /></Link>
          <nav className="hidden lg:flex items-center gap-10 ml-6">
            <Link to={PATHS.HOME} className={`text-[12px] font-black uppercase tracking-[0.2em] transition-colors ${ pathname === PATHS.HOME ? "text-purple-500" : "text-gray-400 hover:text-white"}`}>Trang chủ</Link>
            <div className="relative group" onMouseEnter={() => setActiveDropdown('genre')} onMouseLeave={() => setActiveDropdown(null)}>
              <button className={`flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.2em] transition-colors ${activeDropdown === 'genre' ? 'text-white' : 'text-gray-400'}`}>Thể loại <IoChevronDown className={`transition-transform duration-300 ${activeDropdown === 'genre' ? 'rotate-180' : ''}`} /></button>
              {activeDropdown === 'genre' && (
                <div className="absolute top-full left-[-200px] pt-4 w-[900px] animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="bg-[#0f172a]/98 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.8)] border-t-purple-500/30">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5 text-left"><IoGridOutline className="text-purple-500" size={18}/><span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Khám phá danh mục</span></div>
                    <div className="grid grid-cols-4 gap-x-6 gap-y-2 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar text-left">
                      {categories.map((cat) => (
                        <Link key={cat.categoryId} to={PATHS.GENRES.replace(":slug", cat.slug)} onClick={() => setActiveDropdown(null)} className="group/item flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-transparent transition-all duration-300">
                          <span className="text-[13px] font-bold text-gray-400 group-hover/item:text-white truncate uppercase tracking-tighter">{cat.name}</span>
                          <span className="opacity-0 group-hover/item:opacity-100 text-purple-400 text-xs transition-all translate-x-[-10px] group-hover/item:translate-x-0">→</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Link to={PATHS.SEARCH} className={`flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.2em] transition-colors ${pathname === PATHS.SEARCH ? 'text-purple-500' : 'text-gray-400 hover:text-white'}`}><IoSparklesOutline size={18} /> Tìm kiếm nâng cao</Link>
          </nav>
        </div>

        {/* SEARCH DESKTOP */}
        <div className="hidden lg:flex flex-1 max-w-lg relative mx-8">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-5 py-3 w-full focus-within:border-purple-500/50 transition-all shadow-inner text-left">
            <IoSearch className="text-gray-500 text-xl" />
            <input type="text" placeholder="Nhấn Enter để tìm kiếm..." className="bg-transparent border-none outline-none text-sm w-full text-white px-4 placeholder:text-gray-700 font-bold" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleKeyDown} />
          </div>
          {searchTerm && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
              {suggestions.map((story) => (
                <Link key={story.storyId} to={PATHS.STORY_DETAIL.replace(":slug", story.slug)} className="flex items-center gap-4 p-4 hover:bg-white/5 border-b border-white/5 last:border-none" onClick={() => setSearchTerm("")}>
                  <img src={story.thumbnail} className="w-12 h-16 object-cover rounded-lg shadow-lg" alt="thumb" />
                  <div className="min-w-0 text-left"><p className="text-sm font-bold text-white truncate">{story.title}</p>{story.genres?.length > 0 && <p className="text-xs text-purple-400 mt-1 truncate">{story.genres.join(" • ")}</p>}</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ICONS */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <button onClick={() => setActiveDropdown(activeDropdown === 'search_mobile' ? null : 'search_mobile')} className="lg:hidden p-3 text-gray-400 hover:text-white bg-white/5 rounded-xl transition-all"><IoSearch size={28} /></button>
          <button onClick={toggleTheme} className="p-3 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-all">{isDarkMode ? <IoSunnyOutline size={28} /> : <IoMoonOutline size={28} />}</button>
          {user ? (
            <div className="flex items-center gap-2 md:gap-4">
              <div className="relative">
                <button onClick={() => setActiveDropdown(activeDropdown === 'noti' ? null : 'noti')} className={`p-3 rounded-xl transition-all relative ${activeDropdown === 'noti' ? 'text-purple-400 bg-white/10' : 'text-gray-400 hover:text-white'}`}>
                  <IoNotificationsOutline size={28} />
                  {unreadCount > 0 && <span className="absolute top-2 right-2 w-5 h-5 bg-red-600 text-white text-[10px] font-black flex items-center justify-center rounded-lg border-2 border-[#0b0f1a] animate-pulse shadow-lg">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                </button>
                {/* TRUYỀN HÀM fetchUnreadCount XUỐNG DROP DOWN */}
                {activeDropdown === 'noti' && <NotificationDropdown onClose={() => setActiveDropdown(null)} onUpdateCount={fetchUnreadCount} />}
              </div>
              <button onClick={() => setActiveDropdown(activeDropdown === 'user' ? null : 'user')} className="hidden lg:block p-0.5 rounded-xl border border-white/10 hover:border-purple-500 transition-all shadow-lg"><img src={user.avatar || guestImg} className="w-12 h-12 rounded-lg object-cover" alt="avt" /></button>
              {activeDropdown === 'user' && (
                  <div className="absolute right-0 top-full mt-4 w-64 bg-[#111827] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95">
                    <div className="p-5 bg-gradient-to-br from-purple-600/10 to-blue-600/10 border-b border-white/5 text-left font-black text-white uppercase truncate tracking-widest text-xs">{user.username}</div>
                    <div className="p-2 flex flex-col gap-1">
                      <Link to={PATHS.PROFILE} className="flex items-center gap-4 px-4 py-3.5 text-[11px] font-black text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all uppercase" onClick={() => setActiveDropdown(null)}><IoPersonOutline size={20} /> Hồ sơ cá nhân</Link>
                      <Link to={PATHS.STUDIO_DASHBOARD} className="flex items-center gap-4 px-4 py-3.5 text-[11px] font-black text-purple-400 hover:text-purple-300 hover:bg-purple-500/5 rounded-xl transition-all uppercase" onClick={() => setActiveDropdown(null)}><IoColorPaletteOutline size={20} /> Studio Tác Giả</Link>
                      <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3.5 text-[11px] font-black text-red-500 hover:bg-red-500/5 rounded-xl transition-all uppercase border-t border-white/5"><IoLogOutOutline size={20} /> Đăng xuất</button>
                    </div>
                  </div>
                )}
            </div>
          ) : <Link to={PATHS.LOGIN} className="ml-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[11px] font-black uppercase rounded-2xl">Gia nhập</Link>}
        </div>
      </div>

      {/* MOBILE SEARCH OVERLAY (FIXED) */}
      {activeDropdown === 'search_mobile' && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#0b0f1a] p-4 border-b border-white/10 animate-in slide-in-from-top duration-300 shadow-2xl z-[150]">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <IoSearch className="text-gray-500 mr-3" />
            <input type="text" autoFocus placeholder="Gõ tên truyện..." className="bg-transparent border-none outline-none text-sm w-full text-white font-bold" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleKeyDown} />
            <IoCloseOutline size={28} className="text-gray-400" onClick={() => { setActiveDropdown(null); setSearchTerm(""); }} />
          </div>
          {searchTerm && suggestions.length > 0 && (
            <div className="mt-4 bg-[#111827] rounded-2xl border border-white/10 overflow-hidden max-h-[300px] overflow-y-auto">
              {suggestions.map(s => (
                <Link key={s.storyId} to={PATHS.STORY_DETAIL.replace(":slug", s.slug)} className="flex items-center gap-4 p-4 border-b border-white/5 last:border-none" onClick={() => { setActiveDropdown(null); setSearchTerm(""); }}>
                  <img src={s.thumbnail} className="w-12 h-16 object-cover rounded-lg" alt="" />
                  <div className="min-w-0 text-left"><p className="text-sm font-bold text-white truncate">{s.title}</p></div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && createPortal(
        <div className="fixed inset-0 z-[99999999] lg:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-[#0b0f1a] p-8 flex flex-col gap-10 animate-in slide-in-from-left duration-300 border-r border-white/5 shadow-2xl overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center border-b border-white/5 pb-8">
              <img src={logoImg} className="h-10" alt="Logo" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white transition-colors"><IoCloseOutline size={40} /></button>
            </div>
            <div className="flex flex-col gap-8 text-[14px] font-black uppercase text-gray-400 text-left">
              <Link to={PATHS.HOME} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 hover:text-purple-500 transition-colors"><IoHomeOutline size={24} /> Trang chủ</Link>
              <div className="space-y-4">
                <button onClick={() => setIsMobileGenreOpen(!isMobileGenreOpen)} className={`flex items-center justify-between w-full transition-colors ${isMobileGenreOpen ? 'text-purple-500' : 'hover:text-purple-500'}`}><span className="flex items-center gap-4"><IoOptionsOutline size={24} /> Thể loại</span><IoChevronDown className={`transition-transform duration-300 ${isMobileGenreOpen ? 'rotate-180' : ''}`} /></button>
                {isMobileGenreOpen && (
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 max-h-60 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                      {categories.map(cat => (<Link key={cat.categoryId} to={PATHS.GENRES.replace(":slug", cat.slug)} onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-black text-gray-500 hover:text-white truncate uppercase tracking-tighter text-left">{cat.name}</Link>))}
                    </div>
                  </div>
                )}
              </div>
              <Link to={PATHS.SEARCH} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 hover:text-purple-500 transition-colors"><IoSparklesOutline size={24} /> Tìm kiếm nâng cao</Link>
              {user && (
                <div className="border-t border-white/5 pt-8 flex flex-col gap-8 text-left">
                  <Link to={PATHS.PROFILE} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 hover:text-white transition-colors"><IoPersonOutline size={24} /> Hồ sơ cá nhân</Link>
                  <Link to={PATHS.STUDIO_DASHBOARD} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 hover:text-purple-400 transition-colors"><IoColorPaletteOutline size={24} /> Studio Tác Giả</Link>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-4 text-red-500 font-black uppercase tracking-widest transition-transform hover:translate-x-1"><IoLogOutOutline size={24} /> Đăng xuất</button>
                </div>
              )}
            </div>
            <div className="mt-auto opacity-10 text-center font-black italic text-2xl tracking-tighter border-t border-white/5 pt-6 uppercase">TRUYENVERSE</div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};

export default MainHeader;