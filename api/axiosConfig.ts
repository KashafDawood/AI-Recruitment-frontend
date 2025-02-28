import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { refreshToken } from "./auth/refreshToken";
import { deleteSession } from "@/app/_lib/session";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Store for in-flight token refreshes
let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: AxiosRequestConfig;
}[] = [];

// Process the failed requests queue
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

// Response interceptor for handling token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, add this request to the queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        await refreshToken();

        // Signal all the failed requests to retry
        processQueue(null);

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, reject all queued requests and redirect to login
        processQueue(refreshError as Error);

        // Handle session deletion and redirect properly
        if (typeof window !== "undefined") {
          // Handle session deletion
          deleteSession()
            .then(() => {
              // Redirect to login page after session is deleted
              window.location.href = "/login";
            })
            .catch(() => {
              // If session deletion fails, still redirect to login
              window.location.href = "/login";
            });
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For any 401 errors not related to the original request
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Don't use await here, just handle the promise
        deleteSession()
          .then(() => {
            window.location.href = "/login";
          })
          .catch(() => {
            window.location.href = "/login";
          });
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
