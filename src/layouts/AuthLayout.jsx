import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-plus-jakarta">
      
      {/* LỚP 1: Các vì sao nhỏ (Cố định) */}
      <div className="absolute inset-0 z-0 opacity-30 stars-small"></div>
      
      {/* LỚP 2: Các vì sao vừa (Nhấp nháy chậm) */}
      <div className="absolute inset-0 z-0 opacity-50 stars-medium animate-pulse"></div>

      {/* LỚP 3: Các vì sao lớn (Lấp lánh mạnh) */}
      <div className="absolute inset-0 z-0 stars-large animate-twinkle"></div>

      {/* HIỆU ỨNG NEBULA (Dải ngân hà - Giữ của bạn nhưng tối ưu màu sắc) */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-purple-600/20 rounded-full blur-[140px] animate-nebula-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-600/20 rounded-full blur-[140px] animate-nebula-pulse-delay"></div>
      
      {/* Ánh sáng trung tâm giúp Form nổi bật */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px]"></div>

      <div className="relative z-10 w-full flex justify-center items-center">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;