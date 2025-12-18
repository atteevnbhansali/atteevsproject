
import React, { useState, useMemo } from 'react';
import { useStore } from './store';
import { Dashboard } from './screens/Dashboard';
import { ProjectsList } from './screens/ProjectsList';
import { CaptureInbox } from './screens/CaptureInbox';
import { StewardChat } from './screens/StewardChat';
import { Onboarding } from './screens/Onboarding';
import { ProjectDetail } from './screens/ProjectDetail';
import { PhaseManager } from './screens/PhaseManager';
import { Settings } from './screens/Settings';
import { Garden } from './screens/Garden';
import { CompassTuning } from './screens/CompassTuning';

export enum AppView {
  LANDING = 'landing',
  ONBOARDING = 'onboarding',
  DASHBOARD = 'dashboard',
  PROJECTS = 'projects',
  PROJECT_DETAIL = 'project_detail',
  INBOX = 'inbox',
  STEWARD = 'steward',
  PHASES = 'phases',
  SETTINGS = 'settings',
  GARDEN = 'garden',
  COMPASS_TUNING = 'compass_tuning'
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const store = useStore();

  const handleNavigate = (view: AppView, projectId?: string) => {
    if (projectId) setSelectedProjectId(projectId);
    setCurrentView(view);
  };

  const currentProject = useMemo(() => 
    store.projects.find(p => p.id === selectedProjectId), 
    [store.projects, selectedProjectId]
  );

  const renderView = () => {
    switch (currentView) {
      case AppView.LANDING:
        return (
          <div className="flex flex-col h-screen w-full max-w-md mx-auto p-6 justify-between animate-fade-in">
            <div className="flex justify-between items-center w-full h-12"></div>
            <div className="flex flex-col items-center justify-center flex-grow w-full gap-8">
              <div className="relative w-full px-4">
                <div className="w-full aspect-square max-w-[340px] mx-auto bg-center bg-cover rounded-2xl shadow-xl overflow-hidden" 
                     style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBK8l88XbF3JN8WfINk2GuhJfPxLfD-okTRVcL2GrRhmJXvnWMxaJykUZUQ80ARGNyO_49-UuHgJi2m4IPcehinG8tccuSwUmpVhEz-ZbyHinFkr1zy2ZsPOxXf0g9e1mTpfU26PI1Vev1yxZ9mx0QaHPyJn3ODYalKAiHzBRX7swaYjrJNoYkP05JJBIjzyMhiX-4NrqO7ZC2LAa1ovrJcz5JeHKr96G-1YUAc9OMIhUkV8mLAsdDLLkxo8v1KV2HJ57RuKDsQhZk')` }}>
                  <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-2 max-w-[320px]">
                <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight pt-2">Continuum</h1>
                <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-relaxed">Phase-Aware Life Command Center. Preserve state across time.</p>
              </div>
            </div>
            <div className="flex flex-col gap-5 w-full pb-8 pt-4">
              <button 
                onClick={() => setCurrentView(AppView.ONBOARDING)}
                className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary hover:bg-primary/90 transition-all duration-300 text-slate-900 text-[17px] font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/25 active:scale-[0.98]">
                <span className="mr-2">Enter Command Center</span>
                <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
              </button>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-500 bg-white/50 dark:bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-sm border border-slate-200/50 dark:border-white/5">
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  <p className="text-xs font-medium leading-normal">Local-first stewardship</p>
                </div>
              </div>
            </div>
          </div>
        );
      case AppView.ONBOARDING:
        return <Onboarding onComplete={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.DASHBOARD:
        return <Dashboard store={store} onNavigate={(v, p) => handleNavigate(v as AppView, p)} />;
      case AppView.PROJECTS:
        return <ProjectsList store={store} onNavigate={(v, p) => handleNavigate(v as AppView, p)} />;
      case AppView.PROJECT_DETAIL:
        return <ProjectDetail project={currentProject!} onBack={() => setCurrentView(AppView.PROJECTS)} store={store} />;
      case AppView.INBOX:
        return <CaptureInbox store={store} onBack={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.STEWARD:
        return <StewardChat onBack={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.PHASES:
        return <PhaseManager store={store} onBack={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.SETTINGS:
        return <Settings store={store} onBack={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.GARDEN:
        return <Garden store={store} onBack={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.COMPASS_TUNING:
        return <CompassTuning store={store} onBack={() => setCurrentView(AppView.DASHBOARD)} />;
      default:
        return <Dashboard store={store} onNavigate={(v, p) => handleNavigate(v as AppView, p)} />;
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-background-light dark:bg-background-dark relative shadow-2xl overflow-hidden">
      {renderView()}
    </div>
  );
};

export default App;
