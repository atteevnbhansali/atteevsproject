
import React from 'react';
import { CompassState } from '../types';

interface CompassTuningProps {
  store: any;
  onBack: () => void;
}

export const CompassTuning: React.FC<CompassTuningProps> = ({ store, onBack }) => {
  const { compass, updateCompass } = store;

  const options: Record<keyof CompassState, string[]> = {
    alignment: ['Aligned', 'Drifting', 'Off-Track'],
    momentum: ['Flowing', 'Slow', 'Stuck'],
    chaos: ['Light', 'Moderate', 'Heavy'],
    stallHeat: ['Cool', 'Warm', 'Hot']
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden animate-fade-in">
      <header className="px-6 py-4 pt-12 flex items-center justify-between z-20 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold">Compass Tuning</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-10 no-scrollbar pb-10">
        <p className="text-slate-500 text-sm text-center">Update your compass based on how you feel in this current moment. Be honest, not judgmental.</p>

        {(Object.keys(options) as Array<keyof CompassState>).map((key) => (
          <div key={key} className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">{key.replace(/([A-Z])/g, ' $1')}</h3>
            <div className="flex bg-white dark:bg-surface-dark p-1.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              {options[key].map((opt) => (
                <button 
                  key={opt}
                  onClick={() => updateCompass(key, opt)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                    compass[key] === opt 
                      ? 'bg-primary text-slate-900 shadow-md scale-[1.02]' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-8">
            <button 
                onClick={onBack}
                className="w-full h-14 bg-slate-900 dark:bg-primary text-white dark:text-slate-900 rounded-2xl font-bold shadow-lg active:scale-95 transition-all">
                Update Compass
            </button>
        </div>
      </main>
    </div>
  );
};
