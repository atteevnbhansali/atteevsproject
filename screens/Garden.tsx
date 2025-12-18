
import React, { useState } from 'react';

interface GardenProps {
  store: any;
  onBack: () => void;
}

export const Garden: React.FC<GardenProps> = ({ store, onBack }) => {
  const { gardenItems } = store;
  const [activeCategory, setActiveCategory] = useState<'All' | 'Seed' | 'Idea' | 'Insight'>('All');

  const filtered = activeCategory === 'All' 
    ? gardenItems 
    : gardenItems.filter((item: any) => item.category === activeCategory);

  return (
    <div className="flex flex-col h-full overflow-hidden animate-fade-in bg-[#fdfcf9] dark:bg-background-dark">
      <header className="px-6 py-4 pt-12 flex flex-col gap-4 z-20 sticky top-0 bg-[#fdfcf9]/95 dark:bg-background-dark/95 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-2xl font-bold tracking-tight text-emerald-900 dark:text-emerald-400">The Garden</h1>
          </div>
          <button className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
            <span className="material-symbols-outlined">local_florist</span>
          </button>
        </div>
        <p className="text-slate-500 text-sm italic font-serif">Slow thoughts growing for the future seasons.</p>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {['All', 'Seed', 'Idea', 'Insight'].map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 text-slate-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4 no-scrollbar pb-24">
        {filtered.map((item: any, idx: number) => (
          <div 
            key={item.id} 
            className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-emerald-50 dark:border-emerald-900/10 flex flex-col gap-3 animate-fade-in-up"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="flex justify-between items-start">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                item.category === 'Seed' ? 'bg-amber-100 text-amber-700' :
                item.category === 'Insight' ? 'bg-sky-100 text-sky-700' :
                'bg-emerald-100 text-emerald-700'
              }`}>
                {item.category}
              </span>
              <span className="text-[10px] font-bold text-slate-300 uppercase">{item.createdAt}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">{item.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-serif">{item.content}</p>
            <div className="mt-2 flex justify-end">
              <button className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                Cultivate <span className="material-symbols-outlined text-sm">trending_flat</span>
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 opacity-30 text-emerald-900">
             <span className="material-symbols-outlined text-[80px]">yard</span>
             <p className="font-bold">Nothing growing here yet.</p>
          </div>
        )}
      </main>
    </div>
  );
};
