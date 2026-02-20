import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getMyProfileApi, updateDescriptionApi, updateAvatarApi,
  getFavoritesApi, getHistoriesApi
} from "../profileService";

import { PATHS } from "../../../routes/paths";
import StoryCard from "../../story/components/StoryCard";
import HistoryCard from "../../story/components/HistoryCard";
import Pagination from "../../../components/common/Pagination";

import {
  IoCameraOutline, IoSettingsOutline, IoLockOpenOutline,
  IoHeartOutline, IoTimeOutline, IoMailOutline, IoLogoGoogle, 
  IoShieldCheckmarkOutline, IoCalendarOutline, IoPersonOutline, 
  IoFlashOutline, IoFingerPrintOutline
} from "react-icons/io5";

import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState({ items: [], totalPages: 0, pageIndex: 1 });
  const [histories, setHistories] = useState({ items: [], totalPages: 0, pageIndex: 1 });
  const [activeTab, setActiveTab] = useState("favorites");
  const [isEditing, setIsEditing] = useState(false);
  const [newDesc, setNewDesc] = useState("");
  const [loading, setLoading] = useState(true);

  const PAGE_SIZE = 10;

  const fetchFavorites = async (uid, page) => {
    try {
      const res = await getFavoritesApi(uid, page, PAGE_SIZE);
      setFavorites(res);
    } catch { toast.error("Lỗi tải danh sách yêu thích"); }
  };

  const fetchHistories = async (uid, page) => {
    try {
      const res = await getHistoriesApi(uid, page, PAGE_SIZE);
      setHistories(res);
    } catch { toast.error("Lỗi tải lịch sử đọc"); }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getMyProfileApi();
      setUser(res);
      setNewDesc(res.description || "");
      await Promise.all([
        fetchFavorites(res.userId, 1),
        fetchHistories(res.userId, 1)
      ]);
    } catch { toast.error("Lỗi tải hồ sơ"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleUpdateAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("File", file);
    try {
      await updateAvatarApi(formData);
      toast.success("Cập nhật ảnh thành công!");
      fetchProfile();
    } catch { toast.error("Cập nhật ảnh thất bại"); }
  };

  const handleSaveDesc = async () => {
    try {
      await updateDescriptionApi(newDesc);
      setUser(prev => ({ ...prev, description: newDesc }));
      setIsEditing(false);
      toast.success("Đã lưu mô tả");
    } catch { toast.error("Không thể lưu mô tả"); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-purple-500 font-bold italic">VŨ TRỤ ĐANG TẢI...</div>;
  if (!user) return null;

  // Format ngày gia nhập
  const joinDate = new Date(user.createAt).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  return (
    <div className="max-w-[1400px] mx-auto py-8 md:py-16 px-4 md:px-8 font-plus-jakarta">
      
      {/* --- USER CARD (CLEAN & DETAILED) --- */}
      <div className="bg-[#111827]/60 border border-white/5 rounded-[32px] p-6 md:p-10 mb-12 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Decor icon mờ ở nền */}
        <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12 translate-x-1/4 -translate-y-1/4 pointer-events-none">
            <IoFingerPrintOutline size={300} />
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 relative z-10">
          
          {/* Avatar Area */}
          <div className="relative group shrink-0">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-purple-500 shadow-2xl">
              <img 
                src={user.avatar || "/default-avatar.png"} 
                className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" 
                alt="profile" 
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <IoCameraOutline size={32} className="text-white" />
                <input type="file" className="hidden" onChange={handleUpdateAvatar} accept="image/*" />
              </label>
            </div>
          </div>

          {/* Main Info Section */}
          <div className="flex-1 text-center md:text-left space-y-6 w-full">
            <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">{user.username}</h1>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 text-purple-400 text-[10px] font-bold rounded-lg uppercase flex items-center gap-1">
                            <IoFlashOutline /> Level {user.level}
                        </span>
                        {/* Quyền hạn: 0 Admin, 1 User */}
                        <span className={`px-3 py-1 border text-[10px] font-bold rounded-lg uppercase flex items-center gap-1 ${
                            user.role === 0 
                            ? "bg-red-600/20 border-red-500/30 text-red-400" 
                            : "bg-blue-600/20 border-blue-500/30 text-blue-400"
                        }`}>
                            <IoPersonOutline /> {user.role === 0 ? "Quản trị viên" : "Thành viên"}
                        </span>
                    </div>
                </div>

                {/* Account Details Row */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-xs text-gray-400 font-medium">
                    <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                        <IoMailOutline size={16} className="text-gray-500" /> {user.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <IoCalendarOutline size={16} className="text-gray-500" /> Gia nhập: {joinDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                        {/* Login Type */}
                        {user.loginType === 1 
                            ? <><IoLogoGoogle className="text-red-500" /> Đăng nhập Google</> 
                            : <><IoShieldCheckmarkOutline className="text-green-500" /> Tài khoản Local</>
                        }
                    </span>
                    <span className="flex items-center gap-1.5">
                        {/* Trạng thái */}
                        <div className={`w-2 h-2 rounded-full ${user.isActive ? "bg-green-500" : "bg-red-500"}`}></div>
                        {user.isActive ? "Đã kích hoạt" : "Bị khóa"}
                    </span>
                </div>
            </div>

            <p className="text-gray-400 italic text-sm md:text-base leading-relaxed max-w-2xl bg-white/5 p-4 rounded-2xl border border-white/5">
              "{user.description || "Nhà du hành này vẫn đang giữ bí mật về bản thân..."}"
            </p>

            {/* EXP Bar */}
            <div className="w-full max-w-md space-y-2 mx-auto md:mx-0">
              <div className="flex justify-between text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                <span>Trải nghiệm (EXP)</span>
                <span>{user.currentExp} / 2000</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]" 
                    style={{ width: `${(user.currentExp/2000)*100}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex md:flex-col gap-3 shrink-0">
             <button onClick={() => setIsEditing(true)} className="p-4 bg-white/5 rounded-2xl text-gray-400 hover:text-white border border-white/5 hover:border-purple-500/40 transition-all flex items-center gap-2" title="Sửa tiểu sử">
                <IoSettingsOutline size={24} /> <span className="md:hidden text-xs font-bold">Chỉnh sửa</span>
             </button>
             <Link to={PATHS.FORGOT_PASSWORD} className="p-4 bg-white/5 rounded-2xl text-gray-400 hover:text-white border border-white/5 hover:border-blue-500/40 transition-all flex items-center gap-2" title="Đổi mật khẩu">
                <IoLockOpenOutline size={24} /> <span className="md:hidden text-xs font-bold">Bảo mật</span>
             </Link>
          </div>
        </div>
      </div>

      {/* --- TABS --- */}
      <div className="flex gap-10 mb-8 border-b border-white/5">
        <button onClick={() => setActiveTab("favorites")} className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === 'favorites' ? 'text-purple-500' : 'text-gray-500 hover:text-gray-300'}`}>
          Yêu thích
          {activeTab === 'favorites' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />}
        </button>
        <button onClick={() => setActiveTab("history")} className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === 'history' ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'}`}>
          Lịch sử đọc
          {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
        </button>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="min-h-[400px]">
        {activeTab === "favorites" ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {favorites?.items?.map(s => <StoryCard key={s.storyId} story={s} />)}
            </div>
            <Pagination pageIndex={favorites.pageIndex} totalPages={favorites.totalPages} onPageChange={(p) => fetchFavorites(user.userId, p)} />
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {histories?.items?.map(h => <HistoryCard key={h.storyId} item={h} />)}
            </div>
            <Pagination pageIndex={histories.pageIndex} totalPages={histories.totalPages} onPageChange={(p) => fetchHistories(user.userId, p)} />
          </>
        )}
      </div>

      {/* --- MODAL --- */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/80">
          <div className="bg-[#111827] border border-white/10 p-8 rounded-[32px] w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Chỉnh sửa mô tả</h2>
            <textarea 
              className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-purple-500 transition-all resize-none"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Nhập giới thiệu bản thân..."
            />
            <div className="flex gap-3 mt-6">
              <button onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-white/5 text-gray-500 font-bold rounded-xl text-xs hover:bg-white/10">HỦY</button>
              <button onClick={handleSaveDesc} className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl text-xs hover:bg-purple-500">LƯU</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;