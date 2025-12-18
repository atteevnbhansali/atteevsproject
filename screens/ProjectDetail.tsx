
import React, { useState } from 'react';
import { Project, ProjectStatus, STALL_QUESTS, StallReason } from '../types';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  store: any;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, store }) => {
  const { markBlocked, resolveStall, toggleProjectStatus } = store;
  const [showStallModal, setShowStallModal] = useState(false);

  const completedMilestones = project.milestones.filter(m => m.isCompleted).length;
  const progressPercent = project.milestones.length > 0 ? (completedMilestones / project.milestones.length) * 100 : 0;

  const handleUnstall = () => {
    resolveStall(project.id);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar animate-fade-in bg-background-light dark:bg-background-dark pb-32">
      <header className="sticky top-0 z-20 flex items-center p-4 justify-between bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
        <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full hover:bg-black/5">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Project Narrative</span>
          <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{project.name}</span>
        </div>
        <button className="flex size-10 items-center justify-center rounded-full hover:bg-black/5">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </header>

      <main className="px-6 space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">{project.name}</h1>
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
              project.status === ProjectStatus.ACTIVE ? 'bg-emerald-100 text-emerald-700' :
              project.status === ProjectStatus.BLOCKED ? 'bg-amber-100 text-amber-700' :
              'bg-slate-100 text-slate-500'
            }`}>
              {project.status}
            </span>
          </div>
          <p className="text-slate-500 font-medium italic text-base">"{project.purpose}"</p>
        </div>

        {/* Stall Information Overlay */}
        {project.status === ProjectStatus.BLOCKED && (
           <section className="bg-amber-50 border border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/20 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-amber-500 filled">warning</span>
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Unstall Quest Active</p>
                </div>
                <div className="space-y-4">
                  <p className="text-slate-800 dark:text-slate-200 font-bold text-lg leading-tight">
                    Blocked: {project.stallReason?.replace(/_/g, ' ')}
                  </p>
                  <div className="p-4 bg-white dark:bg-black/20 rounded-2xl border border-amber-100/50">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Quest:</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {project.stallReason ? STALL_QUESTS[project.stallReason] : "Define next step."}
                    </p>
                  </div>
                  <button 
                    onClick={handleUnstall}
                    className="w-full py-4 bg-amber-500 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-xl">bolt</span>
                    Resolve Stall
                  </button>
                </div>
           </section>
        )}

        {/* Quest Marker / Next Action */}
        <section className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-soft">
            <div className="flex justify-between items-center mb-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Quest Marker</p>
              <button className="text-primary text-xs font-bold">EDIT</button>
            </div>
            <div className="flex gap-4 items-center">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                    <span className="material-symbols-outlined text-2xl">bolt</span>
                </div>
                <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{project.nextAction || 'No action defined'}</p>
                </div>
            </div>
        </section>

        {/* Narrative Chapters (Milestones) */}
        <section className="space-y-4">
            <div className="flex justify-between items-end px-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chapters ({completedMilestones}/{project.milestones.length})</h3>
                <span className="text-xs font-bold text-primary">{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-primary transition-all duration-700" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div className="space-y-3">
                {project.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center gap-4 p-4 bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm group">
                        <div className={`size-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            milestone.isCompleted ? 'bg-primary border-primary text-slate-900' : 'border-slate-200 group-hover:border-primary'
                        }`}>
                            {milestone.isCompleted && <span className="material-symbols-outlined text-[14px] font-bold">check</span>}
                        </div>
                        <span className={`text-sm font-bold ${milestone.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                            {milestone.title}
                        </span>
                    </div>
                ))}
            </div>
        </section>

        {/* Action Controls */}
        <div className="flex flex-col gap-3 pt-4">
          {project.status === ProjectStatus.ACTIVE && (
            <button 
              onClick={() => setShowStallModal(true)}
              className="w-full h-14 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-amber-500 flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined">pause_circle</span>
              Mark Blocked
            </button>
          )}
          <button 
            onClick={() => toggleProjectStatus(project.id, ProjectStatus.COMPLETE)}
            className="w-full h-14 bg-emerald-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <span className="material-symbols-outlined">check_circle</span>
            Close Project Arc
          </button>
          <button 
            onClick={() => toggleProjectStatus(project.id, ProjectStatus.PARKED)}
            className="w-full h-14 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold"
          >
            Park to Archive
          </button>
        </div>
      </main>

      {/* Mark Blocked Modal */}
      {showStallModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl overflow-hidden shadow-2xl flex flex-col p-6 animate-fade-in-up">
            <h2 className="text-xl font-bold mb-4">What's blocking this?</h2>
            <div className="space-y-2 mb-6">
              {(Object.values(StallReason)).map((reason) => (
                <button 
                  key={reason}
                  onClick={() => {
                    markBlocked(project.id, reason);
                    setShowStallModal(false);
                  }}
                  className="w-full text-left p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent hover:border-slate-100 dark:hover:border-white/10 transition-all font-medium text-sm"
                >
                  {reason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
            <button onClick={() => setShowStallModal(false)} className="w-full py-3 text-slate-400 font-bold">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};
