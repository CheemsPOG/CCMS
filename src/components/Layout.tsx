import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Phone, BarChart3, User } from "lucide-react";
import StatusDropdown from "./StatusDropdown";
import AiOutlineLogout from "./ui/ai-outline-logout";

interface LayoutProps {
  children: React.ReactNode;
}

// Main layout component with sidebar and navigation
export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [userStatus, setUserStatus] = useState("Available");
  const [triggerStatusModal, setTriggerStatusModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Handle status change
  const handleStatusChange = (newStatus: string, notes?: string) => {
    setUserStatus(newStatus);
    console.log("Status changed to:", newStatus, "Notes:", notes);
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
              onClick={() => navigate("/")}
              title={isCollapsed ? "Đăng xuất" : ""}
            >
              <div className="rounded-xl w-[30px] h-[30px] flex items-center justify-center bg-white">
                <AiOutlineLogout
                  size={15}
                  className="text-[#2b6cb0]"
                  title="Đăng xuất"
                />
              </div>
              {!isCollapsed && (
                <span className="text-[12px] font-bold text-[#a0aec0]">
                  Đăng xuất
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
    </div>
  );
}
