
import axios from 'axios';
import { Shield } from './shield';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const optimizeImage = (url: string, width: number = 800) => {
  if (!url) return '/placeholder.png';
  if (url.startsWith('/uploads')) return `${API_URL}${url}`;
  if (url.includes('res.cloudinary.com')) return url.replace('/upload/', `/upload/f_auto,q_auto:eco,w_${width},c_scale/`);
  return url;
};

export const getBlurPlaceholder = () => {
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAD0lEQVR42mP8/5+hHgAFAAb/D8fL0oAAAAAASUVORK5CYII=";
};

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['X-Shield-Mode'] = 'active';
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    // فك التشفير الشامل للبيانات القادمة من السيرفر
    if (response.data) {
      // تصحيح: لا تقم بعمل Spread للبيانات إذا كانت نصاً (String)
      // Shield.unveil سيعيد البيانات في شكلها الصحيح (مصفوفة، كائن، أو نص)
      response.data = Shield.unveil(response.data);
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.data) {
      error.response.data = Shield.unveil(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;
