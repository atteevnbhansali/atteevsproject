
import React from 'react';
import { PhaseStatus } from '../types';

interface PhaseManagerProps {
  store: any;
  onBack: () => void;
}

export const PhaseManager: React.FC<PhaseManagerProps> = ({ store, onBack }) => {
  const { phases } = store;

  return (
    <div className="flex flex-col h-full bg-background-light animate-fade-in overflow-hidden">
      <header className="flex items-center p-4 pt-12 pb-2 justify-between sticky top-0 bg-background-light/95 backdrop-blur-md z-20">
        <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full hover:bg-black/5">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">My Life Phases</h2>
        <button className="flex size-10 items-center justify-center rounded-full hover:bg-black/5">
          <span className="material-symbols-outlined text-2xl">settings</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-28 pt-2 no-scrollbar">
        <div className="pt-4 pb-2">
          <h3 className="tracking-tight text-xl font-bold">Current Chapter</h3>
        </div>

        {phases.filter((p: any) => p.status === PhaseStatus.ACTIVE).map((phase: any) => (
          <div key={phase.id} className="mb-6 group cursor-pointer relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-400 rounded-2xl opacity-20 blur group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-cover bg-center flex flex-col items-stretch justify-end rounded-2xl h-64 shadow-md overflow-hidden" 
                 style={{ backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0.8) 100%), url('${phase.imageUrl}')` }}>
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-bold text-white bg-primary rounded-full shadow-sm">
                  Active
                </span>
              </div>
              <div className="p-5 flex flex-col gap-1">
                <p className="text-primary/90 text-sm font-semibold tracking-wide uppercase">{phase.startDate} - Present</p>
                <p className="text-white text-3xl font-bold leading-tight">{phase.name}</p>
                <p className="text-gray-200 text-base font-medium leading-normal line-clamp-2">{phase.description}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-2 pb-2 mt-8 border-t border-slate-200">
          <h3 className="text-slate-400 tracking-tight text-lg font-bold">Planned</h3>
        </div>

        {phases.filter((p: any) => p.status === PhaseStatus.PLANNED).map((phase: any) => (
          <div key={phase.id} className="mb-4">
            <div className="flex items-stretch justify-between gap-4 rounded-xl p-4 bg-white border border-transparent hover:border-primary/20 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex flex-col justify-center gap-1 flex-[1.5]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="size-2 rounded-full bg-blue-300"></span>
                  <p className="text-primary text-xs font-bold uppercase tracking-wider">Planned • {phase.startDate}</p>
                </div>
                <p className="text-lg font-bold leading-tight">{phase.name}</p>
                <p className="text-slate-500 text-sm leading-normal line-clamp-2">{phase.description}</p>
              </div>
              <div className="w-24 bg-center bg-cover rounded-lg shrink-0 aspect-square shadow-inner" 
                   style={{ backgroundImage: `url('${phase.imageUrl || 'https://picsum.photos/200/200'}')` }}></div>
            </div>
          </div>
        ))}
      </main>

      <div className="absolute bottom-8 w-full flex justify-center z-30 pointer-events-none">
        <button className="pointer-events-auto shadow-lg flex cursor-pointer items-center justify-center rounded-full h-14 bg-primary text-white gap-2 px-8 font-bold text-base transition-all transform hover:-translate-y-1 active:scale-95">
          <span className="material-symbols-outlined text-[24px]">add</span>
          <span>New Phase</span>
        </button>
      </div>
    </div>
  );
};
