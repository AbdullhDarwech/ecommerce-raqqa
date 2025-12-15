// file: components/EditProduct.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { useParams } from "next/navigation";

// Types بسيطة
interface Category {
  _id: string;
  name: string;
}

// interface Brand {
//   _id: string;
//   name: string;
// }

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string[];
  images: string[];
  pricePurchase: number;
  priceRental: number;
  stockQuantity: number;
  discountPercentage: number;
  isBestSeller: boolean;

  store?: {
    _id: string;
    name: string;
    logo?: string;
  };
}


export default function EditProduct() {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  // const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const [newImages, setNewImages] = useState<File[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  /** تحميل البيانات */
  const loadData = useCallback(async () => {
    try {
      const [pRes, catRes] = await Promise.all([
        api.get(`/products/${id}`),
        api.get("/categories"),
        
      ]);

      setProduct(pRes.data);
      setCategories(catRes.data);
      // setBrands(brandRes.data);

      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /** رفع الصور الجديدة */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  /** حذف صورة جديدة قبل الحفظ */
  const removeLocalImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  /** حذف صورة موجودة */
  const removeExistingImage = (imageUrl: string) => {
    setDeletedImages((prev) => [...prev, imageUrl]);
    setProduct((prev) =>
      prev
        ? { ...prev, images: prev.images.filter((img) => img !== imageUrl) }
        : prev
    );
  };

  /** حفظ التعديلات */
  const handleSave = async () => {
    if (!product) return;

    const formData = new FormData();

    for (const key in product) {
      // @ts-ignore
      formData.append(key, product[key]);
    }

    // إضافة الصور الجديدة
    newImages.forEach((file) => formData.append("images", file));

    // إضافة الصور المحذوفة
    formData.append("deletedImages", JSON.stringify(deletedImages));

    try {
      await api.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("تم حفظ التعديلات بنجاح!");
      window.location.reload();
    } catch (err) {
      console.error("Error Saving:", err);
      alert("حدث خطأ أثناء الحفظ.");
    }
  };

  if (loading) return <p className="text-center p-6">جاري التحميل...</p>;
  if (!product) return <p className="text-center p-6">المنتج غير موجود</p>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">تعديل المنتج</h1>

      {/* FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* الاسم */}
        <div>
          <label className="font-semibold">اسم المنتج</label>
          <input
            className="border p-2 w-full rounded"
            value={product.name}
            onChange={(e) =>
              setProduct({ ...product, name: e.target.value })
            }
          />
        </div>
{/* معلومات المتجر */}
{product.store && (
  <div className="mb-6 p-4 border rounded bg-gray-50">
    <h2 className="text-xl font-bold mb-2">المتجر التابع للمنتج</h2>
    <div className="flex items-center gap-4">
      {product.store.logo && (
        <img
          src={product.store.logo}
          className="w-16 h-16 object-cover rounded border"
        />
      )}
      <div>
        <p className="text-lg font-semibold">{product.store.name}</p>
        <p className="text-gray-500 text-sm">ID: {product.store._id}</p>
      </div>
    </div>
  </div>
)}

        {/* الفئة */}
        {/* الفئة + الفئات الفرعية داخل Select واحد */}
<div>
  <label className="font-semibold">الفئة</label>

  <select
    className="border p-2 w-full rounded"
    value={
      product.subcategory
        ? `${product.category}__${product.subcategory}`
        : product.category
    }
    onChange={(e) => {
      const value = e.target.value;

      // هل هو Subcategory؟
      if (value.includes("__")) {
        const [catId, sub] = value.split("__");

        setProduct({
          ...product,
          category: catId,
          subcategory: sub,
        });
      } else {
        // فئة فقط — بدون Subcategory
        setProduct({
          ...product,
          category: value,
          subcategory: "",
        });
      }
    }}
  >
    {categories.map((c) => (
      <React.Fragment key={c._id}>
        {/* الفئة الرئيسية */}
        <option value={c._id} className="font-bold">
          {c.name}
        </option>

        {/* الفئات الفرعية */}
        {c.subcategories?.map((sub, i) => (
          <option
            key={c._id + "_" + i}
            value={`${c._id}__${sub}`}
            className="pl-4"
          >
            — {sub}
          </option>
        ))}
      </React.Fragment>
    ))}
  </select>
</div>



        {/* الفئة الفرعية */}
        <div>
          <label className="font-semibold">الفئة الفرعية</label>
          <input
            className="border p-2 w-full rounded"
            value={product.subcategory}
            onChange={(e) =>
              setProduct({ ...product, subcategory: e.target.value })
            }
          />
        </div>

        {/* الماركة
        <div>
          <label className="font-semibold">العلامة التجارية</label>
          <select
            className="border p-2 w-full rounded"
            value={product.brand}
            onChange={(e) =>
              setProduct({ ...product, brand: e.target.value })
            }
          >
            {brands.map((b) => (
              <option key={b._id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </div> */}

        {/* الأسعار */}
        <div>
          <label className="font-semibold">سعر الشراء</label>
          <input
            type="number"
            className="border p-2 w-full rounded"
            value={product.pricePurchase}
            onChange={(e) =>
              setProduct({ ...product, pricePurchase: +e.target.value })
            }
          />
        </div>

        <div>
          <label className="font-semibold">سعر الإيجار</label>
          <input
            type="number"
            className="border p-2 w-full rounded"
            value={product.priceRental}
            onChange={(e) =>
              setProduct({ ...product, priceRental: +e.target.value })
            }
          />
        </div>

        {/* المخزون */}
        <div>
          <label className="font-semibold">المخزون</label>
          <input
            type="number"
            className="border p-2 w-full rounded"
            value={product.stockQuantity}
            onChange={(e) =>
              setProduct({ ...product, stockQuantity: +e.target.value })
            }
          />
        </div>

        {/* الخصم */}
        <div>
          <label className="font-semibold">نسبة الخصم (%)</label>
          <input
            type="number"
            className="border p-2 w-full rounded"
            value={product.discountPercentage}
            onChange={(e) =>
              setProduct({
                ...product,
                discountPercentage: +e.target.value,
              })
            }
          />
        </div>

        {/* وصف */}
        <div className="md:col-span-2">
          <label className="font-semibold">الوصف</label>
          <textarea
            rows={4}
            className="border p-2 w-full rounded"
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
          />
        </div>
      </div>

      {/* الصور */}
      <h2 className="text-xl font-semibold mt-8">الصور الحالية</h2>
      <div className="flex flex-wrap gap-3 mt-3">
        {product.images.map((img, i) => (
          <div key={i} className="relative">
            <img
              src={img}
              className="w-28 h-28 object-cover border rounded"
            />
            <button
              onClick={() => removeExistingImage(img)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded px-2 py-1"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* رفع صور جديدة */}
      <div className="mt-6">
        <label className="font-semibold">إضافة صور جديدة</label>
        <input
          type="file"
          multiple
          className="border p-2 w-full rounded"
          onChange={handleImageUpload}
        />

        {newImages.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {newImages.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={URL.createObjectURL(img)}
                  className="w-28 h-28 object-cover border rounded"
                />
                <button
                  onClick={() => removeLocalImage(i)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded px-2 py-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* زر الحفظ */}
      <button
        onClick={handleSave}
        className="bg-green-600 text-white px-8 py-3 rounded mt-8 text-lg"
      >
        حفظ التعديلات
      </button>
    </div>
  );
}
