
import { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  Phase, Project, Capture, PhaseStatus, ProjectStatus, 
  CompassState, Decision, Insight, Milestone, 
  MomentumLog, ActivityLog, StallReason
} from './types';

const INITIAL_PHASES: Phase[] = [
  {
    id: 'p1',
    name: 'Stabilization & Revenue Focus',
    theme: 'Build sustainable income streams while reducing operational chaos. Focus on what generates value, not what feels urgent.',
    successCriteria: '3 reliable revenue sources generating $10k+/month combined. Systems in place that run without daily intervention.',
    description: 'The first chapter of the new operating system.',
    status: PhaseStatus.ACTIVE,
    startDate: '2024-10-01',
    progress: 45
  }
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj1',
    phaseId: 'p1',
    name: 'Sales Engine Alpha',
    purpose: 'Primary revenue driver for the quarter.',
    status: ProjectStatus.ACTIVE,
    nextAction: 'Draft BNI follow-up sequence',
    areaOfLife: 'Work',
    lastActive: new Date().toISOString(),
    milestones: [
      { id: 'm1', projectId: 'proj1', title: 'Target List Built', sequence: 1, isCompleted: true },
      { id: 'm2', projectId: 'proj1', title: 'Outreach Script Defined', sequence: 2, isCompleted: false },
      { id: 'm3', projectId: 'proj1', title: 'First 5 Meetings Held', sequence: 3, isCompleted: false }
    ]
  }
];

export const useStore = () => {
  const [phases, setPhases] = useState<Phase[]>(INITIAL_PHASES);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [momentumLog, setMomentumLog] = useState<MomentumLog[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  
  const activePhase = useMemo(() => phases.find(p => p.status === PhaseStatus.ACTIVE), [phases]);

  const logActivity = useCallback((type: string, phaseId?: string, projectId?: string) => {
    setActivityLog(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      actionType: type,
      linkedPhaseId: phaseId,
      linkedProjectId: projectId,
      createdAt: new Date().toISOString()
    }, ...prev]);
  }, []);

  const addMomentum = useCallback((type: string, points: number, desc: string) => {
    setMomentumLog(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      actionType: type,
      points,
      description: desc,
      createdAt: new Date().toISOString()
    }, ...prev]);
  }, []);

  const activeProjectsCount = useMemo(() => projects.filter(p => p.status === ProjectStatus.ACTIVE).length, [projects]);

  const toggleProjectStatus = useCallback((projectId: string, targetStatus?: ProjectStatus) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const nextStatus = targetStatus || (p.status === ProjectStatus.ACTIVE ? ProjectStatus.PARKED : ProjectStatus.ACTIVE);
        if (nextStatus === ProjectStatus.ACTIVE && activeProjectsCount >= 3 && p.status !== ProjectStatus.ACTIVE) {
          return p; // Blocked by UI modal usually
        }
        if (nextStatus === ProjectStatus.COMPLETE) {
          addMomentum('project_completed', 8, `Project completed: ${p.name}`);
        }
        return { ...p, status: nextStatus, lastActive: new Date().toISOString() };
      }
      return p;
    }));
    logActivity('project_status_change', activePhase?.id, projectId);
  }, [activeProjectsCount, addMomentum, activePhase, logActivity]);

  const addCapture = useCallback((text: string, source: any = 'text') => {
    const newCapture: Capture = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      source,
      capturedAt: new Date().toISOString(),
      importance: 'unclassified',
      status: 'unprocessed'
    };
    setCaptures(prev => [newCapture, ...prev]);
  }, []);

  const processCapture = useCallback((id: string, importance: 'important' | 'interesting') => {
    setCaptures(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = importance === 'interesting' ? 'parked' : 'absorbed';
        if (nextStatus === 'absorbed') addMomentum('capture_absorbed', 3, `Capture absorbed: ${c.text.substring(0, 30)}`);
        return { ...c, importance, status: nextStatus as any };
      }
      return c;
    }));
    logActivity('capture_processed', activePhase?.id);
  }, [addMomentum, activePhase, logActivity]);

  const markBlocked = useCallback((projectId: string, reason: StallReason) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, status: ProjectStatus.BLOCKED, stallReason: reason, blockedAt: new Date().toISOString() };
      }
      return p;
    }));
    logActivity('project_blocked', activePhase?.id, projectId);
  }, [activePhase, logActivity]);

  const resolveStall = useCallback((projectId: string) => {
    const p = projects.find(proj => proj.id === projectId);
    if (p) {
      setProjects(prev => prev.map(proj => {
        if (proj.id === projectId) {
          return { ...proj, status: ProjectStatus.ACTIVE, stallReason: undefined, blockedAt: undefined };
        }
        return proj;
      }));
      addMomentum('stall_resolved', 4, `Unstalled: ${p.name}`);
      logActivity('stall_resolved', activePhase?.id, projectId);
    }
  }, [projects, activePhase, addMomentum, logActivity]);

  // Compass Logic
  const compass = useMemo((): CompassState => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentActions = activityLog.filter(a => new Date(a.createdAt) >= sevenDaysAgo);
    const linkedToPhase = recentActions.filter(a => a.linkedPhaseId === activePhase?.id);
    const alignmentVal = recentActions.length > 0 ? (linkedToPhase.length / recentActions.length) * 100 : 100;

    let alignment: 'Aligned' | 'Drifting' | 'Off-Track' = 'Aligned';
    if (alignmentVal < 40) alignment = 'Off-Track';
    else if (alignmentVal < 70) alignment = 'Drifting';

    const recentMilestones = activityLog.filter(a => a.actionType === 'milestone_completed' && new Date(a.createdAt) >= sevenDaysAgo);
    const recentStallsResolved = activityLog.filter(a => a.actionType === 'stall_resolved' && new Date(a.createdAt) >= sevenDaysAgo);
    
    let momentum: 'Flowing' | 'Slow' | 'Stuck' = 'Stuck';
    if (recentMilestones.length >= 3 || recentStallsResolved.length >= 2) momentum = 'Flowing';
    else if (recentMilestones.length >= 1 || recentStallsResolved.length >= 1) momentum = 'Slow';

    const unprocessedCaptures = captures.filter(c => c.status === 'unprocessed').length;
    const projectsMissingNextAction = projects.filter(p => p.status === ProjectStatus.ACTIVE && !p.nextAction).length;
    const chaosTotal = unprocessedCaptures + projectsMissingNextAction;

    let chaos: 'Light' | 'Moderate' | 'Heavy' = 'Light';
    if (chaosTotal >= 6) chaos = 'Heavy';
    else if (chaosTotal >= 3) chaos = 'Moderate';

    const blockedProjects = projects.filter(p => p.status === ProjectStatus.BLOCKED);
    const hotStalls = blockedProjects.filter(p => {
      if (!p.blockedAt) return false;
      const blockedDate = new Date(p.blockedAt);
      return (now.getTime() - blockedDate.getTime()) > 14 * 24 * 60 * 60 * 1000;
    });

    let stallHeat: 'Cool' | 'Warm' | 'Hot' = 'Cool';
    if (blockedProjects.length >= 3 || hotStalls.length > 0) stallHeat = 'Hot';
    else if (blockedProjects.length > 0) stallHeat = 'Warm';

    return { alignment, momentum, chaos, stallHeat };
  }, [activityLog, activePhase, captures, projects]);

  const weeklyMomentum = useMemo(() => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return momentumLog
      .filter(l => new Date(l.createdAt) >= sevenDaysAgo)
      .reduce((sum, l) => sum + l.points, 0);
  }, [momentumLog]);

  return {
    phases,
    activePhase,
    projects,
    captures,
    decisions,
    insights,
    compass,
    momentumLog,
    weeklyMomentum,
    activeProjectsCount,
    addCapture,
    processCapture,
    toggleProjectStatus,
    markBlocked,
    resolveStall,
    updateCompass: (key: any, val: any) => {}, // Mocked for tuning screen compatibility
    setCompass: (val: any) => {},
    setProjects,
    setPhases
  };
};
