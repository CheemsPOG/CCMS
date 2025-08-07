// Configuration page component
export default function Configuration() {
  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[#2d3748] text-[28px] font-normal leading-[33.6px] tracking-[-0.56px] mb-2">
          Cấu hình
        </h1>
        <p className="text-[#718096] text-[12px]">
          Quản lý cài đặt và cấu hình hệ thống
        </p>
      </div>

      {/* Placeholder content */}
      <div className="bg-white rounded-[15px] shadow-[0px_3.5px_5.5px_0px_rgba(0,0,0,0.02)] p-8">
        <div className="text-center text-gray-500">
          <h2 className="text-xl font-semibold mb-4">Trang Cấu hình</h2>
          <p className="text-sm">
            Các tùy chọn cấu hình sẽ được phát triển ở đây
          </p>
        </div>
      </div>
    </div>
  );
}
