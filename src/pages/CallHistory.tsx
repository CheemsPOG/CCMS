<<<<<<< HEAD
import { useState, useEffect } from "react";
import { Search, Calendar } from "lucide-react";
import MDOutlinePlayArrow from "../components/ui/md-outline-play-arrow";
import MdOutlineGeneratingTokens from "../components/ui/md-outline-generating-tokens";
import { getCallHistory } from "../lib/api";
import { clearCallHistoryCache } from "../lib/cache";
import Toast from "../components/ui/toast";
=======
import { useState } from "react";
import { Search, Calendar, Play, Download, FileText } from "lucide-react";
>>>>>>> parent of bb00de5 (Remove unused images and UI components; update CallHistory to use new icons.)

// IndexedDB configuration
const DB_NAME = "CallCenterDB";
const DB_VERSION = 1;
const STORE_NAME = "callHistory";

// Initialize IndexedDB
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
};

// Storage operations with fallback
const storage = {
  async save(data: any[], searchState: any) {
    try {
      const db = await initDB();
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      await Promise.all([
        this.promisifyRequest(
          store.put({ id: "callHistoryData", data, timestamp: Date.now() })
        ),
        this.promisifyRequest(
          store.put({
            id: "searchState",
            data: searchState,
            timestamp: Date.now(),
          })
        ),
      ]);
      console.log("Data saved to IndexedDB");
    } catch (error) {
      console.warn("IndexedDB failed, falling back to localStorage:", error);
      this.saveToLocalStorage(data, searchState);
    }
  },

  async load() {
    try {
      const db = await initDB();
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);

      const [dataResult, searchResult] = await Promise.all([
        this.promisifyRequest(store.get("callHistoryData")),
        this.promisifyRequest(store.get("searchState")),
      ]);

      if (dataResult && searchResult) {
        console.log("Data loaded from IndexedDB");
        return { data: dataResult.data, searchState: searchResult.data };
      }
    } catch (error) {
      console.warn("IndexedDB failed, trying localStorage:", error);
    }
    return this.loadFromLocalStorage();
  },

  async clear() {
    // Delegate to shared util for consistency
    await clearCallHistoryCache();
  },

  promisifyRequest(request: IDBRequest) {
    return new Promise<any>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  saveToLocalStorage(data: any[], searchState: any) {
    try {
      localStorage.setItem("callHistoryData", JSON.stringify(data));
      localStorage.setItem(
        "callHistorySearchState",
        JSON.stringify(searchState)
      );
      console.log("Data saved to localStorage (fallback)");
    } catch (error) {
      console.error("localStorage failed:", error);
      localStorage.removeItem("callHistoryData");
      localStorage.removeItem("callHistorySearchState");
    }
  },

  loadFromLocalStorage() {
    try {
      const cachedData = localStorage.getItem("callHistoryData");
      const cachedSearchState = localStorage.getItem("callHistorySearchState");
      if (cachedData && cachedSearchState) {
        console.log("Data loaded from localStorage (fallback)");
        return {
          data: JSON.parse(cachedData),
          searchState: JSON.parse(cachedSearchState),
        };
      }
    } catch (error) {
      console.error("Failed to load cached data:", error);
    }
    return null;
  },
};

// Helper functions
const formatDateToApi = (date: Date, time: string = "00:00:00") => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${time}`;
};

const mapCallHistoryData = (callHistoryData: any[]) => {
  return callHistoryData.map((item: any) => {
    const callDateNum = typeof item.callDate === "number" ? item.callDate : 0;
    const callDateMs = callDateNum > 1e12 ? callDateNum : callDateNum * 1000;
    const durationNum = typeof item.duration === "number" ? item.duration : 0;
    const durationMs = durationNum > 1e7 ? durationNum : durationNum * 1000;

    return {
      destination: item.destination,
      duration: new Date(durationMs).toISOString().substr(11, 8),
      dateTime: new Date(callDateMs).toLocaleString("vi-VN"),
      agentName: item.agentName,
      callType: item.callType,
      mediaPath: item.mediaPath,
    };
  });
};

const getPageNumbers = (currentPage: number, totalPages: number) => {
  const pages = [] as (number | "...")[];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (currentPage <= 3) {
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
  return pages;
};

// Media action buttons component
const MediaActions = ({ mediaPath }: { mediaPath: string }) => (
  <>
    <a
      href={mediaPath}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-600 hover:text-gray-800 transition-colors"
      title="Nghe ghi âm"
    >
      <MDOutlinePlayArrow size={16} />
    </a>
    <a
      href={mediaPath}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-600 hover:text-gray-800 transition-colors"
      title="Tải xuống"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 10L12 15L17 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 15V3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
    <a
      href={mediaPath}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-600 hover:text-gray-800 transition-colors"
      title="Mở trong tab mới"
    >
      <MdOutlineGeneratingTokens size={16} />
    </a>
  </>
);

// Loading skeleton component
const LoadingSkeleton = () => (
  <>
    {Array.from({ length: 5 }).map((_, idx) => (
      <div
        key={idx}
        className="grid grid-cols-6 gap-4 items-center py-1 border-b border-slate-100 animate-pulse"
      >
        {Array.from({ length: 6 }).map((_, colIdx) => (
          <div
            key={colIdx}
            className="h-4 bg-gray-200 rounded w-full"
            style={{ minWidth: 0 }}
          />
        ))}
      </div>
    ))}
  </>
);

// CallHistory page component
export default function CallHistory() {
  const [searchPhone, setSearchPhone] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedCallType, setSelectedCallType] = useState<
    "ALL" | "IN" | "OUT"
  >("ALL");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Toast state for errors
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);

  // Load cached data on component mount
  useEffect(() => {
    storage.load().then((cached) => {
      if (cached) {
        setFilteredData(cached.data);
        setHasSearched(cached.searchState.hasSearched);
        setSearchPhone(cached.searchState.searchPhone || "");
        setFromDate(cached.searchState.fromDate || "");
        setToDate(cached.searchState.toDate || "");
        setSelectedCallType(cached.searchState.selectedCallType || "ALL");
      }
    });
  }, []);

  // Fetch call history from API
  const fetchCallHistory = async (filters?: {
    phone?: string;
    fromDate?: string;
    toDate?: string;
    callType?: "IN" | "OUT";
  }) => {
    setLoading(true);
    setError(null);
    try {
      let fromDateTime = "",
        toDateTime = "";
      if (filters?.fromDate && filters?.toDate) {
        fromDateTime = formatDateToApi(new Date(filters.fromDate), "00:00:00");
        toDateTime = formatDateToApi(new Date(filters.toDate), "23:59:59");
      } else if (filters?.fromDate) {
        // Only from date provided - show all history from that date onwards
        const fromDateObj = new Date(filters.fromDate);
        fromDateTime = formatDateToApi(fromDateObj, "00:00:00");
        // Set toDateTime to a far future date to get all calls from fromDate onwards
        toDateTime = formatDateToApi(new Date(2100, 11, 31), "23:59:59");
      } else if (filters?.toDate) {
        // Only to date provided - show all history up to that date
        const toDateObj = new Date(filters.toDate);
        fromDateTime = formatDateToApi(new Date(1900, 0, 1), "00:00:00"); // Far past date
        toDateTime = formatDateToApi(toDateObj, "23:59:59");
      } else {
        // No dates provided - use current date for both
        const now = new Date();
        fromDateTime = formatDateToApi(now, "00:00:00");
        toDateTime = formatDateToApi(now, "23:59:59");
      }

      const params = {
        fromDateTime: fromDateTime,
        toDateTime: toDateTime,
        callType: filters?.callType || undefined,
        source: filters?.phone ? filters.phone.replace(/\s/g, "") : "",
        destination: "",
      };

      const res = await getCallHistory(params);
      const callHistoryData = (res.data as any)?.callHistory || res.data || [];
      const mapped = mapCallHistoryData(callHistoryData);

      setFilteredData(mapped);
      setHasSearched(true);

      await storage.save(mapped, {
        hasSearched: true,
        searchPhone: filters?.phone || "",
        fromDate: filters?.fromDate || "",
        toDate: filters?.toDate || "",
        selectedCallType: filters?.callType || "ALL",
      });
    } catch (e: any) {
      // Map error to Vietnamese messages and show toast
      let errorMessage = "Lỗi khi tải lịch sử cuộc gọi";
      if (e && e.message) {
        if (
          e.message.includes("Failed to fetch") ||
          e.message.includes("NetworkError")
        ) {
          errorMessage = "Không thể kết nối đến máy chủ";
        } else if (e.message.includes("401")) {
          errorMessage = "Phiên đăng nhập đã hết hạn";
          await storage.clear();
        } else if (e.message.includes("500")) {
          errorMessage = "Lỗi máy chủ nội bộ";
        } else if (e.message.includes("404")) {
          errorMessage = "Không tìm thấy dịch vụ";
        } else if (e.message.includes("403")) {
          errorMessage = "Không có quyền truy cập";
        }
      }
      setError(errorMessage);
      setFilteredData([]);
      setHasSearched(false);
      // Show toast instead of inline error
      setToastMessage(errorMessage);
      setIsToastVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Event handlers
  const handleSearch = () => {
    fetchCallHistory({
      phone: searchPhone.trim() ? searchPhone : undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      callType: selectedCallType !== "ALL" ? selectedCallType : undefined,
    });
    setCurrentPage(1);
  };

  const handleClearFilters = async () => {
    setSearchPhone("");
    setFromDate("");
    setToDate("");
    setSelectedCallType("ALL");
    setCurrentPage(1);
    setFilteredData([]);
    setHasSearched(false);
    await storage.clear();
  };

  // Pagination calculations
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

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
        <div className="bg-white h-10 rounded-[15px] border border-slate-200 flex items-center w-[211px]">
          <div className="flex items-center justify-center w-[37.5px] h-full">
            <Search className="w-[15px] h-[15px] text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Nhập số điện thoại"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="flex-1 px-3 text-[12px] text-[#a0aec0] placeholder:text-[#a0aec0] focus:outline-none"
          />
        </div>

        <div className="bg-white h-10 rounded-[15px] border border-slate-200 flex items-center w-[180px] relative">
          <div className="absolute -top-5 left-2 text-[#718096] text-[10px] font-medium">
            Từ ngày
          </div>
          <div className="flex items-center justify-center w-[37.5px] h-full">
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="flex-1 px-3 text-[12px] text-[#a0aec0] placeholder:text-[#a0aec0] focus:outline-none"
          />
        </div>

        <div className="bg-white h-10 rounded-[15px] border border-slate-200 flex items-center w-[180px] relative">
          <div className="absolute -top-5 left-2 text-[#718096] text-[10px] font-medium">
            Đến ngày
          </div>
          <div className="flex items-center justify-center w-[37.5px] h-full">
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="flex-1 px-3 text-[12px] text-[#a0aec0] placeholder:text-[#a0aec0] focus:outline-none"
          />
        </div>

        <select
          value={selectedCallType}
          onChange={(e) =>
            setSelectedCallType(e.target.value as "ALL" | "IN" | "OUT")
          }
          className="bg-white h-10 rounded-[15px] border border-slate-200 flex items-center w-[140px] px-3 text-[12px] text-[#2d3748] focus:outline-none"
        >
          <option value="ALL">Tất cả</option>
          <option value="IN">IN</option>
          <option value="OUT">OUT</option>
        </select>

        <button
          onClick={handleSearch}
          className="bg-[#2b6cb0] text-white text-[12px] font-bold h-10 px-2 rounded-xl hover:bg-[#2c5aa0] transition-colors shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-[96px]"
        >
          Tìm kiếm
        </button>

        {(searchPhone || fromDate || toDate) && (
          <button
            onClick={handleClearFilters}
            className="bg-gray-200 text-gray-600 text-[12px] font-bold h-10 px-4 rounded-xl hover:bg-gray-300 transition-colors"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Loading and error states */}
      {loading && (
        <div className="mb-4 text-[#3182ce] text-[12px]">
          Đang tải dữ liệu...
        </div>
      )}
      {/* Removed inline error message in favor of toast */}

      {/* Results count */}
      {!loading && !error && hasSearched && (
        <div className="mb-4">
          <p className="text-[#718096] text-[12px]">
            {filteredData.length > 0
              ? `Tìm thấy ${filteredData.length} kết quả`
              : "Không có kết quả nào phù hợp"}
          </p>
        </div>
      )}

      {/* Call history table */}
      <div className="bg-white rounded-[15px] shadow-[0px_3.5px_5.5px_0px_rgba(0,0,0,0.02)] p-4 overflow-x-auto">
        <div className="min-w-[1000px]">
          {/* Table headers */}
          <div className="grid grid-cols-6 gap-4 text-[#a0aec0] text-[12px] font-bold mb-3 pb-1 border-b border-slate-200">
            <div>Số điện thoại</div>
            <div>Thời lượng</div>
            <div>Ngày giờ</div>
            <div>Người nhận</div>
            <div>Loại cuộc gọi</div>
            <div>Ghi âm</div>
          </div>

          {/* Table rows */}
          <div className="space-y-1">
            {loading ? (
              <LoadingSkeleton />
            ) : (
              hasSearched &&
              currentData.map((call, index) => (
                <div
                  key={index}
                  className="grid grid-cols-6 gap-4 items-center py-1 border-b border-slate-100"
                >
                  <div className="text-[#718096] text-[14px]">
                    {call.destination}
                  </div>
                  <div className="text-[#718096] text-[14px]">
                    {call.duration}
                  </div>
                  <div className="text-[#718096] text-[14px]">
                    {call.dateTime}
                  </div>
                  <div className="text-[#718096] text-[14px]">
                    {call.agentName}
                  </div>
                  <div className="text-[#718096] text-[12px]">
                    {call.callType}
                  </div>
                  <div className="flex items-center gap-2">
                    {call.mediaPath && (
                      <MediaActions mediaPath={call.mediaPath} />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

<<<<<<< HEAD
        {/* Pagination */}
=======
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
                  <Play className="w-4 h-4" />
                </button>
                <button className="text-[#718096] hover:text-[#4a5568] transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button className="text-[#718096] hover:text-[#4a5568] transition-colors">
                  <FileText className="w-4 h-4" />
                </button>
              </div>
              <div className="text-[#718096] text-[12px]">{call.summary}</div>
            </div>
          ))}
        </div>

        {/* Dynamic Pagination */}
>>>>>>> parent of bb00de5 (Remove unused images and UI components; update CallHistory to use new icons.)
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-[22px] text-[#4a5568] text-[12px]">
            <span>Tổng cộng {totalItems}</span>
            <div className="relative">
              <select
                className="appearance-none bg-white border border-[#cbd5e0] rounded-xl px-3 h-8 text-[#2d3748] text-[12px] pr-8"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
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
            <button
              className="w-8 h-8 flex items-center justify-center rounded-md text-[#718096] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 disabled:hover:bg-transparent"
              onClick={() => setCurrentPage(currentPage - 1)}
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

            {getPageNumbers(currentPage, totalPages).map((page, index) => (
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
                  typeof page === "number" ? setCurrentPage(page) : undefined
                }
                disabled={page === "..."}
                title={typeof page === "number" ? `Trang ${page}` : undefined}
              >
                {page}
              </button>
            ))}

            <button
              className="w-8 h-8 flex items-center justify-center rounded-md text-[#718096] rotate-180 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 disabled:hover:bg-transparent"
              onClick={() => setCurrentPage(currentPage + 1)}
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

      {/* Toast notification for errors */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          isVisible={isToastVisible}
          onClose={() => setIsToastVisible(false)}
          type="error"
        />
      )}
    </div>
  );
}
