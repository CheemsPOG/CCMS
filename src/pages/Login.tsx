import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Image assets
import logoImage from "../assets/images/logo.jpg";
import backgroundSVG from "../assets/images/1457718455276 1.svg";

// Login page component
export default function Login() {
  const navigate = useNavigate();

  // State for form inputs
  const [formData, setFormData] = useState({
    agentNumber: "",
    password: "",
    extension: "",
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual login logic here
    console.log("Login attempt:", formData);

    // Navigate to overview page after login
    navigate("/overview");
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

            {/* Login button */}
            <button
              type="submit"
              className="w-full h-[45px] bg-[#2b6cb0] text-white text-[14px] font-bold rounded-xl hover:bg-[#1e4a8a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b6cb0] focus:ring-opacity-50"
            >
              Đăng nhập
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
    </div>
  );
}
