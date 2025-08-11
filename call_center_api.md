# 📞 Call Center Web Service API Documentation

**Version:** 1.0  
**Base URL:** `http://localhost:8080/api`

> **Security Note:**
>
> - On successful login, a **JWT token** is sent via **cookies**.
> - All endpoints **except login** require this token (cookie-based auth).

---

## 🔐 JWT Token Details

The JWT is issued upon successful login and sent via an **HTTP-only cookie**. It must be included in all protected endpoints.

### 📦 Payload Structure

```json
{
  "agentNum": "string",
  "agentPass": "string",
  "extension": "string",
  "queueNum": "string",
  "exp": 1722831285 // Token expiration timestamp (1 hour from issue time)
}
```

---

## 🔐 Authentication

### 🔹 Agent Login

> ⏱️ **Rate Limit:** 5 requests per minute per IP

- **Endpoint:** `POST /auth/login`
- **Description:** Authenticate an agent and return their session token via cookie.

#### 🔸 Request

**Headers**

```
Content-Type: application/json
Allow-Credentials: true
```

**Body**

```json
{
  "agentNum": "string",
  "agentPass": "string",
  "extension": "string",
  "queueNum": "790001" // or "790002"
}
```

#### 🔸 Responses

**✅ 200 OK**

```json
{
  "msg": "Agent login successfully"
}
```

**❌ 401 Unauthorized**

```json
{
  "msg": "Failed to login agent"
}
```

### 🔹 Agent Logout

> ⏱️ **Rate Limit:** 5 requests per minute per IP

- **Endpoint:** `GET /auth/logout`
- **Description:** Logout an agent via cookie.

#### 🔸 Request

**Headers**

```
Content-Type: application/json
Allow-Credentials: true
Cookie: jwt=<your_token_here>
```

#### 🔸 Responses

**✅ 200 OK**

```json
{
  "msg": "Agent logout successfully"
}
```

**❌ 401 Unauthorized**

```json
{
  "msg": "Failed to logout agent"
}
```

---

## 🧍 Agent Management

### 🔹 Check Agent Status

> ⏱️ **Rate Limit:** 5 requests per minute per IP

- **Endpoint:** `GET /agent/status`
- **Description:** Retrieve current status of the authenticated agent.

#### 🔸 Request

**Headers**

```
Allow-Credentials: true
Cookie: jwt=<your_token_here>
```

#### 🔸 Responses

**✅ 200 OK**

```json
{
  "msg": "Retrieved agent status successfully",
  "data": {
    "status": "integer"
  }
}
```

**❌ 401 Unauthorized or 500 Server Error**

```json
{
  "msg": "Failed to retrieve agent status",
  "data": null
}
```

---

### 🔹 Change Agent Status

- **Endpoint:** `POST /agent/status`
- **Description:** Update the agent’s current status.

> ⏱️ **Rate Limit:** 5 requests per minute per IP

- **Endpoint:** `POST /agent/login`
- **Description:** Authenticate an agent and return their session token via cookie.

#### 🔸 Request

**Headers**

```
Content-Type: application/json
Allow-Credentials: true
Cookie: jwt=<your_token_here>
```

**Body**

```json
{
  "oldStatus": <status_id>
  "newStatus": <status_id>
}
```

> ✅ Agent identity is resolved from the JWT, so no need to send agentNum, extension, or queueNum.

#### 🔸 Responses

**✅ 200 OK**

```json
{
  "msg": "Changed agent status successfully"
}
```

**❌ 400 Bad Request / 401 Unauthorized**

```json
{
  "msg": "Failed to change agent status"
}
```

---

## 📞 Call History

### 🔹 Retrieve Call History

- **Endpoint:** `POST /agent/history`
- **Description:** Query past call logs by date range, type, and caller info.

#### 🔸 Request

**Headers**

```
Content-Type: application/json
Allow-Credentials: true
Cookie: jwt=<your_token_here>
```

**Body**

```json
{
  "fromDateTime": "yyyy-MM-dd HH:mm:ss",
  "toDateTime": "yyyy-MM-dd HH:mm:ss",
  "callType": "IN" | "OUT",
  "source": "string",
  "destination": "string"
}
```

#### 🔸 Responses

**✅ 200 OK**

```json
{
  "msg": "Successfully retrieve call history",
  "data": [
    {
      "agentNum": "string",
      "agentName": "string",
      "duration": int,
      "source": "string",
      "destination": "string",
      "callType": "IN" | "OUT" | "LOCAL",
      "callDate": int, // UNIX TIMESTAMP
      "mediaPath": "string" || ""
    }
  ]
}
```

**❌ 400 / 401 / 500**

```json
{
  "msg": "Failed to retrieve call history",
  "data": null
}
```

---

## 🛡️ Authentication & Authorization

- JWT is issued on login and stored in an **HTTP-only cookie**.
- For subsequent requests, the cookie must be included (e.g., browser session or manual injection via tools like Postman).
- You **do not need to manually pass the Authorization header** unless customized on your backend.

---

## 📌 Status Codes Reference

| Code | Description                 |
| ---- | --------------------------- |
| 200  | OK                          |
| 400  | Bad Request (invalid input) |
| 401  | Unauthorized (JWT missing)  |
| 403  | Forbidden (invalid JWT)     |
| 500  | Internal Server Error       |

---

## 🧾 Agent Status ID Reference

Below are the valid values for the `status` field used in agent status endpoints.

| ID  | Code                  | Description                                   |
| --- | --------------------- | --------------------------------------------- |
| -2  | `dnd_off`             | Tắt DND (Disable Do Not Disturb mode)         |
| -1  | `dnd_normal`          | Không có lý do cụ thể                         |
| 0   | `dnd_get_info`        | Tra cứu thông tin                             |
| 1   | `dnd_tea`             | Giải khát                                     |
| 2   | `dnd_lunch`           | Ăn trưa                                       |
| 3   | `dnd_training`        | Đào tạo                                       |
| 4   | `dnd_meeting`         | Họp                                           |
| 5   | `dnd_outbound_assign` | Thực hiện cuộc gọi ra                         |
| 6   | `dnd_support`         | Hỗ trợ khách hàng                             |
| 7   | `dnd_report`          | Báo cáo                                       |
| 8   | `dnd_relax`           | Thư giãn, giải trí                            |
| 9   | `dnd_wc`              | Đi vệ sinh                                    |
| 10  | `dnd_livechat`        | Hỗ trợ khách hàng qua kênh chat               |
| 11  | `dnd_acw`             | Ghi nhận thông tin sau khi tiếp nhận cuộc gọi |
