
import React, { useState, useRef } from 'react';
import { InvitationData } from '../types';
import { generateLoveStory } from '../services/geminiService';
import { Wand2, Loader2, Music, Upload, Check, VolumeX, Volume2, Camera, User } from 'lucide-react';

interface Props {
  data: InvitationData;
  onUpdate: (data: InvitationData) => void;
}

const PRESET_SONGS = [
  { title: 'Romantic Piano', url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808f3030e.mp3' },
  { title: 'Acoustic Love', url: 'https://cdn.pixabay.com/audio/2024/09/10/audio_f55e3e236d.mp3' },
  { title: 'Smooth Wedding', url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a7315b.mp3' },
  { title: 'Cinematic Dream', url: 'https://cdn.pixabay.com/audio/2022/01/21/audio_31743c589f.mp3' },
];

const InvitationForm: React.FC<Props> = ({ data, onUpdate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyDetails, setStoryDetails] = useState('');
  const musicInputRef = useRef<HTMLInputElement>(null);
  const brideImageRef = useRef<HTMLInputElement>(null);
  const groomImageRef = useRef<HTMLInputElement>(null);

  const handleChange = (section: keyof InvitationData, field: string, value: any) => {
    if (section === 'couple') {
      onUpdate({ ...data, couple: { ...data.couple, [field]: value } });
    } else if (section === 'event') {
      onUpdate({ ...data, event: { ...data.event, [field]: value } });
    } else if (section === 'music') {
      onUpdate({ ...data, music: { ...data.music, [field]: value } });
    } else {
      onUpdate({ ...data, [section]: value });
    }
  };

  const handleGenerateStory = async () => {
    setIsGenerating(true);
    const story = await generateLoveStory(data.couple.brideName, data.couple.groomName, storyDetails || "Pertemuan pertama di kampus");
    onUpdate({ ...data, story });
    setIsGenerating(false);
  };

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleChange('music', 'url', url);
      handleChange('music', 'title', file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleImageUpload = (role: 'bride' | 'groom', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const field = role === 'bride' ? 'brideImage' : 'groomImage';
        handleChange('couple', field, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-10">
      {/* Theme Selection */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Pilih Tema</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(['classic', 'modern', 'rustic', 'floral'] as const).map(t => (
            <button
              key={t}
              onClick={() => handleChange('theme', '', t)}
              className={`py-3 rounded-lg border-2 transition-all capitalize text-sm font-medium ${
                data.theme === t 
                  ? 'border-stone-900 bg-stone-900 text-white shadow-lg' 
                  : 'border-stone-100 text-stone-500 hover:border-stone-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* Music Selection */}
      <section className="space-y-6">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
            <Music className="w-4 h-4" /> Musik Latar
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">Autoplay</span>
            <button 
              onClick={() => handleChange('music', 'isAutoPlay', !data.music.isAutoPlay)}
              className={`w-10 h-5 rounded-full p-1 transition-colors ${data.music.isAutoPlay ? 'bg-pink-500' : 'bg-stone-300'}`}
            >
              <div className={`w-3 h-3 bg-white rounded-full transition-transform ${data.music.isAutoPlay ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {PRESET_SONGS.map((song) => (
              <button
                key={song.url}
                onClick={() => {
                  handleChange('music', 'url', song.url);
                  handleChange('music', 'title', song.title);
                }}
                className={`flex items-center justify-between p-3 rounded-xl border text-sm transition ${
                  data.music.url === song.url 
                    ? 'border-pink-200 bg-pink-50 text-pink-700 font-semibold' 
                    : 'border-stone-100 hover:bg-stone-50 text-stone-600'
                }`}
              >
                <span>{song.title}</span>
                {data.music.url === song.url && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <input 
              type="file" 
              accept="audio/*" 
              className="hidden" 
              ref={musicInputRef} 
              onChange={handleMusicUpload} 
            />
            <button
              onClick={() => musicInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-stone-200 text-stone-500 text-sm hover:border-stone-400 hover:text-stone-700 transition"
            >
              <Upload className="w-4 h-4" /> Unggah Musik Sendiri (.mp3)
            </button>
          </div>
          
          {data.music.url.startsWith('blob:') && (
            <div className="p-3 bg-stone-50 rounded-xl flex items-center gap-2 text-xs text-stone-500">
              <Check className="w-3 h-3 text-green-500" />
              File terpilih: <span className="font-semibold text-stone-700">{data.music.title}</span>
            </div>
          )}
        </div>
      </section>

      {/* Couple Section */}
      <section className="space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 border-b pb-2">Informasi Mempelai</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mempelai Wanita */}
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-stone-100 shadow-inner bg-stone-50 flex items-center justify-center">
                  {data.couple.brideImage ? (
                    <img src={data.couple.brideImage} alt="Bride" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-stone-200" />
                  )}
                </div>
                <button 
                  onClick={() => brideImageRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-stone-900 text-white rounded-full shadow-lg hover:scale-110 transition active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input 
                  type="file" 
                  ref={brideImageRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => handleImageUpload('bride', e)} 
                />
              </div>
              <h4 className="font-serif font-bold text-stone-800 text-lg">Mempelai Wanita</h4>
            </div>
            
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Nama Lengkap Wanita"
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-400 transition"
                value={data.couple.brideName}
                onChange={(e) => handleChange('couple', 'brideName', e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Ayah Kandung"
                className="w-full px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm"
                value={data.couple.brideFather}
                onChange={(e) => handleChange('couple', 'brideFather', e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Ibu Kandung"
                className="w-full px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm"
                value={data.couple.brideMother}
                onChange={(e) => handleChange('couple', 'brideMother', e.target.value)}
              />
            </div>
          </div>

          {/* Mempelai Pria */}
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-stone-100 shadow-inner bg-stone-50 flex items-center justify-center">
                  {data.couple.groomImage ? (
                    <img src={data.couple.groomImage} alt="Groom" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-stone-200" />
                  )}
                </div>
                <button 
                  onClick={() => groomImageRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-stone-900 text-white rounded-full shadow-lg hover:scale-110 transition active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input 
                  type="file" 
                  ref={groomImageRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => handleImageUpload('groom', e)} 
                />
              </div>
              <h4 className="font-serif font-bold text-stone-800 text-lg">Mempelai Pria</h4>
            </div>

            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Nama Lengkap Pria"
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-400 transition"
                value={data.couple.groomName}
                onChange={(e) => handleChange('couple', 'groomName', e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Ayah Kandung"
                className="w-full px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm"
                value={data.couple.groomFather}
                onChange={(e) => handleChange('couple', 'groomFather', e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Ibu Kandung"
                className="w-full px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm"
                value={data.couple.groomMother}
                onChange={(e) => handleChange('couple', 'groomMother', e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 border-b pb-2">Detail Acara</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-stone-500 mb-1 block">Tanggal</label>
            <input 
              type="date"
              className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200"
              value={data.event.date}
              onChange={(e) => handleChange('event', 'date', e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-stone-500 mb-1 block">Waktu</label>
            <input 
              type="time"
              className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200"
              value={data.event.time}
              onChange={(e) => handleChange('event', 'time', e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-stone-500 mb-1 block">Nama Lokasi / Gedung</label>
            <input 
              type="text"
              placeholder="Contoh: Hotel Mulia Senayan"
              className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200"
              value={data.event.locationName}
              onChange={(e) => handleChange('event', 'locationName', e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-stone-500 mb-1 block">Alamat Lengkap</label>
            <textarea 
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 resize-none"
              value={data.event.address}
              onChange={(e) => handleChange('event', 'address', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* AI Story Section */}
      <section className="space-y-4 p-6 bg-pink-50 rounded-2xl border border-pink-100">
        <div className="flex items-center gap-2 mb-2">
          <Wand2 className="w-5 h-5 text-pink-600" />
          <h3 className="font-serif font-bold text-pink-900">AI Story Assistant</h3>
        </div>
        <p className="text-sm text-pink-700 leading-relaxed">
          Tulis sedikit info tentang bagaimana kalian bertemu, biar AI buatin cerita romantisnya!
        </p>
        <textarea 
          placeholder="Contoh: Bertemu di Jakarta saat hujan, hobi nonton film..."
          className="w-full px-4 py-3 rounded-xl bg-white border border-pink-200 text-sm focus:ring-2 focus:ring-pink-300 outline-none transition"
          value={storyDetails}
          onChange={(e) => setStoryDetails(e.target.value)}
        />
        <button
          onClick={handleGenerateStory}
          disabled={isGenerating}
          className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-pink-700 transition disabled:opacity-50"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate Cerita Romantis"}
        </button>
        <div className="mt-4">
          <label className="text-xs font-bold text-pink-800 uppercase block mb-2">Hasil Cerita</label>
          <div className="p-4 bg-white/60 rounded-xl text-stone-700 italic text-sm border border-pink-100">
            {data.story}
          </div>
        </div>
      </section>
    </div>
  );
};

export default InvitationForm;
