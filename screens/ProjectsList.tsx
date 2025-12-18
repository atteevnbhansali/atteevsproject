
import React, { useState } from 'react';
import { ProjectStatus } from '../types';

interface ProjectsListProps {
  store: any;
  onNavigate: (view: string, projectId?: string) => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ store, onNavigate }) => {
  const { projects } = store;
  const [filter, setFilter] = useState<ProjectStatus | 'All'>('All');

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter((p: any) => p.status === filter);

  return (
    <div className="flex flex-col h-full overflow-hidden animate-fade-in">
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-4 pt-12 pb-2">
        <h2 className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight flex-1">Projects</h2>
        <button className="group flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-all">
          <span className="material-symbols-outlined text-primary">add</span>
        </button>
      </header>

      <div className="sticky top-[88px] z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm pb-4 pt-2">
        <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar">
          {['All', ProjectStatus.ACTIVE, ProjectStatus.BLOCKED, ProjectStatus.ARCHIVED].map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f as any)}
              className={`flex h-9 shrink-0 items-center justify-center px-5 rounded-full transition-all active:scale-95 ${
                filter === f 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <p className="text-sm font-semibold">{f}</p>
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-4 pt-2 flex flex-col gap-4 no-scrollbar pb-24">
        {filteredProjects.map((project: any) => (
          <div 
            key={project.id}
            onClick={() => onNavigate('project_detail', project.id)}
            className="group relative flex flex-col justify-between rounded-xl bg-white dark:bg-slate-800 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-transparent dark:border-slate-700 transition-all active:scale-[0.99]"
          >
            <div className="flex w-full items-start justify-between gap-4 mb-4">
              <h3 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">{project.name}</h3>
              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${
                project.status === ProjectStatus.ACTIVE ? 'bg-green-50 text-green-700 ring-green-600/10' : 
                project.status === ProjectStatus.BLOCKED ? 'bg-red-50 text-red-700 ring-red-600/10' :
                'bg-slate-50 text-slate-700 ring-slate-600/10'
              }`}>
                {project.status}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Next Action</p>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-slate-400 mt-0.5 text-[18px]">
                  {project.status === ProjectStatus.BLOCKED ? 'local_shipping' : 'bolt'}
                </span>
                <p className="text-slate-700 dark:text-slate-200 text-sm font-medium leading-normal">{project.nextAction}</p>
              </div>
            </div>
            <div className="mt-5 h-1 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className={`h-full bg-primary rounded-full`} style={{ width: `${project.progress || 10}%` }}></div>
            </div>
          </div>
        ))}
      </main>

      <nav className="fixed bottom-0 left-0 z-50 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe pt-2">
        <div className="flex justify-around items-center h-16">
          <button className="flex flex-col items-center justify-center w-16 gap-1 group" onClick={() => onNavigate('dashboard')}>
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">home</span>
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary">Home</span>
          </button>
          <button className="flex flex-col items-center justify-center w-16 gap-1">
            <span className="material-symbols-outlined text-primary filled">check_circle</span>
            <span className="text-[10px] font-bold text-primary">Projects</span>
          </button>
          <button className="flex flex-col items-center justify-center w-16 gap-1 group" onClick={() => onNavigate('inbox')}>
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">inbox</span>
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary">Inbox</span>
          </button>
          <button className="flex flex-col items-center justify-center w-16 gap-1 group" onClick={() => onNavigate('settings')}>
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">settings</span>
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
