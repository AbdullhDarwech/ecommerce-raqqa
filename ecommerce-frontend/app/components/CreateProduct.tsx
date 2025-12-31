// file: components/CreateProduct.tsx
'use client';
import { ChangeEvent, useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function CreateProduct() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    brand: '',
    pricePurchase: 0,
    priceRental: 0,
    stockQuantity: 0,
    discountPercentage: 0,
    isBestSeller: false,
  });

  // تحميل البيانات الأساسية
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, brnds] = await Promise.all([
          api.get('/categories'),
          api.get('/brands'),
        ]);

        setCategories(cats.data);
        setBrands(brnds.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // رفع الصور
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      setNewImages([...newImages, ...files]);
    }
  };
  const removeLocalImage = (index: number) => {
    const arr = [...newImages];
    arr.splice(index, 1);
    setNewImages(arr);
  };

  const handleSave = async () => {
    const formData = new FormData();

    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('category', product.category);
    formData.append('subcategory', product.subcategory);
    formData.append('brand', product.brand);
    formData.append('pricePurchase', product.pricePurchase.toString());
    formData.append('priceRental', product.priceRental.toString());
    formData.append('stockQuantity', product.stockQuantity.toString());
    formData.append('discountPercentage', product.discountPercentage.toString());
    formData.append('isBestSeller', product.isBestSeller.toString());

    // صور جديدة
    newImages.forEach((file) => formData.append('images', file));

    try {
      const res = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('تم إنشاء المنتج بنجاح!');
      router.push('/products'); // أو أي صفحة أخرى
    } catch (error) {
      console.error('خطأ في الإنشاء:', error);
      alert('حدث خطأ أثناء الإنشاء. تحقق من البيانات.');
    }
  };

  if (loading) return <p>جاري التحميل...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">إنشاء منتج جديد</h1>

      {/* الاسم */}
      <label className="font-semibold">اسم المنتج</label>
      <input
        className="border p-2 w-full mb-4"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
        required
      />

      {/* وصف */}
      <label className="font-semibold">الوصف</label>
      <textarea
        className="border p-2 w-full mb-4"
        value={product.description}
        onChange={(e) => setProduct({ ...product, description: e.target.value })}
      />

      {/* الفئة */}
      <label className="font-semibold">الفئة</label>
      <select
        className="border p-2 w-full mb-4"
        value={product.category}
        onChange={(e) => setProduct({ ...product, category: e.target.value })}
        required
      >
        <option value="">اختر الفئة</option>
        {categories.map((cat: any) => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>

      {/* الفئة الفرعية */}
      <label className="font-semibold">الفئة الفرعية</label>
      <input
        className="border p-2 w-full mb-4"
        value={product.subcategory}
        onChange={(e) => setProduct({ ...product, subcategory: e.target.value })}
      />

      {/* الماركة */}
      <label className="font-semibold">الماركة</label>
      <select
        className="border p-2 w-full mb-4"
        value={product.brand}
        onChange={(e) => setProduct({ ...product, brand: e.target.value })}
      >
        <option value="">اختر الماركة (اختياري)</option>
        {brands.map((b: any) => (
          <option key={b._id} value={b.name}>{b.name}</option>
        ))}
      </select>

      {/* سعر الشراء */}
      <label className="font-semibold">سعر الشراء</label>
      <input
        type="number"
        className="border p-2 w-full mb-4"
        value={product.pricePurchase}
        onChange={(e) => setProduct({ ...product, pricePurchase: Number(e.target.value) })}
      />

      {/* سعر الإيجار */}
      <label className="font-semibold">سعر الإيجار</label>
      <input
        type="number"
        className="border p-2 w-full mb-4"
        value={product.priceRental}
        onChange={(e) => setProduct({ ...product, priceRental: Number(e.target.value) })}
      />

      {/* كمية المخزون */}
      <label className="font-semibold">كمية المخزون</label>
      <input
        type="number"
        className="border p-2 w-full mb-4"
        value={product.stockQuantity}
        onChange={(e) => setProduct({ ...product, stockQuantity: Number(e.target.value) })}
      />

      {/* نسبة الخصم */}
      <label className="font-semibold">نسبة الخصم (%)</label>
      <input
        type="number"
        className="border p-2 w-full mb-4"
        value={product.discountPercentage}
        onChange={(e) => setProduct({ ...product, discountPercentage: Number(e.target.value) })}
      />

      {/* أفضل بائع */}
      <label className="font-semibold">أفضل بائع</label>
      <input
        type="checkbox"
        className="mb-4"
        checked={product.isBestSeller}
        onChange={(e) => setProduct({ ...product, isBestSeller: e.target.checked })}
      />

      {/* رفع صور جديدة */}
      <label className="font-semibold">إضافة صور</label>
      <input type="file" multiple className="border p-2 w-full mb-4" onChange={handleImageUpload} />

      {/* معاينة الصور الجديدة */}
      {newImages.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {newImages.map((file, i) => (
            <div key={i} className="relative">
              <img src={URL.createObjectURL(file)} className="w-24 h-24 rounded object-cover border" />
              <button
                onClick={() => removeLocalImage(i)}
                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}

      <button onClick={handleSave} className="bg-green-600 text-white px-6 py-3 rounded">
        إنشاء المنتج
      </button>
    </div>
  );
}
