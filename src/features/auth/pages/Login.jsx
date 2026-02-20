import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../../context/AuthContext"; 
import { loginApi, googleLoginApi } from "../authService"; 
import { getMyProfileApi } from "../../profile/profileService"; 
import { PATHS } from "../../../routes/paths";

import logoImg from "../../../assets/truyenverse.png";

const LoginPage = () => {
  const { setUser } = useAuth(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ identifier: "", password: "" });

  const onLoginSuccess = async () => {
    try {
      const profileData = await getMyProfileApi();
      setUser(profileData); 
      navigate(PATHS.HOME);
    } catch (err) {
      console.error("Lỗi đồng bộ profile:", err);
      setError("Đăng nhập thành công nhưng không thể tải hồ sơ. Vui lòng thử lại!");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError("");
      await googleLoginApi(credentialResponse.credential);
      await onLoginSuccess();
    } catch (err) {
      setError("Đăng nhập Google thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await loginApi(formData.identifier, formData.password);
      await onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.Message || "Thông tin không chính xác");
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="w-full max-w-[440px] bg-[#0f172a]/40 backdrop-blur-3xl border border-white/5 p-8 md:p-12 rounded-[3rem] shadow-[0_0_50px_-12px_rgba(139,92,246,0.3)] animate-in fade-in zoom-in duration-700">
      
      {/* KHU VỰC LOGO: Đã tăng size và thêm hiệu ứng Glow */}
      <div className="flex flex-col items-center mb-10 group">
        <Link to={PATHS.HOME} className="relative">
          {/* Lớp hào quang phía sau logo */}
          <div className="absolute inset-0 bg-purple-500/20 blur-[40px] rounded-full group-hover:bg-purple-500/40 transition-all duration-500"></div>
          
          <img 
            src={logoImg} 
            alt="TruyenVerse" 
            className="h-24 md:h-32 w-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] group-hover:scale-110 transition-transform duration-500" 
          />
        </Link>
        
        {/* Tên Studio: Tinh chỉnh lại font và khoảng cách */}
        <h2 className="mt-4 text-2xl md:text-3xl font-black text-white tracking-[0.2em] uppercase italic">
          Truyen<span className="text-purple-500">Verse</span>
          <span className="block text-[10px] tracking-[0.8em] text-gray-500 not-italic mt-1 font-bold">STUDIO</span>
        </h2>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] p-3 rounded-xl mb-6 text-center font-bold uppercase tracking-widest animate-shake">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <input 
          type="text" 
          placeholder="Username hoặc Email"
          className="w-full bg-[#0b0f1a]/80 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-600"
          value={formData.identifier}
          onChange={(e) => setFormData({...formData, identifier: e.target.value})}
          required
        />
        <input 
          type="password" 
          placeholder="Mật khẩu"
          className="w-full bg-[#0b0f1a]/80 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-600"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />

        <div className="flex justify-end pr-2">
          <Link to={PATHS.FORGOT_PASSWORD} className="text-[10px] text-gray-500 hover:text-purple-400 font-bold uppercase tracking-widest">
            Quên mật khẩu?
          </Link>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 active:scale-95 text-white font-black py-4 rounded-2xl shadow-xl shadow-purple-600/20 transition-all disabled:opacity-50 tracking-widest"
        >
          {loading ? "ĐANG KẾT NỐI..." : "ĐĂNG NHẬP"}
        </button>
      </form>

      <div className="relative my-8 text-center">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
        <span className="relative bg-[#1a2235] px-4 text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Hoặc</span>
      </div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Lỗi kết nối Google!")}
          theme="filled_black"
          shape="pill"
          width="100%"
          useOneTap
        />
      </div>

      <p className="text-center text-gray-500 text-[11px] mt-10 font-bold uppercase tracking-widest">
        Bạn là lính mới? <Link to={PATHS.REGISTER} className="text-purple-400 hover:text-purple-300 transition-colors">Gia nhập ngay</Link>
      </p>
    </div>
  );
};

export default LoginPage;