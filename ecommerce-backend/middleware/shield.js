
/**
 * ميدل وير حماية البيانات (Shield Protocol) - Server Side
 * يقوم بتمويه البيانات قبل إرسالها لتظهر كرموز غير مفهومة في Network Tab
 */
const SCRAMBLE_KEY = 42;

const shieldMiddleware = (req, res, next) => {
  const isShieldActive = req.headers['x-shield-mode'] === 'active';

  if (isShieldActive) {
    const originalJson = res.json;

    res.json = function (data) {
      try {
        const SHIELD_PREFIX = 'f_shield_v1:';
        const jsonString = JSON.stringify(data);
        
        // تطبيق عملية التمويه (Scrambling)
        let scrambled = '';
        for (let i = 0; i < jsonString.length; i++) {
          scrambled += String.fromCharCode(jsonString.charCodeAt(i) ^ SCRAMBLE_KEY);
        }
        
        const encodedData = Buffer.from(scrambled).toString('base64');
        
        // إرسال النص المموه
        return res.send(`${SHIELD_PREFIX}${encodedData}`);
      } catch (error) {
        return originalJson.call(this, data);
      }
    };
  }

  next();
};

module.exports = shieldMiddleware;
