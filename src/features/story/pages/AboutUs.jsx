import React from "react";
import { 
  IoPlanetOutline, IoRocketOutline, IoLayersOutline, 
  IoFlashOutline, IoStatsChartOutline, IoColorPaletteOutline, 
  IoNotificationsCircleOutline, IoShieldCheckmarkOutline 
} from "react-icons/io5";
import logoImg from "../../../assets/truyenverse.png";

const AboutUs = () => {
  return (
    <div className="max-w-7xl mx-auto py-16 px-6 font-plus-jakarta text-gray-400">
      
      {/* 1. HERO SECTION: KHẲNG ĐỊNH VỊ THẾ STUDIO */}
      <div className="text-center mb-28 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full -z-10" />
        <img 
          src={logoImg} 
          alt="TruyenVerse Logo" 
          className="h-28 md:h-36 mx-auto mb-10 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-transform hover:scale-110 duration-500" 
        />
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8">
          Vũ Trụ <span className="text-purple-500">TruyenVerse</span>
        </h1>
        <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-bold text-gray-300 italic">
          "Nơi mỗi chương truyện là một cuộc hành trình, nơi mỗi độc giả là một nhà du hành không giới hạn."
        </p>
      </div>

      {/* 2. HỆ SINH THÁI ĐỘC GIẢ (READERS) */}
      <section className="mb-32">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-1 w-20 bg-purple-600" />
          <h2 className="text-3xl font-black text-white uppercase tracking-widest">Trải Nghiệm Độc Giả</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 p-10 rounded-[32px] hover:bg-white/[0.08] transition-all group">
            <IoFlashOutline size={40} className="text-purple-500 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-black text-white uppercase mb-4 tracking-wider">Giao Diện Đọc Tối Ưu</h3>
            <p className="leading-loose text-sm font-medium">
              Hệ thống trình đọc được tùy chỉnh riêng biệt cho cả máy tính và điện thoại. 
              Công nghệ tải ảnh thông minh giúp bạn lướt qua hàng nghìn trang truyện manhwa/manhua 
              mà không gặp tình trạng giật lag hay chờ đợi.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-10 rounded-[32px] hover:bg-white/[0.08] transition-all group border-l-purple-500/50">
            <IoLayersOutline size={40} className="text-purple-500 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-black text-white uppercase mb-4 tracking-wider">Cá Nhân Hóa Đa Vũ Trụ</h3>
            <p className="leading-loose text-sm font-medium">
              Lưu trữ lịch sử du hành, quản lý danh sách theo dõi và nhận đề xuất truyện 
              dựa trên sở thích cá nhân. Mỗi tài khoản là một căn cứ riêng biệt trong vũ trụ TruyenVerse.
            </p>
          </div>
        </div>
      </section>

      {/* 3. HỆ THỐNG EXP & CẤP ĐỘ (GAMIFICATION) */}
      <section className="mb-32 bg-gradient-to-r from-purple-900/10 to-transparent p-1 md:p-12 rounded-[40px] border border-white/5">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 p-6">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
              Cơ Chế <span className="text-purple-500">Tăng Trưởng EXP</span>
            </h2>
            <p className="text-lg leading-relaxed font-bold text-gray-300">
              Tại TruyenVerse, sự tương tác của bạn được đền đáp bằng sức mạnh.
            </p>
            <div className="space-y-6">
              <div className="flex gap-5 items-start">
                <div className="p-3 bg-purple-600 rounded-2xl shadow-lg shadow-purple-600/20"><IoStatsChartOutline size={24} className="text-white" /></div>
                <div>
                  <h4 className="text-white font-black uppercase tracking-widest text-sm">Hệ thống Cấp độ (Level)</h4>
                  <p className="text-xs mt-2 leading-relaxed">Mỗi trang truyện bạn đọc, mỗi bình luận bạn để lại đều tích lũy điểm EXP. Cấp độ càng cao, đặc quyền trong vũ trụ càng lớn.</p>
                </div>
              </div>
              <div className="flex gap-5 items-start">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20"><IoNotificationsCircleOutline size={24} className="text-white" /></div>
                <div>
                  <h4 className="text-white font-black uppercase tracking-widest text-sm">Thông Báo Thời Gian Thực</h4>
                  <p className="text-xs mt-2 leading-relaxed">Không bao giờ bỏ lỡ một khoảnh khắc nào. Hệ thống thông báo tự động cập nhật ngay khi truyện có chương mới hoặc có tương tác từ cộng đồng.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 p-4">
             <div className="bg-[#111827] border border-white/5 p-8 rounded-3xl text-center shadow-2xl">
                <span className="text-4xl font-black text-purple-500">4K+</span>
                <p className="text-[10px] font-black text-gray-500 uppercase mt-2 tracking-widest">Tác phẩm</p>
             </div>
             <div className="bg-[#111827] border border-white/5 p-8 rounded-3xl text-center shadow-2xl translate-y-8">
                <span className="text-4xl font-black text-blue-500">24/7</span>
                <p className="text-[10px] font-black text-gray-500 uppercase mt-2 tracking-widest">Vận hành</p>
             </div>
             <div className="bg-[#111827] border border-white/5 p-8 rounded-3xl text-center shadow-2xl">
                <span className="text-4xl font-black text-emerald-500">STUDIO</span>
                <p className="text-[10px] font-black text-gray-500 uppercase mt-2 tracking-widest">Sáng tạo</p>
             </div>
             <div className="bg-[#111827] border border-white/5 p-8 rounded-3xl text-center shadow-2xl translate-y-8">
                <span className="text-4xl font-black text-amber-500">LVL UP</span>
                <p className="text-[10px] font-black text-gray-500 uppercase mt-2 tracking-widest">Cơ chế EXP</p>
             </div>
          </div>
        </div>
      </section>

      {/* 4. STUDIO TÁC GIẢ (CREATORS) */}
      <section className="mb-32">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-1 w-20 bg-emerald-500" />
          <h2 className="text-3xl font-black text-white uppercase tracking-widest">Studio Tác Giả</h2>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-16 relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full group-hover:bg-emerald-500/20 transition-all" />
          
          <div className="grid lg:grid-cols-3 gap-12 relative z-10">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Công cụ đăng truyện <span className="text-emerald-400 font-black italic">Chuyên Nghiệp</span></h3>
              <p className="text-sm leading-loose font-medium text-gray-300">
                Chúng tôi cung cấp một bảng điều khiển (Dashboard) mạnh mẽ dành riêng cho người sáng tác. 
                Bạn có thể dễ dàng tải lên các chương truyện, quản lý danh sách tác phẩm, và theo dõi số liệu 
                tương tác của độc giả một cách chi tiết nhất. TruyenVerse đồng hành cùng bạn trên con đường 
                xây dựng thương hiệu tác giả cá nhân.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <span className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] font-black text-emerald-400 uppercase tracking-widest">Quản lý chương</span>
                <span className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] font-black text-emerald-400 uppercase tracking-widest">Thống kê đọc</span>
                <span className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] font-black text-emerald-400 uppercase tracking-widest">Tương tác Fan</span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="p-10 bg-emerald-500 rounded-[40px] shadow-[0_20px_50px_rgba(16,185,129,0.3)] rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <IoColorPaletteOutline size={80} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TẦM NHÌN CÔNG NGHỆ */}
      <section className="text-center py-20 border-y border-white/5 relative">
        <h2 className="text-white text-xs font-black uppercase tracking-[0.5em] mb-10">Nền Tảng Công Nghệ</h2>
        <div className="flex flex-wrap justify-center gap-16 md:gap-32 opacity-40 hover:opacity-100 transition-opacity">
          <div className="flex flex-col items-center gap-4">
            <IoRocketOutline size={40} />
            <span className="text-[10px] font-black uppercase tracking-widest">High Performance</span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <IoShieldCheckmarkOutline size={40} />
            <span className="text-[10px] font-black uppercase tracking-widest">Secure System</span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <IoPlanetOutline size={40} />
            <span className="text-[10px] font-black uppercase tracking-widest">Scalable Infra</span>
          </div>
        </div>
      </section>

      {/* FOOTER ABOUT */}
      <div className="mt-24 text-center">
        <p className="text-[11px] font-bold text-gray-600 uppercase tracking-[0.4em] mb-4">Established 2026 • TruyenVerse Studio Team</p>
        <div className="h-1 w-20 bg-purple-600 mx-auto" />
      </div>
    </div>
  );
};

export default AboutUs;