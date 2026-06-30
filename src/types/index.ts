export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface VariantOption {
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  image: string;
  category: 'headphones' | 'amplifiers' | 'keyboards' | 'turntables';
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  variants: VariantOption[];
  specs: Record<string, string>;
  features: string[];
  stock: number;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants: Record<string, string>;
}

export interface OrderDetails {
  fullName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  promoCode?: string;
  discount: number;
  total: number;
}
