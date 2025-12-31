export default function PrivacyPage() {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">سياسة الخصوصية</h1>
        <div className="text-gray-700 space-y-4">
          <p>نحن في سوق الرقة نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.</p>
          <h2 className="text-2xl font-semibold">البيانات التي نجمعها</h2>
          <p>نجمع الاسم، البريد الإلكتروني، رقم الهاتف، وعنوان التوصيل لإتمام الطلبات.</p>
          <h2 className="text-2xl font-semibold">كيف نستخدم البيانات</h2>
          <p>نستخدم البيانات لمعالجة الطلبات، تحسين الخدمة، وإرسال عروض خاصة.</p>
          <h2 className="text-2xl font-semibold">حماية البيانات</h2>
          <p>نستخدم تشفير SSL لحماية بياناتك، ولا نشاركها مع أطراف ثالثة دون إذنك.</p>
        </div>
      </div>
    );
  }