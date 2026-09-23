export type Role = 'buyer' | 'seller';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface CarbonCredit {
  id: number;
  projectName: string;
  category: string;
  description: string;
  location: string;
  price: number;
  availableCredits: number;
  sellerId: number;
  sellerName: string;
  image: string;
}

export interface CartItem {
  credit: CarbonCredit;
  quantity: number;
}

export interface OrderItem {
  projectName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  buyerId: number;
  date: string;
  items: OrderItem[];
  totalCredits: number;
  totalPrice: number;
}