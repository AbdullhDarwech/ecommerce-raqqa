
/**
 * بروتوكول الدرع السيادي (Sovereign Shield) - الإصدار المستقر 2.2
 * تم التعديل ليدعم معالجة محارف الـ Unicode (العربية) بشكل صحيح بين السيرفر والكلينت
 */

const SHIELD_PREFIX = 'f_shield_v1:';
const SCRAMBLE_KEY = 42; 

export const Shield = {
  /**
   * تمويه بصري (UI Scrambling)
   * يستخدم فقط للتأثيرات البصرية في الواجهة
   */
  scramble: (text: string): string => {
    if (!text || typeof text !== 'string') return '';
    if (text.startsWith(SHIELD_PREFIX)) return 'ò¥ó„óƒòª...';
    
    let scrambled = '';
    for (let i = 0; i < text.length; i++) {
      scrambled += String.fromCharCode(text.charCodeAt(i) ^ SCRAMBLE_KEY);
    }
    return scrambled;
  },

  /**
   * فك التشفير العميق (Deep Unveiling)
   * يقوم بفك تشفير البيانات القادمة من السيرفر وإعادتها لأصلها العربي
   */
  unveil: (data: any): any => {
    if (!data) return data;

    // معالجة النصوص المشفرة ببادئة الدرع
    if (typeof data === 'string' && data.startsWith(SHIELD_PREFIX)) {
      try {
        const encoded = data.substring(SHIELD_PREFIX.length);
        
        // 1. تحويل الـ Base64 إلى مصفوفة بايتات (Uint8Array)
        const binaryString = atob(encoded);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // 2. تحويل البايتات إلى نص (UTF-8) - هذا هو النص المشفر (Scrambled)
        const scrambled = new TextDecoder().decode(bytes);

        // 3. عكس عملية XOR لاستعادة النص الأصلي
        let unveiled = '';
        for (let i = 0; i < scrambled.length; i++) {
          unveiled += String.fromCharCode(scrambled.charCodeAt(i) ^ SCRAMBLE_KEY);
        }
        
        // 4. محاولة تحويل النص المستعاد إلى JSON إذا كان كائناً أو مصفوفة
        try {
          const parsed = JSON.parse(unveiled);
          return Shield.unveil(parsed); // فك تشفير داخلي للمحتويات
        } catch {
          return unveiled; // نص عادي
        }
      } catch (e) {
        console.error("Shield Protocol Failure:", e);
        return data;
      }
    }

    // معالجة المصفوفات بشكل متداخل
    if (Array.isArray(data)) {
      return data.map(item => Shield.unveil(item));
    }

    // معالجة الكائنات بشكل متداخل
    if (typeof data === 'object' && data !== null) {
      const unveiledObj: any = {};
      for (const key in data) {
        unveiledObj[key] = Shield.unveil(data[key]);
      }
      return unveiledObj;
    }

    return data;
  }
};
