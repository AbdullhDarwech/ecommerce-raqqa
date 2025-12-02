export default function AboutPage() {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">عن سوق الرقة</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">من نحن</h2>
            <p className="text-gray-700 mb-4">
              سوق الرقة هو السوق الإلكتروني الأول في الرقة، نقدم منتجات محلية وعالمية بأسعار تنافسية وتوصيل سريع.
            </p>
            <p className="text-gray-700">
              هدفنا هو تسهيل التسوق لسكان الرقة وتقديم خدمة عالية الجودة.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">رؤيتنا</h2>
            <p className="text-gray-700">
              أن نكون المنصة الأولى للتجارة الإلكترونية في الرقة، مع التركيز على المنتجات المحلية والدعم المجتمعي.
            </p>
          </div>
        </div>
      </div>
    );
  }