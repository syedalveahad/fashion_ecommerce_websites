export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  regular_price: number;
  sale_price?: number;
  feature_image: string;
  additional_images: string[];
  sizes: string[];
  size_required_count?: number;
  colors: {
    options: string[];
    multiple: boolean;
    max_selection: number;
  };
  category: string;
  conditions: string[];
  stock?: number;
  size_chart_id?: string;
  offer_end_date?: string;
  status: 'published' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  delivery_area: 'inside' | 'outside';
  customer_note?: string;
  items: OrderItem[];
  subtotal: number;
  delivery_charge: number;
  coupon_code?: string;
  discount: number;
  total: number;
  status: 'pending' | 'approved' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  size: string;
  colors: string[];
  image: string;
}

export interface SizeChart {
  id: string;
  name: string;
  content: string;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value: number;
  max_uses?: number;
  used_count: number;
  expires_at?: string;
  active: boolean;
  created_at: string;
}

export interface Settings {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface CartItem extends OrderItem {
  regular_price: number;
}

export const CATEGORIES = [
  'Half Sleeve Blank T-Shirt',
  'Half Sleeve Design T-Shirt',
  'Half Sleeve Reglan T-Shirt',
  'Half Sleeve Blank Drop Shoulder T-Shirts',
];

export const CONDITIONS = [
  'Top Selling',
  'New Arrivals',
  'Free Delivery',
  'Stock Clearance',
];
