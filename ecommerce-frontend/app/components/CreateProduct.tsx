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
  
  // إضافة حالة للخصائص
  const [properties, setProperties] = useState<Array<{key: string, value: string}>>([
    { key: '', value: '' }
  ]);

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

  // معالجة الخصائص
  const handlePropertyChange = (index: number, field: 'key' | 'value', newValue: string) => {
    const updatedProperties = [...properties];
    updatedProperties[index][field] = newValue;
    setProperties(updatedProperties);
  };

  const addProperty = () => {
    setProperties([...properties, { key: '', value: '' }]);
  };

  const removeProperty = (index: number) => {
    if (properties.length > 1) {
      const updatedProperties = [...properties];
      updatedProperties.splice(index, 1);
      setProperties(updatedProperties);
    }
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

    // إضافة الخصائص إلى الفورم داتا
    // فلتر الخصائص الفارغة وإرسالها كـ JSON
    const filteredProperties = properties.filter(p => p.key.trim() !== '' && p.value.trim() !== '');
    if (filteredProperties.length > 0) {
      formData.append('properties', JSON.stringify(filteredProperties));
    }

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
      <h1 className="text-3xl font-bold mb-6">إنشاء منتج جديد</h1>

      {/* الاسم */}
      <div className="mb-4">
        <label className="font-semibold block mb-2">اسم المنتج</label>
        <input
          className="border p-2 w-full rounded"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          required
        />
      </div>

      {/* وصف */}
      <div className="mb-4">
        <label className="font-semibold block mb-2">الوصف</label>
        <textarea
          className="border p-2 w-full rounded"
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          rows={3}
        />
      </div>

      {/* الفئة */}
      <div className="mb-4">
        <label className="font-semibold block mb-2">الفئة</label>
        <select
          className="border p-2 w-full rounded"
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
          required
        >
          <option value="">اختر الفئة</option>
          {categories.map((cat: any) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* الفئة الفرعية */}
      <div className="mb-4">
        <label className="font-semibold block mb-2">الفئة الفرعية</label>
        <input
          className="border p-2 w-full rounded"
          value={product.subcategory}
          onChange={(e) => setProduct({ ...product, subcategory: e.target.value })}
        />
      </div>

      {/* الماركة */}
      <div className="mb-4">
        <label className="font-semibold block mb-2">الماركة</label>
        <select
          className="border p-2 w-full rounded"
          value={product.brand}
          onChange={(e) => setProduct({ ...product, brand: e.target.value })}
        >
          <option value="">اختر الماركة (اختياري)</option>
          {brands.map((b: any) => (
            <option key={b._id} value={b.name}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* سعر الشراء */}
      <div className="mb-4">
        <label className="font-semibold block mb-2">سعر الشراء</label>
        <input
          type="number"
          min="0"
          step="0.01"
          className="border p-2 w-full rounded"
          value={product.pricePurchase}
          onChange={(e) => setProduct({ ...product, pricePurchase: Number(e.target.value) })}
        />
      </div>

      {/* سعر الإيجار */}
      <div className="mb-4">
        <label className="font-semibold block mb-2">سعر الإيجار</label>
        <input
          type="number"
          min="0"
          step="0.01"
          className="border p-2 w-full rounded"
          value={product.priceRental}
          onChange={(e) => setProduct({ ...product, priceRental: Number(e.target.value) })}
        />
      </div>

      {/* كمية المخزون */}
      <div className="mb-4">
        <label className="font-semibold block mb-2">كمية المخزون</label>
        <input
          type="number"
          min="0"
          className="border p-2 w-full rounded"
          value={product.stockQuantity}
          onChange={(e) => setProduct({ ...product, stockQuantity: Number(e.target.value) })}
        />
      </div>

      {/* نسبة الخصم */}
      <div className="mb-4">
        <label className="font-semibold block mb-2">نسبة الخصم (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          className="border p-2 w-full rounded"
          value={product.discountPercentage}
          onChange={(e) => setProduct({ ...product, discountPercentage: Number(e.target.value) })}
        />
      </div>

      {/* أفضل بائع */}
      <div className="mb-6">
        <label className="font-semibold inline-flex items-center">
          <input
            type="checkbox"
            className="ml-2"
            checked={product.isBestSeller}
            onChange={(e) => setProduct({ ...product, isBestSeller: e.target.checked })}
          />
          أفضل بائع
        </label>
      </div>

      {/* خصائص المنتج */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <label className="font-semibold text-lg">خصائص المنتج</label>
          <button
            type="button"
            onClick={addProperty}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + إضافة خاصية
          </button>
        </div>
        
        <div className="space-y-3">
          {properties.map((prop, index) => (
            <div key={index} className="flex gap-3 items-center">
              <div className="flex-1">
                <label className="text-sm text-gray-600">المفتاح (مثال: اللون، الحجم)</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  value={prop.key}
                  onChange={(e) => handlePropertyChange(index, 'key', e.target.value)}
                  placeholder="مثال: اللون"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-600">القيمة (مثال: أحمر، كبير)</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  value={prop.value}
                  onChange={(e) => handlePropertyChange(index, 'value', e.target.value)}
                  placeholder="مثال: أحمر"
                />
              </div>
              {properties.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProperty(index)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 mt-5"
                  title="حذف"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* رفع صور جديدة */}
      <div className="mb-6">
        <label className="font-semibold block mb-2">إضافة صور</label>
        <input 
          type="file" 
          multiple 
          accept="image/*"
          className="border p-2 w-full rounded" 
          onChange={handleImageUpload} 
        />
        <p className="text-sm text-gray-500 mt-1">يمكنك اختيار أكثر من صورة</p>
      </div>

      {/* معاينة الصور الجديدة */}
      {newImages.length > 0 && (
        <div className="mb-6">
          <label className="font-semibold block mb-2">معاينة الصور</label>
          <div className="flex gap-3 flex-wrap">
            {newImages.map((file, i) => (
              <div key={i} className="relative">
                <img 
                  src={URL.createObjectURL(file)} 
                  className="w-24 h-24 rounded object-cover border" 
                  alt="معاينة الصورة"
                />
                <button
                  onClick={() => removeLocalImage(i)}
                  className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-red-700"
                  title="حذف الصورة"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* زر الإنشاء */}
      <div className="flex gap-3">
        <button 
          onClick={() => router.back()} 
          className="bg-gray-300 text-gray-800 px-6 py-3 rounded hover:bg-gray-400"
        >
          رجوع
        </button>
        <button 
          onClick={handleSave} 
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 flex-1"
        >
          إنشاء المنتج
        </button>
      </div>
    </div>
  );
}