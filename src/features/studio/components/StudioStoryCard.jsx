import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  IoPencilOutline, 
  IoEyeOffOutline, 
  IoTrashOutline, 
  IoCloudUploadOutline,
  IoAlertCircleOutline,
  IoStatsChartOutline
} from "react-icons/io5";
import { PATHS } from "../../../routes/paths";
import { 
  publishStoryApi, 
  hideStoryApi, 
  deleteStoryApi 
} from "../../story/storyService";
import { toast } from "react-toastify";

const StudioStoryCard = ({ story, onRefresh }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // MAPPING TRẠNG THÁI TỪ JSON
  // 0: Deleted, 1: Published, 2: Hidden
  const currentStatus = story.status; 

  // Hàm xử lý chung cho các API
  const handleAction = async (actionApi, successMsg, errorMsg) => {
    setIsProcessing(true);
    try {
      await actionApi(story.storyId);
      toast.success(successMsg);
      onRefresh(); // Cập nhật lại danh sách sau khi đổi trạng thái
    } catch (err) {
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatViews = (views) => {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + "M";
    if (views >= 1000) return (views / 1000).toFixed(1) + "K";
    return views;
  };

  // Cấu hình Badge dựa trên trạng thái
  const getStatusConfig = (status) => {
    switch (status) {
      case 1: return { text: "Đang Công Khai", color: "bg-green-500", shadow: "shadow-green-500/50" };
      case 2: return { text: "Đang Ẩn", color: "bg-orange-500", shadow: "shadow-orange-500/50" };
      case 0: return { text: "Đã Xóa", color: "bg-red-500", shadow: "shadow-red-500/50" };
      default: return { text: "Không rõ", color: "bg-gray-500", shadow: "shadow-gray-500/50" };
    }
  };

  const statusCfg = getStatusConfig(currentStatus);

  return (
    <div className={`group relative bg-[#111827]/60 backdrop-blur-2xl border border-white/5 rounded-[32px] p-5 flex items-center gap-6 transition-all hover:bg-white/5 shadow-2xl ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
      
      {/* THUMBNAIL */}
      <div className="relative shrink-0">
        <img 
          src={story.thumbnail} 
          alt={story.title} 
          className="w-20 h-28 md:w-24 md:h-32 object-cover rounded-2xl shadow-lg border border-white/10" 
        />
        {/* Cảnh báo nếu truyện bị Admin Khóa */}
        {story.adminLockStatus === 1 && (
          <div className="absolute inset-0 bg-red-900/60 rounded-2xl flex items-center justify-center backdrop-blur-[2px]">
            <IoAlertCircleOutline size={30} className="text-white animate-pulse" />
          </div>
        )}
      </div>

      {/* THÔNG TIN TRUYỆN */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-black text-white uppercase tracking-tight truncate mb-2">
          {story.title}
        </h3>
        
        <div className="flex flex-wrap items-center gap-4">
          {/* BADGE TRẠNG THÁI LUÔN HIỂN THỊ ĐÚNG THEO ENUM */}
          <span className={`px-3 py-1.5 ${statusCfg.color}/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/5`}>
            <span className={`w-2 h-2 rounded-full ${statusCfg.color} shadow-[0_0_10px] ${statusCfg.shadow}`} />
            {statusCfg.text}
          </span>
          
          <div className="flex items-center gap-3 text-[10px] text-gray-500 font-black uppercase tracking-tighter">
            <span className="flex items-center gap-1"><IoStatsChartOutline /> {formatViews(story.totalView)} Lượt xem</span>
            <span className="opacity-20">|</span>
            <span className="text-amber-500">Rating: {story.rateAvg?.toFixed(1) || "0.0"}</span>
          </div>
        </div>
      </div>

      {/* NHÓM 3 NÚT THAO TÁC + QUẢN LÝ */}
      <div className="flex items-center gap-2">
        
        {/* NÚT 1: PUBLISH HOẶC HIDE */}
        {currentStatus === 2 || currentStatus === 0 ? (
          <button 
            onClick={() => handleAction(publishStoryApi, "Đã công khai truyện!", "Lỗi công khai truyện.")}
            className="p-3 bg-green-600/10 rounded-2xl text-green-500 hover:bg-green-600 hover:text-white transition-all border border-green-500/20"
            title="Công khai tác phẩm"
          >
            <IoCloudUploadOutline size={22} />
          </button>
        ) : (
          <button 
            onClick={() => handleAction(hideStoryApi, "Đã ẩn truyện!", "Lỗi khi ẩn truyện.")}
            className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white transition-all border border-white/5"
            title="Tạm ẩn truyện"
          >
            <IoEyeOffOutline size={22} />
          </button>
        )}

        {/* NÚT 2: QUẢN LÝ CHI TIẾT (LUÔN CÓ) */}
        <button 
          onClick={() => navigate(PATHS.MANAGE_STORY.replace(":id", story.storyId))}
          className="p-3 bg-purple-600/10 rounded-2xl text-purple-400 hover:bg-purple-600 hover:text-white transition-all border border-purple-500/20"
          title="Chỉnh sửa chi tiết"
        >
          <IoPencilOutline size={22} />
        </button>

        {/* NÚT 3: XÓA (LUÔN CÓ) */}
        <button 
          onClick={() => {
            if(window.confirm(`Xóa vĩnh viễn truyện: ${story.title}?`)) 
              handleAction(deleteStoryApi, "Đã thực hiện lệnh xóa!", "Lỗi khi xóa truyện.");
          }}
          className="p-3 bg-red-600/10 rounded-2xl text-red-500 hover:bg-red-600 hover:text-white transition-all border border-red-500/20"
          title="Xóa truyện"
        >
          <IoTrashOutline size={22} />
        </button>
      </div>
    </div>
  );
};

export default StudioStoryCard;