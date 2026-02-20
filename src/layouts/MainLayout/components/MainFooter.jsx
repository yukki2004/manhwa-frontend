import React from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../../../routes/paths";
import logoImg from "../../../assets/truyenverse.png";
import { 
  IoLogoFacebook, IoLogoDiscord, IoMailOutline, 
  IoArrowUpOutline, IoShieldCheckmarkOutline, IoDocumentTextOutline, 
  IoInformationCircleOutline, IoPlanetOutline, IoSearchOutline 
} from "react-icons/io5";

const MainFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHardReload = (path) => {
    window.location.href = path;
  };

  return (
    <footer className="bg-[#0b0f1a] border-t border-white/5 text-gray-400 font-plus-jakarta relative overflow-hidden" role="contentinfo">
      {/* SEO Keywords ẩn: Tối ưu cho bot tìm kiếm */}
      <span className="sr-only">TruyenVerse Studio - Đọc truyện tranh online Manhwa, Manhua, cơ chế EXP, hệ thống đăng truyện chuyên nghiệp.</span>

      {/* Hiệu ứng hào quang Cosmic */}
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-600/5 blur-[160px] rounded-full -z-10" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* CỘT 1: THƯƠNG HIỆU & GIỚI THIỆU NGẮN */}
          <div className="space-y-8">
            <div 
              onClick={() => handleHardReload(PATHS.HOME)}
              className="inline-block cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <img 
                src={logoImg} 
                alt="TruyenVerse Studio - Đa vũ trụ truyện tranh" 
                className="h-14 w-auto object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]" 
                loading="lazy"
              />
            </div>
            <p className="text-sm leading-relaxed font-medium">
              <strong className="text-purple-500 font-black italic">TruyenVerse Studio</strong> — Nền tảng đọc truyện tối ưu hiệu năng với hệ thống <span className="text-white">tăng trưởng EXP</span> độc đáo và công nghệ hiển thị hiện đại dành cho cộng đồng yêu thích Manhwa.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.facebook.com/karuizawa.kei.856929?locale=vi_VN" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3.5 bg-white/5 rounded-2xl text-gray-400 hover:text-blue-500 hover:bg-white/10 transition-all shadow-xl"
                aria-label="Liên kết Facebook cá nhân"
              >
                <IoLogoFacebook size={22} />
              </a>
              <a href="#" className="p-3.5 bg-white/5 rounded-2xl text-gray-400 hover:text-indigo-500 hover:bg-white/10 transition-all shadow-xl" aria-label="Cộng đồng Discord"><IoLogoDiscord size={22} /></a>
              <a href="mailto:contact@truyenverse.com" className="p-3.5 bg-white/5 rounded-2xl text-gray-400 hover:text-purple-500 hover:bg-white/10 transition-all shadow-xl" aria-label="Email liên hệ"><IoMailOutline size={22} /></a>
            </div>
          </div>

          {/* CỘT 2: KHÁM PHÁ (ĐÃ BỔ SUNG ABOUT US) */}
          <div>
            <h3 className="text-white text-[13px] font-black uppercase tracking-[0.25em] mb-10 border-l-4 border-purple-600 pl-5">
              Vũ Trụ Truyện
            </h3>
            <ul className="space-y-5">
              <li>
                <button onClick={() => handleHardReload(PATHS.HOME)} className="text-[13px] font-bold uppercase tracking-wider text-gray-500 hover:text-purple-400 transition-colors flex items-center gap-3 italic">
                  <IoPlanetOutline size={18} /> Trang chủ
                </button>
              </li>
              <li>
                {/* Tích hợp Route About Us mới */}
                <Link to={PATHS.ABOUT} className="text-[13px] font-bold uppercase tracking-wider text-gray-500 hover:text-purple-400 transition-colors flex items-center gap-3 italic">
                  <IoInformationCircleOutline size={18} /> Giới thiệu Studio
                </Link>
              </li>
              <li>
                <Link to={PATHS.SEARCH} className="text-[13px] font-bold uppercase tracking-wider text-gray-500 hover:text-purple-400 transition-colors flex items-center gap-3 italic">
                  <IoSearchOutline size={18} /> Tìm kiếm nâng cao
                </Link>
              </li>
            </ul>
          </div>

          {/* CỘT 3: PHÁP LÝ */}
          <div>
            <h3 className="text-white text-[13px] font-black uppercase tracking-[0.25em] mb-10 border-l-4 border-purple-600 pl-5">
              Hành Lang Pháp Lý
            </h3>
            <ul className="space-y-5">
              <li>
                <Link to={PATHS.PRIVACY} className="text-[13px] font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors flex items-center gap-3 italic">
                  <IoShieldCheckmarkOutline size={18} /> Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to={PATHS.TERMS} className="text-[13px] font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors flex items-center gap-3 italic">
                  <IoDocumentTextOutline size={18} /> Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* CỘT 4: THÔNG BÁO BẢN QUYỀN */}
          <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 relative group shadow-2xl">
            <h3 className="text-white text-[12px] font-black uppercase tracking-[0.2em] mb-4">
              Copyright Notice
            </h3>
            <p className="text-[11px] text-gray-500 leading-loose font-medium italic">
              Nội dung được tổng hợp từ internet và đóng góp cộng đồng. Mọi vấn đề vi phạm bản quyền vui lòng liên hệ Email hỗ trợ để được xử lý trong 24h.
            </p>
            <div className="mt-4 pt-4 border-t border-white/5">
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">v1.0.4 • Stable Build</span>
            </div>
            
            {/* Nút Back-to-top */}
            <button 
              onClick={scrollToTop}
              className="absolute -top-7 right-8 p-4 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-2xl shadow-[0_10px_30px_rgba(168,85,247,0.4)] hover:-translate-y-2 transition-all active:scale-90"
              aria-label="Cuộn lên đầu trang"
            >
              <IoArrowUpOutline size={26} />
            </button>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[11px] font-black text-gray-600 uppercase tracking-[0.4em]">
            © 2026 <span className="text-purple-600">TruyenVerse Team</span>. All Rights Reserved.
          </p>
          <div className="flex items-center gap-8 opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <span className="text-[10px] font-black text-white uppercase tracking-widest italic">An Toàn Tuyệt Đối</span>
            <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Vận Hành 24/7</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;