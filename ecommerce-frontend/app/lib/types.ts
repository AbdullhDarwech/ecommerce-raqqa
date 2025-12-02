export interface Product {
    _id: string;
    name: string;
    description: string;
    category: string; // أو Category إذا كان كائن
    brand: string;
    pricePurchase: number;
    priceRental?: number;
    images: string[];
    stockQuantity: number;
    isBestSeller: boolean;
    discountPercentage?: number;
    reviews?: Review[];
  }
  
  export interface Review {
    _id: string;
    product: string;
    user: string;
    rating: number;
    comment: string;
  }
  
  export interface User {
    _id: string;
    email: string;
    name: string;
    phone?: string;
    addresses?: any[]; // يمكن تحسينه لاحقاً
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
    status: 'pending' | 'shipped' | 'delivered';
    orderType: 'purchase' | 'rental';
    deliveryAddress: any;
    items: any[]; // يمكن تحسينه لاحقاً
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
  export interface Category {
    _id: string;
    name: string;
    description: string;
    imageUrl : string;
    localInventoryNotes?: string;
    subcategories?: string[];
  }