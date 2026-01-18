
export enum Category {
  PLACE = 'PLACE',
  HOTEL = 'HOTEL',
  RESTAURANT = 'RESTAURANT',
  EMERGENCY = 'EMERGENCY'
}

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  CONTENT_MANAGER = 'CONTENT_MANAGER',
  NONE = 'NONE'
}

export interface Place {
  id: string;
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
  sources?: { title: string; uri: string }[];
}

export interface Review {
  id: string;
  placeId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  sunrise: string;
  sunset: string;
}

export interface TransportInfo {
  type: string;
  route: string;
  fare: string;
  duration: string;
  description: string;
}

export interface ItineraryItem {
  day: number;
  activities: string[];
}
