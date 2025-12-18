
import React from 'react';
import { ProjectStatus, CompassState } from '../types';
import { AppView } from '../App';

interface DashboardProps {
  store: any;
  onNavigate: (view: AppView, projectId?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ store, onNavigate }) => {
  const { activePhase, projects, compass, captures, activeProjectsCount, weeklyMomentum } = store;

  const activeProjects = projects.filter((p: any) => p.status === ProjectStatus.ACTIVE || p.status === ProjectStatus.BLOCKED);
  const unprocessedCount = captures.filter((c: any) => c.status === 'unprocessed').length;

  const getStatusColor = (val: string) => {
    switch (val) {
      case 'Aligned': case 'Flowing': case 'Light': case 'Cool': return 'text-emerald-500';
      case 'Drifting': case 'Slow': case 'Moderate': case 'Warm': return 'text-amber-500';
      case 'Off-Track': case 'Stuck': case 'Heavy': case 'Hot': return 'text-red-500';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar animate-fade-in bg-background-light dark:bg-background-dark pb-32">
      <header className="px-6 pt-12 pb-4 flex items-center justify-between z-10 sticky top-0 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
        <div className="flex flex-col">
          <h1 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </h1>
          <p className="text-xl font-bold text-slate-900 dark:text-white">Continuum</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-surface-dark px-3 py-1.5 rounded-full border border-stone-100 dark:border-stone-800 shadow-sm">
          <div className={`w-2 h-2 rounded-full ${compass.chaos === 'Light' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase">Load: {compass.chaos}</span>
        </div>
      </header>

      <main className="px-4 flex flex-col gap-6">
        {/* Phase Compass Indicators */}
        <section aria-label="Phase Compass" className="grid grid-cols-2 gap-3">
          {[
            { label: 'Alignment', val: compass.alignment, id: 'alignment' },
            { label: 'Momentum', val: compass.momentum, id: 'momentum' },
            { label: 'Chaos', val: compass.chaos, id: 'chaos' },
            { label: 'Stall Heat', val: compass.stallHeat, id: 'stallHeat' }
          ].map((item, idx) => (
            <button 
              key={idx} 
              className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-soft hover:border-primary transition-all group"
              onClick={() => onNavigate(AppView.COMPASS_TUNING)}
            >
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</span>
                <span className={`text-sm font-bold ${getStatusColor(item.val)}`}>{item.val}</span>
              </div>
              <span className="material-symbols-outlined text-slate-200 group-hover:text-primary transition-colors">chevron_right</span>
            </button>
          ))}
        </section>

        {/* Current Phase Card */}
        {activePhase && (
          <section onClick={() => onNavigate(AppView.PHASES)}>
            <div className="bg-slate-900 dark:bg-surface-dark rounded-3xl p-6 shadow-glow relative overflow-hidden group border border-slate-800">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-[120px]">timeline</span>
              </div>
              <div className="flex flex-col gap-3 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/30">Active Phase</span>
                </div>
                <h2 className="text-2xl font-bold text-white leading-tight">"{activePhase.name}"</h2>
                <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{activePhase.theme}</p>
                <button className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-widest mt-1">
                  Success Criteria <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Active Focus Slots */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Focus ({activeProjectsCount}/3)</h3>
            <button onClick={() => onNavigate(AppView.PROJECTS)} className="text-[10px] font-bold text-primary hover:underline">VIEW ALL</button>
          </div>

          <div className="grid gap-3">
            {activeProjects.map((project: any) => (
              <div 
                key={project.id}
                onClick={() => onNavigate(AppView.PROJECT_DETAIL, project.id)}
                className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-soft border border-slate-100 dark:border-slate-800 transition-all hover:translate-y-[-2px]"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">→ {project.name}</h4>
                  {project.status === ProjectStatus.BLOCKED && (
                     <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[9px] font-bold uppercase">Stalled</span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Next Action</span>
                  <p className={`text-sm font-medium ${project.status === ProjectStatus.BLOCKED ? 'text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                    {project.nextAction || 'No action defined'}
                  </p>
                </div>
              </div>
            ))}

            {Array.from({ length: Math.max(0, 3 - activeProjectsCount) }).map((_, i) => (
              <div 
                key={`empty-${i}`}
                className="h-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-300 font-bold text-xs uppercase"
              >
                Empty Slot
              </div>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="grid grid-cols-2 gap-3 mb-6">
          <button 
            onClick={() => onNavigate(AppView.INBOX)}
            className="flex flex-col p-4 rounded-2xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 items-start gap-2"
          >
            <div className="flex justify-between w-full">
              <span className="material-symbols-outlined text-primary">inbox</span>
              {unprocessedCount > 0 && <span className="bg-primary text-white text-[10px] font-bold px-1.5 rounded-full">{unprocessedCount}</span>}
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Capture Inbox</span>
          </button>
          <div className="flex flex-col p-4 rounded-2xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 items-start gap-2">
            <div className="flex justify-between w-full">
              <span className="material-symbols-outlined text-emerald-500">trending_up</span>
              <span className="text-emerald-500 text-[10px] font-bold">+{weeklyMomentum}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Momentum</span>
          </div>
        </section>
      </main>

      {/* Persistent AI Entry */}
      <div className="fixed bottom-24 left-0 right-0 px-6 z-50 pointer-events-none">
        <button 
          onClick={() => onNavigate(AppView.STEWARD)}
          className="pointer-events-auto w-full h-14 bg-slate-900 dark:bg-surface-dark rounded-2xl shadow-floating flex items-center px-5 gap-3 border border-slate-800"
        >
          <span className="material-symbols-outlined text-primary filled">smart_toy</span>
          <span className="text-slate-400 text-sm font-medium">Talk to your system...</span>
        </button>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 pb-safe pt-2">
        <div className="flex justify-around items-center h-16">
          <button className="flex flex-col items-center justify-center w-16 gap-1" onClick={() => onNavigate(AppView.DASHBOARD)}>
            <span className="material-symbols-outlined filled text-primary">dashboard</span>
            <span className="text-[10px] font-bold text-primary">Center</span>
          </button>
          <button className="flex flex-col items-center justify-center w-16 gap-1 group" onClick={() => onNavigate(AppView.PROJECTS)}>
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">check_circle</span>
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary transition-colors">Arcs</span>
          </button>
          <button className="flex flex-col items-center justify-center w-16 gap-1 group" onClick={() => onNavigate(AppView.INBOX)}>
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">inbox</span>
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary transition-colors">Inbox</span>
          </button>
          <button className="flex flex-col items-center justify-center w-16 gap-1 group" onClick={() => onNavigate(AppView.SETTINGS)}>
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">settings</span>
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary transition-colors">System</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
