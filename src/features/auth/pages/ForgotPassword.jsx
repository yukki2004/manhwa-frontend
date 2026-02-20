import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPasswordApi, verifyOtpApi, resetPasswordApi } from "../authService";
import { PATHS } from "../../../routes/paths";
import logoImg from "../../../assets/truyenverse.png";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });

  const handleApiError = (err) => {
    const message = err.response?.data?.Message || "Đã có lỗi xảy ra, vui lòng thử lại!";
    setError(message);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPasswordApi(email);
      setStep(2);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };


  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyOtpApi(email, otp);
      setStep(3);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };


  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await resetPasswordApi(email, passwords.newPassword, otp, passwords.confirmPassword);
      alert("Đổi mật khẩu thành công! Hãy đăng nhập lại.");
      navigate(PATHS.LOGIN);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-[#0f172a]/40 backdrop-blur-3xl border border-white/5 p-8 md:p-12 rounded-[3rem] shadow-[0_0_50px_-12px_rgba(139,92,246,0.3)] animate-in fade-in zoom-in duration-700">
      
      <div className="flex flex-col items-center mb-10 group">
        <Link to={PATHS.HOME} className="relative">
          <div className="absolute inset-0 bg-purple-500/20 blur-[40px] rounded-full group-hover:bg-purple-500/40 transition-all"></div>
          <img src={logoImg} alt="TruyenVerse" className="h-20 md:h-24 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
        </Link>
        <h2 className="mt-4 text-xl font-black text-white tracking-[0.2em] uppercase italic">
          Khôi phục <span className="text-purple-500">Mật khẩu</span>
        </h2>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] p-3 rounded-xl mb-6 text-center font-bold uppercase tracking-widest animate-shake">
          {error}
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-6">
          <p className="text-gray-400 text-xs text-center leading-relaxed">Nhập email của bạn, chúng tôi sẽ gửi mã OTP đa vũ trụ để khôi phục quyền truy cập.</p>
          <input 
            type="email" 
            placeholder="Địa chỉ Email"
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-purple-500 outline-none transition-all placeholder:text-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-purple-600/20 transition-all active:scale-95 disabled:opacity-50 tracking-widest">
            {loading ? "ĐANG GỬI..." : "GỬI MÃ XÁC NHẬN"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <p className="text-gray-400 text-xs text-center leading-relaxed">Mã OTP đã được gửi đến <span className="text-white font-bold">{email}</span>. Vui lòng kiểm tra hộp thư.</p>
          <input 
            type="text" 
            placeholder="Nhập 6 chữ số mã OTP"
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-center text-2xl font-black text-purple-400 tracking-[0.5em] focus:border-purple-500 outline-none transition-all"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-purple-600/20 transition-all active:scale-95 disabled:opacity-50 tracking-widest">
            {loading ? "ĐANG XÁC THỰC..." : "XÁC NHẬN MÃ"}
          </button>
          <div className="text-center">
            <button type="button" onClick={() => setStep(1)} className="text-[10px] text-gray-500 hover:text-white uppercase font-bold transition-colors">Đổi email khác</button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <p className="text-gray-400 text-xs text-center leading-relaxed mb-4">Mã xác thực chính xác! Hãy thiết lập mật khẩu mới an toàn hơn.</p>
          <input 
            type="password" 
            placeholder="Mật khẩu mới"
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-purple-500 outline-none transition-all"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
            required
          />
          <input 
            type="password" 
            placeholder="Xác nhận mật khẩu mới"
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-purple-500 outline-none transition-all"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
            required
          />
          <button disabled={loading} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-green-600/20 transition-all active:scale-95 disabled:opacity-50 tracking-widest">
            {loading ? "ĐANG LƯU..." : "CẬP NHẬT MẬT KHẨU"}
          </button>
        </form>
      )}

      <div className="mt-10 text-center">
        <Link to={PATHS.LOGIN} className="text-gray-500 text-[11px] font-bold uppercase hover:text-purple-400 transition-colors"> Quay lại đăng nhập </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;