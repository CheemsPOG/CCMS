import { useState } from "react";
import { Search, Calendar, Download } from "lucide-react";
import MDOutlinePlayArrow from "../components/ui/md-outline-play-arrow";
import MdOutlineGeneratingTokens from "../components/ui/md-outline-generating-tokens";

// Call history data
const callHistoryData = [
  {
    phoneNumber: "0987 654 321",
    dateTime: "15/05/2024 11:20",
    duration: "00:08:15",
    receiver: "minh.vu",
    summary: "Khách hàng cần hỗ trợ kỹ thuật về kết nối mạng.",
  },
  {
    phoneNumber: "0378 123 456",
    dateTime: "15/05/2024 10:45",
    duration: "00:02:30",
    receiver: "linh.nguyen",
    summary: "Hỏi về thủ tục đăng ký dịch vụ mới.",
  },
  {
    phoneNumber: "0865 555 789",
    dateTime: "14/05/2024 17:12",
    duration: "00:12:45",
    receiver: "tuan.tran",
    summary: "Phản ánh về thái độ phục vụ của nhân viên.",
  },
  {
    phoneNumber: "0599 888 111",
    dateTime: "14/05/2024 15:05",
    duration: "00:06:22",
    receiver: "minh.vu",
    summary: "Yêu cầu thay đổi gói cước hiện tại.",
  },
  {
    phoneNumber: "0707 234 567",
    dateTime: "13/05/2024 14:30",
    duration: "00:05:55",
    receiver: "phuong.ho",
    summary: "Thắc mắc về hóa đơn cước tháng trước.",
  },
  {
    phoneNumber: "0918 765 432",
    dateTime: "13/05/2024 11:11",
    duration: "00:09:03",
    receiver: "tuan.tran",
    summary: "Góp ý về việc cải thiện chất lượng ứng dụng.",
  },
  {
    phoneNumber: "0333 456 789",
    dateTime: "13/05/2024 09:50",
    duration: "00:03:18",
    receiver: "linh.nguyen",
    summary: "Xác nhận thông tin về chương trình giảm giá.",
  },
  {
    phoneNumber: "0888 999 000",
    dateTime: "12/05/2024 16:45",
    duration: "00:15:01",
    receiver: "minh.vu",
    summary: "Khiếu nại về việc giao hàng chậm trễ.",
  },
  {
    phoneNumber: "0945 111 222",
    dateTime: "12/05/2024 14:20",
    duration: "00:04:44",
    receiver: "phuong.ho",
    summary: "Hủy dịch vụ và yêu cầu hoàn tiền.",
  },
  {
    phoneNumber: "0777 333 444",
    dateTime: "12/05/2024 10:05",
    duration: "00:07:39",
    receiver: "tuan.tran",
    summary: "Tư vấn về sản phẩm mới ra mắt.",
  },
  {
    phoneNumber: "0966 777 888",
    dateTime: "11/05/2024 16:30",
    duration: "00:11:22",
    receiver: "linh.nguyen",
    summary: "Khiếu nại về chất lượng sản phẩm đã mua.",
  },
  {
    phoneNumber: "0844 555 666",
    dateTime: "11/05/2024 14:15",
    duration: "00:05:33",
    receiver: "minh.vu",
    summary: "Hỏi về chính sách bảo hành sản phẩm.",
  },
  {
    phoneNumber: "0722 999 111",
    dateTime: "11/05/2024 11:45",
    duration: "00:08:47",
    receiver: "phuong.ho",
    summary: "Yêu cầu hỗ trợ cài đặt ứng dụng mobile.",
  },
  {
    phoneNumber: "0633 444 777",
    dateTime: "10/05/2024 17:20",
    duration: "00:03:12",
    receiver: "tuan.tran",
    summary: "Xác nhận thông tin địa chỉ giao hàng.",
  },
  {
    phoneNumber: "0511 222 333",
    dateTime: "10/05/2024 15:55",
    duration: "00:14:28",
    receiver: "linh.nguyen",
    summary: "Phản ánh về dịch vụ chăm sóc khách hàng.",
  },
  {
    phoneNumber: "0488 666 999",
    dateTime: "10/05/2024 13:40",
    duration: "00:06:15",
    receiver: "minh.vu",
    summary: "Hỏi về các chương trình khuyến mãi hiện tại.",
  },
  {
    phoneNumber: "0399 111 555",
    dateTime: "09/05/2024 16:10",
    duration: "00:09:51",
    receiver: "phuong.ho",
    summary: "Yêu cầu thay đổi thông tin tài khoản.",
  },
  {
    phoneNumber: "0277 888 222",
    dateTime: "09/05/2024 12:25",
    duration: "00:04:36",
    receiver: "tuan.tran",
    summary: "Tư vấn về gói dịch vụ phù hợp cho doanh nghiệp.",
  },
  {
    phoneNumber: "0155 444 888",
    dateTime: "09/05/2024 09:30",
    duration: "00:07:18",
    receiver: "linh.nguyen",
    summary: "Hỗ trợ khôi phục mật khẩu tài khoản.",
  },
  {
    phoneNumber: "0033 777 111",
    dateTime: "08/05/2024 18:45",
    duration: "00:12:04",
    receiver: "minh.vu",
    summary: "Khiếu nại về việc tính phí không chính xác.",
  },
];

// CallHistory page component
export default function CallHistory() {
  const [searchPhone, setSearchPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredData, setFilteredData] = useState(callHistoryData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Handle search
  const handleSearch = () => {
    let filtered = callHistoryData;

    // Filter by phone number if provided
    if (searchPhone.trim()) {
      const searchPhoneClean = searchPhone.toLowerCase().replace(/\s/g, "");
      filtered = filtered.filter((call) => {
        const callPhoneClean = call.phoneNumber
          .toLowerCase()
          .replace(/\s/g, "");
        return callPhoneClean.includes(searchPhoneClean);
      });
    }

    // Filter by date if provided
    if (selectedDate) {
      filtered = filtered.filter((call) => {
        const callDate = new Date(
          call.dateTime.split(" ")[0].split("/").reverse().join("-")
        );
        const selectedDateObj = new Date(selectedDate);
        return callDate.toDateString() === selectedDateObj.toDateString();
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filtering
    console.log(
      "Searching for:",
      searchPhone,
      "Date:",
      selectedDate,
      "Results:",
      filtered.length
    );
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchPhone("");
    setSelectedDate("");
    setFilteredData(callHistoryData);
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, current page range, and last page with ellipsis
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[#2d3748] text-[28px] font-normal leading-[33.6px] tracking-[-0.56px] mb-2">
          Lịch sử cuộc gọi
        </h1>
        <p className="text-[#718096] text-[12px]">
          Xem và quản lý lịch sử cuộc gọi
        </p>
      </div>

      {/* Search and filter section */}
      <div className="flex gap-3 mb-8">
        {/* Phone number search */}
        <div className="bg-white h-10 rounded-[15px] border border-slate-200 flex items-center w-[211px]">
          <div className="flex items-center justify-center w-[37.5px] h-full">
            <div className="flex items-center gap-[5px] px-1.5 py-1">
              <Search className="w-[15px] h-[15px] text-gray-400" />
            </div>
          </div>
          <input
            type="text"
            placeholder="Nhập số điện thoại"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="flex-1 px-3 text-[12px] text-[#a0aec0] placeholder:text-[#a0aec0] focus:outline-none"
          />
        </div>

        {/* Date picker */}
        <div className="bg-white h-10 rounded-[15px] border border-slate-200 flex items-center w-[210px]">
          <div className="flex items-center justify-center w-[37.5px] h-full">
            <div className="flex items-center gap-[5px] px-1.5 py-1">
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex-1 px-3 text-[12px] text-[#a0aec0] placeholder:text-[#a0aec0] focus:outline-none"
          />
        </div>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="bg-[#2b6cb0] text-white text-[12px] font-bold h-10 px-2 rounded-xl hover:bg-[#2c5aa0] transition-colors shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-[96px]"
        >
          Tìm kiếm
        </button>

        {/* Clear filters button */}
        {(searchPhone || selectedDate) && (
          <button
            onClick={handleClearFilters}
            className="bg-gray-200 text-gray-600 text-[12px] font-bold h-10 px-4 rounded-xl hover:bg-gray-300 transition-colors"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Results count */}
      {filteredData.length !== callHistoryData.length && (
        <div className="mb-4">
          <p className="text-[#718096] text-[12px]">
            Tìm thấy {filteredData.length} kết quả
            {filteredData.length === 0 && " - Không có kết quả nào phù hợp"}
          </p>
        </div>
      )}

      {/* Call history table */}
      <div className="bg-white rounded-[15px] shadow-[0px_3.5px_5.5px_0px_rgba(0,0,0,0.02)] p-4">
        {/* Table headers */}
        <div className="grid grid-cols-6 gap-4 text-[#a0aec0] text-[12px] font-bold mb-3 pb-1 border-b border-slate-200">
          <div>Số điện thoại</div>
          <div>Ngày giờ</div>
          <div>Thời lượng</div>
          <div>Người nhận</div>
          <div>Ghi âm</div>
          <div>Tóm tắt</div>
        </div>

        {/* Table rows */}
        <div className="space-y-1">
          {currentData.map((call, index) => (
            <div
              key={index}
              className="grid grid-cols-6 gap-4 items-center py-1 border-b border-slate-100"
            >
              <div className="text-[#718096] text-[14px]">
                {call.phoneNumber}
              </div>
              <div className="text-[#718096] text-[14px]">{call.dateTime}</div>
              <div className="text-[#718096] text-[14px]">{call.duration}</div>
              <div className="text-[#718096] text-[14px]">{call.receiver}</div>
              <div className="flex gap-3">
                <button className="text-[#718096] hover:text-[#4a5568] transition-colors">
                  <MDOutlinePlayArrow size={16} title="Phát ghi âm" />
                </button>
                <button className="text-[#718096] hover:text-[#4a5568] transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button className="text-[#718096] hover:text-[#4a5568] transition-colors">
                  <MdOutlineGeneratingTokens size={16} title="Tạo báo cáo" />
                </button>
              </div>
              <div className="text-[#718096] text-[12px]">{call.summary}</div>
            </div>
          ))}
        </div>

        {/* Dynamic Pagination */}
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-[22px] text-[#4a5568] text-[12px]">
            <span>Tổng cộng {totalItems}</span>
            <div className="relative">
              <select
                className="appearance-none bg-white border border-[#cbd5e0] rounded-xl px-3 h-8 text-[#2d3748] text-[12px] pr-8"
                value={itemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(Number(e.target.value))
                }
              >
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path
                    d="M1 1L5 5L9 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {/* Previous button */}
            <button
              className="w-8 h-8 flex items-center justify-center rounded-md text-[#718096] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 disabled:hover:bg-transparent"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              title="Trang trước"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                className={`w-8 h-8 flex items-center justify-center text-[12px] transition-colors ${
                  page === currentPage
                    ? "rounded-xl bg-[#3182ce] text-white"
                    : page === "..."
                    ? "text-[#718096] cursor-default"
                    : "rounded-md text-[#718096] hover:bg-gray-100"
                }`}
                onClick={() =>
                  typeof page === "number" ? handlePageChange(page) : undefined
                }
                disabled={page === "..."}
                title={typeof page === "number" ? `Trang ${page}` : undefined}
              >
                {page}
              </button>
            ))}

            {/* Next button */}
            <button
              className="w-8 h-8 flex items-center justify-center rounded-md text-[#718096] rotate-180 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 disabled:hover:bg-transparent"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="Trang tiếp"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
