import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home as HomeIcon, PhoneCall, Megaphone, UserCircle, 
  ArrowLeft, Globe, Sunrise, Sunset, 
  ChevronDown, Mail, Smartphone, Camera, 
  Star, Loader2, Compass, ShieldCheck, Save, Edit, 
  Trash2, PlusCircle, LayoutDashboard, Database, MapPin,
  CreditCard, AlertTriangle, Bus, Info, PlayCircle, MoreVertical,
  ChevronRight, CheckCircle2, UserPlus, Lock
} from 'lucide-react';
import { generateTourPlan, speakText } from './services/gemini';

// --- Global Audio Helper ---
const playPCM = async (base64: string) => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    
    const dataInt16 = new Int16Array(bytes.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start();
  } catch (e) {
    console.error("Audio Playback Error:", e);
  }
};

// --- Safe Fetch Helper ---
const safeFetch = async (url: string, options: RequestInit = {}) => {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await res.json();
    } else {
      const text = await res.text();
      console.warn("Received non-JSON response:", text.substring(0, 100));
      return null;
    }
  } catch (error) {
    console.error("SafeFetch Error:", error);
    return null;
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('v_user') || 'null'));
  const [config, setConfig] = useState<any>(null);

  const fetchConfig = async () => {
    const data = await safeFetch('api.php?action=get_config');
    if (data) setConfig(data);
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  if (!config) return <div className="h-screen flex flex-col items-center justify-center gap-4 bg-white"><Loader2 className="animate-spin text-blue-600" size={40}/><p className="text-slate-400 font-bold animate-pulse">Initializing Portal...</p></div>;

  const isAdmin = user?.email === 'helloyeasin00@gmail.com';

  return (
    <Router>
      <div className="app-container min-h-screen bg-slate-50 max-w-[450px] mx-auto overflow-hidden pb-32 shadow-2xl relative font-['Hind_Siliguri']">
        <Routes>
          <Route path="/" element={<HomeView config={config} />} />
          <Route path="/login" element={<LoginView onLogin={(u: any) => { setUser(u); localStorage.setItem('v_user', JSON.stringify(u)); }} />} />
          <Route path="/signup" element={<SignupView />} />
          <Route path="/profile" element={<ProfileView user={user} onLogout={() => { setUser(null); localStorage.removeItem('v_user'); }} />} />
          <Route path="/emergency" element={<EmergencyView data={config.emergency} />} />
          <Route path="/announcements" element={<AnnouncementsView data={config.announcements} />} />
          <Route path="/admin" element={isAdmin ? <AdminDashboard config={config} refresh={fetchConfig} /> : <div className="p-10 text-center">Unauthorized Access Restricted</div>} />
          
          {/* Categorized Content */}
          <Route path="/places" element={<ListView title="Tourist Spots" data={config.places || []} />} />
          <Route path="/kitkat" element={<ListView title="Kitkat Chair" data={config.kitkat || []} />} />
          <Route path="/transport" element={<ListView title="Transport Counter" data={config.transport || []} />} />
          <Route path="/bank" element={<ListView title="Bank/ATM" data={config.bank || []} />} />
          <Route path="/warning" element={<ListView title="Caution Area" data={config.warning || []} />} />
          <Route path="/hotels" element={<ListView title="Find Your Accommodation" data={config.hotels || []} />} />
          <Route path="/tourist-bus" element={<ListView title="Tourist Bus" data={config.tourist_bus || []} />} />
          <Route path="/restaurant" element={<ListView title="Restaurant" data={config.restaurant || []} />} />
          <Route path="/ai-planner" element={<AIPlannerView />} />
          <Route path="*" element={<ComingSoon/>} />
        </Routes>
        
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[450px] z-50">
          <div className="bg-[#22C55E] text-white py-3 overflow-hidden whitespace-nowrap border-b border-white/10 shadow-lg">
            <div className="animate-marquee inline-block font-bold text-[12px] px-4 font-inter tracking-wide">{config.ticker.bn}</div>
          </div>
          <BottomNav />
        </div>
      </div>
    </Router>
  );
};

// --- AUTH VIEWS ---

const LoginView = ({ onLogin }: any) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await safeFetch('api.php?action=login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass })
    });
    if (res && res.status === 'success') {
      onLogin(res.user);
      navigate('/');
    } else alert('Invalid Email or Password');
  };

  return (
    <div className="p-10 pt-24 space-y-8 bg-white h-screen">
      <div className="text-center"><UserCircle size={80} className="mx-auto text-blue-600 mb-4"/><h1 className="text-3xl font-black">লগ ইন করুন</h1></div>
      <div className="space-y-4">
        <Input label="ইমেল ঠিকানা *" value={email} onChange={setEmail} placeholder="example@mail.com"/>
        <Input label="পাসওয়ার্ড *" value={pass} onChange={setPass} placeholder="••••••••" type="password"/>
        <button onClick={handleLogin} className="w-full bg-[#0047FF] text-white py-5 rounded-2xl font-black shadow-xl active:scale-95 transition-transform">লগ ইন</button>
        <p className="text-center text-sm font-bold text-slate-400">অ্যাকাউন্ট নেই? <Link to="/signup" className="text-blue-600">সাইন আপ করুন</Link></p>
      </div>
    </div>
  );
};

const SignupView = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', mobile: '', nid: '' });
  const navigate = useNavigate();

  const handleSignup = async () => {
    const res = await safeFetch('api.php?action=signup', {
      method: 'POST',
      body: JSON.stringify(form)
    });
    if (res && res.status === 'success') { navigate('/login'); } else alert(res?.message || 'Signup Failed');
  };

  return (
    <div className="p-8 pt-14 space-y-6 bg-[#003056] min-h-screen text-white pb-32 overflow-y-auto hide-scrollbar">
      <div className="flex items-center gap-4 justify-between">
        <button onClick={()=>window.history.back()} className="p-3 bg-white/10 rounded-xl"><ArrowLeft size={20}/></button>
        <Info size={20} className="text-white/40"/>
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black tracking-tight">সাইন আপ করুন</h1>
        <p className="text-slate-300 font-bold">অ্যাকাউন্ট তৈরি করতে ফর্মটি পূরণ করুন</p>
      </div>
      <div className="flex flex-col items-center gap-2 mb-8 mt-6">
        <div className="w-24 h-24 bg-slate-300 rounded-full flex items-center justify-center relative border-4 border-white/20">
          <UserCircle size={40} className="text-slate-500"/>
          <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full text-slate-800 shadow-lg"><PlusCircle size={16}/></button>
        </div>
        <span className="text-xs font-bold text-white/70">প্রোফাইল ছবি নির্বাচন করুন</span>
      </div>
      <div className="space-y-4">
        <Input label="নাম *" value={form.name} onChange={(v:any)=>setForm({...form, name: v})} placeholder="নামের প্রথম অংশ লিখুন" light/>
        <div className="flex gap-4 p-2"><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked className="w-4 h-4 accent-green-500"/> বাংলাদেশী</label><label className="flex items-center gap-2 text-sm font-bold text-white/50"><input type="checkbox" className="w-4 h-4"/> অন্যান্য</label></div>
        <Input label="মোবাইল নম্বর *" value={form.mobile} onChange={(v:any)=>setForm({...form, mobile: v})} placeholder="মোবাইল নম্বর" light/>
        <Input label="ইমেল ঠিকানা" value={form.email} onChange={(v:any)=>setForm({...form, email: v})} placeholder="ইমেল ঠিকানা লিখুন" light/>
        <Input label="পাসওয়ার্ড" value={form.password} onChange={(v:any)=>setForm({...form, password: v})} placeholder="পাসওয়ার্ড" light type="password"/>
        <Input label="এনআইডি কার্ড" value={form.nid} onChange={(v:any)=>setForm({...form, nid: v})} placeholder="এনআইডি বা অনলাইন নম্বর দিন" light/>
        <button onClick={handleSignup} className="w-full bg-[#22C55E] py-5 rounded-2xl font-black text-white shadow-xl mt-6 active:scale-95 transition-transform">অ্যাকাউন্ট তৈরি করে নিন</button>
        <p className="text-center text-xs font-bold text-white/40 pb-10">ইতিমধ্যেই একটি অ্যাকাউন্ট আছে? <Link to="/login" className="text-white underline">লগ ইন করুন</Link></p>
      </div>
    </div>
  );
};

// --- CORE UI ---

const HomeView = ({ config }: any) => {
  const navigate = useNavigate();
  return (
    <div className="animate-in fade-in">
      <header className="relative bg-gradient-to-b from-[#4EB0F5] to-[#0047FF] pt-10 pb-24 px-6 text-center text-white rounded-b-[50px] shadow-2xl overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="flex justify-between items-center mb-10 relative z-10">
          <div className="bg-[#22C55E] px-4 py-1.5 rounded-full text-[10px] font-black border border-white/20 shadow-lg">Online</div>
          <div className="flex items-center gap-3">
             <button className="bg-white/20 px-4 py-2 rounded-xl text-xs font-bold border border-white/10 flex items-center gap-1 backdrop-blur-md">English <ChevronDown size={14}/></button>
             <button onClick={()=>navigate('/profile')} className="p-2 hover:bg-white/10 rounded-full transition-colors"><MoreVertical/></button>
          </div>
        </div>
        <h1 className="text-[52px] font-black leading-none drop-shadow-2xl mb-2 font-inter">Welcome to</h1>
        <p className="text-md font-bold text-white/90 mt-1 mb-10 px-6 drop-shadow-md">{config.hero.subBn}</p>
        <div className="inline-flex items-center gap-4 bg-black/20 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20 text-[11px] font-bold shadow-2xl">
           <div className="flex items-center gap-2.5"><Sunrise size={16} className="text-amber-300"/> Sunrise at 6:32 AM</div>
           <div className="w-px h-4 bg-white/30"></div>
           <div className="flex items-center gap-2.5"><Sunset size={16} className="text-orange-400"/> Sunset at 5:34 PM</div>
        </div>
      </header>

      <main className="px-5 -mt-10 relative z-20 pb-20 grid grid-cols-2 gap-5">
        {config.features.map((f: any) => (
          <Link key={f.id} to={f.path} className="bg-white p-5 rounded-[40px] shadow-2xl border border-slate-100 flex flex-col items-center justify-between text-center gap-4 active:scale-95 transition-all h-56 group hover:shadow-blue-100">
            <div className="w-full h-32 rounded-3xl overflow-hidden bg-slate-50 border border-slate-50 flex items-center justify-center">
              <img src={f.icon} alt="" className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"/>
            </div>
            <span className="text-[13px] font-black text-slate-800 leading-tight h-10 flex items-center justify-center px-1">{f.label}</span>
          </Link>
        ))}
      </main>
    </div>
  );
};

const AnnouncementsView = ({ data }: any) => {
  const [playing, setPlaying] = useState<string | null>(null);

  const handleSpeak = async (text: string, id: string) => {
    if (playing) return;
    setPlaying(id);
    const audio = await speakText(text);
    if (audio) await playPCM(audio);
    setPlaying(null);
  };

  return (
    <div className="bg-white min-h-screen pb-40">
      <header className="bg-[#4D2F23] pt-14 pb-16 px-8 text-center text-white relative shadow-2xl">
        <button onClick={()=>window.history.back()} className="absolute left-6 top-14 p-4 bg-white/10 rounded-2xl backdrop-blur-md"><ArrowLeft/></button>
        <div className="absolute right-6 top-14 flex items-center gap-3">
           <button onClick={() => data[0] && handleSpeak(data[0].content, data[0].id)} className="bg-white/20 border border-white/20 px-5 py-2 rounded-full flex items-center gap-2 text-sm font-bold backdrop-blur-md">
             {playing ? <Loader2 size={18} className="animate-spin text-amber-400"/> : <PlayCircle size={18} className="text-amber-400"/>} অডিও শুনুন
           </button>
           <Info size={22} className="text-white/40"/>
        </div>
        <h1 className="text-4xl font-black mt-12 tracking-tight">ঘোষণা</h1>
        <p className="text-white/60 font-bold text-sm mt-3 px-8">জেলা প্রশাসন কর্তৃক জরুরী ঘোষণা সমূহের বিস্তারিত</p>
      </header>
      <div className="p-6 space-y-6 -mt-8 relative z-20">
        {data.map((n: any) => (
          <div key={n.id} className="bg-white rounded-[40px] shadow-[0_15px_50px_rgba(0,0,0,0.08)] border border-slate-50 p-10 animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-5">
              <h4 className="text-[#0047FF] font-black text-xl tracking-tight">তারিখ: {n.date}</h4>
              <div className="p-2 bg-slate-50 rounded-full"><ChevronDown size={20} className="text-blue-600"/></div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="p-4 bg-rose-50 rounded-2xl shrink-0"><AlertTriangle className="text-rose-500" size={24}/></div>
              <p className="text-slate-800 font-bold leading-loose text-[16px]">{n.content}</p>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-50 flex justify-end">
               <div className="bg-rose-500 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-rose-200">
                 IMPORTANT NOTICE
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmergencyView = ({ data }: any) => (
  <div className="bg-slate-50 min-h-screen">
    <header className="bg-[#4D1515] pt-14 pb-24 px-8 text-center text-white rounded-b-[50px] relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl"></div>
      <button onClick={()=>window.history.back()} className="absolute left-6 top-14 p-4 bg-white/10 rounded-2xl"><ArrowLeft/></button>
      <div className="bg-[#22C55E] px-4 py-1.5 rounded-full text-[10px] font-black absolute top-14 right-6 border border-white/20">অনলাইন</div>
      <h1 className="text-5xl font-black mt-12 tracking-tight">জরুরি সেবা</h1>
      <p className="text-white/60 font-bold text-sm mt-3">যেকোনো জরুরি দরকারে ফোন করুন</p>
    </header>
    <div className="p-6 grid grid-cols-2 gap-5 -mt-12 relative z-20 pb-40">
      {data.map((e: any) => (
        <div key={e.id} className="bg-white p-6 rounded-[35px] shadow-2xl border border-slate-50 flex flex-col items-center gap-4 hover:shadow-rose-100 transition-all active:scale-95">
          <div className="w-full h-28 bg-slate-50 rounded-2xl flex items-center justify-center p-5 border border-slate-100">
            <img src={e.icon} alt="" className="w-full h-full object-contain"/>
          </div>
          <h4 className="text-[13px] font-black text-slate-800 h-10 flex items-center text-center leading-tight">{e.name}</h4>
          <a href={`tel:${e.phone}`} className="w-full bg-blue-50 text-[#0047FF] font-black py-2 rounded-xl text-center text-sm">{e.phone}</a>
        </div>
      ))}
    </div>
  </div>
);

// --- MASTER ADMIN DASHBOARD ---
const AdminDashboard = ({ config, refresh }: any) => {
  const [activeTab, setActiveTab] = useState('features');
  const [editData, setEditData] = useState(JSON.parse(JSON.stringify(config))); // Deep copy
  const [activeList, setActiveList] = useState('places');
  const [isSyncing, setIsSyncing] = useState(false);

  const save = async (key: string, data: any) => {
    setIsSyncing(true);
    const res = await safeFetch('api.php?action=update_config', {
      method: 'POST',
      body: JSON.stringify({ key, data })
    });
    setIsSyncing(false);
    if(res && res.status === 'success') {
      alert('Database Synced Successfully!');
      refresh();
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-40 font-inter">
      <header className="bg-[#001D3D] p-10 pt-20 text-white rounded-b-[60px] shadow-2xl relative">
        <button onClick={()=>window.history.back()} className="absolute left-6 top-14 p-4 bg-white/5 rounded-2xl"><ArrowLeft/></button>
        <h1 className="text-4xl font-black">Admin Panel</h1>
        <p className="text-blue-500 font-bold text-xs uppercase tracking-[0.3em] mt-3">Access Level: Master Admin</p>
        <div className="flex gap-2 mt-10 overflow-x-auto hide-scrollbar py-2">
          {['branding', 'features', 'lists', 'notices'].map(t => (
            <button key={t} onClick={()=>setActiveTab(t)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === t ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'bg-white/5 text-white/30'}`}>{t}</button>
          ))}
        </div>
      </header>

      <div className="p-6 space-y-6">
        {isSyncing && <div className="p-4 bg-blue-600 text-white text-center rounded-2xl font-black animate-pulse shadow-xl">Synchronizing Database...</div>}
        
        {activeTab === 'branding' && (
          <div className="bg-white p-10 rounded-[50px] shadow-2xl space-y-6">
             <h3 className="text-2xl font-black text-slate-800">Site Identity</h3>
             <Input label="Main Welcome Title" value={editData.hero.bn} onChange={(v:any)=>setEditData({...editData, hero:{...editData.hero, bn:v}})}/>
             <Input label="Header Description" value={editData.hero.subBn} onChange={(v:any)=>setEditData({...editData, hero:{...editData.hero, subBn:v}})}/>
             <Input label="Marquee News Text" value={editData.ticker.bn} onChange={(v:any)=>setEditData({...editData, ticker:{...editData.ticker, bn:v}})}/>
             <button onClick={()=>save('hero', editData.hero)} className="admin-btn-primary">Update Header</button>
             <button onClick={()=>save('ticker', editData.ticker)} className="admin-btn-secondary">Update Ticker</button>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="bg-white p-10 rounded-[50px] shadow-2xl space-y-6">
             <h3 className="text-2xl font-black text-slate-800">Home Grid Manager</h3>
             <p className="text-xs font-bold text-slate-400 -mt-4">Edit labels and icons for the main dashboard grid.</p>
             {editData.features.map((f:any, i:number) => (
               <div key={i} className="p-6 bg-slate-50 rounded-[35px] border border-slate-100 space-y-4 relative">
                 <button onClick={()=>{ const nf = [...editData.features]; nf.splice(i,1); setEditData({...editData, features:nf}); }} className="absolute top-4 right-4 text-rose-500 p-2"><Trash2 size={18}/></button>
                 <Input label={`Item ${i+1} Label`} value={f.label} onChange={(v:any)=>{ const nf = [...editData.features]; nf[i].label = v; setEditData({...editData, features:nf}); }}/>
                 <Input label="Icon URL" value={f.icon} onChange={(v:any)=>{ const nf = [...editData.features]; nf[i].icon = v; setEditData({...editData, features:nf}); }}/>
                 <Input label="Route Path" value={f.path} onChange={(v:any)=>{ const nf = [...editData.features]; nf[i].path = v; setEditData({...editData, features:nf}); }}/>
               </div>
             ))}
             <button onClick={()=>setEditData({...editData, features:[...editData.features, {id: Date.now(), label:'New', icon:'', path:'/'}]})} className="w-full py-4 border-4 border-dashed border-slate-100 rounded-[35px] text-slate-300 font-black">+ Add New Grid Item</button>
             <button onClick={()=>save('features', editData.features)} className="admin-btn-primary">Apply Dashboard Updates</button>
          </div>
        )}

        {activeTab === 'lists' && (
           <div className="bg-white p-10 rounded-[50px] shadow-2xl space-y-6">
              <h3 className="text-2xl font-black text-slate-800">Content Database</h3>
              <select className="w-full bg-slate-100 p-5 rounded-3xl font-black mb-4 outline-none appearance-none shadow-inner text-blue-600" onChange={e=>setActiveList(e.target.value)}>
                {['places', 'kitkat', 'transport', 'bank', 'warning', 'hotels', 'tourist-bus', 'restaurant'].map(o=><option key={o} value={o.replace('-','_')}>{o.toUpperCase()}</option>)}
              </select>
              {(editData[activeList.replace('-','_')] || []).map((item:any, i:number) => (
                <div key={i} className="p-6 bg-slate-50 rounded-[35px] border border-slate-100 space-y-3 relative">
                   <button onClick={()=>{ const nl = [...editData[activeList]]; nl.splice(i,1); setEditData({...editData, [activeList]: nl}); }} className="absolute top-4 right-4 text-rose-500"><Trash2 size={16}/></button>
                   <Input label="Title" value={item.nameBn} onChange={(v:any)=>{ const nl = [...editData[activeList]]; nl[i].nameBn = v; setEditData({...editData, [activeList]: nl}); }}/>
                   <Input label="Description" value={item.descBn} onChange={(v:any)=>{ const nl = [...editData[activeList]]; nl[i].descBn = v; setEditData({...editData, [activeList]: nl}); }}/>
                   <Input label="Image URL" value={item.img} onChange={(v:any)=>{ const nl = [...editData[activeList]]; nl[i].img = v; setEditData({...editData, [activeList]: nl}); }}/>
                </div>
              ))}
              <button onClick={()=>{
                 const cat = activeList.replace('-','_');
                 const current = editData[cat] || [];
                 setEditData({...editData, [cat]: [...current, {id: Date.now(), nameBn: '', descBn: '', img: ''}]})
              }} className="w-full py-5 border-4 border-dashed border-slate-100 rounded-[35px] text-slate-300 font-black">+ Add New Record</button>
              <button onClick={()=>save(activeList.replace('-','_'), editData[activeList.replace('-','_')])} className="admin-btn-primary">Sync {activeList.toUpperCase()} Database</button>
           </div>
        )}
      </div>
      <style>{`
        .admin-btn-primary { width: 100%; background: #0047FF; color: white; padding: 22px; border-radius: 30px; font-weight: 900; box-shadow: 0 15px 35px rgba(0,71,255,0.2); transition: all 0.2s; }
        .admin-btn-primary:active { transform: scale(0.97); }
        .admin-btn-secondary { width: 100%; background: #F1F5F9; color: #64748B; padding: 22px; border-radius: 30px; font-weight: 900; }
      `}</style>
    </div>
  );
};

// --- HELPERS ---

const Input = ({ label, value, onChange, placeholder, light, type }: any) => (
  <div className="space-y-1.5 w-full">
    <label className={`text-[11px] font-black uppercase tracking-[0.2em] pl-2 ${light ? 'text-white/50' : 'text-slate-400'}`}>{label}</label>
    <div className="relative">
       {label.includes('নাম') && <UserCircle size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"/>}
       {label.includes('মোবাইল') && <Smartphone size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"/>}
       {label.includes('পাসওয়ার্ড') && <Lock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"/>}
       {label.includes('ইমেল') && <Mail size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"/>}
       <input 
        type={type || 'text'}
        value={value || ''} 
        onChange={e=>onChange(e.target.value)} 
        placeholder={placeholder}
        className={`w-full rounded-[25px] py-5 px-14 outline-none font-bold text-sm transition-all border-2 ${light ? 'bg-white/10 border-white/10 text-white placeholder:text-white/30 focus:bg-white focus:text-slate-800 focus:border-green-500' : 'bg-slate-50 border-transparent focus:border-blue-600 focus:bg-white text-slate-800'}`}
       />
    </div>
  </div>
);

const ListView = ({ title, data }: any) => (
  <div className="p-6 pt-24 space-y-8 pb-40 min-h-screen bg-slate-50 animate-in slide-in-from-right">
    <div className="flex items-center gap-5">
      <button onClick={()=>window.history.back()} className="p-5 bg-white shadow-2xl rounded-3xl text-slate-400 hover:text-blue-600 transition-colors"><ArrowLeft/></button> 
      <h1 className="text-[32px] font-black text-slate-800 tracking-tight leading-tight">{title}</h1>
    </div>
    {data.length === 0 ? <ComingSoon/> : data.map((item: any) => (
      <div key={item.id} className="bg-white rounded-[50px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-50 animate-in zoom-in-95 group">
        <div className="h-64 bg-slate-100 relative overflow-hidden">
          <img src={item.img || 'https://images.unsplash.com/photo-1544735032-6a71dd6414fe'} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>
        <div className="p-10">
          <h3 className="text-2xl font-black mb-3 text-slate-800">{item.nameBn}</h3>
          <p className="text-slate-500 font-bold text-[16px] leading-relaxed">{item.descBn}</p>
        </div>
      </div>
    ))}
  </div>
);

const ProfileView = ({ user, onLogout }: any) => {
  const navigate = useNavigate();
  if (!user) return (
    <div className="p-10 pt-32 space-y-12 text-center h-screen bg-white">
      <div className="w-40 h-40 bg-slate-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
        <UserCircle size={100} className="text-slate-200"/>
      </div>
      <div className="space-y-4">
        <h1 className="text-[44px] font-black tracking-tight leading-none text-slate-800">প্রোফাইল</h1>
        <p className="text-slate-400 font-bold px-10 leading-relaxed">আপনার ট্রিপ পরিচালনা করতে এবং আপডেট থাকতে সাইন ইন করুন।</p>
      </div>
      <div className="space-y-4">
        <button onClick={()=>navigate('/login')} className="w-full bg-[#0047FF] py-7 text-white font-black rounded-[35px] shadow-2xl shadow-blue-200 active:scale-95 transition-all text-xl">সাইন ইন</button>
        <button onClick={()=>navigate('/signup')} className="w-full bg-slate-50 py-6 text-slate-400 font-black rounded-[35px] text-lg">অ্যাকাউন্ট নেই? সাইন আপ</button>
      </div>
    </div>
  );

  return (
    <div className="p-8 pt-24 animate-in fade-in bg-white min-h-screen pb-40 text-center">
      <div className="w-40 h-40 bg-gradient-to-br from-[#0047FF] to-[#00D1FF] rounded-full flex items-center justify-center text-white text-6xl font-black shadow-2xl mx-auto mb-10 border-8 border-slate-50">{user.name[0]}</div>
      <h2 className="text-[40px] font-black mb-2 text-slate-800 tracking-tight">{user.name}</h2>
      <div className="bg-blue-50 text-blue-600 px-6 py-2 rounded-full inline-block font-black uppercase text-[11px] tracking-[0.3em] mb-12 border border-blue-100">{user.role || 'TRAVELLER'}</div>
      <div className="space-y-5">
        {user.role === 'ADMIN' && <button onClick={()=>navigate('/admin')} className="w-full bg-[#001D3D] py-6 rounded-[35px] text-white font-black flex items-center justify-center gap-4 shadow-2xl active:scale-95 transition-all text-xl"><ShieldCheck className="text-amber-400" size={24}/> Master Admin Panel</button>}
        <button onClick={onLogout} className="w-full bg-rose-500 py-6 rounded-[35px] text-white font-black text-xl shadow-xl active:scale-95 transition-all">লগ আউট</button>
      </div>
    </div>
  );
};

const AIPlannerView = () => {
  const [days, setDays] = useState(1);
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateTourPlan(days);
    if (result) setPlan(result);
    setLoading(false);
  };

  return (
    <div className="p-8 pt-24 min-h-screen bg-white pb-40">
      <h1 className="text-[40px] font-black mb-10 tracking-tight text-slate-800 leading-none">এআই ট্যুর<br/>প্ল্যানার</h1>
      {!plan ? (
        <div className="space-y-12">
          <div className="bg-slate-50 p-20 rounded-[70px] text-center shadow-inner border border-slate-100"><Compass size={80} className="text-blue-600 mx-auto animate-pulse" /></div>
          <div className="space-y-4">
             <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-4">How many days?</label>
             <div className="grid grid-cols-4 gap-4">
               {[1, 2, 3, 5].map(d => (
                 <button key={d} onClick={() => setDays(d)} className={`py-7 rounded-[35px] font-black text-3xl transition-all ${days === d ? 'bg-blue-600 text-white shadow-2xl scale-110' : 'bg-slate-50 text-slate-300 border border-slate-100'}`}>{d}</button>
               ))}
             </div>
          </div>
          <button onClick={handleGenerate} className="w-full bg-[#0047FF] text-white py-9 rounded-[45px] font-black text-2xl shadow-2xl shadow-blue-200 active:scale-95 transition-all">
             {loading ? <Loader2 className="animate-spin mx-auto"/> : 'প্ল্যান তৈরি করুন'}
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {plan.itinerary.map((day: any) => (
            <div key={day.day} className="bg-slate-50 p-12 rounded-[60px] border border-slate-100 shadow-sm">
              <div className="text-blue-600 font-black text-xs uppercase mb-6 tracking-widest">Adventure Day {day.day}</div>
              <h4 className="text-slate-800 font-black text-[26px] mb-8 leading-tight">{day.title}</h4>
              <ul className="space-y-8">{day.activities.map((act: string, idx: number) => <li key={idx} className="flex gap-6 font-bold text-slate-500 text-[16px] leading-relaxed"><div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center shrink-0"><CheckCircle2 size={18} className="text-green-500"/></div> {act}</li>)}</ul>
            </div>
          ))}
          <button onClick={() => setPlan(null)} className="w-full py-8 font-black text-blue-600 uppercase tracking-widest text-sm border-2 border-dashed border-blue-100 rounded-[40px]">Create New Journey</button>
        </div>
      )}
    </div>
  );
};

const BottomNav = () => {
  const loc = useLocation();
  return (
    <nav className="px-10 py-8 flex justify-between items-center bg-white rounded-t-[55px] shadow-[0_-20px_60px_rgba(0,0,0,0.06)] border-t border-slate-50 relative z-50">
      <NavItem to="/" icon={<HomeIcon />} label="হোম" active={loc.pathname === '/'} />
      <NavItem to="/emergency" icon={<PhoneCall />} label="জরুরি সেবা" active={loc.pathname === '/emergency'} />
      <NavItem to="/announcements" icon={<Megaphone />} label="ঘোষণা" active={loc.pathname === '/announcements'} />
      <NavItem to="/profile" icon={<UserCircle />} label="প্রোফাইল" active={loc.pathname === '/profile'} />
    </nav>
  );
};

const NavItem = ({ to, icon, label, active }: any) => (
  <Link to={to} className={`flex flex-col items-center gap-2 transition-all ${active ? 'text-blue-600 font-black scale-110' : 'text-slate-300 font-bold'}`}>
    <div className={active ? 'bg-blue-50 p-4 rounded-[22px] shadow-sm shadow-blue-100' : 'p-1'}>{React.cloneElement(icon as React.ReactElement<any>, { size: 24 })}</div>
    <span className="text-[11px] tracking-tight">{label}</span>
  </Link>
);

const ComingSoon = () => (
  <div className="p-20 text-center opacity-30 h-full flex flex-col items-center justify-center min-h-[60vh]">
    <MapPin size={100} className="text-slate-100 mb-8 animate-bounce" />
    <h1 className="text-3xl font-black text-slate-800">শীঘ্রই আসছে...</h1>
    <p className="text-slate-400 font-bold mt-4">এই সেকশনটি বর্তমানে আপডেটের কাজ চলছে।</p>
  </div>
);

export default App;
