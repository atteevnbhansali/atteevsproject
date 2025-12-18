
import React from 'react';

interface CaptureInboxProps {
  store: any;
  onBack: () => void;
}

export const CaptureInbox: React.FC<CaptureInboxProps> = ({ store, onBack }) => {
  const { captures, removeCapture, processToGarden } = store;

  return (
    <div className="flex flex-col h-full overflow-hidden animate-fade-in bg-background-light dark:bg-background-dark">
      <header className="px-6 py-4 pt-12 flex items-center justify-between z-20 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight">The Inbox</h1>
        </div>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
          {captures.length} Loops
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pt-4 pb-24 space-y-6 no-scrollbar">
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl">
            <p className="text-xs text-primary font-medium italic">"Every loop unclosed is a leak of attention. Safe storage restores peace."</p>
        </div>

        {captures.map((item: any) => (
          <article 
            key={item.id} 
            className="bg-white dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-4 animate-fade-in-up"
          >
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">{item.capturedAt}</span>
                    <div className="flex gap-1">
                        <span className="material-symbols-outlined text-slate-200">more_horiz</span>
                    </div>
                </div>
                <p className="text-base font-bold text-slate-800 dark:text-slate-100 leading-snug">{item.text}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => processToGarden(item.id)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50 transition-colors group">
                <span className="material-symbols-outlined text-emerald-500 group-hover:scale-110 transition-transform">yard</span>
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Interesting</span>
              </button>
              <button 
                onClick={() => removeCapture(item.id)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-primary/10 bg-primary/5 hover:bg-primary/10 transition-colors group">
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">explore</span>
                <span className="text-[10px] font-bold text-primary uppercase">Important</span>
              </button>
            </div>
            
            <p className="text-[10px] text-center text-slate-400 font-medium">Interesting moves to the Garden. Important maps to a Project.</p>
          </article>
        ))}

        {captures.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300">
            <span className="material-symbols-outlined text-[80px] mb-4">check_circle</span>
            <p className="font-bold text-lg">Clear Mind</p>
            <p className="text-sm">Attention is fully stewarded.</p>
          </div>
        )}
      </main>
    </div>
  );
};
