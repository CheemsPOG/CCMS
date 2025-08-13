import { useEffect } from "react";
import { X, CheckCircle } from "lucide-react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: "success" | "error" | "info";
  duration?: number;
}

export default function Toast({
  message,
  isVisible,
  onClose,
  type = "success",
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return {
          bgColor: "bg-green-500",
          icon: <CheckCircle className="w-5 h-5" />,
        };
      case "error":
        return {
          bgColor: "bg-red-500",
          icon: null, // No left icon for error toasts
        };
      case "info":
        return {
          bgColor: "bg-blue-500",
          icon: <CheckCircle className="w-5 h-5" />,
        };
      default:
        return {
          bgColor: "bg-green-500",
          icon: <CheckCircle className="w-5 h-5" />,
        };
    }
  };

  const { bgColor, icon } = getToastStyles();

  return (
    <div
      className={`fixed top-4 right-4 z-[60] ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right-2 duration-300 cursor-pointer`}
      onClick={onClose}
      title="Nhấp để đóng"
    >
      {icon && icon}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="ml-2 text-white/80 hover:text-white transition-colors"
        title="Đóng"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
