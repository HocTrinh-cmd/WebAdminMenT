export interface User {
  _id: string;
  email: string;
  username: string;
  phonenumber?: string;
  address?: string;
  role: 'Admin' | 'Customer' | 'SuperAdmin';
  createAt: string;
  lastLogin?: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
  category: string;
  supplier: string;
  description: string;
  discount: number;
}

export interface Category {
  _id: string;
  name: string;
  brand: string;
  image: string[];
}

export interface Feedback {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface Voucher {
  _id: string;
  code: string;
  description: string;
  discountValue: number;
  minimumOrder: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  _id: string;
  name: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: string[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
}
