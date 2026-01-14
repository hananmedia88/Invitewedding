
import React, { useState, useEffect, useRef } from 'react';
import { InvitationData, RsvpEntry } from '../types';
import { Calendar, MapPin, Clock, Send, Heart, Music, Check, Play, Pause, Volume2, MailOpen, MessageSquare, Quote } from 'lucide-react';

interface Props {
  data: InvitationData;
  rsvps: RsvpEntry[];
  onAddRsvp: (rsvp: RsvpEntry) => void;
  isPreviewMode?: boolean;
}

const InvitationPreview: React.FC<Props> = ({ data, rsvps, onAddRsvp, isPreviewMode = false }) => {
  const [rsvpForm, setRsvpForm] = useState({ name: '', attendance: 'yes' as 'yes' | 'no', guests: 1, message: '' });
  const [wishForm, setWishForm] = useState({ name: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [wishSubmitted, setWishSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showPlayerControls, setShowPlayerControls] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (!isOpen) return;

    const observerOptions = {
      root: scrollContainerRef.current,
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, [isOpen]);

  // Leaflet Map Initialization
  useEffect(() => {
    if (isOpen && mapContainerRef.current && !mapInstanceRef.current) {
      const L = (window as any).L;
      if (!L) return;

      const lat = data.event.latitude || -6.1754;
      const lng = data.event.longitude || 106.8272;

      mapInstanceRef.current = L.map(mapContainerRef.current).setView([lat, lng], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      const marker = L.marker([lat, lng]).addTo(mapInstanceRef.current);
      marker.bindPopup(`<b>${data.event.locationName}</b><br>${data.event.address}`).openPopup();

      // Force invalidating size after animation finishes
      setTimeout(() => {
        if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
      }, 1000);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, data.event]);

  useEffect(() => {
    const timer = setInterval(() => {
      const target = new Date(data.event.date).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [data.event.date]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    if (data.music.isAutoPlay && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => {
        console.log("Autoplay blocked or failed:", e);
      });
    }
  };

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSubmitRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpForm.name) return;

    onAddRsvp({
      id: Date.now().toString(),
      ...rsvpForm,
      timestamp: Date.now(),
    });
    setSubmitted(true);
  };

  const handleSubmitWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishForm.name || !wishForm.message) return;

    onAddRsvp({
      id: Date.now().toString(),
      name: wishForm.name,
      message: wishForm.message,
      attendance: 'yes', // Default to yes for just wishes
      guests: 0, // 0 for just wishes
      timestamp: Date.now(),
    });
    setWishSubmitted(true);
    setWishForm({ name: '', message: '' });
    setTimeout(() => setWishSubmitted(false), 3000);
  };

  const getThemeStyles = () => {
    switch(data.theme) {
      case 'rustic': return { bg: 'bg-[#f4ead5]', accent: 'text-[#8d6e63]', font: 'font-serif', border: 'border-[#8d6e63]/20', button: 'bg-[#8d6e63]', card: 'bg-[#ede0c8]' };
      case 'modern': return { bg: 'bg-white', accent: 'text-stone-900', font: 'font-sans', border: 'border-stone-900', button: 'bg-stone-900', card: 'bg-stone-50' };
      case 'floral': return { bg: 'bg-pink-50', accent: 'text-pink-500', font: 'font-serif', border: 'border-pink-200', button: 'bg-pink-500', card: 'bg-white' };
      default: return { bg: 'bg-stone-50', accent: 'text-[#d4af37]', font: 'font-serif', border: 'border-[#d4af37]/30', button: 'bg-[#d4af37]', card: 'bg-white' };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className={`w-full h-full overflow-hidden ${styles.bg} selection:bg-stone-200 relative`}>
      <audio ref={audioRef} src={data.music.url} loop />

      {/* Cover / Open Screen */}
      <div className={`absolute inset-0 z-[100] transition-all duration-1000 flex flex-col items-center justify-center p-10 bg-cover bg-center ${isOpen ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`} style={{backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=2069')"}}>
         <div className="text-white text-center space-y-6">
            <p className="uppercase tracking-[0.5em] text-xs font-light animate-pulse">Pernikahan Suci Dari</p>
            <h1 className="text-6xl md:text-8xl font-cursive drop-shadow-lg">{data.couple.brideName} & {data.couple.groomName}</h1>
            <div className="h-px w-20 bg-white/50 mx-auto my-8"></div>
            <button 
               onClick={handleOpenInvitation}
               className="group flex items-center gap-3 bg-white text-stone-900 px-8 py-4 rounded-full font-bold hover:scale-105 transition shadow-2xl active:scale-95"
            >
               <MailOpen className="w-5 h-5 group-hover:animate-bounce" /> Buka Undangan
            </button>
         </div>
      </div>

      <div ref={scrollContainerRef} className={`w-full h-full overflow-y-auto ${!isOpen ? 'hidden' : 'block'}`}>
        {/* Floating Elements (Visual Decoration) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-stone-400/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-stone-900/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none"></div>

        {/* Hero Section */}
        <section className="h-[90vh] flex flex-col items-center justify-center text-center p-10 relative overflow-hidden">
          <div className="z-10 reveal">
            <p className={`uppercase tracking-[0.3em] mb-8 text-xs font-semibold ${styles.accent}`}>Pernikahan Dari</p>
            <div className="flex flex-col items-center mb-10">
              <h1 className="text-6xl md:text-8xl font-cursive mb-4 text-stone-800 drop-shadow-sm">{data.couple.brideName}</h1>
              <Heart className={`w-8 h-8 my-4 ${styles.accent} opacity-50`} />
              <h1 className="text-6xl md:text-8xl font-cursive text-stone-800 drop-shadow-sm">{data.couple.groomName}</h1>
            </div>
            <div className={`text-xl md:text-2xl font-light tracking-widest ${styles.accent}`}>
              {new Date(data.event.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div className="absolute bottom-10 animate-bounce">
              <div className="w-px h-16 bg-stone-300 mx-auto"></div>
          </div>
        </section>

        {/* Intro / Story Section */}
        <section className="max-w-2xl mx-auto px-10 py-32 text-center reveal-scale">
          <h2 className={`text-3xl font-serif italic mb-10 ${styles.accent}`}>“Cinta tak terlihat oleh mata, ia dirasakan oleh hati.”</h2>
          <div className="w-16 h-px bg-stone-300 mx-auto mb-10"></div>
          <p className="text-stone-600 leading-loose font-light text-lg italic px-4">
            {data.story}
          </p>
        </section>

        {/* Profiles Section */}
        <section className="bg-white/50 backdrop-blur py-32 px-10">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="text-center space-y-6 group reveal-left">
              <div className="relative mx-auto w-64 h-80 bg-stone-200 rounded-t-full overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                <img src={data.couple.brideImage || "https://picsum.photos/400/500?wedding=1"} className="w-full h-full object-cover" alt="Bride" />
              </div>
              <div>
                <h3 className="text-4xl font-cursive mb-2">{data.couple.brideName}</h3>
                <p className="text-xs text-stone-500 uppercase tracking-widest mb-4">Mempelai Wanita</p>
                <div className="text-stone-600 font-light text-sm italic">
                  Putri dari Pasangan:<br />
                  {data.couple.brideFather} & {data.couple.brideMother}
                </div>
              </div>
            </div>

            <div className="text-center space-y-6 group reveal-right">
              <div className="relative mx-auto w-64 h-80 bg-stone-200 rounded-t-full overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                <img src={data.couple.groomImage || "https://picsum.photos/400/500?wedding=2"} className="w-full h-full object-cover" alt="Groom" />
              </div>
              <div>
                <h3 className="text-4xl font-cursive mb-2">{data.couple.groomName}</h3>
                <p className="text-xs text-stone-500 uppercase tracking-widest mb-4">Mempelai Pria</p>
                <div className="text-stone-600 font-light text-sm italic">
                  Putra dari Pasangan:<br />
                  {data.couple.groomFather} & {data.couple.groomMother}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Event Details Section */}
        <section className="py-32 px-10 text-center relative overflow-hidden">
          <h2 className="text-4xl font-serif mb-16 reveal">Detail Acara</h2>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 reveal-scale">
             <div className="bg-white p-10 md:p-16 rounded-[40px] shadow-2xl space-y-12 border border-stone-100 flex flex-col justify-center">
                <div className="space-y-4">
                    <Calendar className={`w-10 h-10 mx-auto ${styles.accent}`} />
                    <div className="text-2xl font-serif">Akad Nikah & Resepsi</div>
                    <p className="text-stone-500 font-light">
                      {new Date(data.event.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>

                <div className="space-y-4">
                    <Clock className={`w-10 h-10 mx-auto ${styles.accent}`} />
                    <p className="text-2xl font-serif">Pukul {data.event.time} WIB - Selesai</p>
                </div>

                <div className="space-y-4">
                    <MapPin className={`w-10 h-10 mx-auto ${styles.accent}`} />
                    <div className="text-2xl font-serif">{data.event.locationName}</div>
                    <p className="text-stone-500 font-light max-w-xs mx-auto leading-relaxed">
                      {data.event.address}
                    </p>
                </div>
             </div>

             <div className="bg-white p-4 rounded-[40px] shadow-2xl border border-stone-100 h-[400px] lg:h-auto min-h-[400px] relative overflow-hidden group">
                <div ref={mapContainerRef} className="w-full h-full rounded-[30px]" />
                <a 
                  href={`https://www.google.com/maps/search/${encodeURIComponent(data.event.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-8 right-8 z-[1000] bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-xl text-xs font-bold hover:bg-stone-900 hover:text-white transition duration-300 flex items-center gap-2 border border-stone-200"
                >
                  <MapPin className="w-3 h-3" /> Petunjuk Jalan
                </a>
             </div>
          </div>
        </section>

        {/* Countdown Section */}
        <section className="py-20 bg-stone-900 text-white text-center reveal">
          <h3 className="text-xl font-light uppercase tracking-[0.4em] mb-12 opacity-80">Menuju Hari Bahagia</h3>
          <div className="flex justify-center gap-6 md:gap-12">
             {[
               { label: 'Hari', val: timeLeft.days },
               { label: 'Jam', val: timeLeft.hours },
               { label: 'Menit', val: timeLeft.minutes },
               { label: 'Detik', val: timeLeft.seconds }
             ].map(item => (
               <div key={item.label} className="w-20 md:w-32">
                  <div className="text-4xl md:text-6xl font-serif mb-2">{item.val}</div>
                  <div className="text-[10px] uppercase tracking-widest opacity-50">{item.label}</div>
               </div>
             ))}
          </div>
        </section>

        {/* Gallery Placeholder */}
        <section className="py-32 px-4 max-w-6xl mx-auto">
           <h2 className="text-4xl font-serif mb-16 text-center reveal">Galeri Kami</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="h-64 bg-stone-200 rounded-3xl overflow-hidden shadow-lg reveal-left"><img src="https://picsum.photos/400/600?q=1" className="w-full h-full object-cover hover:scale-110 transition duration-700" /></div>
              <div className="h-64 bg-stone-200 rounded-3xl overflow-hidden shadow-lg translate-y-8 reveal-left" style={{transitionDelay: '200ms'}}><img src="https://picsum.photos/400/600?q=2" className="w-full h-full object-cover hover:scale-110 transition duration-700" /></div>
              <div className="h-64 bg-stone-200 rounded-3xl overflow-hidden shadow-lg reveal-right" style={{transitionDelay: '400ms'}}><img src="https://picsum.photos/400/600?q=3" className="w-full h-full object-cover hover:scale-110 transition duration-700" /></div>
              <div className="h-64 bg-stone-200 rounded-3xl overflow-hidden shadow-lg translate-y-8 reveal-right" style={{transitionDelay: '600ms'}}><img src="https://picsum.photos/400/600?q=4" className="w-full h-full object-cover hover:scale-110 transition duration-700" /></div>
           </div>
        </section>

        {/* RSVP Section */}
        <section className="py-32 px-6 bg-stone-100/50 reveal-scale">
          <div className="max-w-xl mx-auto bg-white p-10 rounded-[40px] shadow-2xl">
            <h2 className="text-4xl font-cursive text-center mb-4">Konfirmasi Kehadiran</h2>
            <p className="text-center text-stone-500 font-light mb-10 text-sm">Merupakan kehormatan bagi kami atas kehadiran Bapak/Ibu/Saudara/i.</p>
            
            {submitted ? (
              <div className="text-center py-10 space-y-4 animate-scale-in">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Check className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-serif">Terima Kasih!</h3>
                <p className="text-stone-500">Konfirmasi Anda telah berhasil kami simpan.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-stone-400 text-xs underline mt-4 hover:text-stone-600"
                >
                  Ingin mengubah konfirmasi?
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitRsvp} className="space-y-6">
                <div>
                  <label className="text-xs uppercase font-bold text-stone-400 tracking-wider mb-2 block">Nama Lengkap</label>
                  <input 
                    type="text"
                    required
                    placeholder="Contoh: Budi Sudarsono"
                    className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-300 outline-none transition"
                    value={rsvpForm.name}
                    onChange={e => setRsvpForm({...rsvpForm, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase font-bold text-stone-400 tracking-wider mb-2 block">Kehadiran</label>
                    <select 
                      className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-300 outline-none transition"
                      value={rsvpForm.attendance}
                      onChange={e => setRsvpForm({...rsvpForm, attendance: e.target.value as any})}
                    >
                      <option value="yes">Hadir</option>
                      <option value="no">Tidak Hadir</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase font-bold text-stone-400 tracking-wider mb-2 block">Jumlah Tamu</label>
                    <input 
                      type="number"
                      min="1"
                      max="10"
                      className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-300 outline-none transition"
                      value={rsvpForm.guests}
                      onChange={e => setRsvpForm({...rsvpForm, guests: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-stone-400 tracking-wider mb-2 block">Pesan atau Ucapan</label>
                  <textarea 
                    rows={4}
                    placeholder="Tuliskan ucapan selamat..."
                    className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-300 outline-none transition resize-none"
                    value={rsvpForm.message}
                    onChange={e => setRsvpForm({...rsvpForm, message: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-stone-800 shadow-xl transition active:scale-95"
                >
                  <Send className="w-5 h-5" /> Kirim Konfirmasi
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Guest Book & Wishes Section */}
        <section className="py-32 px-10 bg-white">
            <div className="max-w-4xl mx-auto">
               <div className="text-center mb-16 reveal">
                  <h2 className="text-4xl font-serif mb-4">Buku Tamu & Ucapan</h2>
                  <p className="text-stone-500 font-light italic">Berikan doa dan ucapan terbaik untuk kedua mempelai</p>
                  <div className="w-16 h-px bg-stone-300 mx-auto mt-6"></div>
               </div>
               
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Form Column */}
                  <div className="lg:col-span-1 reveal-left">
                     <div className={`p-8 rounded-[30px] shadow-xl border border-stone-100 ${styles.card}`}>
                        <h3 className="text-xl font-serif mb-6 flex items-center gap-2">
                           <MessageSquare className={`w-5 h-5 ${styles.accent}`} /> Kirim Ucapan
                        </h3>
                        <form onSubmit={handleSubmitWish} className="space-y-4">
                           <div>
                              <input 
                                 type="text"
                                 placeholder="Nama Anda"
                                 required
                                 className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:ring-1 focus:ring-stone-300 outline-none transition"
                                 value={wishForm.name}
                                 onChange={e => setWishForm({...wishForm, name: e.target.value})}
                              />
                           </div>
                           <div>
                              <textarea 
                                 rows={4}
                                 placeholder="Tulis ucapan doa..."
                                 required
                                 className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:ring-1 focus:ring-stone-300 outline-none transition resize-none"
                                 value={wishForm.message}
                                 onChange={e => setWishForm({...wishForm, message: e.target.value})}
                              />
                           </div>
                           <button 
                              type="submit"
                              className={`w-full py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition active:scale-95 ${styles.button} hover:opacity-90 shadow-lg`}
                           >
                              <Send className="w-4 h-4" /> {wishSubmitted ? 'Terkirim!' : 'Kirim Ucapan'}
                           </button>
                        </form>
                     </div>
                  </div>

                  {/* Messages List Column */}
                  <div className="lg:col-span-2 reveal-right">
                     <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                        {rsvps.length > 0 ? (
                          rsvps.map((r, idx) => (
                            <div key={r.id} className={`p-8 rounded-[30px] border border-stone-100 shadow-sm hover:shadow-md transition relative group ${styles.card}`}>
                               <Quote className="absolute top-6 right-8 w-12 h-12 text-stone-100 group-hover:text-stone-200 transition pointer-events-none" />
                               <div className="flex items-center gap-3 mb-6">
                                  <div className={`w-12 h-12 ${styles.bg} rounded-full flex items-center justify-center text-stone-500 font-bold border ${styles.border}`}>
                                     {r.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                     <div className="font-semibold text-stone-800 flex items-center gap-2">
                                        {r.name}
                                        {r.guests > 0 && <span className="text-[10px] font-light bg-stone-100 px-2 py-0.5 rounded-full text-stone-400">Guest</span>}
                                     </div>
                                     <div className="text-[10px] text-stone-400">
                                        {new Date(r.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                     </div>
                                  </div>
                               </div>
                               <p className="text-stone-600 font-light italic leading-relaxed relative z-10">"{r.message || "Selamat Berbahagia!"}"</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-stone-400 py-20 italic bg-stone-50/50 rounded-[40px] border border-dashed border-stone-200">
                             Belum ada ucapan. Jadilah yang pertama memberikan doa!
                          </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="py-20 text-center bg-stone-50 border-t border-stone-200 reveal">
          <h3 className="text-3xl font-cursive mb-4">{data.couple.brideName} & {data.couple.groomName}</h3>
          <p className="text-stone-400 text-xs tracking-widest uppercase">NikahYuk • Sampai Jumpa di Hari Bahagia</p>
        </footer>
      </div>

      {/* Modern Music Player Floating Control */}
      <div 
        className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onMouseEnter={() => setShowPlayerControls(true)}
        onMouseLeave={() => setShowPlayerControls(false)}
      >
        {showPlayerControls && (
          <div className="bg-white/80 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-white/50 animate-fade-in-up w-64">
            <div className="flex items-center gap-4 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-stone-900 text-white ${isPlaying ? 'animate-spin-slow' : ''}`}>
                <Music className="w-5 h-5" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-tighter">Now Playing</p>
                <p className="text-sm font-semibold truncate text-stone-800">{data.music.title}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-stone-400" />
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
              />
            </div>
          </div>
        )}

        <button 
          onClick={toggleMusic}
          className={`w-14 h-14 rounded-full shadow-2xl border flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-90 ${
            isPlaying 
              ? 'bg-white text-stone-900 border-white animate-spin-slow' 
              : 'bg-stone-900 text-white border-stone-800'
          }`}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>
      </div>
    </div>
  );
};

export default InvitationPreview;
