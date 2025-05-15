// src/lib/axios.ts
import axios from 'axios';
// import { toast } from 'react-toastify';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor - đơn giản hơn vì Clerk đã handle auth
axiosInstance.interceptors.request.use(
  (config) => {
    // Có thể thêm các headers khác nếu cần
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - tập trung vào xử lý lỗi business
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    // Xử lý các loại lỗi business
    if (error.response) {
      switch (error.response.status) {
        case 403:
          break;
        case 404:
          break;
        case 429: // Rate limiting
          toast.error('Quá nhiều yêu cầu, vui lòng thử lại sau');
          break;
        case 500:
          toast.error('Lỗi hệ thống, vui lòng thử lại sau');
          break;
        default:
          toast.error(error.response.data?.message || 'Có lỗi xảy ra');
      }
    } else if (error.request) {
      // Lỗi network
      toast.error('Không thể kết nối đến máy chủ');
    }

    // Log error cho monitoring
    logError(error);

    return Promise.reject(error);
  }
);

// Thêm retry logic cho các API calls quan trọng
import axiosRetry from 'axios-retry';

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // Chỉ retry với lỗi network hoặc server error
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      (error.response && error.response.status >= 500)
    );
  }
});

// Hàm log lỗi tập trung
const logError = (error) => {
  console.error('API Error:', {
    url: error.config?.url,
    method: error.config?.method,
    status: error.response?.status,
    message: error.message,
    data: error.response?.data
  });
  
  // Có thể thêm logging service như Sentry ở đây
};

export default axiosInstance;