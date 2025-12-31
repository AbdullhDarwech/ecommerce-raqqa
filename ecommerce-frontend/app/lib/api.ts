
// import axios from 'axios';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// /**
//  * تحويل رابط الصورة إلى نسخة فائقة الضغط والسرعة
//  * تم تقليل الجودة إلى q_20 لضمان التحميل الفوري
//  */
// export const optimizeImage = (url: string, width: number = 800) => {
//   if (!url) return '/placeholder.png';
  
//   // إذا كان الرابط محلياً
//   if (url.startsWith('/uploads')) {
//     return `${API_URL}${url}`;
//   }

//   // تحسين صور Cloudinary - استخدام q_auto:eco وضغط عدواني
//   if (url.includes('res.cloudinary.com')) {
//     // f_auto: اختيار أفضل صيغة
//     // q_auto:eco: ضغط اقتصادي جداً
//     return url.replace('/upload/', `/upload/f_auto,q_auto:eco,w_${width},c_scale/`);
//   }

//   // تحسين صور Unsplash - تقليل q إلى 20 لسرعة خيالية
//   if (url.includes('images.unsplash.com')) {
//     const baseUrl = url.split('?')[0];
//     return `${baseUrl}?auto=format,compress&q=20&w=${width}`;
//   }

//   // صور Picsum للتجارب
//   if (url.includes('picsum.photos')) {
//     return `${url}?blur=2`; // إضافة تمويه لتقليل حجم الداتا في الصور التجريبية
//   }

//   return url;
// };

// // مولد صور مصغرة جداً للـ Blur placeholder
// export const getBlurPlaceholder = () => {
//   return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
// };

// api.interceptors.request.use(
//   (config) => {
//     if (typeof window !== 'undefined') {
//       const token = localStorage.getItem('token');
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default api;





import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // إضافة وقت انتظار لمنع تعليق الموقع
  headers: {
    'Content-Type': 'application/json',
  },
});

export const optimizeImage = (url: string, width: number = 800) => {
  if (!url) return '/placeholder.png';
  
  if (url.startsWith('/uploads')) {
    return `${API_URL}${url}`;
  }

  // استخدام q_auto:eco لضغط أعلى وتوفير بيانات
  if (url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', `/upload/f_auto,q_auto:eco,w_${width},c_scale/`);
  }

  // ضغط Unsplash عدواني جداً (q=10) للتحميل السريع
  if (url.includes('images.unsplash.com')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?auto=format,compress&q=10&w=${width}`;
  }

  return url;
};

export const getBlurPlaceholder = () => {
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAD0lEQVR42mP8/5+hHgAFAAb/D8fL0oAAAAAASUVORK5CYII=";
};

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

export default api;