
import React, { useState, useRef } from 'react';
import { RsvpEntry, InvitationData, UserAccount, Template } from '../types';
import { 
  Users, UserCheck, MessageCircle, ChevronLeft, Download, Trash2, Edit3, 
  ShieldCheck, ShoppingCart, UserPlus, Grid, Filter, MoreVertical, Ban, 
  CheckCircle, TrendingUp, DollarSign, Activity, CreditCard, Zap, Plus, 
  Palette, Save, RefreshCcw, Type, Layout, Heart, Eye, X, Smartphone, Monitor,
  Presentation, FileUp, Sparkles, Wand2, FileType
} from 'lucide-react';

interface Props {
  rsvps: RsvpEntry[];
  onBack: () => void;
  invitationData: InvitationData;
  onDeleteRsvp?: (id: string) => void;
  onEditInvitation?: () => void;
}

const MOCK_USERS: UserAccount[] = [
  { id: '1', name: 'Andi Pratama', email: 'andi@gmail.com', status: 'active', plan: 'pro', invitationsCreated: 5, joinDate: '2024-01-15' },
  { id: '2', name: 'Budi Raharjo', email: 'budi@yahoo.com', status: 'active', plan: 'premium', invitationsCreated: 2, joinDate: '2024-02-10' },
  { id: '3', name: 'Siska Dewi', email: 'siska@outlook.com', status: 'suspended', plan: 'basic', invitationsCreated: 1, joinDate: '2024-03-05' },
];

const MOCK_TEMPLATES: Template[] = [
  { id: 't1', name: 'Modern Minimalist', price: 150000, category: 'Modern', previewUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622', sales: 45 },
  { id: 't2', name: 'Rustic Blossom', price: 120000, category: 'Rustic', previewUrl: 'https://images.unsplash.com/photo-1522673607200-164883eecd4c', sales: 89 },
  { id: 't3', name: 'Royal Gold', price: 200000, category: 'Classic', previewUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552', sales: 32 },
  { id: 't4', name: 'Tropical Paradise', price: 135000, category: 'Floral', previewUrl: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09', sales: 12 },
];

const AdminPanel: React.FC<Props> = ({ rsvps, onBack, invitationData, onDeleteRsvp, onEditInvitation }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'templates' | 'studio' | 'rsvps'>('dashboard');
  const [selectedProduct, setSelectedProduct] = useState<Template | null>(null);
  const [isProcessingPPT, setIsProcessingPPT] = useState(false);
  const [uploadedPPT, setUploadedPPT] = useState<string | null>(null);
  const pptInputRef = useRef<HTMLInputElement>(null);
  
  // Studio State
  const [studioConfig, setStudioConfig] = useState({
    name: 'Template Baru #1',
    primaryColor: '#1a1a1a',
    accentColor: '#d4af37',
    bgColor: '#ffffff',
    fontFamily: 'font-serif',
    borderRadius: '24px',
  });

  const handlePPTUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingPPT(true);
      setUploadedPPT(file.name);
      
      // Simulate AI extracting theme from PPTX
      setTimeout(() => {
        setStudioConfig({
          ...studioConfig,
          name: `Imported from ${file.name.replace('.pptx', '')}`,
          accentColor: '#e07a5f', // Extracted dummy color
          bgColor: '#f4f1de',     // Extracted dummy color
          fontFamily: 'font-serif'
        });
        setIsProcessingPPT(false);
      }, 2500);
    }
  };

  const totalRevenue = MOCK_TEMPLATES.reduce((acc, t) => acc + (t.price * t.sales), 0);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-stone-100 rounded-full transition">
              <ChevronLeft className="w-5 h-5 text-stone-500" />
            </button>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" /> Owner Dashboard
              </h1>
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Management Console</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden md:block text-right mr-4">
                <div className="text-[10px] font-bold text-stone-400 uppercase">System Status</div>
                <div className="text-xs font-bold text-green-600 flex items-center gap-1">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Operational
                </div>
             </div>
             <button className="bg-stone-900 text-white p-2.5 rounded-xl"><Download className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 space-y-2">
          {[
            { id: 'dashboard', label: 'Ringkasan', icon: Activity },
            { id: 'users', label: 'Data Pengguna', icon: Users },
            { id: 'templates', label: 'Katalog Produk', icon: Grid },
            { id: 'studio', label: 'Studio Desain', icon: Palette },
            { id: 'rsvps', label: 'Monitor RSVP', icon: MessageCircle }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-stone-900 text-white shadow-lg' 
                  : 'text-stone-500 hover:bg-stone-200/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white rounded-[40px] shadow-sm border border-stone-200 overflow-hidden min-h-[700px]">
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="p-10 space-y-10 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-8 bg-indigo-50 rounded-[32px] border border-indigo-100">
                     <DollarSign className="w-8 h-8 text-indigo-600 mb-4" />
                     <div className="text-3xl font-serif font-bold">Rp {(totalRevenue/1000000).toFixed(1)}M</div>
                     <div className="text-xs text-indigo-400 font-bold uppercase mt-1">Total Revenue</div>
                  </div>
                  <div className="p-8 bg-green-50 rounded-[32px] border border-green-100">
                     <ShoppingCart className="w-8 h-8 text-green-600 mb-4" />
                     <div className="text-3xl font-serif font-bold">{MOCK_TEMPLATES.reduce((a,b)=>a+b.sales, 0)}</div>
                     <div className="text-xs text-green-400 font-bold uppercase mt-1">Total Sales</div>
                  </div>
                  <div className="p-8 bg-stone-50 rounded-[32px] border border-stone-100">
                     <Users className="w-8 h-8 text-stone-600 mb-4" />
                     <div className="text-3xl font-serif font-bold">1.2k</div>
                     <div className="text-xs text-stone-400 font-bold uppercase mt-1">Active Users</div>
                  </div>
               </div>
               
               <div className="bg-stone-50 p-8 rounded-[32px]">
                  <h3 className="font-bold mb-4">Aktivitas Terkini</h3>
                  <div className="space-y-4">
                     {[1,2,3].map(i => (
                       <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-200">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">U</div>
                             <div>
                                <div className="text-sm font-bold">User #{i} membeli 'Royal Gold'</div>
                                <div className="text-[10px] text-stone-400 uppercase">2 Jam yang lalu</div>
                             </div>
                          </div>
                          <div className="font-bold">Rp 200k</div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {/* Catalog Tab */}
          {activeTab === 'templates' && (
            <div className="p-10 space-y-8 animate-in slide-in-from-right-4 duration-500">
               <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-serif font-bold">Katalog Produk</h2>
                  <button onClick={() => setActiveTab('studio')} className="bg-stone-900 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-stone-800 transition">
                     <Plus className="w-4 h-4" /> Create New
                  </button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {MOCK_TEMPLATES.map(tpl => (
                    <div key={tpl.id} className="group bg-stone-50 border border-stone-200 rounded-[32px] p-4 hover:shadow-xl transition flex flex-col h-full">
                       <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 relative">
                          <img src={tpl.previewUrl} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                          <button 
                            onClick={() => setSelectedProduct(tpl)}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white gap-2 font-bold"
                          >
                             <Eye className="w-5 h-5" /> Quick Preview
                          </button>
                       </div>
                       <h3 className="font-bold text-stone-900 mb-2 px-2">{tpl.name}</h3>
                       <div className="mt-auto pt-4 border-t border-stone-200 flex justify-between items-center px-2">
                          <div className="text-indigo-600 font-bold">Rp {tpl.price.toLocaleString()}</div>
                          <div className="text-xs text-stone-400 font-bold">{tpl.sales} Sales</div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Studio Tab (Integrated) */}
          {activeTab === 'studio' && (
            <div className="flex flex-col lg:flex-row h-full animate-in zoom-in-95 duration-500">
               {/* Controls Panel */}
               <div className="w-full lg:w-[350px] border-r border-stone-200 p-8 space-y-8 bg-stone-50/30 overflow-y-auto max-h-[700px] custom-scrollbar">
                  <div className="flex items-center gap-2 text-stone-900 mb-2">
                     <Palette className="w-5 h-5 text-indigo-600" />
                     <h3 className="font-bold">Studio Editor</h3>
                  </div>

                  {/* PowerPoint Import Section */}
                  <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl border border-orange-200 space-y-4">
                    <div className="flex items-center gap-2 text-orange-700">
                      <Presentation className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">PowerPoint Importer</span>
                    </div>
                    <p className="text-[10px] text-orange-600 leading-relaxed font-medium">Unggah file .pptx untuk mengekstrak tema dan aset secara otomatis menggunakan AI.</p>
                    
                    <div className="relative">
                      <input 
                        type="file" 
                        ref={pptInputRef}
                        accept=".pptx" 
                        className="hidden" 
                        onChange={handlePPTUpload}
                      />
                      <button 
                        onClick={() => pptInputRef.current?.click()}
                        disabled={isProcessingPPT}
                        className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                          isProcessingPPT ? 'bg-orange-200 text-orange-400' : 'bg-white text-orange-600 hover:bg-orange-600 hover:text-white shadow-sm'
                        }`}
                      >
                        {isProcessingPPT ? (
                          <RefreshCcw className="w-4 h-4 animate-spin" />
                        ) : (
                          <><FileUp className="w-4 h-4" /> Upload .pptx</>
                        )}
                      </button>
                    </div>

                    {uploadedPPT && !isProcessingPPT && (
                      <div className="flex items-center gap-2 p-2 bg-white/50 rounded-xl text-[10px] text-orange-800 font-bold">
                        <FileType className="w-3 h-3" />
                        <span className="truncate">{uploadedPPT}</span>
                        <Sparkles className="w-3 h-3 text-orange-500 ml-auto" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Template Name</label>
                     <input 
                        type="text" 
                        className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
                        value={studioConfig.name}
                        onChange={(e) => setStudioConfig({...studioConfig, name: e.target.value})}
                     />
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Typography</label>
                     <div className="grid grid-cols-1 gap-2">
                        {[
                           { id: 'font-serif', name: 'Elegant Serif' },
                           { id: 'font-sans', name: 'Modern Sans' },
                           { id: 'font-cursive', name: 'Handwritten' }
                        ].map(f => (
                           <button 
                              key={f.id}
                              onClick={() => setStudioConfig({...studioConfig, fontFamily: f.id})}
                              className={`text-left px-4 py-3 rounded-xl text-xs transition font-bold ${studioConfig.fontFamily === f.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'}`}
                           >
                              {f.name}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Color Palette</label>
                     <div className="space-y-3">
                        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-stone-200">
                           <span className="text-xs font-bold text-stone-600">Accent Color</span>
                           <input type="color" value={studioConfig.accentColor} onChange={(e)=>setStudioConfig({...studioConfig, accentColor: e.target.value})} className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none" />
                        </div>
                        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-stone-200">
                           <span className="text-xs font-bold text-stone-600">Background</span>
                           <input type="color" value={studioConfig.bgColor} onChange={(e)=>setStudioConfig({...studioConfig, bgColor: e.target.value})} className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none" />
                        </div>
                     </div>
                  </div>

                  <button className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition shadow-xl mt-8">
                     <Save className="w-4 h-4" /> Simpan Template
                  </button>
               </div>

               {/* Live Preview Area */}
               <div className="flex-1 bg-stone-100 p-10 flex flex-col items-center justify-center relative min-h-[600px]">
                  {isProcessingPPT && (
                    <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
                      <div className="relative">
                        <div className="w-20 h-20 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
                        <Wand2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-orange-500" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-orange-900">Menganalisis Slide PowerPoint...</p>
                        <p className="text-xs text-orange-500">Mengekstrak skema warna dan tipografi</p>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-6 left-6 text-stone-400 font-bold text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                     <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> Live Preview
                  </div>

                  {/* Device Toggles */}
                  <div className="absolute top-6 right-6 flex bg-white rounded-full p-1 shadow-md border border-stone-200">
                     <button className="p-2 bg-stone-100 rounded-full"><Smartphone className="w-4 h-4" /></button>
                     <button className="p-2 text-stone-400"><Monitor className="w-4 h-4" /></button>
                  </div>

                  {/* Mobile Frame */}
                  <div 
                    className="w-[320px] h-[600px] bg-white rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border-[10px] border-stone-900 relative overflow-hidden transition-all duration-500"
                    style={{ backgroundColor: studioConfig.bgColor }}
                  >
                     <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="animate-in fade-in zoom-in duration-700">
                           <Heart className="w-10 h-10 mx-auto mb-4" style={{ color: studioConfig.accentColor }} />
                           <div className={`space-y-4 ${studioConfig.fontFamily}`} style={{ color: studioConfig.primaryColor }}>
                              <div className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Save the Date</div>
                              <div className="text-4xl leading-tight">Putra<br/>&<br/>Putri</div>
                              <div className="pt-4 text-[10px] font-bold tracking-[0.2em] px-4 py-1.5 rounded-full inline-block bg-opacity-10" style={{ color: studioConfig.accentColor, backgroundColor: studioConfig.accentColor + '20' }}>
                                 20 SEPTEMBER 2025
                              </div>
                           </div>
                           <div className="mt-10 pt-10 border-t border-stone-100">
                              <button className="px-8 py-3 rounded-full text-white text-[10px] font-bold uppercase tracking-widest shadow-xl" style={{ backgroundColor: studioConfig.accentColor }}>
                                 Open Invitation
                              </button>
                           </div>
                        </div>
                     </div>
                     {/* Notch */}
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-stone-900 rounded-b-3xl"></div>
                  </div>
               </div>
            </div>
          )}

          {/* User & RSVP Tabs remain the same */}
          {activeTab === 'users' && <div className="p-10 text-center text-stone-400 py-40 italic">Interface Manajemen User sedang disinkronisasi...</div>}
          {activeTab === 'rsvps' && (
            <div className="p-10 space-y-6 animate-in fade-in duration-500">
               <h2 className="text-2xl font-serif font-bold">Live RSVP Stream</h2>
               <div className="space-y-4">
                  {rsvps.map(r => (
                    <div key={r.id} className="p-6 bg-stone-50 border border-stone-200 rounded-3xl flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${r.attendance === 'yes' ? 'bg-green-500' : 'bg-red-500'}`}>
                             {r.name.charAt(0)}
                          </div>
                          <div>
                             <div className="font-bold">{r.name}</div>
                             <div className="text-xs text-stone-400 italic">"{r.message || 'No message'}"</div>
                          </div>
                       </div>
                       <button onClick={()=>onDeleteRsvp?.(r.id)} className="p-2 hover:bg-red-50 text-stone-300 hover:text-red-500 transition rounded-xl"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </main>
      </div>

      {/* Quick Preview Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-4xl rounded-[40px] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300 flex flex-col md:flex-row h-[600px]">
              <button onClick={()=>setSelectedProduct(null)} className="absolute top-6 right-6 z-10 p-2 bg-stone-100 hover:bg-stone-200 rounded-full transition">
                 <X className="w-6 h-6 text-stone-600" />
              </button>
              
              <div className="flex-1 bg-stone-200 overflow-hidden">
                 <img src={selectedProduct.previewUrl} className="w-full h-full object-cover" />
              </div>
              
              <div className="w-full md:w-[400px] p-10 flex flex-col">
                 <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">{selectedProduct.category} Theme</div>
                 <h3 className="text-3xl font-serif font-bold text-stone-900 mb-6">{selectedProduct.name}</h3>
                 
                 <div className="space-y-6 flex-1">
                    <p className="text-stone-500 text-sm leading-relaxed">Template ini dirancang khusus untuk pernikahan dengan tema {selectedProduct.category.toLowerCase()}. Menampilkan layout yang bersih dan navigasi yang intuitif.</p>
                    <div className="flex gap-8">
                       <div>
                          <div className="text-[10px] font-bold text-stone-400 uppercase mb-1">Price</div>
                          <div className="text-xl font-bold text-stone-900">Rp {selectedProduct.price.toLocaleString()}</div>
                       </div>
                       <div>
                          <div className="text-[10px] font-bold text-stone-400 uppercase mb-1">Downloads</div>
                          <div className="text-xl font-bold text-stone-900">{selectedProduct.sales}+</div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <button onClick={()=>{setSelectedProduct(null); setActiveTab('studio')}} className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition">Edit in Studio</button>
                    <button className="w-full py-4 border border-stone-200 text-stone-600 rounded-2xl font-bold hover:bg-stone-50 transition">Export Metadata</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
