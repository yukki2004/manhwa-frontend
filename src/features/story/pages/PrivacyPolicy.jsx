import React from "react";
import { IoShieldCheckmarkOutline, IoLockClosedOutline, IoEyeOutline, IoCloudOutline } from "react-icons/io5";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 font-plus-jakarta text-gray-400">
      {/* Header Page */}
      <div className="text-center mb-16">
        <div className="inline-block p-4 bg-purple-500/10 rounded-2xl text-purple-500 mb-6">
          <IoShieldCheckmarkOutline size={40} />
        </div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">
          Chính sách <span className="text-purple-500">Bảo mật</span>
        </h1>
        <p className="text-sm tracking-widest font-bold text-gray-500 uppercase">Cập nhật lần cuối: 12/02/2026</p>
      </div>

      <div className="space-y-12">
        {/* Section 1 */}
        <section className="bg-white/5 border border-white/5 p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5"><IoLockClosedOutline size={80} /></div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm">01</span>
            Thu thập thông tin
          </h2>
          <p className="leading-relaxed mb-4">
            TruyenVerse Studio thu thập thông tin để cung cấp trải nghiệm đọc truyện tốt hơn cho bạn. Các loại thông tin bao gồm:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Thông tin tài khoản: Email, tên hiển thị và ảnh đại diện khi bạn đăng ký thành viên.</li>
            <li>Dữ liệu sử dụng: Lịch sử đọc truyện, danh sách theo dõi và các tương tác trong vũ trụ truyện tranh.</li>
            <li>Thông tin kỹ thuật: Địa chỉ IP, loại trình duyệt và thông số thiết bị để tối ưu hóa hiệu năng hiển thị.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="bg-white/5 border border-white/5 p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5"><IoEyeOutline size={80} /></div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm">02</span>
            Sử dụng thông tin
          </h2>
          <p className="leading-relaxed">
            Chúng tôi cam kết sử dụng thông tin của bạn vào các mục đích chính đáng:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm">
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">Duy trì và cá nhân hóa trải nghiệm đọc truyện đa vũ trụ.</div>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">Gửi thông báo về chương mới của các bộ truyện bạn đang theo dõi.</div>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">Phát hiện và ngăn chặn các hành vi xâm nhập trái phép hoặc vi phạm bản quyền.</div>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">Phân tích dữ liệu để không ngừng nâng cấp giao diện Studio.</div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-white/5 border border-white/5 p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5"><IoCloudOutline size={80} /></div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm">03</span>
            Bảo mật dữ liệu
          </h2>
          <p className="leading-relaxed">
            Dữ liệu của bạn được lưu trữ trên hệ thống máy chủ hiện đại với công nghệ mã hóa chuẩn ngành. TruyenVerse Studio cam kết không bán, trao đổi hoặc chia sẻ dữ liệu cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích thương mại.
          </p>
        </section>
      </div>

      <div className="mt-20 p-8 text-center border-t border-white/5">
        <p className="text-sm font-bold italic text-gray-600">
          Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ: 
          <span className="text-purple-500 ml-2">privacy@truyenverse.com</span>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;