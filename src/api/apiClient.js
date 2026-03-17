import axios from "axios";
import { getAuthToken, logout, refreshAccessToken } from "./authService";

// ✅ Hardcoded backend URL
const API_BASE_URL = "https://api.agrowmartindia.com/api"; // ← your Spring Boot API

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    // Attach JWT if valid
    if (token && token.split(".").length === 3) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ JWT attached:", config.url);
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  },
);

// 🔐 RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    console.log("✅ Response received:", response.config?.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config || {};
    const status = error.response?.status;
    const requestUrl = originalRequest.url || "";

    console.error(`❌ API Error: ${requestUrl} | Status: ${status}`);

    // 🚫 Network / CORS / backend down
    if (!error.response) {
      alert("Server is unreachable. Please try again later.");
      return Promise.reject(error);
    }

    // 🚫 Do NOT retry on login or missing routes
    if (
      status === 404 ||
      requestUrl.includes("/admin/auth/login") ||
      requestUrl.includes("/admin/auth/forgot-password") ||
      requestUrl.includes("/admin/auth/reset-password") ||
      requestUrl.includes("/api/auth/refresh-token")
    ) {
      return Promise.reject(error);
    }

    // 🔄 401 → try refresh token ONCE
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("🔄 Attempting token refresh...");

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Token refresh failed, logging out.");
        logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // 🚫 403 → permission issue
    if (status === 403) {
      alert("You do not have permission to perform this action.");
    }

    return Promise.reject(error);
  },
);

export default api;