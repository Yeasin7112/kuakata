
export enum Category {
  PLACE = 'PLACE',
  HOTEL = 'HOTEL',
  RESTAURANT = 'RESTAURANT',
  EMERGENCY = 'EMERGENCY'
}

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  VENDOR = 'VENDOR',
  USER = 'USER',
  NONE = 'NONE'
}

export interface Product {
  id: string;
  vendorId: string;
  nameBn: string;
  nameEn: string;
  descriptionBn: string;
  descriptionEn: string;
  price: number;
  image: string;
  type: 'ROOM' | 'DISH';
  available?: boolean;
}

export interface Place {
  id: string;
  vendorId?: string; // Links to a vendor account
  nameBn: string;
  nameEn: string;
  category: Category;
  descriptionBn: string;
  descriptionEn: string;
  image: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  bestTime?: string;
  priceRange?: string;
  contact?: string;
  facilities?: string[];
  rating: number;
}

export interface Booking {
  id: string;
  userId: string;
  vendorId: string;
  productId: string;
  productName: string;
  totalPrice: number;
  commission: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  date: string;
  checkIn?: string;
  checkOut?: string;
  quantity?: number;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  type: Category.HOTEL | Category.RESTAURANT;
  balance: number;
  commissionOwed: number;
}

export interface Review {
  id: string;
  placeId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}
