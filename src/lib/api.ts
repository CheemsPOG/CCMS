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

/**
 * Login an agent. Sets JWT cookie on success.
 * @param {LoginParams} params - Login parameters
 * @returns {Promise<{msg: string}>}
 */
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

/**
 * Logout the current agent (clears JWT cookie).
 * @returns {Promise<{msg: string}>}
 */
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

/**
 * Get the current agent's status.
 * @returns {Promise<{msg: string, data: {status: string | number}}>} status may be numeric, numeric string, or code string
 */
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

/**
 * Retrieve call history for the agent.
 * @param {CallHistoryParams} params - Query parameters
 * @returns {Promise<{msg: string, data: {callHistory: Array<any>}}>} 
 */
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

/**
 * Change the agent's status.
 * @param {ChangeStatusParams} params - oldStatus and newStatus (see status table in API docs)
 * @returns {Promise<{msg: string}>}
 */
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

// All functions throw on error. Use try/catch in your components/pages.
// Example:
// try { await loginAgent({ ... }); } catch (e) { alert(e.message); }
