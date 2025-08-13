// api.ts - Call Center API handler
// This file provides simple functions to interact with the main call center APIs.
// All functions use fetch and handle cookies automatically (credentials: 'include').
//
// Endpoints covered:
// 1. Agent Login      - POST /agent/login
// 2. Agent Logout     - POST /agent/logout
// 3. Check Agent Status - GET /agent/status
// 4. Retrieve Call History - POST /agent/history
//
// Usage: Import and call these functions from your pages/components.
//
// NOTE: All requests assume the backend is at http://localhost:8080/api
//
// 🚨 MOCK API ENABLED FOR UI TESTING 🚨
// Real API calls are commented out below. The mock API provides realistic data
// and filtering behavior for testing the UI without requiring a backend server.
// 
// To switch back to real API:
// 1. Comment out the mock functions (lines ~60-180)
// 2. Uncomment the real API functions (lines ~185-280)
// 3. Ensure your backend server is running at http://localhost:8080

const BASE_URL = 'http://localhost:8080/api';

// Type definitions for API parameters
export interface LoginParams {
  agentNum: string;
  agentPass: string;
  extension: string;
  queueNum: string;
}

export interface CallHistoryParams {
  fromDateTime: string; // 'yyyy-MM-dd HH:mm:ss'
  toDateTime: string;   // 'yyyy-MM-dd HH:mm:ss'
  callType?: 'IN' | 'OUT' | 'ALL';
  source?: string;
  destination?: string;
}

export interface ChangeStatusParams {
  oldStatus: string; // numeric string per API (e.g., "5")
  newStatus: string; // numeric string per API (e.g., "6")
}

// ===== MOCK DATA FOR UI TESTING =====

// Function to generate fresh mock data with hardcoded diverse dates for testing
const generateMockCallHistoryData = () => {
  return [
  // Today's calls (December 21, 2024 - various times)
  {
    destination: "0123456789",
    duration: 120000, // 2 minutes in milliseconds
    callDate: new Date('2024-12-21 14:30:00').getTime(), // Today 2:30 PM
    agentName: "Nguyễn Văn A",
    callType: "IN",
    mediaPath: "/recordings/call_001.mp3"
  },
  {
    destination: "0987654321",
    duration: 300000, // 5 minutes in milliseconds
    callDate: new Date('2024-12-21 13:15:00').getTime(), // Today 1:15 PM
    agentName: "Trần Thị B",
    callType: "OUT",
    mediaPath: "/recordings/call_002.mp3"
  },
  {
    destination: "0555666777",
    duration: 45000, // 45 seconds in milliseconds
    callDate: new Date('2024-12-21 11:45:00').getTime(), // Today 11:45 AM
    agentName: "Lê Văn C",
    callType: "IN",
    mediaPath: "/recordings/call_003.mp3"
  },
  {
    destination: "0111222333",
    duration: 180000, // 3 minutes in milliseconds
    callDate: new Date('2024-12-21 10:20:00').getTime(), // Today 10:20 AM
    agentName: "Phạm Thị D",
    callType: "OUT",
    mediaPath: "/recordings/call_004.mp3"
  },
  {
    destination: "0444555666",
    duration: 90000, // 1.5 minutes in milliseconds
    callDate: new Date('2024-12-21 09:30:00').getTime(), // Today 9:30 AM
    agentName: "Hoàng Văn E",
    callType: "IN",
    mediaPath: "/recordings/call_005.mp3"
  },
  {
    destination: "0333444555",
    duration: 240000, // 4 minutes in milliseconds
    callDate: new Date('2024-12-21 08:15:00').getTime(), // Today 8:15 AM
    agentName: "Vũ Thị F",
    callType: "OUT",
    mediaPath: "/recordings/call_006.mp3"
  },
  
  // Yesterday's calls (December 20, 2024 - various times)
  {
    destination: "0222333444",
    duration: 60000, // 1 minute in milliseconds
    callDate: new Date('2024-12-20 16:45:00').getTime(), // Yesterday 4:45 PM
    agentName: "Đặng Văn G",
    callType: "IN",
    mediaPath: "/recordings/call_007.mp3"
  },
  {
    destination: "0777888999",
    duration: 150000, // 2.5 minutes in milliseconds
    callDate: new Date('2024-12-20 15:20:00').getTime(), // Yesterday 3:20 PM
    agentName: "Bùi Thị H",
    callType: "OUT",
    mediaPath: "/recordings/call_008.mp3"
  },
  {
    destination: "0666777888",
    duration: 90000, // 1.5 minutes
    callDate: new Date('2024-12-20 14:10:00').getTime(), // Yesterday 2:10 PM
    agentName: "Nguyễn Thị I",
    callType: "IN",
    mediaPath: "/recordings/call_009.mp3"
  },
  {
    destination: "0888999000",
    duration: 300000, // 5 minutes
    callDate: new Date('2024-12-20 12:30:00').getTime(), // Yesterday 12:30 PM
    agentName: "Trần Văn J",
    callType: "OUT",
    mediaPath: "/recordings/call_010.mp3"
  },
  {
    destination: "0999000111",
    duration: 180000, // 3 minutes
    callDate: new Date('2024-12-20 11:00:00').getTime(), // Yesterday 11:00 AM
    agentName: "Lê Thị K",
    callType: "IN",
    mediaPath: "/recordings/call_011.mp3"
  },
  
  // 2 days ago calls (December 19, 2024)
  {
    destination: "0111222333",
    duration: 120000, // 2 minutes
    callDate: new Date('2024-12-19 17:15:00').getTime(), // 2 days ago 5:15 PM
    agentName: "Phạm Văn L",
    callType: "OUT",
    mediaPath: "/recordings/call_012.mp3"
  },
  {
    destination: "0123456789",
    duration: 200000, // 3.3 minutes
    callDate: new Date('2024-12-19 16:00:00').getTime(), // 2 days ago 4:00 PM
    agentName: "Nguyễn Văn A",
    callType: "IN",
    mediaPath: "/recordings/call_013.mp3"
  },
  {
    destination: "0987654321",
    duration: 240000, // 4 minutes
    callDate: new Date('2024-12-19 14:45:00').getTime(), // 2 days ago 2:45 PM
    agentName: "Trần Thị B",
    callType: "OUT",
    mediaPath: "/recordings/call_014.mp3"
  },
  {
    destination: "0555666777",
    duration: 90000, // 1.5 minutes
    callDate: new Date('2024-12-19 13:20:00').getTime(), // 2 days ago 1:20 PM
    agentName: "Lê Văn C",
    callType: "IN",
    mediaPath: "/recordings/call_015.mp3"
  },
  
  // 3 days ago calls (December 18, 2024)
  {
    destination: "0444555666",
    duration: 150000, // 2.5 minutes
    callDate: new Date('2024-12-18 18:30:00').getTime(), // 3 days ago 6:30 PM
    agentName: "Hoàng Văn E",
    callType: "OUT",
    mediaPath: "/recordings/call_016.mp3"
  },
  {
    destination: "0333444555",
    duration: 300000, // 5 minutes
    callDate: new Date('2024-12-18 17:15:00').getTime(), // 3 days ago 5:15 PM
    agentName: "Vũ Thị F",
    callType: "IN",
    mediaPath: "/recordings/call_017.mp3"
  },
  {
    destination: "0222333444",
    duration: 120000, // 2 minutes
    callDate: new Date('2024-12-18 16:00:00').getTime(), // 3 days ago 4:00 PM
    agentName: "Đặng Văn G",
    callType: "OUT",
    mediaPath: "/recordings/call_018.mp3"
  },
  
  // 1 week ago calls (December 14, 2024)
  {
    destination: "0777888999",
    duration: 180000, // 3 minutes
    callDate: new Date('2024-12-14 19:45:00').getTime(), // 1 week ago 7:45 PM
    agentName: "Bùi Thị H",
    callType: "IN",
    mediaPath: "/recordings/call_019.mp3"
  },
  {
    destination: "0666777888",
    duration: 240000, // 4 minutes
    callDate: new Date('2024-12-14 18:30:00').getTime(), // 1 week ago 6:30 PM
    agentName: "Nguyễn Thị I",
    callType: "OUT",
    mediaPath: "/recordings/call_020.mp3"
  },
  
  // 2 weeks ago calls (December 7, 2024)
  {
    destination: "0888999000",
    duration: 90000, // 1.5 minutes
    callDate: new Date('2024-12-07 20:15:00').getTime(), // 2 weeks ago 8:15 PM
    agentName: "Trần Văn J",
    callType: "IN",
    mediaPath: "/recordings/call_021.mp3"
  },
  {
    destination: "0999000111",
    duration: 300000, // 5 minutes
    callDate: new Date('2024-12-07 19:00:00').getTime(), // 2 weeks ago 7:00 PM
    agentName: "Lê Thị K",
    callType: "OUT",
    mediaPath: "/recordings/call_022.mp3"
  },
  
  // 1 month ago calls (November 21, 2024)
  {
    destination: "0111222333",
    duration: 150000, // 2.5 minutes
    callDate: new Date('2024-11-21 21:30:00').getTime(), // 1 month ago 9:30 PM
    agentName: "Phạm Văn L",
    callType: "IN",
    mediaPath: "/recordings/call_023.mp3"
  },
  {
    destination: "0123456789",
    duration: 200000, // 3.3 minutes
    callDate: new Date('2024-11-21 20:15:00').getTime(), // 1 month ago 8:15 PM
    agentName: "Nguyễn Văn A",
    callType: "OUT",
    mediaPath: "/recordings/call_024.mp3"
  },
  
  // 2 months ago calls (October 21, 2024)
  {
    destination: "0987654321",
    duration: 180000, // 3 minutes
    callDate: new Date('2024-10-21 22:00:00').getTime(), // 2 months ago 10:00 PM
    agentName: "Trần Thị B",
    callType: "IN",
    mediaPath: "/recordings/call_025.mp3"
  }
  ];
};

// Get fresh mock data
const mockCallHistoryData = generateMockCallHistoryData();

// Log mock data for debugging
console.log('📊 Mock API: Generated', mockCallHistoryData.length, 'call history records');
console.log('📊 Mock API: Sample record:', mockCallHistoryData[0]);

// Log date distribution for debugging
const dateDistribution = mockCallHistoryData.reduce((acc, record) => {
  const date = new Date(record.callDate).toDateString();
  acc[date] = (acc[date] || 0) + 1;
  return acc;
}, {} as Record<string, number>);
console.log('📅 Mock API: Date distribution:', dateDistribution);

// Log specific date ranges for testing
const sortedDates = mockCallHistoryData.map(r => new Date(r.callDate)).sort((a, b) => a.getTime() - b.getTime());
console.log('📅 Mock API: Date range - Earliest:', sortedDates[0].toDateString(), 'Latest:', sortedDates[sortedDates.length - 1].toDateString());

// Mock agent status data
const mockAgentStatus = {
  msg: "Success",
  data: { status: -2 } // Default to "DND Off" (Available)
};

// Helper function to filter mock data based on API parameters
const filterMockCallHistory = (params: CallHistoryParams) => {
  let filtered = [...mockCallHistoryData];
  
  console.log('🔍 Mock API: Filtering with params:', params);
  console.log('🔍 Mock API: Starting with', filtered.length, 'records');
  
  // Filter by date range - handle the exact format the component sends
  if (params.fromDateTime && params.toDateTime) {
    const fromDate = new Date(params.fromDateTime).getTime();
    const toDate = new Date(params.toDateTime).getTime();
    
    console.log('🔍 Mock API: Date filter - from:', new Date(fromDate).toLocaleString(), 'to:', new Date(toDate).toLocaleString());
    console.log('🔍 Mock API: Raw date strings:', params.fromDateTime, 'to', params.toDateTime);
    
    filtered = filtered.filter(item => {
      const callTime = item.callDate;
      const isInRange = callTime >= fromDate && callTime <= toDate;
      console.log('🔍 Mock API: Call time:', new Date(callTime).toLocaleString(), 'in range:', isInRange);
      return isInRange;
    });
    
    console.log('🔍 Mock API: After date filter:', filtered.length, 'records');
  }
  
  // Filter by call type
  if (params.callType && params.callType !== 'ALL') {
    console.log('🔍 Mock API: Call type filter:', params.callType);
    
    filtered = filtered.filter(item => item.callType === params.callType);
    
    console.log('🔍 Mock API: After call type filter:', filtered.length, 'records');
  }
  
  // Filter by phone number (source or destination)
  if (params.source || params.destination) {
    const searchPhone = (params.source || params.destination || '').replace(/\s/g, '');
    if (searchPhone) {
      console.log('🔍 Mock API: Phone search:', searchPhone);
      
      filtered = filtered.filter(item => 
        item.destination.includes(searchPhone) || 
        item.agentName.toLowerCase().includes(searchPhone.toLowerCase())
      );
      
      console.log('🔍 Mock API: After phone filter:', filtered.length, 'records');
    }
  }
  
  console.log('🔍 Mock API: Final filtered result:', filtered.length, 'records');
  return filtered;
};

// ===== MOCK API FUNCTIONS =====

/**
 * Mock login function - simulates successful login
 */
export async function loginAgent({ agentNum, agentPass, extension, queueNum }: LoginParams): Promise<{msg: string}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock validation - accept any non-empty credentials
  if (!agentNum || !agentPass || !extension || !queueNum) {
    throw new Error('Thiếu thông tin đăng nhập');
  }
  
  // Simulate successful login
  return { msg: 'Đăng nhập thành công' };
}

/**
 * Mock logout function - simulates successful logout
 */
export async function logoutAgent(): Promise<{msg: string}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return { msg: 'Đăng xuất thành công' };
}

/**
 * Mock get agent status function
 */
export async function getAgentStatus(): Promise<{msg: string, data: {status: string | number}}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return mockAgentStatus;
}

/**
 * Mock get call history function - applies filters like real API
 */
export async function getCallHistory(params: CallHistoryParams): Promise<{msg: string, data: {callHistory: Array<any>}}> {
  console.log('🚀 Mock API: getCallHistory called with params:', params);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Apply filters to mock data
  const filteredData = filterMockCallHistory(params);
  
  console.log('🚀 Mock API: Returning filtered data:', filteredData.length, 'records');
  
  return {
    msg: 'Success',
    data: { callHistory: filteredData }
  };
}

/**
 * Mock change agent status function
 */
export async function changeAgentStatus({ oldStatus, newStatus }: ChangeStatusParams): Promise<{msg: string}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Simulate status change
  mockAgentStatus.data.status = parseInt(newStatus);
  
  return { msg: 'Trạng thái đã được cập nhật thành công' };
}

// ===== REAL API FUNCTIONS (COMMENTED OUT FOR MOCK TESTING) =====

/*
export async function loginAgent({ agentNum, agentPass, extension, queueNum }: LoginParams): Promise<{msg: string}> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ agentNum, agentPass, extension, queueNum }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || 'Login failed');
  return data;
}

export async function logoutAgent(): Promise<{msg: string}> {
  const res = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || 'Logout failed');
  return data;
}

export async function getAgentStatus(): Promise<{msg: string, data: {status: string | number}}> {
  const res = await fetch(`${BASE_URL}/agent/status`, {
    method: 'GET',
    credentials: 'include',
  });
  // Handle blank/empty responses as DND Off (Available status)
  const text = await res.text();
  if (res.ok && (!text || text.trim() === '')) {
    // Blank response means DND Off (Available status)
    return { msg: 'Success', data: { status: -2 } }; // -2 maps to "DND Off"
  }

  // Parse JSON for non-empty responses
  const data = JSON.parse(text);
  if (!res.ok) throw new Error(data.msg || 'Failed to get status');
  return data;
}

export async function getCallHistory(params: CallHistoryParams): Promise<{msg: string, data: {callHistory: Array<any>}}> {
  const res = await fetch(`${BASE_URL}/agent/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || 'Failed to get call history');
  return data;
}

export async function changeAgentStatus({ oldStatus, newStatus }: ChangeStatusParams): Promise<{msg: string}> {
  const res = await fetch(`${BASE_URL}/agent/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ oldStatus, newStatus }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || 'Failed to change agent status');
  return data;
}
*/

// All functions throw on error. Use try/catch in your components/pages.
// Example:
// try { await loginAgent({ ... }); } catch (e) { alert(e.message); }
