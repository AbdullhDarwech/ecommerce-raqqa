// مثال بسيط لتوليد محتوى تسويقي (يمكن استخدام OpenAI API لتحسينه)
const generateMarketingContent = (productName, categoryId) => {
    const categories = {
      1: 'Electronics', // افترض IDs
      // أضف الباقي
    };
    const category = categories[categoryId] || 'General';
    return `Discover ${productName} in ${category} – inspired by Raqqa's vibrant markets and perfect for local needs!`;
  };
  
  module.exports = { generateMarketingContent };