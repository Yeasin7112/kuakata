
import { Place, Category } from './types';

export const PLACES: Place[] = [
  {
    id: 'p1',
    nameBn: 'কুয়াকাটা সমুদ্র সৈকত',
    nameEn: 'Kuakata Sea Beach',
    category: Category.PLACE,
    descriptionBn: 'কুয়াকাটা দক্ষিণ এশিয়ার একমাত্র সমুদ্র সৈকত যেখান থেকে সূর্যোদয় এবং সূর্যাস্ত উভয়ই দেখা যায়।',
    descriptionEn: 'Kuakata is the only sea beach in South Asia from where both sunrise and sunset can be observed.',
    image: 'https://picsum.photos/seed/beach/800/600',
    location: { lat: 21.8122, lng: 90.1213, address: 'Kuakata, Patuakhali' },
    bestTime: 'Sunrise & Sunset',
    rating: 4.8
  },
  {
    id: 'p2',
    nameBn: 'লেবুর চর',
    nameEn: 'Lebur Chor',
    category: Category.PLACE,
    descriptionBn: 'সৈকতের একদম শেষ প্রান্তে অবস্থিত প্রাকৃতিক সৌন্দর্যের এক অপূর্ব লীলাভূমি।',
    descriptionEn: 'A place of natural beauty located at the very end of the beach.',
    image: 'https://picsum.photos/seed/forest/800/600',
    location: { lat: 21.8322, lng: 90.0913, address: 'Lebur Chor, Kuakata' },
    bestTime: 'Late Afternoon',
    rating: 4.5
  },
  {
    id: 'p3',
    nameBn: 'মিশ্রিপাড়া বৌদ্ধ মন্দির',
    nameEn: 'Mishripara Buddhist Temple',
    category: Category.PLACE,
    descriptionBn: 'এখানে দক্ষিণ এশিয়ার অন্যতম বৃহত্তম বুদ্ধ মূর্তি রয়েছে।',
    descriptionEn: 'Houses one of the largest Buddha statues in South Asia.',
    image: 'https://picsum.photos/seed/temple/800/600',
    location: { lat: 21.8522, lng: 90.1513, address: 'Mishripara, Kuakata' },
    bestTime: 'Daylight',
    rating: 4.6
  }
];

export const HOTELS: Place[] = [
  {
    id: 'h1',
    nameBn: 'সিকদার রিসোর্ট অ্যান্ড ভিলাস',
    nameEn: 'Sikder Resort & Villas',
    category: Category.HOTEL,
    descriptionBn: 'কুয়াকাটার সবচেয়ে বিলাসবহুল রিসোর্টগুলোর একটি।',
    descriptionEn: 'One of the most luxurious resorts in Kuakata.',
    image: 'https://picsum.photos/seed/hotel1/800/600',
    location: { lat: 21.8150, lng: 90.1250, address: 'Main Road, Kuakata' },
    priceRange: '৳৫০০০ - ৳১৫০০০',
    contact: '01711-XXXXXX',
    facilities: ['Swimming Pool', 'Gym', 'Restaurant', 'Free WiFi'],
    rating: 4.9
  },
  {
    id: 'h2',
    nameBn: 'হোটেল গ্রেভার ইন',
    nameEn: 'Hotel Graver Inn',
    category: Category.HOTEL,
    descriptionBn: 'আরামদায়ক এবং আধুনিক সুযোগ সুবিধা সম্পন্ন হোটেল।',
    descriptionEn: 'Comfortable hotel with modern amenities.',
    image: 'https://picsum.photos/seed/hotel2/800/600',
    location: { lat: 21.8130, lng: 90.1220, address: 'Beach Road, Kuakata' },
    priceRange: '৳৩০০০ - ৳৮০০০',
    contact: '01822-XXXXXX',
    facilities: ['AC Rooms', 'Car Parking', 'Restaurant'],
    rating: 4.4
  }
];

export const RESTAURANTS: Place[] = [
  {
    id: 'r1',
    nameBn: 'কুয়াকাটা ফ্রাই হাউজ',
    nameEn: 'Kuakata Fry House',
    category: Category.RESTAURANT,
    descriptionBn: 'তাজা সামুদ্রিক মাছের ফ্রাইয়ের জন্য বিখ্যাত।',
    descriptionEn: 'Famous for fresh seafood fries.',
    image: 'https://picsum.photos/seed/fish/800/600',
    location: { lat: 21.8115, lng: 90.1210, address: 'Beach Market, Kuakata' },
    priceRange: '৳২০০ - ৳১০০০',
    contact: '01933-XXXXXX',
    rating: 4.7
  }
];

export const EMERGENCY_CONTACTS = [
  { name: 'Tourist Police', phone: '01320-XXXXXX', type: 'Police' },
  { name: 'Kuakata Hospital', phone: '01711-XXXXXX', type: 'Health' },
  { name: 'Fire Service', phone: '01611-XXXXXX', type: 'Rescue' },
  { name: 'Tourist Helpline', phone: '16444', type: 'Info' }
];

export const TRANSPORT_INFO = [
  {
    type: 'Bus',
    route: 'Dhaka to Kuakata',
    fare: '৳৮০০ - ৳১৫০০',
    duration: '১০-১২ ঘণ্টা',
    description: 'Gabtoli or Sayedabad to Kuakata direct.'
  },
  {
    type: 'Launch',
    route: 'Dhaka to Patuakhali',
    fare: '৳৫০০ - ৳৪০০০',
    duration: '৯-১০ ঘণ্টা',
    description: 'Sadarghat to Patuakhali, then bus/auto to Kuakata.'
  }
];
