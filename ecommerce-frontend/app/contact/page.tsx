export default function ContactPage() {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">اتصل بنا</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">معلومات الاتصال</h2>
            <p>هاتف: 0930904315</p>
            <p>بريد: info@raqamarket.com</p>
            <p>عنوان: الرقة، سوريا</p>
          </div>
          <form className="space-y-4">
            <input type="text" placeholder="الاسم" className="w-full border p-2 rounded" />
            <input type="email" placeholder="البريد" className="w-full border p-2 rounded" />
            <textarea placeholder="الرسالة" className="w-full border p-2 rounded" rows={4}></textarea>
            <button type="submit" className="bg-Furato-green text-white px-6 py-2 rounded">إرسال</button>
          </form>
        </div>
      </div>
    );
  }