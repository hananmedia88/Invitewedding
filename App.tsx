
import React, { useState } from 'react';
import { Heart, Plus, Layout, Sparkles, ShoppingBag, ShieldCheck, ChevronRight } from 'lucide-react';
import { InvitationData, RsvpEntry } from './types';
import InvitationForm from './components/InvitationForm';
import InvitationPreview from './components/InvitationPreview';
import Marketplace from './components/Marketplace';

type View = 'landing' | 'edit' | 'preview' | 'marketplace';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  
  const [invitationData, setInvitationData] = useState<InvitationData>({
    couple: {
      brideName: 'Siti Aminah',
      brideFather: 'Bp. Ahmad',
      brideMother: 'Ibu Fatimah',
      brideImage: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=400',
      groomName: 'Budi Santoso',
      groomFather: 'Bp. Gunawan',
      groomMother: 'Ibu Ratna',
      groomImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=400',
    },
    event: {
      date: '2025-08-20',
      time: '09:00',
      locationName: 'Gedung Serbaguna Jakarta',
      address: 'Jl. Merdeka No. 123, Jakarta Pusat',
      latitude: -6.1754,
      longitude: 106.8272,
    },
    story: 'Kisah cinta kami dimulai dari sebuah pertemuan sederhana yang tak terduga, yang kemudian tumbuh menjadi sebuah komitmen suci seumur hidup.',
    theme: 'classic',
    music: {
      url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808f3030e.mp3',
      title: 'Romantic Wedding Piano',
      isAutoPlay: true,
    }
  });

  const [rsvps, setRsvps] = useState<RsvpEntry[]>([]);

  const handleUpdateData = (newData: InvitationData) => {
    setInvitationData(newData);
  };

  const handleAddRsvp = (rsvp: RsvpEntry) => {
    setRsvps(prev => [rsvp, ...prev]);
  };

  const LandingPage = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="relative z-10 text-center text-white px-4 max-w-4xl">
        <Heart className="w-16 h-16 mx-auto mb-6 text-pink-400 animate-pulse" />
        <h1 className="text-5xl md:text-7xl font-cursive mb-6">NikahYuk</h1>
        <p className="text-xl md:text-2xl font-light mb-10 tracking-widest uppercase">
          Platform Undangan Pernikahan Digital & Marketplace Template
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => setView('marketplace')}
            className="bg-white text-stone-900 px-10 py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-stone-100 transition shadow-xl"
          >
            <ShoppingBag className="w-5 h-5" /> Lihat Marketplace
          </button>
          <button 
            onClick={() => setView('edit')}
            className="bg-stone-900/50 backdrop-blur text-white border border-white/30 px-10 py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-stone-900 transition shadow-xl"
          >
            <Plus className="w-5 h-5" /> Buat Undangan
          </button>
        </div>
      </div>
      
      {/* Admin Panel Redirect - Separated to Manager Portal */}
      <button 
        onClick={() => window.location.href = 'manager.html'}
        className="fixed bottom-6 left-6 z-20 text-white/30 hover:text-white transition flex items-center gap-2 text-xs uppercase tracking-tighter"
      >
        <ShieldCheck className="w-4 h-4" /> Kelola Sistem (Admin Portal)
      </button>
    </div>
  );

  return (
    <div className="min-h-screen">
      {view === 'landing' && <LandingPage />}
      
      {view === 'edit' && (
        <div className="bg-stone-100 min-h-screen p-4 md:p-10">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 animate-in slide-in-from-bottom-8 duration-700">
            <div className="lg:w-1/2">
              <div className="bg-white rounded-[40px] shadow-2xl p-6 md:p-10 h-fit border border-stone-200">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-serif font-bold text-stone-800 flex items-center gap-3">
                    <Layout className="w-8 h-8 text-indigo-600" /> Atur Undangan
                  </h2>
                  <button 
                    onClick={() => setView('landing')}
                    className="p-2 hover:bg-stone-50 rounded-full transition"
                  >
                    <ChevronRight className="w-6 h-6 rotate-180 text-stone-400" />
                  </button>
                </div>
                <InvitationForm data={invitationData} onUpdate={handleUpdateData} />
                <div className="mt-12 flex gap-4">
                  <button 
                    onClick={() => setView('preview')}
                    className="flex-1 bg-stone-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-stone-800 transition shadow-xl"
                  >
                    <Sparkles className="w-5 h-5" /> Lihat Hasil Akhir
                  </button>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 hidden lg:block">
              <div className="sticky top-10 rounded-[50px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.1)] h-[850px] border-[12px] border-white ring-1 ring-stone-200">
                 <InvitationPreview data={invitationData} rsvps={rsvps} onAddRsvp={handleAddRsvp} isPreviewMode={true} />
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'preview' && (
        <div className="relative">
          <button 
            onClick={() => setView('edit')}
            className="fixed top-6 left-6 z-50 bg-white/90 backdrop-blur text-stone-900 px-6 py-3 rounded-full shadow-2xl hover:bg-white transition flex items-center gap-2 border border-stone-200 font-bold text-sm"
          >
            <ChevronRight className="w-5 h-5 rotate-180" /> Kembali ke Editor
          </button>
          <InvitationPreview data={invitationData} rsvps={rsvps} onAddRsvp={handleAddRsvp} />
        </div>
      )}

      {view === 'marketplace' && (
        <Marketplace 
          onBack={() => setView('landing')}
          onSelectTemplate={(theme) => {
            setInvitationData({ ...invitationData, theme });
            setView('edit');
          }}
        />
      )}
    </div>
  );
};

export default App;
