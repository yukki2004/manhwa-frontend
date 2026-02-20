import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { PATHS } from "../../../routes/paths";
import logoImg from "../../../assets/truyenverse.png";
import guestImg from "../../../assets/guest.png";
import { IoHelpCircleOutline, IoRocketOutline } from "react-icons/io5";

const StudioHeader = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 w-full z-[100] bg-[#0b0f1a]/90 backdrop-blur-xl border-b border-white/5 h-16 md:h-20 flex items-center shadow-2xl font-plus-jakarta">
      <div className="max-w-[1600px] mx-auto w-full px-6 md:px-10 flex items-center justify-between">
        
        {/* KHỐI TRÁI: LOGO STUDIO */}
        <div className="flex items-center gap-4">
          <Link to={PATHS.HOME} className="shrink-0 flex items-center">
            <img 
              src={logoImg} 
              alt="TruyenVerse" 
              className="h-8 md:h-10 w-auto object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]" 
            />
          </Link>
          <div className="h-6 w-[1px] bg-white/10 hidden md:block" />
          <Link to={PATHS.STUDIO_DASHBOARD} className="flex items-center gap-2 group">
            <span className="text-[14px] md:text-[16px] font-black uppercase tracking-[0.3em] text-white group-hover:text-purple-400 transition-colors">
              STUDIO
            </span>
            <IoRocketOutline className="text-purple-500 group-hover:animate-bounce transition-all" size={18} />
          </Link>
        </div>

        {/* KHỐI PHẢI: HỖ TRỢ & USER */}
        <div className="flex items-center gap-6">

          <div className="flex items-center gap-3 pl-6 border-l border-white/5">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-black text-white uppercase truncate max-w-[120px]">
                {user?.fullName || user?.username || "Tác giả"}
              </span>
              <span className="text-[9px] text-purple-500 font-black uppercase tracking-widest italic">
                Creator Mode
              </span>
            </div>
            
            <Link to={PATHS.PROFILE} className="p-0.5 rounded-xl border border-white/10 hover:border-purple-500 transition-all shadow-lg">
              <img 
                src={user?.avatar || guestImg} 
                className="w-10 h-10 md:w-11 md:h-11 rounded-lg object-cover" 
                alt="avt" 
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudioHeader;