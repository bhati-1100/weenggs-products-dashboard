import axios, { CanceledError } from "axios";
import { message } from "antd";

const axiosInstance = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* Request Interceptor */
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

/* Response Interceptor */
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't toast on intentional cancellations (React Query supersedes a query,
    // StrictMode double-mount in dev, component unmount, etc.).
    if (
      axios.isCancel(error) ||
      error instanceof CanceledError ||
      error?.code === "ERR_CANCELED" ||
      error?.name === "AbortError" ||
      error?.name === "CanceledError"
    ) {
      return Promise.reject(error);
    }

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";

    message.error(errorMessage);

    return Promise.reject(error);
  }
);

export default axiosInstance;