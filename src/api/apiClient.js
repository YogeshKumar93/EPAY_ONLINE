// api/apiClient.js
import axios from "axios";
import { BASE_URL } from "./ApiEndpoints";
import { getToken, clearToken } from "../contexts/AuthContext";
import { forceLogout } from "../utils/forceLogout";

const IV = import.meta.env.VITE_KEY_IV;
const SECRET_KEY = import.meta.env.VITE_SECART_KEY;

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 180000, // 3 minutes
  headers: {
    "Content-Type": "application/json",
  },
});

// ------------------
// Request Deduplication + Memoization
// ------------------
const pendingRequests = new Map();
const cache = new Map();
const CACHE_TTL = 2000;

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      forceLogout();
    }
    return Promise.reject(error);
  }
);

export const apiCall = async (
  method,
  url,
  data = null,
  params = null,
  useClientRef = true
) => {
  try {
    const token = getToken();

    // For GET requests: api_token goes in params (query string)
    // For other requests: api_token goes in data (payload)
    if (method.toLowerCase() === "get") {
      // GET request - api_token in query params only
      params = {
        ...(params || {}),
        api_token: token || "",
      };
      // Don't add api_token to data for GET requests
    } else {
      // Non-GET request (POST, PUT, DELETE, etc.) - api_token in payload only
      if (data) {
        if (data instanceof FormData) {
          data.append("api_token", token || "");
        } else {
          data = {
            ...data,
            api_token: token || "",
          };
        }
      } else {
        data = {
          api_token: token || "",
        };
      }
      // Don't add api_token to params for non-GET requests
    }

    const key = JSON.stringify({ method, url, data, params });

    // 1. Cache Check
    if (cache.has(key)) {
      const { timestamp, response } = cache.get(key);
      if (Date.now() - timestamp < CACHE_TTL) {
        return { error: null, response };
      } else {
        cache.delete(key);
      }
    }

    // 2. If request is already pending, return the same promise
    if (pendingRequests.has(key)) {
      return pendingRequests.get(key);
    }

    const isFormData = data instanceof FormData;

    const requestPromise = apiClient({
      method,
      url,
      data,
      params,
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
    })
      .then((res) => {
        const response = res.data;
        cache.set(key, { response, timestamp: Date.now() });
        pendingRequests.delete(key);
        return { error: null, response };
      })
      .catch((err) => {
        pendingRequests.delete(key);
        return { error: err.response?.data || err.message, response: null };
      });

    pendingRequests.set(key, requestPromise);

    return requestPromise;
  } catch (error) {
    console.error("API Error:", error);
    return { error: error.message, response: null };
  }
};

export default apiClient;
