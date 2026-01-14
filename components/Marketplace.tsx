
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ShoppingBag as ShopIcon, 
  Star as StarIcon, 
  Zap as ZapIcon, 
  Eye as EyeIcon, 
  CheckCircle as CheckIcon, 
  Tag as TagIcon, 
  Search as SearchIcon, 
  Filter as FilterIcon, 
  Plus as PlusIcon, 
  Palette as PaletteIcon, 
  Sparkles as SparklesIcon 
} from 'lucide-react';

interface Props {
  onBack: () => void;
  onSelectTemplate: (theme: 'classic' | 'modern' | 'rustic' | 'floral') => void;
}

const TEMPLATES = [
  { id: 'classic', name: 'Timeless Elegance', category: 'Classic', rating: 4.9, price: 'Free', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600' },
  { id: 'modern', name: 'Urban Chic', category: 'Modern', rating: 4.8, price: 'Pro', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600' },
  { id: 'rustic', name: 'Bohemian Woods', category: 'Rustic', rating: 4.7, price: 'Free', image: 'https://images.unsplash.com/photo-1522673607200-164883eecd4c?auto=format&fit=crop&q=80&w=600' },
  { id: 'floral', name: 'Spring Garden', category: 'Floral', rating: 5.0, price: 'Premium', image: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=600' },
];

const Marketplace: React.FC<Props> = ({ onBack, onSelectTemplate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Top Banner */}
      <div className="bg-stone-900 text-white py-20 px-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-6 relative z-10">
           <button onClick={onBack} className="absolute left-0 top-0 p-3 bg-white/10 hover:bg-white/20 transition rounded-2xl">
              <ChevronLeft className="w-6 h-6 text-white" />
           </button>
           <ShopIcon className="w-12 h-12 text-pink-500 mb-2" />
           <h1 className="text-4xl md:text-6xl font-serif font-bold">Template Marketplace</h1>
           <p className="text-stone-400 max-w-2xl text-lg font-light">Pilih desain eksklusif NikahYuk untuk hari istimewa Anda.</p>
           
           <div className="flex flex-col md:flex-row gap-4 w-full max-w-xl mt-8">
              <div className="relative flex-1">
                 <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
                 <input 
                   type="text" 
                   placeholder="Cari tema (Modern, Rustic...)" 
                   className="w-full pl-14 pr-4 py-5 bg-white text-stone-900 rounded-3xl outline-none shadow-2xl"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
           </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="max-w-6xl mx-auto px-10 -translate-y-8 flex gap-4 overflow-x-auto no-scrollbar pb-4">
         {['Semua Tema', 'Modern', 'Rustic', 'Classic', 'Floral', 'Islamic', 'Minimalist'].map((cat, i) => (
           <button key={cat} className={`whitespace-nowrap px-6 py-4 rounded-2xl font-bold text-sm shadow-xl transition active:scale-95 ${i === 0 ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 hover:bg-stone-100'}`}>
              {cat}
           </button>
         ))}
      </div>

      {/* Template Grid */}
      <div className="max-w-6xl mx-auto px-10 mt-8">
         <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-serif font-bold text-stone-800">Katalog Desain Terpopuler</h2>
            <div className="flex items-center gap-2 text-stone-400 text-sm font-medium">
               <FilterIcon className="w-4 h-4" /> Filter & Urutkan
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEMPLATES.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase())).map((tpl) => (
              <div key={tpl.id} className="group bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-stone-100 flex flex-col h-full">
                 <div className="relative aspect-[3/4] overflow-hidden">
                    <img src={tpl.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
                       <button 
                         onClick={() => onSelectTemplate(tpl.id as any)}
                         className="p-4 bg-white rounded-full text-stone-900 hover:scale-110 transition shadow-xl"
                        >
                          <EyeIcon className="w-6 h-6" />
                       </button>
                    </div>
                    {tpl.price !== 'Free' && (
                      <div className="absolute top-5 right-5 bg-stone-900 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 shadow-lg">
                         <ZapIcon className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {tpl.price}
                      </div>
                    )}
                 </div>
                 <div className="p-8 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{tpl.category}</span>
                       <div className="flex items-center gap-1 text-xs font-bold text-stone-900">
                          <StarIcon className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {tpl.rating}
                       </div>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-stone-800 mb-6">{tpl.name}</h3>
                    
                    <div className="mt-auto flex flex-col gap-3">
                       <button 
                         onClick={() => onSelectTemplate(tpl.id as any)}
                         className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold text-sm hover:bg-stone-800 transition active:scale-95 shadow-xl shadow-stone-200"
                        >
                          Gunakan Template
                       </button>
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Marketplace;
