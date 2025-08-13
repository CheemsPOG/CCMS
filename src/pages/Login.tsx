import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Image assets
import logoImage from "../assets/images/logo.jpg";
import backgroundSVG from "../assets/images/1457718455276 1.svg";
import { loginAgent } from "../lib/api";
import { ChevronDown } from "lucide-react";
import Toast from "../components/ui/toast";

// Login page component
export default function Login() {
  const navigate = useNavigate();

  // State for form inputs
  const [formData, setFormData] = useState({
    agentNumber: "",
    password: "",
    extension: "",
    queueNum: "790001",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queueDropdownOpen, setQueueDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check if any required fields are blank
    if (
      !formData.agentNumber.trim() ||
      !formData.password.trim() ||
      !formData.extension.trim()
    ) {
      const errorMessage = "Chưa nhập thông tin";
      setError(errorMessage);
      setToastMessage(errorMessage);
      setToastType("error");
      setIsToastVisible(true);
      setLoading(false);
      return;
    }

    try {
      await loginAgent({
        agentNum: formData.agentNumber,
        agentPass: formData.password,
        extension: formData.extension,
        queueNum: formData.queueNum,
      });

      // Show success toast before navigating
      setToastMessage("Đăng nhập thành công!");
      setToastType("success");
      setIsToastVisible(true);

      // Navigate after a short delay to show the toast
      setTimeout(() => {
        navigate("/overview");
      }, 1000);
    } catch (e: any) {
      // Handle different types of errors with Vietnamese messages
      let errorMessage = "Đăng nhập thất bại";

      if (e && e.message) {
        if (
          e.message.includes("Failed to fetch") ||
          e.message.includes("NetworkError")
        ) {
          errorMessage = "Không thể kết nối đến máy chủ";
        } else if (e.message.includes("401")) {
          errorMessage = "Thông tin đăng nhập không hợp lệ";
        } else if (e.message.includes("500")) {
          errorMessage = "Lỗi máy chủ nội bộ";
        } else if (e.message.includes("404")) {
          errorMessage = "Không tìm thấy dịch vụ đăng nhập";
        } else if (e.message.includes("403")) {
          errorMessage = "Tài khoản bị khóa";
        } else if (e.message.includes("400")) {
          errorMessage = "Thông tin đăng nhập không hợp lệ";
        } else {
          errorMessage = "Đăng nhập thất bại";
        }
      }

      setError(errorMessage);

      // Show error toast
      setToastMessage(errorMessage);
      setToastType("error");
      setIsToastVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#c4f1f9] relative w-full h-screen flex">
      {/* Left side - Login form */}
      <div className="w-[641px] h-full flex flex-col bg-white">
        {/* Logo section */}
        <div className="flex items-center gap-2 mt-8 ml-[100px]">
          <div className="w-[92.3px] h-[43.2px] overflow-hidden">
            <img
              src={logoImage}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col gap-[8.822px] items-center pt-[2.794px]">
            <div className="bg-[#005194] flex items-center justify-center px-[3.352px] rounded-[3.492px]">
              <span className="text-white text-[14.162px] font-normal leading-[1.2]">
                AGENT CM
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mt-16 ml-[100px]">
          <h1 className="text-[#2b6cb0] text-[40px] font-bold leading-[1.5]">
            Đăng nhập
          </h1>
        </div>

        {/* Login form */}
        <div className="mt-12 ml-[100px] w-[350px]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Agent Number field */}
            <div className="relative">
              <label className="block text-[#2d3748] text-[14px] font-normal mb-1 ml-1">
                Agent number
              </label>
              <input
                type="text"
                name="agentNumber"
                value={formData.agentNumber}
                onChange={handleInputChange}
                placeholder="Nhập agent number"
                className="w-full h-[50px] px-5 py-0 border border-slate-200 rounded-[15px] text-[14px] text-[#2d3748] placeholder:text-[#a0aec0] focus:outline-none focus:border-[#2b6cb0] transition-colors"
              />
            </div>

            {/* Password field */}
            <div className="relative">
              <label className="block text-[#2d3748] text-[14px] font-normal mb-1 ml-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Nhập password"
                className="w-full h-[50px] px-5 py-0 border border-slate-200 rounded-[15px] text-[14px] text-[#2d3748] placeholder:text-[#a0aec0] focus:outline-none focus:border-[#2b6cb0] transition-colors"
              />
            </div>

            {/* Extension field */}
            <div className="relative">
              <label className="block text-[#2d3748] text-[14px] font-normal mb-1 ml-1">
                Extension
              </label>
              <input
                type="text"
                name="extension"
                value={formData.extension}
                onChange={handleInputChange}
                placeholder="Nhập extension"
                className="w-full h-[50px] px-5 py-0 border border-slate-200 rounded-[15px] text-[14px] text-[#2d3748] placeholder:text-[#a0aec0] focus:outline-none focus:border-[#2b6cb0] transition-colors"
              />
            </div>
            {/* Queue Number dropdown */}
            <div className="relative">
              <label className="block text-[#2d3748] text-[14px] font-normal mb-1 ml-1">
                Queue Number
              </label>
              <div className="relative">
                <select
                  name="queueNum"
                  value={formData.queueNum}
                  onChange={handleInputChange}
                  onFocus={() => setQueueDropdownOpen(true)}
                  onBlur={() => setQueueDropdownOpen(false)}
                  className="w-full h-[50px] px-5 py-0 border border-slate-200 rounded-[15px] text-[14px] text-[#2d3748] focus:outline-none focus:border-[#2b6cb0] transition-colors bg-white appearance-none pr-10"
                >
                  <option value="790001">790001</option>
                  <option value="790002">790002</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      queueDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
            {/* Login button */}
            <button
              type="submit"
              className="w-full h-[45px] bg-[#2b6cb0] text-white text-[14px] font-bold rounded-xl hover:bg-[#1e4a8a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b6cb0] focus:ring-opacity-50"
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        </div>
      </div>

      {/* Right side - Background image */}
      <div className="flex-1 relative overflow-hidden">
        {/* Background color - Cyan 100 */}
        <div className="absolute inset-0 bg-[#c4f1f9]" />

        {/* Background SVG image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={backgroundSVG}
            alt="Background pattern"
            className="w-full h-full object-cover opacity-90"
          />
        </div>
      </div>

      {/* Toast notification for login success */}
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
