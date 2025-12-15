import axios from 'axios';

// تغيير الرابط حسب عنوان السيرفر الخاص بك
// تم تحديث المنفذ إلى 4000 بناءً على الخطأ الظاهر في رسالة المستخدم
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// إضافة التوكن لكل الطلبات تلقائياً
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// معالجة الأخطاء (مثل انتهاء صلاحية التوكن)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // إذا انتهت صلاحية الجلسة، قم بتسجيل الخروج (اختياري)
      if (typeof window !== 'undefined') {
        // localStorage.removeItem('token');
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;