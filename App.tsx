
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  Map as MapIcon, 
  Hotel, 
  Utensils, 
  PhoneCall, 
  Navigation, 
  Calendar,
  Settings,
  ChevronRight,
  Sun,
  Sunrise,
  Sunset,
  ArrowLeft,
  Search,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Lock,
  Globe,
  ExternalLink,
  Sparkles,
  Star,
  MessageSquare,
  Send,
  Info,
  ChevronDown,
  CloudRain,
  Bus,
  CalendarCheck,
  Building,
  Box,
  LayoutDashboard,
  Loader2,
  Clock,
  Globe2
} from 'lucide-react';
import { PLACES, HOTELS, RESTAURANTS, EMERGENCY_CONTACTS, TRANSPORT_INFO } from './constants';
import { Category, Place, AdminRole, Review } from './types';
import { generateTourPlan, getLiveInfo } from './services/gemini';

// --- Translations ---

const T = {
  bn: {
    appName: "ভ্রমণিকা",
    tagline: "কুয়াকাটার ভ্রমণ তথ্য ও নির্দেশনা",
    welcome: "আপনাকে স্বাগতম!",
    subWelcome: "পৃথিবীর একমাত্র সৈকত যেখান থেকে সূর্যোদয় ও সূর্যাস্ত দেখা যায়।",
    menu_places: "দর্শনীয় স্থান সমূহ",
    menu_weather: "আবহাওয়া তথ্য",
    menu_hotels: "হোটেল/মোটেল/রিসোর্ট",
    menu_transport: "পরিবহন কাউন্টার",
    menu_planner: "ট্যুর প্ল্যানার",
    menu_admin_steps: "প্রশাসনের পদক্ষেপ",
    menu_about: "কুয়াকাটা সম্পর্কে",
    menu_locker: "লকার সার্ভিস",
    nav_home: "হোম",
    nav_live: "লাইভ",
    nav_places: "স্থান",
    nav_emergency: "জরুরি",
    nav_settings: "সেটিংস",
    search_placeholder: "খুঁজুন...",
    distance: "দূরত্ব",
    features: "বৈশিষ্ট্য",
    best_time: "সেরা সময়",
    view_map: "লোকেশন ম্যাপ দেখুন",
    reviews: "ভ্রমণকারীদের মতামত",
    add_review: "আপনার মতামত দিন",
    name_label: "আপনার নাম...",
    review_label: "আপনার ভ্রমণ অভিজ্ঞতা লিখুন...",
    submit: "জমা দিন",
    lang: "English",
    live_exp_title: "লাইভ এক্সপ্লোরার",
    planner_title: "এআই ট্যুর প্ল্যানার",
    emergency_title: "জরুরি নম্বরসমূহ",
    transport_title: "কিভাবে যাবেন",
    // Added missing property
    food_title: "খাবার ও রেস্টুরেন্ট",
    about_title: "কুয়াকাটা সম্পর্কে",
    about_content: "কুয়াকাটা দক্ষিণ এশিয়ার একমাত্র সমুদ্র সৈকত যেখান থেকে সূর্যোদয় এবং সূর্যাস্ত উভয়ই দেখা যায়। পটুয়াখালী জেলার কলাপাড়া উপজেলার লতাচাপলি ইউনিয়নে এই পর্যটন কেন্দ্রটি অবস্থিত।",
    about_location: "অবস্থান",
    about_area: "আয়তন",
    about_area_val: "১৮ কিঃমিঃ সৈকত",
    dist_val: "কুয়াকাটা জিরো পয়েন্ট থেকে সড়ক পথে দূরত্ব ৩ কিঃমিঃ এবং নৌ পথে প্রায় ১৫ কিঃমিঃ।",
    feat_val: "এখানে সৈকতের বিশেষ বৈশিষ্ট্য হলো এর ছড়িয়ে থাকা ম্যানগ্রোভ গাছ ও লাল কাঁকড়া। সূর্যাস্তের সময় এগুলো দেখতে অত্যন্ত মনোমুগ্ধকর।"
  },
  en: {
    appName: "Vromonika",
    tagline: "Kuakata Tourism Guide & Info",
    welcome: "Welcome!",
    subWelcome: "The only beach in the world to watch both sunrise and sunset.",
    menu_places: "Tourist Attractions",
    menu_weather: "Weather Info",
    menu_hotels: "Hotels & Resorts",
    menu_transport: "Transport Counter",
    menu_planner: "Tour Planner",
    menu_admin_steps: "District Admin",
    menu_about: "About Kuakata",
    menu_locker: "Locker Services",
    nav_home: "Home",
    nav_live: "Live",
    nav_places: "Places",
    nav_emergency: "Emergency",
    nav_settings: "Settings",
    search_placeholder: "Search here...",
    distance: "Distance",
    features: "Features",
    best_time: "Best Time",
    view_map: "View Location Map",
    reviews: "Traveler Reviews",
    add_review: "Give your feedback",
    name_label: "Your name...",
    review_label: "Write your travel experience...",
    submit: "Submit",
    lang: "বাংলা",
    live_exp_title: "Live Explorer",
    planner_title: "AI Tour Planner",
    emergency_title: "Emergency Numbers",
    transport_title: "How to Go",
    // Added missing property
    food_title: "Food & Dining",
    about_title: "About Kuakata",
    about_content: "Kuakata is a rare panoramic beach situated in the southernmost tip of Bangladesh. It is the only place in South Asia where one can watch both sunrise and sunset from the same beach.",
    about_location: "Location",
    about_area: "Area",
    about_area_val: "18 KM Beach",
    dist_val: "3 KM by road from Zero Point and about 15 KM by waterway.",
    feat_val: "The special features of the beach are the scattered mangrove trees and red crabs. They look truly mesmerizing during sunset."
  }
};

// --- Data Management ---

const useKuakataData = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [hotels, setHotels] = useState<Place[]>([]);
  const [restaurants, setRestaurants] = useState<Place[]>([]);

  useEffect(() => {
    const savedPlaces = localStorage.getItem('kuakata_places');
    const savedHotels = localStorage.getItem('kuakata_hotels');
    const savedFood = localStorage.getItem('kuakata_food');

    if (savedPlaces) setPlaces(JSON.parse(savedPlaces));
    else setPlaces(PLACES);

    if (savedHotels) setHotels(JSON.parse(savedHotels));
    else setHotels(HOTELS);

    if (savedFood) setRestaurants(JSON.parse(savedFood));
    else setRestaurants(RESTAURANTS);
  }, []);

  const saveData = (type: Category, newData: Place[]) => {
    if (type === Category.PLACE) {
      setPlaces(newData);
      localStorage.setItem('kuakata_places', JSON.stringify(newData));
    } else if (type === Category.HOTEL) {
      setHotels(newData);
      localStorage.setItem('kuakata_hotels', JSON.stringify(newData));
    } else if (type === Category.RESTAURANT) {
      setRestaurants(newData);
      localStorage.setItem('kuakata_food', JSON.stringify(newData));
    }
  };

  return { places, hotels, restaurants, saveData };
};

// --- Sub-components ---

const BottomNav = ({ lang }: { lang: 'en' | 'bn' }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  if (isAdminPath) return null;

  const isActive = (path: string) => location.pathname === path;
  const currentT = T[lang];

  const navItems = [
    { path: '/', icon: HomeIcon, label: currentT.nav_home },
    { path: '/live', icon: Sparkles, label: currentT.nav_live },
    { path: '/places', icon: Navigation, label: currentT.nav_places },
    { path: '/emergency', icon: PhoneCall, label: currentT.nav_emergency },
    { path: '/admin', icon: Settings, label: currentT.nav_settings },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[450px] bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-[24px]">
      {navItems.map((item) => (
        <Link 
          key={item.path} 
          to={item.path}
          className={`flex flex-col items-center space-y-1.5 transition-all ${isActive(item.path) ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
        >
          <item.icon size={22} strokeWidth={isActive(item.path) ? 2.5 : 2} />
          <span className="text-[10px] font-bold">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

// --- View Components ---

const HomeView = ({ lang, setLang }: { lang: 'en' | 'bn', setLang: (l: 'en' | 'bn') => void }) => {
  const currentT = T[lang];

  return (
    <div className="pb-28 bg-[#F0F4FF] min-h-screen">
      {/* Header Area */}
      <div className="bg-[#0047FF] pt-12 pb-24 px-6 rounded-b-[40px] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        {/* Top Indicators */}
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full mr-2 animate-pulse"></span>
            Online
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="bg-white/20 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center border border-white/10 active:scale-95 transition-all"
            >
              <Globe2 size={14} className="mr-1.5" />
              {currentT.lang} <ChevronDown size={14} className="ml-1" />
            </button>
            <div className="text-white opacity-80"><Info size={20} /></div>
          </div>
        </div>

        {/* Branding */}
        <div className="text-center space-y-2 relative z-10">
          <h1 className="text-white text-5xl font-black tracking-tighter drop-shadow-lg">{currentT.appName}</h1>
          <p className="text-blue-100 text-sm font-medium">{currentT.tagline}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-5 -mt-16 space-y-6 relative z-20">
        
        {/* Welcome Card */}
        <div className="bg-white rounded-[32px] p-6 shadow-[0_10px_30px_rgba(0,71,255,0.1)] border border-blue-50/50">
          <h2 className="text-[#0047FF] text-2xl font-black mb-1">{currentT.welcome}</h2>
          <p className="text-slate-500 text-sm font-medium">{currentT.subWelcome}</p>
        </div>

        {/* Grid Menu */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: currentT.menu_places, sub: 'Places to visit', icon: <MapIcon className="text-orange-500" />, path: '/places', bg: 'bg-orange-50' },
            { label: currentT.menu_weather, sub: 'Weather info', icon: <CloudRain className="text-blue-500" />, path: '/live', bg: 'bg-blue-50' },
            { label: currentT.menu_hotels, sub: 'Hotels & Resorts', icon: <Hotel className="text-indigo-500" />, path: '/hotels', bg: 'bg-indigo-50' },
            { label: currentT.menu_transport, sub: 'Bus & Launch', icon: <Bus className="text-emerald-500" />, path: '/transport', bg: 'bg-emerald-50' },
            { label: currentT.menu_planner, sub: 'Itinerary Planner', icon: <CalendarCheck className="text-rose-500" />, path: '/planner', bg: 'bg-rose-50' },
            { label: currentT.menu_admin_steps, sub: 'District Admin', icon: <Building className="text-amber-500" />, path: '/emergency', bg: 'bg-amber-50' },
            { label: currentT.menu_about, sub: 'About Kuakata', icon: <Info className="text-sky-500" />, path: '/about', bg: 'bg-sky-50' },
            { label: currentT.menu_locker, sub: 'Locker Services', icon: <Box className="text-purple-500" />, path: '/emergency', bg: 'bg-purple-50' },
          ].map((item, idx) => (
            <Link 
              key={idx} 
              to={item.path}
              className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-3 active:scale-95 transition-all hover:shadow-md"
            >
              <div className={`${item.bg} w-16 h-16 rounded-2xl flex items-center justify-center`}>
                {React.cloneElement(item.icon as React.ReactElement<any>, { size: 32 })}
              </div>
              <div>
                <h4 className="text-slate-800 text-xs font-black leading-tight">{item.label}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{item.sub}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Ticker */}
        <div className="bg-emerald-600 rounded-2xl py-3 px-4 shadow-lg overflow-hidden flex items-center space-x-3">
          <div className="bg-white/20 p-1.5 rounded-full"><Info size={14} className="text-white" /></div>
          <div className="ticker-container flex-1">
            <div className="ticker-content text-white text-[11px] font-bold">
              • {lang === 'en' ? 'Kuakata was previously called Palongki' : 'কুয়াকাটার প্রাচীন নাম পালংকি'} • {lang === 'en' ? 'One of the best tourist destinations in Bangladesh' : 'বাংলাদেশের অন্যতম সেরা পর্যটন কেন্দ্র'} • {lang === 'en' ? 'Visit Mishripara for the large Buddha statue' : 'মিশ্রিপাড়া বড় বুদ্ধ মূর্তি দেখতে ভুলবেন না'} •
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailView = ({ allItems, lang }: { allItems: Place[], lang: 'en' | 'bn' }) => {
  const location = useLocation();
  const id = location.pathname.split('/').pop() || '';
  const place = allItems.find(p => p.id === id);
  const [showMap, setShowMap] = useState(false);
  const currentT = T[lang];

  if (!place) return <div className="p-8 text-center pt-24">তথ্য পাওয়া যায়নি / Not Found</div>;

  const mapEmbedUrl = `https://maps.google.com/maps?q=${place.location.lat},${place.location.lng}&z=15&output=embed`;
  const name = lang === 'en' ? place.nameEn : place.nameBn;
  const description = lang === 'en' ? place.descriptionEn : place.descriptionBn;

  return (
    <div className="pb-32 bg-white min-h-screen">
      {/* Header Banner */}
      <div className="relative h-80 w-full overflow-hidden">
        <img src={place.image} alt={place.nameEn} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {/* Floating Controls */}
        <div className="absolute top-10 left-6 right-6 flex justify-between items-center z-10">
          <button onClick={() => window.history.back()} className="p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/20">
            <ArrowLeft size={24} />
          </button>
          <button className="p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/20">
            <Info size={24} />
          </button>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-10 left-8 right-8 space-y-2">
          <h1 className="text-white text-3xl font-black drop-shadow-lg">{name}</h1>
          <p className="text-blue-100 text-sm font-bold flex items-center">
            <Navigation size={14} className="mr-2" /> {lang === 'en' ? 'Premier Tourist Spot' : 'অপূর্ব পর্যটন কেন্দ্র'}
          </p>
        </div>
      </div>

      {/* Content Info */}
      <div className="px-8 -mt-6 bg-white rounded-t-[40px] pt-10 space-y-8">
        <div className="bg-blue-50/50 p-6 rounded-[32px] border border-blue-100/50 space-y-4">
          <p className="text-slate-600 text-[13px] leading-relaxed text-justify font-medium">
            {description}
          </p>
          
          <div className="space-y-3 pt-2">
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 font-black text-sm whitespace-nowrap">{currentT.distance} :</span>
              <p className="text-slate-500 text-xs font-bold">{currentT.dist_val}</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 font-black text-sm whitespace-nowrap">{currentT.features} :</span>
              <p className="text-slate-500 text-xs font-bold">{currentT.feat_val}</p>
            </div>
            {place.bestTime && (
              <div className="flex items-start space-x-3">
                <span className="text-blue-600 font-black text-sm whitespace-nowrap">{currentT.best_time} :</span>
                <p className="text-slate-500 text-xs font-bold">{place.bestTime}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: lang === 'en' ? 'Media' : 'ছবি ও ভিডিও', icon: <Sparkles className="text-rose-500" />, bg: 'bg-rose-50' },
            { label: currentT.nav_live, icon: <Calendar className="text-sky-500" />, bg: 'bg-sky-50' },
            { label: currentT.transport_title, icon: <Bus className="text-emerald-500" />, bg: 'bg-emerald-50' },
            { label: currentT.nav_places, icon: <Navigation className="text-orange-500" />, bg: 'bg-orange-50' },
            { label: lang === 'en' ? 'Dining' : 'খাবারের তথ্য', icon: <Utensils className="text-indigo-500" />, bg: 'bg-indigo-50' },
            { label: lang === 'en' ? 'Hotels' : 'হোটেল', icon: <Hotel className="text-blue-500" />, bg: 'bg-blue-50' },
          ].map((item, idx) => (
            <button key={idx} className="bg-white border border-slate-100 rounded-[24px] p-4 flex flex-col items-center space-y-2 shadow-sm active:scale-95 transition-all">
              <div className={`${item.bg} p-2.5 rounded-xl`}>
                {React.cloneElement(item.icon as React.ReactElement<any>, { size: 24 })}
              </div>
              <span className="text-[10px] font-bold text-slate-700 leading-tight text-center">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Review Trigger Area */}
        <ReviewSection placeId={id} lang={lang} />
      </div>

      {/* Primary Action Button */}
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-[85%] max-w-[400px] z-40">
        <button 
          onClick={() => setShowMap(true)}
          className="w-full bg-[#0047FF] text-white py-5 rounded-2xl font-black text-lg shadow-[0_10px_30px_rgba(0,71,255,0.3)] flex items-center justify-center space-x-3 active:scale-95 transition-all"
        >
          <MapIcon size={24} />
          <span>{currentT.view_map}</span>
        </button>
      </div>

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[40px] overflow-hidden flex flex-col h-[70vh] shadow-2xl relative">
            <button 
              onClick={() => setShowMap(false)}
              className="absolute top-4 right-4 z-50 p-3 bg-white/80 backdrop-blur-md text-slate-800 rounded-full shadow-lg border border-slate-100"
            >
              <X size={20} />
            </button>
            <iframe 
              src={mapEmbedUrl}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              className="flex-1"
            ></iframe>
            <div className="p-6 bg-slate-50 border-t border-slate-100">
               <p className="text-xs text-slate-500 font-bold text-center">{place.location.address}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Review Components ---

const ReviewSection = ({ placeId, lang }: { placeId: string, lang: 'en' | 'bn' }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userName, setUserName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const currentT = T[lang];

  useEffect(() => {
    const allReviews = JSON.parse(localStorage.getItem('kuakata_all_reviews') || '[]');
    setReviews(allReviews.filter((r: Review) => r.placeId === placeId));
  }, [placeId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !comment) return;

    const newReview: Review = {
      id: Date.now().toString(),
      placeId,
      userName,
      comment,
      rating,
      date: new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'bn-BD')
    };

    const allReviews = JSON.parse(localStorage.getItem('kuakata_all_reviews') || '[]');
    localStorage.setItem('kuakata_all_reviews', JSON.stringify([newReview, ...allReviews]));
    setReviews([newReview, ...reviews]);
    setUserName('');
    setComment('');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-slate-800 font-black text-lg">{currentT.reviews}</h3>
        <span className="text-blue-600 font-bold text-xs">{reviews.length} {lang === 'en' ? 'Reviews' : 'টি রিভিউ'}</span>
      </div>
      
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] py-12 text-center">
            <MessageSquare size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-400 text-xs font-bold">{lang === 'en' ? 'No reviews yet.' : 'এখনো কেউ মতামত দেয়নি।'}</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="bg-white border border-slate-100 rounded-[28px] p-5 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-800 font-bold text-sm">{review.userName}</span>
                <div className="flex items-center bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full text-[10px] font-black">
                  <Star size={10} className="mr-1 fill-amber-600" /> {review.rating}.0
                </div>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed italic">"{review.comment}"</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 space-y-4">
        <h4 className="text-slate-800 font-black text-sm px-1">{currentT.add_review}</h4>
        <input 
          placeholder={currentT.name_label} 
          className="w-full bg-white border-none rounded-xl py-3 px-4 text-xs font-bold shadow-sm"
          value={userName} onChange={e => setUserName(e.target.value)}
        />
        <textarea 
          placeholder={currentT.review_label} 
          className="w-full bg-white border-none rounded-xl py-3 px-4 text-xs font-bold shadow-sm min-h-[80px]"
          value={comment} onChange={e => setComment(e.target.value)}
        />
        <button className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-black text-sm flex items-center justify-center space-x-2">
          <Send size={16} />
          <span>{currentT.submit}</span>
        </button>
      </form>
    </div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const { places, hotels, restaurants, saveData } = useKuakataData();
  const [role, setRole] = useState<AdminRole>(AdminRole.NONE);
  const [lang, setLang] = useState<'bn' | 'en'>('bn');

  const allItems = [...places, ...hotels, ...restaurants];

  return (
    <Router>
      <div className="app-container min-h-screen relative shadow-2xl overflow-x-hidden bg-slate-50 max-w-[450px] mx-auto">
        <Routes>
          <Route path="/" element={<HomeView lang={lang} setLang={setLang} />} />
          <Route path="/live" element={<LiveExplorer lang={lang} />} />
          <Route path="/places" element={<ListView items={places} title={T[lang].menu_places} lang={lang} />} />
          <Route path="/hotels" element={<ListView items={hotels} title={T[lang].menu_hotels} lang={lang} />} />
          <Route path="/food" element={<ListView items={restaurants} title={T[lang].food_title || 'Food'} lang={lang} />} />
          <Route path="/detail/:id" element={<DetailView allItems={allItems} lang={lang} />} />
          <Route path="/planner" element={<TourPlannerView lang={lang} />} />
          <Route path="/emergency" element={<EmergencyView lang={lang} />} />
          <Route path="/admin" element={
            role !== AdminRole.NONE ? (
              <AdminDashboard 
                places={places} 
                hotels={hotels} 
                restaurants={restaurants} 
                onSave={saveData} 
                role={role}
                lang={lang}
              />
            ) : (
              <AdminLogin onLogin={(r) => setRole(r)} lang={lang} />
            )
          } />
          
          <Route path="/transport" element={<TransportView lang={lang} />} />
          <Route path="/about" element={
            <div className="pb-32">
              <Header title={T[lang].about_title} showBack lang={lang} />
              <div className="p-8 space-y-6">
                 <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 space-y-4">
                    <h3 className="text-blue-600 font-black text-xl">{lang === 'en' ? 'Daughter of Ocean' : 'সাগর কন্যা কুয়াকাটা'}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">{T[lang].about_content}</p>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                        <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{T[lang].about_location}</span>
                            <p className="text-xs font-black text-slate-800">{lang === 'en' ? 'Patuakhali, Bangladesh' : 'পটুয়াখালী, বাংলাদেশ'}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{T[lang].about_area}</span>
                            <p className="text-xs font-black text-slate-800">{T[lang].about_area_val}</p>
                        </div>
                    </div>
                 </div>
              </div>
            </div>
          } />
        </Routes>
        <BottomNav lang={lang} />
      </div>
    </Router>
  );
};

// --- Reused Layout Components ---

const ListView = ({ items, title, lang }: { items: Place[], title: string, lang: 'en' | 'bn' }) => {
  const [search, setSearch] = useState('');
  const currentT = T[lang];
  
  const filtered = items.filter(i => {
    const name = (lang === 'en' ? i.nameEn : i.nameBn).toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <div className="pb-32 bg-[#F0F4FF] min-h-screen">
      <div className="bg-[#0047FF] pt-14 pb-12 px-6 rounded-b-[40px] relative">
        <button onClick={() => window.history.back()} className="absolute top-14 left-6 text-white"><ArrowLeft size={24} /></button>
        <h1 className="text-white text-2xl font-black text-center">{title}</h1>
      </div>
      
      <div className="px-6 -mt-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            placeholder={currentT.search_placeholder} 
            className="w-full bg-white border-none rounded-[20px] py-4 pl-12 pr-4 text-sm font-bold shadow-lg"
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="p-6 space-y-4">
        {filtered.map(item => (
          <Link key={item.id} to={`/detail/${item.id}`} className="bg-white rounded-[28px] p-3 shadow-sm border border-slate-100 flex items-center space-x-4 active:scale-[0.98] transition-all">
            <img src={item.image} className="w-20 h-20 rounded-2xl object-cover" />
            <div className="flex-1">
              <h4 className="text-slate-800 font-black text-sm">{lang === 'en' ? item.nameEn : item.nameBn}</h4>
              <p className="text-[10px] text-slate-400 font-bold flex items-center mt-1">
                <Navigation size={10} className="mr-1" /> {item.location.address}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-black">★ {item.rating}</span>
                <ChevronRight size={18} className="text-slate-300" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const Header = ({ title, showBack, lang }: { title: string, showBack?: boolean, lang: 'en' | 'bn' }) => (
  <div className="bg-[#0047FF] pt-14 pb-10 px-6 rounded-b-[32px] flex items-center justify-center relative shadow-lg">
    {showBack && <button onClick={() => window.history.back()} className="absolute left-6 text-white"><ArrowLeft size={24} /></button>}
    <h1 className="text-white text-xl font-black">{title}</h1>
  </div>
);

// Admin Login
const AdminLogin = ({ onLogin, lang }: { onLogin: (r: AdminRole) => void, lang: 'en' | 'bn' }) => {
  const [pass, setPass] = useState('');
  const currentT = T[lang];

  return (
    <div className="h-screen bg-[#F0F4FF] flex items-center justify-center p-8">
      <div className="w-full bg-white rounded-[40px] p-10 shadow-2xl space-y-8 text-center">
        <div className="bg-blue-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-blue-600"><Lock size={32} /></div>
        <h2 className="text-2xl font-black text-slate-800">{lang === 'en' ? 'Admin Login' : 'অ্যাডমিন প্রবেশ'}</h2>
        <input 
          type="password" placeholder={lang === 'en' ? 'Enter Password...' : 'পাসওয়ার্ড দিন...'} 
          className="w-full bg-slate-50 border-none rounded-2xl py-4 text-center font-bold"
          value={pass} onChange={e => setPass(e.target.value)}
        />
        <button 
          onClick={() => {
            if (pass === 'superadmin') onLogin(AdminRole.SUPER_ADMIN);
            else if (pass === 'admin') onLogin(AdminRole.CONTENT_MANAGER);
            else alert(lang === 'en' ? 'Wrong Password' : 'ভুল পাসওয়ার্ড');
          }}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg"
        >
          {lang === 'en' ? 'Login' : 'লগইন করুন'}
        </button>
      </div>
    </div>
  );
};

// Implement LiveExplorer with Gemini Maps Grounding
const LiveExplorer = ({ lang }: { lang: 'en' | 'bn' }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string, sources: any[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);
  const currentT = T[lang];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setCoords({ lat: 21.8122, lng: 90.1213 }) // Default to Kuakata
    );
  }, []);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    const info = await getLiveInfo(query, coords?.lat, coords?.lng);
    setResult(info);
    setLoading(false);
  };

  return (
    <div className="pb-32 bg-[#F0F4FF] min-h-screen">
      <Header title={currentT.live_exp_title} showBack lang={lang} />
      <div className="p-6 space-y-6">
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 space-y-4">
          <p className="text-xs font-bold text-slate-400 uppercase">{lang === 'en' ? 'Enter your query' : 'যেকোনো তথ্য জানতে লিখুন'}</p>
          <div className="relative">
             <input 
              placeholder={lang === 'en' ? "Any events in Kuakata today?" : "যেমন: কুয়াকাটায় আজ কি কোনো বিশেষ ইভেন্ট আছে?"} 
              className="w-full bg-slate-50 border-none rounded-2xl py-4 px-4 text-xs font-bold"
              value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-xl"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="prose prose-sm font-medium text-slate-600 leading-relaxed text-justify">
              {result.text}
            </div>
            
            {result.sources.length > 0 && (
              <div className="pt-4 border-t border-slate-50">
                <p className="text-[10px] font-black text-blue-600 uppercase mb-3">{lang === 'en' ? 'Sources:' : 'উৎস সমূহ:'}</p>
                <div className="flex flex-wrap gap-2">
                  {result.sources.map((s, i) => (
                    <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center">
                      {s.title} <ExternalLink size={10} className="ml-1" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Implement TourPlannerView with Gemini Itinerary Planning
const TourPlannerView = ({ lang }: { lang: 'en' | 'bn' }) => {
  const [days, setDays] = useState(2);
  const [itinerary, setItinerary] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const currentT = T[lang];

  const handleGenerate = async () => {
    setLoading(true);
    const data = await generateTourPlan(days);
    if (data && data.itinerary) {
      setItinerary(data.itinerary);
    }
    setLoading(false);
  };

  return (
    <div className="pb-32 bg-[#F0F4FF] min-h-screen">
      <Header title={currentT.planner_title} showBack lang={lang} />
      <div className="p-6 space-y-6">
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="text-slate-800 font-black text-sm">{lang === 'en' ? 'Duration' : 'ভ্রমণের সময়সীমা'}</h3>
            <div className="flex items-center bg-slate-100 rounded-xl p-1">
              {[1, 2, 3, 4].map(d => (
                <button 
                  key={d} 
                  onClick={() => setDays(d)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${days === d ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400'}`}
                >
                  {d} {lang === 'en' ? 'D' : 'দিন'}
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm shadow-lg flex items-center justify-center space-x-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            <span>{lang === 'en' ? 'Create Plan for Me' : 'আমার জন্য প্ল্যান তৈরি করুন'}</span>
          </button>
        </div>

        {itinerary && (
          <div className="space-y-4">
            {itinerary.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 space-y-4 animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-xs">{item.day}</div>
                  <h4 className="text-slate-800 font-black text-sm">{item.title || (lang === 'en' ? `Day ${item.day}` : `দিন ${item.day}`)}</h4>
                </div>
                <div className="space-y-3">
                  {item.activities.map((act: string, j: number) => (
                    <div key={j} className="flex items-start space-x-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-200"></div>
                      <p className="text-xs font-medium text-slate-500 leading-relaxed">{act}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EmergencyView = ({ lang }: { lang: 'en' | 'bn' }) => (
  <div className="pb-32">
    <Header title={T[lang].emergency_title} showBack lang={lang} />
    <div className="p-6 space-y-4">
      {EMERGENCY_CONTACTS.map(c => (
        <div key={c.name} className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex justify-between items-center">
          <div>
            <h4 className="font-black text-slate-800 text-sm">{c.name}</h4>
            <span className="text-[10px] text-slate-400 font-bold uppercase">{c.type}</span>
          </div>
          <a href={`tel:${c.phone}`} className="bg-emerald-50 text-emerald-600 p-3 rounded-full"><PhoneCall size={20} /></a>
        </div>
      ))}
    </div>
  </div>
);

const TransportView = ({ lang }: { lang: 'en' | 'bn' }) => (
  <div className="pb-32">
    <Header title={T[lang].transport_title} showBack lang={lang} />
    <div className="p-6 space-y-4">
      {TRANSPORT_INFO.map((t, idx) => (
        <div key={idx} className="bg-white p-6 rounded-[28px] shadow-sm border border-slate-100 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-black text-blue-600">{t.type}</h4>
            <span className="text-emerald-600 font-black text-xs">{t.fare}</span>
          </div>
          <div className="space-y-1 text-xs font-bold text-slate-500">
            <p>{lang === 'en' ? 'Route' : 'রুট'}: {t.route}</p>
            <p>{lang === 'en' ? 'Time' : 'সময়'}: {t.duration}</p>
            <p className="mt-2 text-[10px] italic">{t.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AdminDashboard = ({ 
  places, 
  hotels, 
  restaurants, 
  onSave, 
  role,
  lang
}: { 
  places: Place[], 
  hotels: Place[], 
  restaurants: Place[], 
  onSave: (type: Category, newData: Place[]) => void, 
  role: AdminRole,
  lang: 'en' | 'bn'
}) => {
  const [activeTab, setActiveTab] = useState<Category>(Category.PLACE);
  const [editingItem, setEditingItem] = useState<Partial<Place> | null>(null);

  const currentList = activeTab === Category.PLACE ? places : activeTab === Category.HOTEL ? hotels : restaurants;
  const canDelete = role === AdminRole.SUPER_ADMIN;

  const handleEdit = (item: Place) => {
    setEditingItem(item);
  };

  const handleAddNew = () => {
    setEditingItem({
      id: Date.now().toString(),
      category: activeTab,
      nameBn: '',
      nameEn: '',
      descriptionBn: '',
      descriptionEn: '',
      image: 'https://picsum.photos/800/600',
      location: { lat: 21.8, lng: 90.1, address: '' },
      rating: 4.5,
      facilities: [],
      bestTime: ''
    });
  };

  const handleDelete = (id: string) => {
    if (!canDelete) return;
    if (window.confirm('আপনি কি নিশ্চিত যে এটি ডিলিট করতে চান?')) {
      const newList = currentList.filter(i => i.id !== id);
      onSave(activeTab, newList);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const exists = currentList.find(i => i.id === editingItem.id);
    let newList: Place[];
    if (exists) {
      newList = currentList.map(i => i.id === editingItem.id ? (editingItem as Place) : i);
    } else {
      newList = [editingItem as Place, ...currentList];
    }

    onSave(activeTab, newList);
    setEditingItem(null);
  };

  return (
    <div className="pb-32 bg-[#F0F4FF] min-h-screen">
      <div className="bg-[#0047FF] pt-14 pb-12 px-6 rounded-b-[40px] relative">
        <button onClick={() => window.location.reload()} className="absolute top-14 right-6 text-white text-xs font-black border border-white/20 px-3 py-1 rounded-full backdrop-blur-md">Log Out</button>
        <h1 className="text-white text-2xl font-black text-center">{lang === 'en' ? 'Admin Dashboard' : 'অ্যাডমিন ড্যাশবোর্ড'}</h1>
        <p className="text-blue-100 text-[10px] text-center mt-1 font-bold uppercase tracking-widest">{role === AdminRole.SUPER_ADMIN ? 'Super Admin Access' : 'Content Manager Access'}</p>
      </div>

      <div className="px-6 -mt-6">
        <div className="bg-white rounded-[24px] p-2 flex space-x-1 shadow-lg border border-slate-100">
          {[Category.PLACE, Category.HOTEL, Category.RESTAURANT].map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === cat ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}
            >
              {cat === Category.PLACE ? (lang === 'en' ? 'Places' : 'স্থান') : cat === Category.HOTEL ? (lang === 'en' ? 'Hotels' : 'হোটেল') : (lang === 'en' ? 'Food' : 'খাবার')}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <button 
          onClick={handleAddNew}
          className="w-full bg-emerald-50 text-emerald-600 py-4 rounded-[20px] font-black text-sm border-2 border-dashed border-emerald-200 flex items-center justify-center space-x-2 active:scale-95 transition-all"
        >
          <Plus size={20} />
          <span>{lang === 'en' ? `Add New ${activeTab}` : `নতুন ${activeTab === Category.PLACE ? 'স্থান' : activeTab === Category.HOTEL ? 'হোটেল' : 'খাবার'} যোগ করুন`}</span>
        </button>

        <div className="space-y-3">
          {currentList.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-[28px] border border-slate-100 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-4">
                <img src={item.image} className="w-12 h-12 rounded-xl object-cover bg-slate-100" />
                <div>
                  <h4 className="text-slate-800 font-black text-xs line-clamp-1">{lang === 'en' ? item.nameEn : item.nameBn}</h4>
                  <p className="text-[10px] text-slate-400 font-bold">{item.location.address || 'No Address'}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(item)} className="p-2 bg-blue-50 text-blue-600 rounded-lg active:scale-90 transition-all">
                  <Edit size={16} />
                </button>
                {canDelete && (
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-rose-50 text-rose-600 rounded-lg active:scale-90 transition-all">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Form Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md p-6 flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl space-y-6 overflow-y-auto max-h-[85vh]">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-xl text-slate-800">{lang === 'en' ? 'Edit Information' : 'তথ্য পরিবর্তন করুন'}</h3>
              <button onClick={() => setEditingItem(null)} className="p-2 text-slate-300"><X size={24} /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Name (English)</label>
                <input 
                  className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold"
                  value={editingItem.nameEn} onChange={e => setEditingItem({...editingItem, nameEn: e.target.value})} required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">নাম (বাংলা)</label>
                <input 
                  className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold"
                  value={editingItem.nameBn} onChange={e => setEditingItem({...editingItem, nameBn: e.target.value})} required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Image URL</label>
                <input 
                  className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold"
                  value={editingItem.image} onChange={e => setEditingItem({...editingItem, image: e.target.value})} required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Address</label>
                <input 
                  className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold"
                  value={editingItem.location?.address} onChange={e => setEditingItem({...editingItem, location: {...editingItem.location!, address: e.target.value}})} required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Rating</label>
                  <input 
                    type="number" step="0.1" max="5" min="1"
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold"
                    value={editingItem.rating} onChange={e => setEditingItem({...editingItem, rating: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Price (৳)</label>
                  <input 
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold"
                    value={editingItem.priceRange || ''} onChange={e => setEditingItem({...editingItem, priceRange: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Best Time to Visit</label>
                <div className="relative">
                  <Clock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    placeholder="e.g. Winter or Sunset"
                    className="w-full bg-slate-50 border-none rounded-xl py-3 pl-10 pr-4 text-xs font-bold"
                    value={editingItem.bestTime || ''} onChange={e => setEditingItem({...editingItem, bestTime: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Description (English)</label>
                <textarea 
                  rows={3}
                  className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold resize-none"
                  value={editingItem.descriptionEn} onChange={e => setEditingItem({...editingItem, descriptionEn: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">বিস্তারিত (বাংলা)</label>
                <textarea 
                  rows={3}
                  className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold resize-none"
                  value={editingItem.descriptionBn} onChange={e => setEditingItem({...editingItem, descriptionBn: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center space-x-2 active:scale-95 transition-all"
              >
                <Save size={18} />
                <span>{lang === 'en' ? 'Save' : 'সংরক্ষণ করুন'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
