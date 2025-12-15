export interface Category {
  _id: string;
  name: string;
  description?: string;
  imageUrl: string;
  localInventoryNotes?: string;
  subcategories?: string[];
  slug?: string;
}

export interface Review {
  _id: string;
  product: string;
  user: User | string;
  rating: number;
  comment: string;
  date?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string[];
  category: string | Category;
  brand: string;
  pricePurchase: number;
  priceRental?: number;
  priceOld?: number;
  discountPercentage?: number;
  images: string[];
  stockQuantity: number;
  isBestSeller: boolean;
  reviews?: Review[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Address {
  street: string;
  city: string;
  details: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  addresses?: Address[];
  paymentMethods?: any[];
  role: 'user' | 'admin';
  favorites?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  orderType: 'purchase' | 'rental';
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
}

export interface Order {
  _id: string;
  user: string;
  totalPrice: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  orderType: 'purchase' | 'rental';
  deliveryAddress: any;
  items: any[];
  createdAt?: string;
}

export interface AdminStats {
  products: number;
  orders: number;
  users: number;
}

export interface UserStats {
  orders: number;
  favorites: number;
  productsViewed: number;
}

export interface Store {
  _id: string;
  name: string;
  description: string[];
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
  coverImage?: string;
  categories?: string[];
  owner?: string | User;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
