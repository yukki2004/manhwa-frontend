import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../authService";
import { PATHS } from "../../../routes/paths";

// Import logo chuẩn từ assets
import logoImg from "../../../assets/truyenverse.png";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Kiểm tra mật khẩu khớp nhau trước khi gọi API
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      // Gọi API Register đã định nghĩa
      await registerApi(formData.username, formData.email, formData.password);
      
      setSuccess("Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...");
      
      // Chờ 2 giây để người dùng đọc thông báo thành công rồi mới chuyển hướng
      setTimeout(() => {
        navigate(PATHS.LOGIN);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.Message || "Đăng ký thất bại. Email hoặc Username có thể đã tồn tại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-[#0f172a]/40 backdrop-blur-3xl border border-white/5 p-8 md:p-12 rounded-[3rem] shadow-[0_0_50px_-12px_rgba(139,92,246,0.3)] animate-in fade-in zoom-in duration-700">
      
      {/* KHU VỰC LOGO: Đồng nhất với LoginPage */}
      <div className="flex flex-col items-center mb-8 group">
        <Link to={PATHS.HOME} className="relative">
          <div className="absolute inset-0 bg-purple-500/20 blur-[40px] rounded-full group-hover:bg-purple-500/40 transition-all duration-500"></div>
          <img 
            src={logoImg} 
            alt="TruyenVerse" 
            className="h-20 md:h-24 w-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] group-hover:scale-110 transition-transform duration-500" 
          />
        </Link>
        <h2 className="mt-4 text-xl md:text-2xl font-black text-white tracking-[0.2em] uppercase italic text-center">
          Gia nhập <span className="text-purple-500">TruyenVerse</span>
        </h2>
      </div>

      {/* THÔNG BÁO LỖI/THÀNH CÔNG */}
      {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] p-3 rounded-xl mb-6 text-center font-bold uppercase tracking-widest animate-shake">{error}</div>}
      {success && <div className="bg-green-500/10 border border-green-500/50 text-green-400 text-[10px] p-3 rounded-xl mb-6 text-center font-bold uppercase tracking-widest">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          placeholder="Tên người dùng (Username)"
          className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-700"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          required
        />
        <input 
          type="email" 
          placeholder="Địa chỉ Email"
          className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-700"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <input 
          type="password" 
          placeholder="Mật khẩu"
          className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-700"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        <input 
          type="password" 
          placeholder="Xác nhận mật khẩu"
          className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-700"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          required
        />

        <button 
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 active:scale-95 text-white font-black py-4 rounded-2xl shadow-xl shadow-purple-600/20 transition-all disabled:opacity-50 tracking-widest mt-4"
        >
          {loading ? "ĐANG TẠO TÀI KHOẢN..." : "GIA NHẬP NGAY"}
        </button>
      </form>

      <p className="text-center text-gray-500 text-[11px] mt-8 font-bold uppercase tracking-widest">
        Đã có tài khoản? <Link to={PATHS.LOGIN} className="text-purple-400 hover:text-purple-300 transition-colors">Đăng nhập ngay</Link>
      </p>
    </div>
  );
};

export default RegisterPage;