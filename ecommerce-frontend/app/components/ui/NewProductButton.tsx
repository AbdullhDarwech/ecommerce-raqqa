'use client';

import Link from "next/link";
// import { Button } from "./Button";
import { Plus } from "lucide-react";
import Button from "./Button";

export default function NewProductButton() {
  return (
    <div className="flex justify-end mb-4">
      <Link href="/admin/products/create">
        <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl">
          <Plus size={18} />
          إنشاء منتج جديد
        </Button>
      </Link>
    </div>
  );
}
