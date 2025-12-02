import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000', // تأكد من أن هذا 3000، ليس 4000
});

// إضافة interceptor لإرسال التوكن في كل طلب
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;