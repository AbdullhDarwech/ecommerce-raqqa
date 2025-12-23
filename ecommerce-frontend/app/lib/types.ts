
export interface Category {
  _id: string;
  name: string;
  description?: string;
  imageUrl: string;
  subcategories?: string[];
  attributeConfig?: string[]; // الخصائص المعرفة للفئة
}

// إضافة واجهة المتجر
export interface Store {
  _id: string;
  name: string;
  owner?: string | User;
  description?: string[];
  logo?: string;
  coverImage?: string;
  categories?: string[] | Category[];
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string[];
  category: string | Category;
  subcategory?: string;
  brand: string;
  pricePurchase: number;
  priceRental?: number;
  priceOld?: number;
  discountPercentage?: number;
  images: string[];
  stockQuantity: number;
  isBestSeller: boolean;
  store?: string | Store | any;
  specifications?: Record<string, string>; // القيم الفعلية للخصائص
  createdAt?: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'admin';
  favorites?: string[];
  createdAt?: string;
  addresses?: {
    city: string;
    street: string;
    details?: string;
  }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  orderType: 'purchase' | 'rental';
}

// إضافة واجهة عنصر الطلب
export interface OrderItem {
  _id?: string;
  product: Product;
  quantity: number;
  priceAtTime: number;
  orderType: 'purchase' | 'rental';
}

// إضافة واجهة الطلب
export interface Order {
  _id: string;
  user: string | User;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress: {
    city: string;
    street: string;
    details?: string;
  };
  phone?: string;
  createdAt?: string;
}