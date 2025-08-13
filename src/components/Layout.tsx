import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Phone, BarChart3, User, LogOut } from "lucide-react";
import StatusDropdown from "./StatusDropdown";
<<<<<<< HEAD
import AiOutlineLogout from "./ui/ai-outline-logout";
import { getAgentStatus, logoutAgent } from "../lib/api";
import Toast from "./ui/toast";
import { clearCallHistoryCache } from "../lib/cache";

// Map status ID to readable string (see API doc for full mapping)
const statusIdToString = (id: number): string => {
  switch (id) {
    case -2:
      return "DND Off";
    case -1:
      return "DND Normal";
    case 0:
      return "Tra cứu thông tin";
    case 1:
      return "Giải khát";
    case 2:
      return "Ăn trưa";
    case 3:
      return "Đào tạo";
    case 4:
      return "Họp";
    case 5:
      return "Gọi ra";
    case 6:
      return "Hỗ trợ KH";
    case 7:
      return "Báo cáo";
    case 8:
      return "Thư giãn";
    case 9:
      return "Đi vệ sinh";
    case 10:
      return "Livechat";
    case 11:
      return "ACW";
    default:
      return "Không rõ";
  }
};

// Map backend status code string to readable string
// Codes from API docs: dnd_off, dnd_normal, dnd_get_info, dnd_tea, dnd_lunch, dnd_training,
// dnd_meeting, dnd_outbound_assign, dnd_support, dnd_report, dnd_relax, dnd_wc, dnd_livechat, dnd_acw
const statusCodeToString = (code: string): string => {
  switch (code) {
    case "dnd_off":
      return "DND Off";
    case "dnd_normal":
      return "DND Normal";
    case "dnd_get_info":
      return "Tra cứu thông tin";
    case "dnd_tea":
      return "Giải khát";
    case "dnd_lunch":
      return "Ăn trưa";
    case "dnd_training":
      return "Đào tạo";
    case "dnd_meeting":
      return "Họp";
    case "dnd_outbound_assign":
      return "Gọi ra";
    case "dnd_support":
      return "Hỗ trợ KH";
    case "dnd_report":
      return "Báo cáo";
    case "dnd_relax":
      return "Thư giãn";
    case "dnd_wc":
      return "Đi vệ sinh";
    case "dnd_livechat":
      return "Livechat";
    case "dnd_acw":
      return "ACW";
    default:
      return "Không rõ";
  }
};
=======
>>>>>>> parent of bb00de5 (Remove unused images and UI components; update CallHistory to use new icons.)

interface LayoutProps {
  children: React.ReactNode;
}

// Main layout component with sidebar and navigation
export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [userStatus, setUserStatus] = useState("Đang tải...");
  const [triggerStatusModal, setTriggerStatusModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Fetch agent status on mount
  useEffect(() => {
    async function fetchStatus() {
      setStatusLoading(true);
      try {
        const res = await getAgentStatus();
        console.log("API Response:", res); // Debug: log the full response

        // Handle API returning string code (e.g., "dnd_acw"), numeric string (e.g., "5"), or numeric id (e.g., 5)
        const rawStatus = (res as any)?.data?.status;
        console.log("Raw Status:", rawStatus);

        if (typeof rawStatus === "string") {
          // If it's a numeric string, map via numeric table
          if (/^-?\d+$/.test(rawStatus)) {
            const id = parseInt(rawStatus, 10);
            const statusText = statusIdToString(id);
            console.log("Mapped Status (from numeric string):", statusText);
            setUserStatus(statusText || "Available");
          } else {
            // Otherwise treat as status code string
            const statusText = statusCodeToString(rawStatus);
            console.log("Mapped Status (from code):", statusText);
            setUserStatus(statusText || "Available");
          }
        } else if (typeof rawStatus === "number") {
          const statusText = statusIdToString(rawStatus);
          console.log("Mapped Status (from id):", statusText);
          setUserStatus(statusText || "Available");
        } else {
          console.warn("Status missing or invalid, defaulting to Available.");
          setUserStatus("Available");
        }
      } catch (e: any) {
        console.error("Status fetch error:", e); // Debug: log the error

        // Handle different types of errors with Vietnamese messages
        let errorMsg = "Không thể tải trạng thái";

        if (e && e.message) {
          if (
            e.message.includes("Failed to fetch") ||
            e.message.includes("NetworkError")
          ) {
            errorMsg = "Không thể kết nối đến máy chủ";
          } else if (e.message.includes("401")) {
            errorMsg = "Phiên đăng nhập đã hết hạn";
            // Clear call history cache if token expired
            await clearCallHistoryCache();
          } else if (e.message.includes("500")) {
            errorMsg = "Lỗi máy chủ nội bộ";
          } else if (e.message.includes("404")) {
            errorMsg = "Không tìm thấy dịch vụ";
          } else if (e.message.includes("403")) {
            errorMsg = "Không có quyền truy cập";
          } else {
            errorMsg = "Lỗi khi tải trạng thái";
          }
        }

        setUserStatus("Không rõ");

        // Show error toast
        setToastMessage(errorMsg);
        setToastType("error");
        setIsToastVisible(true);
      } finally {
        setStatusLoading(false);
      }
    }
    fetchStatus();
  }, []);

  // Handle status change - just update UI state (API call already done in StatusDropdown)
  const handleStatusChange = async (newStatus: string, notes?: string) => {
    try {
      // Just update the UI state - API call was already made in StatusDropdown
      setUserStatus(newStatus);
      console.log("Status changed successfully:", { newStatus, notes });
    } catch (e: any) {
      console.error("Status change error:", e);
      // Keep old status on error
    }
  };

  // Handle chevron click to open status modal
  const handleChevronClick = () => {
    setTriggerStatusModal(true);
  };

  // Reset trigger after modal opens
  const handleTriggerReset = () => {
    setTriggerStatusModal(false);
  };

  // Handle navigation
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Handle logout
  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logoutAgent();
      // Clear cached call history on logout
      await clearCallHistoryCache();
      // Optionally clear more user state here
      navigate("/"); // Redirect to login
    } catch (e: any) {
      // Handle different types of errors with Vietnamese messages
      let errorMessage = "Lỗi khi đăng xuất";

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
        } else {
          errorMessage = "Lỗi khi đăng xuất";
        }
      }

      // Show error toast
      setToastMessage(errorMessage);
      setToastType("error");
      setIsToastVisible(true);
    } finally {
      setLogoutLoading(false);
    }
  };

  // Check if current path is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-[#f7fafc] relative w-full h-screen flex overflow-hidden">
      {/* Left sidebar with smooth transition */}
      <div
        className={`bg-white h-full border-r border-[#e3e3e3] transition-all duration-300 ease-in-out flex-shrink-0 ${
          isCollapsed ? "w-[80px]" : "w-[280px]"
        }`}
      >
        <div
          className={`h-full overflow-hidden transition-all duration-300 ease-in-out ${
            isCollapsed ? "w-[80px]" : "w-[280px]"
          }`}
        >
          {/* User profile section */}
          <div
            className={`flex items-center gap-3 p-6 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="bg-[#4fd1c5] rounded-xl shadow-[0px_3.5px_5.5px_0px_rgba(0,0,0,0.02)] w-10 h-10 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col flex-1">
                <span className="text-[#2d3748] text-[14px] font-bold mb-1">
                  nguyen.tran2
                </span>
                <div className="flex items-center gap-1">
                  <StatusDropdown
                    currentStatus={userStatus}
                    onStatusChange={handleStatusChange}
                    triggerOpen={triggerStatusModal}
                    onTriggerReset={handleTriggerReset}
                  />
                  {statusLoading && (
                    <span className="ml-2 text-xs text-gray-400">
                      Đang tải...
                    </span>
                  )}
                </div>
              </div>
            )}
            {!isCollapsed && (
              <div
                className="flex items-center justify-center w-4 h-4 cursor-pointer hover:bg-gray-100 rounded transition-colors"
                onClick={handleChevronClick}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#718096]"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Navigation menu */}
          <div className={`${isCollapsed ? "px-2" : "px-6"}`}>
            {/* Overview */}
            <div
              className={`flex items-center gap-3 mb-4 cursor-pointer rounded-[15px] p-2 transition-colors hover:bg-gray-50 ${
                isActive("/overview")
                  ? "bg-[#edf2f7] shadow-[0px_3.5px_5.5px_0px_rgba(0,0,0,0.02)]"
                  : ""
              } ${isCollapsed ? "justify-center" : ""}`}
              onClick={() => handleNavigation("/overview")}
              title={isCollapsed ? "Tổng quan" : ""}
            >
              <div
                className={`rounded-xl w-[30px] h-[30px] flex items-center justify-center ${
                  isActive("/overview") ? "bg-[#2b6cb0]" : "bg-white"
                }`}
              >
                <Home
                  className={`w-[15px] h-[15px] ${
                    isActive("/overview") ? "text-white" : "text-[#2b6cb0]"
                  }`}
                />
              </div>
              {!isCollapsed && (
                <span
                  className={`text-[12px] font-bold ${
                    isActive("/overview") ? "text-[#2d3748]" : "text-[#a0aec0]"
                  }`}
                >
                  Tổng quan
                </span>
              )}
            </div>

            {/* Call History */}
            <div
              className={`flex items-center gap-3 mb-4 cursor-pointer rounded-[15px] p-2 transition-colors hover:bg-gray-50 ${
                isActive("/call-history")
                  ? "bg-[#edf2f7] shadow-[0px_3.5px_5.5px_0px_rgba(0,0,0,0.02)]"
                  : ""
              } ${isCollapsed ? "justify-center" : ""}`}
              onClick={() => handleNavigation("/call-history")}
              title={isCollapsed ? "Lịch sử cuộc gọi" : ""}
            >
              <div
                className={`rounded-xl w-[30px] h-[30px] flex items-center justify-center ${
                  isActive("/call-history") ? "bg-[#2b6cb0]" : "bg-white"
                }`}
              >
                <Phone
                  className={`w-[15px] h-[15px] ${
                    isActive("/call-history") ? "text-white" : "text-[#2b6cb0]"
                  }`}
                />
              </div>
              {!isCollapsed && (
                <span
                  className={`text-[12px] font-bold ${
                    isActive("/call-history")
                      ? "text-[#2d3748]"
                      : "text-[#a0aec0]"
                  }`}
                >
                  Lịch sử cuộc gọi
                </span>
              )}
            </div>

            {/* Configuration */}
            <div
              className={`flex items-center gap-3 mb-4 cursor-pointer rounded-[15px] p-2 transition-colors hover:bg-gray-50 ${
                isActive("/configuration")
                  ? "bg-[#edf2f7] shadow-[0px_3.5px_5.5px_0px_rgba(0,0,0,0.02)]"
                  : ""
              } ${isCollapsed ? "justify-center" : ""}`}
              onClick={() => handleNavigation("/configuration")}
              title={isCollapsed ? "Cấu hình" : ""}
            >
              <div
                className={`rounded-xl w-[30px] h-[30px] flex items-center justify-center ${
                  isActive("/configuration") ? "bg-[#2b6cb0]" : "bg-white"
                }`}
              >
                <BarChart3
                  className={`w-[15px] h-[15px] ${
                    isActive("/configuration") ? "text-white" : "text-[#2b6cb0]"
                  }`}
                />
              </div>
              {!isCollapsed && (
                <span
                  className={`text-[12px] font-bold ${
                    isActive("/configuration")
                      ? "text-[#2d3748]"
                      : "text-[#a0aec0]"
                  }`}
                >
                  Cấu hình
                </span>
              )}
            </div>
          </div>

          {/* Logout button */}
          <div
            className={`absolute bottom-[20px] ${
              isCollapsed
                ? "left-0 w-[80px] flex justify-center"
                : "left-0 px-6"
            }`}
          >
            <div
              className={`flex items-center gap-3 mb-4 cursor-pointer rounded-[15px] p-2 transition-colors hover:bg-gray-50 ${
                isCollapsed ? "justify-center" : "w-full pr-30"
              }`}
              onClick={handleLogout}
              title={isCollapsed ? "Đăng xuất" : ""}
            >
              <div className="rounded-xl w-[30px] h-[30px] flex items-center justify-center bg-white">
                <LogOut className="w-[15px] h-[15px] text-[#2b6cb0]" />
              </div>
              {!isCollapsed && (
                <span className="text-[12px] font-bold text-[#a0aec0]">
                  {logoutLoading ? "Đang đăng xuất..." : "Đăng xuất"}
                </span>
              )}
            </div>
          </div>

          {/* Layout toggle button */}
          <div
            className={`absolute bottom-[60px] ${
              isCollapsed ? "left-[60px] bottom-[80px]" : "left-[260px]"
            } transition-all duration-300 ease-in-out`}
          >
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="bg-white border border-slate-200 rounded-md w-10 h-10 flex items-center justify-center hover:bg-slate-50 transition-colors"
              title={isCollapsed ? "Mở rộng" : "Thu gọn"}
            >
              {isCollapsed ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#718096]"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#718096]"
                >
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Copyright */}
          {!isCollapsed && (
            <div className="absolute bottom-[20px] left-[328px]">
              <p className="text-[#a0aec0] text-[12px] leading-[1.5]">
                @ 2025 - Agent Call Management System
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 min-w-0 overflow-auto">{children}</div>

      {/* Toast notification for status errors */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          isVisible={isToastVisible}
          onClose={() => setIsToastVisible(false)}
          type={toastType}
        />
      )}
    </div>
  );
}
