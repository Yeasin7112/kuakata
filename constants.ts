
import { Place, Category, Announcement } from './types';

export const APP_FEATURES = [
  { id: 'spots', labelBn: 'দর্শনীয় স্থান সমূহ', labelEn: 'Tourist Spots', icon: 'https://cdn-icons-png.flaticon.com/512/2560/2560421.png', path: '/places' },
  { id: 'weather', labelBn: 'আবহাওয়ার পূর্বাভাস', labelEn: 'Weather Update', icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163763.png', path: '/weather' },
  { id: 'hotel', labelBn: 'আবাসন সুবিধাসমূহ', labelEn: 'Find Your Accommodation', icon: 'https://cdn-icons-png.flaticon.com/512/2316/2316041.png', path: '/hotels' },
  { id: 'transport', labelBn: 'পরিবহন কাউন্টার', labelEn: 'Transport Counter', icon: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png', path: '/transport' },
  { id: 'events', labelBn: 'আসন্ন ইভেন্টসমূহ', labelEn: 'Upcoming Events', icon: 'https://cdn-icons-png.flaticon.com/512/3652/3652191.png', path: '/events' },
  { id: 'dc', labelBn: 'জেলা প্রশাসনের উদ্যোগ', labelEn: 'DC Initiatives', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_Seal_of_Bangladesh.svg/1200px-Government_Seal_of_Bangladesh.svg.png', path: '/dc' },
  { id: 'atm', labelBn: 'ব্যাংক/এটিএম', labelEn: 'Bank/ATM', icon: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png', path: '/atm' },
  { id: 'caution', labelBn: 'সতর্কতা এলাকা', labelEn: 'Caution Area', icon: 'https://cdn-icons-png.flaticon.com/512/564/564619.png', path: '/caution' },
  { id: 'kitkat', labelBn: 'কিটকট চেয়ার', labelEn: 'Kitkat Chair', icon: 'https://cdn-icons-png.flaticon.com/512/2664/2664654.png', path: '/kitkat' },
  { id: 'local_trans', labelBn: 'স্থানীয় যাতায়াতের মাধ্যমসমূহ', labelEn: 'Local Transport', icon: 'https://cdn-icons-png.flaticon.com/512/3462/3462214.png', path: '/local-transport' },
  { id: 'complaints', labelBn: 'অভিযোগ ও উপদেশ', labelEn: 'Complaints & Advice', icon: 'https://cdn-icons-png.flaticon.com/512/10312/10312384.png', path: '/complaints' },
  { id: 'ai', labelBn: 'এআই ট্যুর প্ল্যানার', labelEn: 'AI Tour Planner', icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png', path: '/ai-planner' }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    date: '১১ ডিসেম্বর, ২০২৪',
    titleBn: 'জরুরী ঘোষণা',
    titleEn: 'Emergency Notice',
    contentBn: 'সমস্ত ভ্রমণকারীদের জানানো যাচ্ছে যে, রক্ষণাবেক্ষণ কাজের কারণে কিছু রুটে সাময়িক বিঘ্ন ঘটতে পারে। অনুগ্রহ করে আপডেট করা সময়সূচি পরীক্ষা করে ভ্রমণের পরিকল্পনা করুন।',
    contentEn: 'All travelers are informed that due to maintenance work, some routes may experience temporary disruptions. Please check the updated schedule.',
    isImportant: true
  }
];

export const EMERGENCY_SERVICES = [
  { id: 'e1', nameBn: 'জেলা প্রশাসন পর্যটন সেল', nameEn: 'District Admin Tourism Cell', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_Seal_of_Bangladesh.svg/1200px-Government_Seal_of_Bangladesh.svg.png', phone: '01700-000000' },
  { id: 'e2', nameBn: 'টুরিস্ট পুলিশ', nameEn: 'Tourist Police', icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Bangladesh_Police_Logo.svg/1200px-Bangladesh_Police_Logo.svg.png', phone: '01320-000000' },
  { id: 'e3', nameBn: 'ডাক্তার', nameEn: 'Doctor', icon: 'https://cdn-icons-png.flaticon.com/512/2785/2785482.png', phone: '16263' },
  { id: 'e4', nameBn: 'লাইফগার্ড', nameEn: 'Lifeguard', icon: 'https://cdn-icons-png.flaticon.com/512/2964/2964514.png', phone: '01711-000000' }
];
