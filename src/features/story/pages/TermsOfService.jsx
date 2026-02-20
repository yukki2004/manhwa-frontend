import React from "react";
import { IoDocumentTextOutline, IoCheckmarkCircleOutline, IoAlertCircleOutline, IoPlanetOutline } from "react-icons/io5";

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 font-plus-jakarta text-gray-400">
      {/* Header Page */}
      <div className="text-center mb-16">
        <div className="inline-block p-4 bg-blue-500/10 rounded-2xl text-blue-500 mb-6">
          <IoDocumentTextOutline size={40} />
        </div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">
          Điều khoản <span className="text-blue-500">Sử dụng</span>
        </h1>
        <p className="text-sm tracking-widest font-bold text-gray-500 uppercase">Cập nhật lần cuối: 12/02/2026</p>
      </div>

      <div className="space-y-8">
        {/* Khối chấp nhận điều khoản */}
        <div className="flex gap-6 items-start bg-blue-600/5 border border-blue-600/20 p-8 rounded-3xl">
          <IoCheckmarkCircleOutline className="text-blue-500 shrink-0" size={32} />
          <p className="text-white font-medium leading-relaxed">
            Bằng việc truy cập và sử dụng TruyenVerse Studio, bạn mặc nhiên đồng ý với các điều khoản dưới đây. Nếu không đồng ý, vui lòng ngừng sử dụng dịch vụ của chúng tôi.
          </p>
        </div>

        {/* Content sections */}
        <div className="grid grid-cols-1 gap-8">
          <section className="p-8 border-l-4 border-purple-600 bg-white/5 rounded-r-3xl">
            <h3 className="text-white font-black uppercase tracking-widest mb-4 flex items-center gap-3 text-lg">
              <IoPlanetOutline className="text-purple-500" /> Quyền sở hữu trí tuệ
            </h3>
            <p className="text-sm leading-loose">
              Tất cả các tác phẩm truyện tranh trên TruyenVerse được tổng hợp từ nhiều nguồn khác nhau. Chúng tôi luôn tôn trọng bản quyền của tác giả. Nếu bạn là chủ sở hữu bản quyền và yêu cầu gỡ bỏ, vui lòng gửi yêu cầu qua kênh hỗ trợ chính thức.
            </p>
          </section>

          <section className="p-8 border-l-4 border-blue-600 bg-white/5 rounded-r-3xl">
            <h3 className="text-white font-black uppercase tracking-widest mb-4 flex items-center gap-3 text-lg">
              <IoAlertCircleOutline className="text-blue-500" /> Trách nhiệm người dùng
            </h3>
            <ul className="list-disc pl-6 space-y-3 text-sm leading-relaxed">
              <li>Không sao chép, phân phối lại nội dung truyện tranh dưới bất kỳ hình thức nào mà không có sự đồng ý của Studio.</li>
              <li>Không sử dụng các công cụ tự động (crawl data) làm ảnh hưởng đến hiệu năng hệ thống đa vũ trụ của chúng tôi.</li>
              <li>Bình luận và tương tác một cách văn minh, không spam hoặc lan truyền nội dung độc hại.</li>
            </ul>
          </section>

          <section className="p-8 border-l-4 border-emerald-600 bg-white/5 rounded-r-3xl">
            <h3 className="text-white font-black uppercase tracking-widest mb-4 text-lg">Thay đổi dịch vụ</h3>
            <p className="text-sm leading-loose italic">
              TruyenVerse Studio có quyền thay đổi, tạm ngưng hoặc chấm dứt bất kỳ phần nào của dịch vụ vào bất kỳ lúc nào mà không cần thông báo trước để nâng cấp trải nghiệm người dùng tốt hơn.
            </p>
          </section>
        </div>
      </div>

      <div className="mt-20 p-8 text-center bg-white/5 rounded-3xl border border-white/5">
        <h4 className="text-white font-black uppercase tracking-widest mb-2">TruyenVerse Studio Team</h4>
        <p className="text-[11px] font-bold text-gray-600 uppercase tracking-[0.3em]">Hợp nhất trải nghiệm truyện tranh hiện đại</p>
      </div>
    </div>
  );
};

export default TermsOfService;