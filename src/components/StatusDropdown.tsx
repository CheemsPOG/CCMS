import React, { useState } from "react";
import { ChevronDown, X } from "lucide-react";

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
  { value: "Away", label: "Away", color: "bg-yellow-500" },
  { value: "Do Not Disturb", label: "Do Not Disturb", color: "bg-gray-500" },
];

// Content options for the dropdown
const contentOptions = [
  "Giải khát",
  "Ăn trưa",
  "Đào tạo",
  "Họp",
  "Thực hiện cuộc gọi ra",
  "Hỗ trợ khách hàng",
  "Báo cáo",
  "Thư giãn, giải trí",
  "Đi vệ sinh",
  "Hỗ trợ khách hàng qua kênh chat",
  "Ghi nhận thông tin sau khi tiếp nhận cuộc gọi",
];

export default function StatusDropdown({
  currentStatus,
  onStatusChange,
  triggerOpen = false,
  onTriggerReset,
}: StatusDropdownProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [notes, setNotes] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isContentDropdownOpen, setIsContentDropdownOpen] = useState(false);

  // Handle external trigger to open modal
  React.useEffect(() => {
    if (triggerOpen) {
      handleStatusClick();
      onTriggerReset?.();
    }
  }, [triggerOpen]);

  // Get current status color
  const getCurrentStatusColor = () => {
    const status = statusOptions.find((s) => s.value === currentStatus);
    return status?.color || "bg-green-500";
  };

  // Handle opening the modal
  const handleStatusClick = () => {
    setIsModalOpen(true);
    setSelectedStatus(currentStatus);
    setNotes("");
  };

  // Handle closing the modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedStatus(currentStatus);
    setNotes("");
    setIsDropdownOpen(false);
    setIsContentDropdownOpen(false);
  };

  // Handle confirming status change
  const handleConfirm = () => {
    onStatusChange(selectedStatus, notes);
    setIsModalOpen(false);
    setIsDropdownOpen(false);
  };

  // Handle status selection from dropdown
  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setIsDropdownOpen(false);
  };

  // Handle content selection from dropdown
  const handleContentSelect = (content: string) => {
    setNotes(content);
    setIsContentDropdownOpen(false);
  };

  return (
    <>
      {/* Status display - non-clickable */}
      <div className="flex items-center gap-1">
        <div className={`w-3 h-3 rounded-full ${getCurrentStatusColor()}`} />
        <span className="text-[#718096] text-[14px]">{currentStatus}</span>
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
                        statusOptions.find((s) => s.value === selectedStatus)
                          ?.color
                      }`}
                    />
                    <span className="text-[#2d3748] text-[14px]">
                      {
                        statusOptions.find((s) => s.value === selectedStatus)
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
                        onClick={() => handleStatusSelect(status.value)}
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

            {/* Content dropdown section */}
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
                    {notes || "Chọn nội dung"}
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
                    {contentOptions.map((content) => (
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

            {/* Action buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-[#718096] text-[14px] font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-[#2b6cb0] text-white text-[14px] font-medium rounded-md hover:bg-[#2557a7] transition-colors"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
