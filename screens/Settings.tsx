
import React from 'react';

interface SettingsProps {
  store: any;
  onBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ store, onBack }) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar animate-fade-in bg-background-light dark:bg-background-dark pb-20">
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 pt-12 pb-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
        <button onClick={onBack} className="flex items-center text-primary group">
          <span className="material-symbols-outlined text-[28px] group-hover:-translate-x-0.5 transition-transform">arrow_back_ios_new</span>
          <span className="text-lg font-medium ml-1">Home</span>
        </button>
        <h1 className="text-lg font-bold">Settings</h1>
        <div className="w-[70px]"></div>
      </header>

      <main className="px-5 space-y-8">
        <div>
          <h3 className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Current Alignment</h3>
          <div className="flex flex-col overflow-hidden rounded-xl bg-white dark:bg-surface-dark shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
              <label className="text-base font-medium whitespace-nowrap mr-4">Life Phase</label>
              <input className="flex-1 bg-transparent text-right text-primary border-none focus:ring-0 p-0 text-base" defaultValue="Building Foundation" />
            </div>
            <div className="group flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors">
              <span className="text-base font-medium">Phase Duration</span>
              <div className="flex items-center gap-2">
                <span className="text-base text-slate-500">Quarterly</span>
                <span className="material-symbols-outlined text-slate-300 text-xl">chevron_right</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Notifications & Focus</h3>
          <div className="flex flex-col overflow-hidden rounded-xl bg-white dark:bg-surface-dark shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-base font-medium">Morning Briefing</span>
              <div className="relative inline-block w-12 align-middle">
                <input type="checkbox" className="absolute opacity-0 w-full h-full cursor-pointer z-10 peer" />
                <div className="block h-6 rounded-full bg-slate-200 peer-checked:bg-primary transition-all"></div>
                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-all peer-checked:translate-x-6"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-base font-medium">Evening Reflection</span>
               <div className="relative inline-block w-12 align-middle">
                <input type="checkbox" defaultChecked className="absolute opacity-0 w-full h-full cursor-pointer z-10 peer" />
                <div className="block h-6 rounded-full bg-slate-200 peer-checked:bg-primary transition-all"></div>
                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-all peer-checked:translate-x-6"></div>
              </div>
            </div>
          </div>
        </div>

        <div>
            <h3 className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Appearance</h3>
            <div className="overflow-hidden rounded-xl bg-white dark:bg-surface-dark shadow-sm p-1.5">
                <div className="flex w-full bg-background-light dark:bg-slate-800 rounded-lg p-1">
                    <button className="flex-1 py-1.5 text-sm font-medium rounded-md">Light</button>
                    <button className="flex-1 py-1.5 text-sm font-medium rounded-md bg-white dark:bg-slate-600 shadow-sm">Dark</button>
                    <button className="flex-1 py-1.5 text-sm font-medium rounded-md">System</button>
                </div>
            </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-center space-y-3 pb-10">
          <div className="flex items-center justify-center h-16 w-16 bg-primary/10 rounded-full mb-2">
            <span className="material-symbols-outlined text-primary text-3xl">spa</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span className="text-xs font-medium uppercase tracking-wide">Local-First Storage</span>
          </div>
          <p className="text-xs text-slate-400/60 italic">Version 2.4.0 (Build 892)</p>
        </div>
      </main>
    </div>
  );
};
