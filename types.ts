
export enum Category {
  PLACE = 'PLACE',
  HOTEL = 'HOTEL',
  RESTAURANT = 'RESTAURANT',
  EMERGENCY = 'EMERGENCY',
  TRANSPORT = 'TRANSPORT',
  WEATHER = 'WEATHER',
  EVENT = 'EVENT',
  GOVT = 'GOVT',
  ATM = 'ATM',
  KITKAT = 'KITKAT',
  CAUTION = 'CAUTION'
}

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  VENDOR = 'VENDOR',
  USER = 'USER'
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
  type: 'ROOM' | 'DISH' | 'TICKET' | 'CHAIR';
}

export interface Announcement {
  id: string;
  date: string;
  titleBn: string;
  titleEn: string;
  contentBn: string;
  contentEn: string;
  isImportant: boolean;
}

export interface Place {
  id: string;
  vendorId?: string;
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
  rating: number;
}

export interface Booking {
  id: string;
  userId: string;
  vendorId: string;
  productId: string;
  productName: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  date: string;
}
