import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import StudioHeader from "../features/studio/components/StudioHeader";

const StudioLayout = () => {
  const { loading } = useAuth();
  const { theme } = useTheme();

  // Kiểm tra trạng thái loading từ AuthContext
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a]">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#0b0f1a]' : 'bg-gray-50'}`}>
      
      {/* HEADER CHUẨN STUDIO */}
      <StudioHeader />

      {/* VÙNG NỘI DUNG CHÍNH (Full Width) */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-10 py-10">
        
        {/* Banner tiêu đề trang (Dùng chung cho các page studio) */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <Outlet />
        </div>

      </main>

      {/* FOOTER ĐƠN GIẢN (Tùy chọn) */}
      <footer className="py-6 border-t border-white/5 text-center">
        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">
          &copy; 2026 TruyenVerse Studio &bull; Nền tảng sáng tạo tối thượng
        </p>
      </footer>
    </div>
  );
};

export default StudioLayout;