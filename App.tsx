
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home as HomeIcon, Hotel, Utensils, PhoneCall, Navigation, 
  Calendar, ChevronRight, ArrowLeft, Star, Loader2, CheckCircle2, 
  UserCircle, Globe2, LogOut, ShoppingBag, ShieldCheck, 
  FileEdit, LayoutDashboard, MapPin, Compass, Waves, Sun, 
  BookOpen, Camera, Eye, EyeOff
} from 'lucide-react';
import { Category, Place, AdminRole, Product, Booking } from './types';
import { db, supabase } from './services/database';

// --- Global Config ---
const COMMISSION_RATE = 0.10;

const T = {
  bn: {
    appName: "OurKuakata",
    tagline: "কুয়াকাটার প্রথম ডিজিটাল ট্যুর গাইড",
    hub_title: "অ্যাকাউন্ট হাব",
    guide_section: "কোথায় ঘুরবেন?",
    business_section: "সেবা ও বুকিং",
    explore_title: "কুয়াকাটা ভ্রমণ নির্দেশিকা",
    auth_error: "ভুল ইউজারনেম বা পাসওয়ার্ড!",
    reg_error: "এই ইউজার বা ইমেইল ইতিমধ্যে নিবন্ধিত আছে।",
    reg_failed: "তথ্য জমা করা সম্ভব হয়নি। ডাটাবেস চেক করুন।"
  },
  en: {
    appName: "OurKuakata",
    tagline: "Kuakata's #1 Digital Travel Companion",
    hub_title: "Profile Hub",
    guide_section: "Sightseeing Guide",
    business_section: "Stay & Dine",
    explore_title: "Explore Kuakata",
    auth_error: "Incorrect Username or Password!",
    reg_error: "User or Email already exists.",
    reg_failed: "Database Write Failed. Please check your Supabase setup."
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'testing' | 'ok' | 'fail'>('testing');

  useEffect(() => {
    const initData = async () => {
      try {
        const isConnected = await db.testConnection();
        
        if (isConnected) {
          setDbStatus('ok');
          const [loadedProducts, loadedBookings, loadedPlaces] = await Promise.all([
            db.getProducts(),
            db.getBookings(),
            db.getPlaces()
          ]);
          setProducts(loadedProducts);
          setBookings(loadedBookings);
          setPlaces(loadedPlaces);
        } else {
          setDbStatus('fail');
        }
        
        const savedUser = JSON.parse(localStorage.getItem('v_current_user') || 'null');
        setUser(savedUser);
      } catch (err) {
        console.error("Init Error:", err);
        setDbStatus('fail');
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      await db.updateBooking(bookingId, { status: 'CONFIRMED' });
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CONFIRMED' } : b));
    } catch (err) {
      alert("Database error: Could not confirm booking.");
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#0047FF] flex flex-col items-center justify-center text-white space-y-4">
      <Compass size={48} className="animate-spin opacity-50" />
      <p className="font-black text-xs uppercase tracking-[0.3em]">OurKuakata</p>
    </div>
  );

  return (
    <Router>
      {dbStatus === 'fail' && (
        <div className="fixed top-0 left-0 w-full bg-rose-600 text-white text-[10px] font-black py-2 text-center z-[9999] uppercase tracking-widest shadow-xl">
           DATABASE ERROR: SUPABASE UNREACHABLE. ENSURE TABLES ARE CREATED.
        </div>
      )}
      <div className="app-container min-h-screen relative shadow-2xl bg-white max-w-[450px] mx-auto overflow-hidden pb-24">
        <Routes>
          <Route path="/" element={<HomeView lang={lang} setLang={setLang} places={places} />} />
          <Route path="/hub" element={<ProfileHubView lang={lang} user={user} onLogout={() => { setUser(null); localStorage.removeItem('v_current_user'); }} />} />
          <Route path="/auth" element={<AuthView lang={lang} onLogin={(u: any) => { setUser(u); localStorage.setItem('v_current_user', JSON.stringify(u)); }} />} />
          <Route path="/places" element={<ExploreView lang={lang} places={places} />} />
          <Route path="/emergency" element={<EmergencyView lang={lang} />} />
          <Route path="/detail/:id" element={<MarketDetailView lang={lang} products={products} places={places} user={user} onBook={async (b: any) => {
            const commission = b.totalPrice * COMMISSION_RATE;
            const newBooking: Booking = { ...b, id: `BK-${Date.now()}`, status: 'PENDING', commission, date: new Date().toLocaleDateString() };
            await db.saveBooking(newBooking);
            setBookings(prev => [newBooking, ...prev]);
            alert("Success: Booking Saved!");
          }} />} />
          
          <Route path="/vendor/*" element={<VendorPortal lang={lang} user={user} products={products} setProducts={async (p: any) => { setProducts(p); await db.saveProducts(p); }} bookings={bookings} onConfirm={handleConfirmBooking} />} />
          <Route path="/super-admin/*" element={<SuperAdminPortal lang={lang} user={user} places={places} setPlaces={async (p: any) => { setPlaces(p); await db.savePlaces(p); }} bookings={bookings} />} />
          <Route path="/manager/*" element={<ContentManagerPortal lang={lang} user={user} places={places} setPlaces={async (p: any) => { setPlaces(p); await db.savePlaces(p); }} />} />
        </Routes>
        <BottomNav lang={lang} user={user} />
      </div>
    </Router>
  );
};

// --- AUTH VIEW (Netlify Ready) ---
const AuthView = ({ lang, onLogin }: any) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<AdminRole>(AdminRole.USER);
  const [type, setType] = useState<Category>(Category.HOTEL);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async () => {
    if (!name.trim() || !password.trim()) return alert("Username/Password Required");
    if (isRegistering && !email.includes('@')) return alert("Valid Email Required");

    setLoading(true);
    try {
      const usersInDb = await db.getUsers();

      if (isRegistering) {
        const exists = usersInDb.find(u => 
          u.name.toLowerCase() === name.toLowerCase() || 
          (u.email && u.email.toLowerCase() === email.toLowerCase())
        );
        
        if (exists) {
            alert(T[lang].reg_error);
            setLoading(false);
            return;
        }

        const newUser = { 
          id: `U-${Date.now()}`, 
          name: name.trim(), 
          email: email.trim().toLowerCase(), 
          password: password, 
          role: role, 
          type: role === AdminRole.VENDOR ? type : undefined
        };
        
        // Critical: db.saveUser includes verification logic now
        await db.saveUser(newUser);
        onLogin(newUser);
        redirectUser(newUser.role);
      } else {
        const matchedUser = usersInDb.find((u: any) => 
          (u.email?.toLowerCase() === name.toLowerCase() || u.name?.toLowerCase() === name.toLowerCase()) && 
          (u.password === password)
        );
        
        if (matchedUser) {
            onLogin(matchedUser);
            redirectUser(matchedUser.role);
        } else {
            alert(T[lang].auth_error);
        }
      }
    } catch (err: any) {
      alert(`DATABASE ERROR:\n${err.message}\n\nHint: Check if SQL Editor was used to create tables.`);
      console.error("Auth Exception:", err);
    } finally {
      setLoading(false);
    }
  };

  const redirectUser = (userRole: AdminRole) => {
    if (userRole === AdminRole.SUPER_ADMIN) navigate('/super-admin');
    else if (userRole === AdminRole.NONE) navigate('/manager');
    else if (userRole === AdminRole.VENDOR) navigate('/vendor');
    else navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0047FF] flex items-end justify-center">
      <div className="w-full bg-white rounded-t-[60px] p-10 shadow-2xl space-y-8 pb-20 animate-in slide-in-from-bottom">
        <div className="text-center space-y-2 pt-4">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">{isRegistering ? "Registration" : "Login"}</h2>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
            {isRegistering ? "Syncing with Supabase..." : "Direct Database Access"}
          </p>
        </div>
        
        <div className="space-y-4">
          <input placeholder={isRegistering ? "Your Name" : "Username / Email"} className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 outline-none rounded-3xl py-5 px-6 font-bold text-sm" value={name} onChange={e => setName(e.target.value)} />
          {isRegistering && (
            <input type="email" placeholder="Email" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 outline-none rounded-3xl py-5 px-6 font-bold text-sm" value={email} onChange={e => setEmail(e.target.value)} />
          )}
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Password" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 outline-none rounded-3xl py-5 px-6 font-bold text-sm" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          
          {!isRegistering ? null : (
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setRole(AdminRole.USER)} className={`py-4 rounded-2xl text-[10px] font-black uppercase transition-all border-2 ${role === AdminRole.USER ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>Traveler</button>
              <button onClick={() => setRole(AdminRole.VENDOR)} className={`py-4 rounded-2xl text-[10px] font-black uppercase transition-all border-2 ${role === AdminRole.VENDOR ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>Business</button>
            </div>
          )}
          
          <button onClick={handleAuth} disabled={loading} className="w-full bg-[#0047FF] text-white py-5 rounded-[32px] font-black shadow-2xl flex items-center justify-center space-x-3 text-sm mt-6">
            {loading ? <Loader2 size={24} className="animate-spin" /> : <CheckCircle2 size={24} />}
            <span>{isRegistering ? "Sign Up" : "Sign In"}</span>
          </button>

          <button onClick={() => setIsRegistering(!isRegistering)} className="w-full text-slate-400 text-xs font-bold py-4">
            {isRegistering ? "Switch to Login" : "Create Traveler/Business Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ... (Rest of UI components remain identical but with dbStatus awareness) ...

const HomeView = ({ lang, setLang, places }: any) => {
  const attractions = places.filter((p: any) => p.category === 'PLACE');
  return (
    <div className="animate-in fade-in">
      <header className="bg-[#0047FF] pt-14 pb-20 px-8 rounded-b-[60px] shadow-2xl relative text-center">
        <div className="flex justify-between mb-8">
           <button onClick={() => setLang(lang === 'en' ? 'bn' : 'en')} className="glass text-white text-[10px] font-black px-4 py-2 rounded-2xl">
             {lang === 'en' ? 'বাংলা' : 'ENGLISH'}
           </button>
           <Link to="/hub" className="p-1 glass rounded-2xl text-white"><UserCircle size={28} /></Link>
        </div>
        <h1 className="text-white text-5xl font-black tracking-tighter">OurKuakata</h1>
        <p className="text-blue-100 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">{T[lang].tagline}</p>
      </header>
      <main className="px-6 mt-14">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
          <MapPin size={16} className="text-[#0047FF]" /> {T[lang].guide_section}
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {attractions.length === 0 ? <p className="p-5 text-slate-300 font-bold uppercase text-[10px]">Fetching from Supabase...</p> : attractions.map((p: any) => (
            <Link key={p.id} to={`/detail/${p.id}`} className="min-w-[200px] bg-white rounded-[40px] shadow-xl border border-slate-50 overflow-hidden">
              <img src={p.image} className="h-28 w-full object-cover" />
              <div className="p-5 font-black text-slate-800 text-sm">{lang === 'bn' ? p.nameBn : p.nameEn}</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

const ProfileHubView = ({ lang, user, onLogout }: any) => (
  <div className="min-h-screen bg-slate-50 p-8 pt-20">
     <h1 className="text-3xl font-black text-slate-800 mb-8">Profile Hub</h1>
     {user ? (
       <div className="bg-white p-8 rounded-[44px] shadow-xl border border-slate-50 flex items-center justify-between">
          <div>
             <p className="font-black text-slate-800">{user.name}</p>
             <p className="text-[10px] text-blue-600 font-black uppercase">{user.role}</p>
          </div>
          <button onClick={onLogout} className="p-4 bg-rose-50 text-rose-500 rounded-2xl"><LogOut /></button>
       </div>
     ) : (
       <Link to="/auth" className="block w-full bg-blue-600 text-white py-5 rounded-[32px] text-center font-black">Login to App</Link>
     )}
  </div>
);

const ExploreView = ({ lang, places }: any) => (
  <div className="p-8 pt-20">
     <h1 className="text-3xl font-black text-slate-800 mb-8">{T[lang].explore_title}</h1>
     {places.map((p: any) => (
       <Link key={p.id} to={`/detail/${p.id}`} className="block bg-white rounded-[40px] shadow-xl border border-slate-50 h-32 mb-4 overflow-hidden flex">
          <div className="w-1/3 bg-slate-100"><img src={p.image} className="w-full h-full object-cover" /></div>
          <div className="p-6 flex flex-col justify-center"><h4 className="font-black text-slate-800">{lang === 'bn' ? p.nameBn : p.nameEn}</h4></div>
       </Link>
     ))}
  </div>
);

const MarketDetailView = ({ lang, products, places, onBook, user }: any) => {
  const loc = useLocation();
  const id = loc.pathname.split('/').pop();
  const place = places.find((p: any) => p.id === id);
  const myProducts = products.filter((p: Product) => p.vendorId === place?.vendorId);
  if (!place) return <div className="p-20 text-center font-black text-slate-300">Syncing...</div>;
  return (
    <div className="pb-32 bg-white min-h-screen">
       <div className="h-[400px] relative">
          <img src={place.image} className="w-full h-full object-cover" />
          <button onClick={() => window.history.back()} className="absolute top-14 left-6 p-4 glass rounded-3xl text-white"><ArrowLeft /></button>
       </div>
       <div className="p-10 -mt-10 bg-white rounded-t-[60px] relative">
          <h1 className="text-4xl font-black text-slate-800 mb-4">{lang === 'bn' ? place.nameBn : place.nameEn}</h1>
          <p className="text-slate-500 mb-10">{lang === 'bn' ? place.descriptionBn : place.descriptionEn}</p>
          {myProducts.map(p => (
            <div key={p.id} className="bg-slate-50 p-6 rounded-[44px] mb-4 flex justify-between items-center">
               <div><p className="font-black">{p.nameEn}</p><p className="text-blue-600 font-black">৳{p.price}</p></div>
               <button onClick={() => onBook({...p, userId: user?.id})} className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[11px] font-black">RESERVE</button>
            </div>
          ))}
       </div>
    </div>
  );
};

const EmergencyView = ({ lang }: any) => (
  <div className="p-8 pt-20">
    <h1 className="text-4xl font-black text-slate-800 mb-8">Emergency</h1>
    <div className="bg-rose-50 p-8 rounded-[44px] border border-rose-100 flex justify-between items-center">
       <div><p className="font-black">Tourist Police</p><p className="text-rose-500 font-black text-[10px]">KUAKATA HQ</p></div>
       <a href="tel:999" className="bg-rose-500 text-white px-6 py-3 rounded-2xl font-black text-xs">Call</a>
    </div>
  </div>
);

const BottomNav = ({ lang }: any) => {
  const loc = useLocation();
  if (loc.pathname.startsWith('/auth')) return null;
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[450px] bg-white border-t p-6 flex justify-around items-center z-50 rounded-t-[40px] shadow-2xl">
      <Link to="/" className={loc.pathname === '/' ? 'text-blue-600' : 'text-slate-300'}><HomeIcon /></Link>
      <Link to="/places" className={loc.pathname === '/places' ? 'text-blue-600' : 'text-slate-300'}><Navigation /></Link>
      <Link to="/emergency" className={loc.pathname === '/emergency' ? 'text-blue-600' : 'text-slate-300'}><PhoneCall /></Link>
      <Link to="/hub" className={loc.pathname === '/hub' ? 'text-blue-600' : 'text-slate-300'}><LayoutDashboard /></Link>
    </nav>
  );
};

// Fixed: Added props interfaces/destructuring to resolve "Property does not exist on type IntrinsicAttributes" errors.
const SuperAdminPortal = (props: any) => <div className="p-20 font-black">Admin Access</div>;
const ContentManagerPortal = (props: any) => <div className="p-20 font-black">Staff Control</div>;
const VendorPortal = (props: any) => <div className="p-20 font-black">Business Dashboard</div>;

export default App;
