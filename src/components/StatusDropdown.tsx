import React, { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { changeAgentStatus } from "../lib/api";
import Toast from "./ui/toast";

interface StatusDropdownProps {
  currentStatus: string;
  onStatusChange: (status: string, notes?: string) => void;
  triggerOpen?: boolean;
  onTriggerReset?: () => void;
}

// Status options with their corresponding colors
const statusOptions = [
  { value: "Available", label: "Available", color: "bg-green-500" },
  { value: "Busy", label: "Busy", color: "bg-red-500" },
  { value: "Break", label: "Break", color: "bg-yellow-500" },
];

// Content options for each category
const contentOptionsByCategory = {
  Available: ["DND Off"],
  Busy: [
    // "Không lý do" under Busy will map to DND Normal (-1)
    "Không lý do",
    "Tra thông tin",
    "Họp",
    "Gọi ra",
    "Hỗ trợ KH",
    "Báo cáo",
    "Livechat",
    "ACW",
  ],
  Break: ["Giải khát", "Ăn trưa", "Đào tạo", "Thư giãn", "Đi vệ sinh"],
};

// Map status string to status ID (should match Layout's mapping)
const statusStringToId = (str: string): number => {
  switch (str) {
    case "DND Off":
      return -2;
    case "DND Normal":
      return -1;
    case "Không lý do":
      return -1; // Alias shown under Busy category
    case "Không lí do":
      return -1; // support both spellings
    case "Tra thông tin":
      return 0;
    case "Tra cứu thông tin":
      return 0; // support Layout label variant
    case "Giải khát":
      return 1;
    case "Ăn trưa":
      return 2;
    case "Đào tạo":
      return 3;
    case "Họp":
      return 4;
    case "Gọi ra":
      return 5;
    case "Hỗ trợ KH":
      return 6;
    case "Báo cáo":
      return 7;
    case "Thư giãn":
      return 8;
    case "Đi vệ sinh":
      return 9;
    case "Livechat":
      return 10;
    case "ACW":
      return 11;
    default:
      return -1;
  }
};

// Map Vietnamese status text to category and content
const getStatusCategoryFromText = (
  statusText: string
): { category: string; content: string } => {
  switch (statusText) {
    case "DND Off":
      return { category: "Available", content: "DND Off" };
    case "DND Normal":
      // Show DND Normal under Busy as "Không lý do"
      return { category: "Busy", content: "Không lý do" };
    case "Không lý do":
      return { category: "Busy", content: "Không lý do" };
    case "Không lí do":
      return { category: "Busy", content: "Không lý do" };
    case "Tra thông tin":
      return { category: "Busy", content: "Tra thông tin" };
    case "Tra cứu thông tin":
      return { category: "Busy", content: "Tra thông tin" }; // normalize to one label
    case "Giải khát":
      return { category: "Break", content: "Giải khát" };
    case "Ăn trưa":
      return { category: "Break", content: "Ăn trưa" };
    case "Đào tạo":
      return { category: "Break", content: "Đào tạo" };
    case "Họp":
      return { category: "Busy", content: "Họp" };
    case "Gọi ra":
      return { category: "Busy", content: "Gọi ra" };
    case "Hỗ trợ KH":
      return { category: "Busy", content: "Hỗ trợ KH" };
    case "Báo cáo":
      return { category: "Busy", content: "Báo cáo" };
    case "Thư giãn":
      return { category: "Break", content: "Thư giãn" };
    case "Đi vệ sinh":
      return { category: "Break", content: "Đi vệ sinh" };
    case "Livechat":
      return { category: "Busy", content: "Livechat" };
    case "ACW":
      return { category: "Busy", content: "ACW" };
    default:
      return { category: "Available", content: statusText };
  }
};

export default function StatusDropdown({
  currentStatus,
  onStatusChange,
  triggerOpen = false,
  onTriggerReset,
}: StatusDropdownProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Available");
  const [selectedContent, setSelectedContent] = useState("");
  const [notes, setNotes] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isContentDropdownOpen, setIsContentDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Handle external trigger to open modal
  React.useEffect(() => {
    if (triggerOpen) {
      handleStatusClick();
      onTriggerReset?.();
    }
  }, [triggerOpen]);

  // Get current status color based on category
  const getCurrentStatusColor = () => {
    const { category } = getStatusCategoryFromText(currentStatus);
    const status = statusOptions.find((s) => s.value === category);
    return status?.color || "bg-green-500";
  };

  // Handle opening the modal
  const handleStatusClick = () => {
    setIsModalOpen(true);
    const { category, content } = getStatusCategoryFromText(currentStatus);
    setSelectedCategory(category);
    setSelectedContent(content);
    setNotes("");
  };

  // Handle closing the modal
  const handleCancel = () => {
    setIsModalOpen(false);
    const { category, content } = getStatusCategoryFromText(currentStatus);
    setSelectedCategory(category);
    setSelectedContent(content);
    setNotes("");
    setIsDropdownOpen(false);
    setIsContentDropdownOpen(false);
  };

  // Handle confirming status change
  const handleConfirm = async () => {
    setLoading(true);
    try {
      // Ensure a content is selected; if not, pick the first content for the chosen category
      const categoryContents =
        contentOptionsByCategory[
          selectedCategory as keyof typeof contentOptionsByCategory
        ] || [];
      const finalContent =
        selectedContent || categoryContents[0] || currentStatus;

      // Map display text to numeric string IDs expected by API
      const oldMapped = statusStringToId(currentStatus);
      const newMapped = statusStringToId(finalContent);
      const oldStatusId = String(oldMapped);
      const newStatusId = String(newMapped);
      await changeAgentStatus({
        oldStatus: oldStatusId,
        newStatus: newStatusId,
      });
      onStatusChange(finalContent, notes);
      setIsModalOpen(false);
      setIsDropdownOpen(false);
      setToastMessage("Trạng thái đã được cập nhật thành công!");
      setToastType("success");
      setIsToastVisible(true);
    } catch (e: any) {
      // Handle different types of errors with Vietnamese messages
      let errorMessage = "Lỗi khi đổi trạng thái";

      if (e && e.message) {
        if (
          e.message.includes("Failed to fetch") ||
          e.message.includes("NetworkError")
        ) {
          errorMessage = "Không thể kết nối đến máy chủ";
        } else if (e.message.includes("401")) {
          errorMessage = "Phiên đăng nhập đã hết hạn";
        } else if (e.message.includes("500")) {
          errorMessage = "Lỗi máy chủ nội bộ";
        } else if (e.message.includes("404")) {
          errorMessage = "Không tìm thấy dịch vụ";
        } else if (e.message.includes("403")) {
          errorMessage = "Không có quyền truy cập";
        } else if (e.message.includes("400")) {
          errorMessage = "Dữ liệu không hợp lệ";
        } else if (e.message.includes("429")) {
          errorMessage = "Quá nhiều yêu cầu, vui lòng thử lại sau";
        } else {
          errorMessage = "Lỗi khi đổi trạng thái";
        }
      }

      // Show error toast
      setToastMessage(errorMessage);
      setToastType("error");
      setIsToastVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle category selection from dropdown
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    const firstContent =
      contentOptionsByCategory[
        category as keyof typeof contentOptionsByCategory
      ]?.[0] || "";
    setSelectedContent(firstContent);
    setIsDropdownOpen(false);
  };

  // Handle content selection from dropdown
  const handleContentSelect = (content: string) => {
    setSelectedContent(content);
    setIsContentDropdownOpen(false);
  };

  return (
    <>
      {/* Status display - non-clickable */}
      <div className="flex items-center gap-1">
        <div className={`w-3 h-3 rounded-full ${getCurrentStatusColor()}`} />
        <span className="text-[#718096] text-[14px]">
          {(() => {
            const { category, content } =
              getStatusCategoryFromText(currentStatus);

            // Show simple text for Available only
            if (category === "Available") {
              return category;
            }

            // Show Category - Content format for others
            return `${category} - ${content}`;
          })()}
        </span>
      </div>

      {/* Modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Modal overlay matching Figma design - rgba(0,0,0,0.48) */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.48)" }}
            onClick={handleCancel}
          />

          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow-lg w-[400px] p-6">
            {/* Modal header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#2d3748] text-[18px] font-medium">
                Đổi trạng thái
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status selection */}
            <div className="mb-4">
              <label className="block text-[#2d3748] text-[14px] font-medium mb-2">
                Chọn trạng thái
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left flex items-center justify-between hover:border-gray-400 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        statusOptions.find((s) => s.value === selectedCategory)
                          ?.color
                      }`}
                    />
                    <span className="text-[#2d3748] text-[14px]">
                      {
                        statusOptions.find((s) => s.value === selectedCategory)
                          ?.label
                      }
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown options */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    {statusOptions.map((status) => (
                      <button
                        key={status.value}
                        onClick={() => handleCategorySelect(status.value)}
                        className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-gray-50 transition-colors first:rounded-t-md last:rounded-b-md"
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${status.color}`}
                        />
                        <span className="text-[#2d3748] text-[14px]">
                          {status.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Content dropdown section - only show for Busy and Break categories */}
            {(selectedCategory === "Busy" || selectedCategory === "Break") && (
              <div className="mb-6">
                <label className="block text-[#2d3748] text-[14px] font-medium mb-2">
                  Nội dung
                </label>
                <div className="relative">
                  <button
                    onClick={() =>
                      setIsContentDropdownOpen(!isContentDropdownOpen)
                    }
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left flex items-center justify-between hover:border-gray-400 transition-colors"
                  >
                    <span className="text-[#2d3748] text-[14px]">
                      {selectedContent || "Chọn nội dung"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform ${
                        isContentDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Content dropdown options */}
                  {isContentDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                      {contentOptionsByCategory[
                        selectedCategory as keyof typeof contentOptionsByCategory
                      ]?.map((content) => (
                        <button
                          key={content}
                          onClick={() => handleContentSelect(content)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors first:rounded-t-md last:rounded-b-md"
                        >
                          <span className="text-[#2d3748] text-[14px]">
                            {content}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-[#718096] text-[14px] font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-[#2b6cb0] text-white text-[14px] font-medium rounded-md hover:bg-[#2557a7] transition-colors"
                disabled={loading}
              >
                {loading ? "Đang lưu..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          isVisible={isToastVisible}
          onClose={() => setIsToastVisible(false)}
          type={toastType}
        />
      )}
    </>
  );
}
