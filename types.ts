
export enum ProjectStatus {
  ACTIVE = 'active',
  PARKED = 'parked',
  BLOCKED = 'blocked',
  COMPLETE = 'complete',
  // Fix: Added missing ARCHIVED status for project filtering
  ARCHIVED = 'archived'
}

export enum PhaseStatus {
  ACTIVE = 'active',
  CLOSING = 'closing',
  ARCHIVED = 'archived',
  // Fix: Added missing PLANNED status for phase management
  PLANNED = 'planned'
}

export enum StallReason {
  WAITING = 'waiting_on_someone',
  CLARITY = 'missing_clarity',
  DECISION = 'needs_decision',
  TOO_BIG = 'too_big',
  ENERGY = 'energy_mismatch',
  TOOLING = 'tooling_dependency',
  RELEVANCE = 'low_phase_relevance'
}

export const STALL_QUESTS: Record<StallReason, string> = {
  [StallReason.WAITING]: "Send a follow-up message to the person you're waiting on",
  [StallReason.CLARITY]: "Write down the ONE question that, if answered, would unblock this",
  [StallReason.DECISION]: "List your 2-3 options, pick one, and log it as a Decision",
  [StallReason.TOO_BIG]: "Break this into 3 concrete steps and pick the smallest one",
  [StallReason.ENERGY]: "Schedule a 30-min block for this during your peak energy time",
  [StallReason.TOOLING]: "Identify exactly what tool/resource you need and how to get it",
  [StallReason.RELEVANCE]: "Consider: should this be parked until a future phase?"
};

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  sequence: number;
  isCompleted: boolean;
  completedAt?: string;
}

export interface Decision {
  id: string;
  statement: string;
  context: string;
  tradeoffs?: string;
  projectId?: string;
  phaseId: string;
  reversibility?: 'easy' | 'hard';
  createdAt: string;
}

export interface Insight {
  id: string;
  statement: string;
  source: 'reflection' | 'ai' | 'experience';
  implication?: string;
  phaseId: string;
  createdAt: string;
}

export interface Phase {
  id: string;
  name: string;
  theme: string;
  successCriteria: string;
  status: PhaseStatus;
  startDate: string;
  progress: number;
  description: string;
  timeHorizon?: string;
}

export interface Project {
  id: string;
  phaseId: string;
  name: string;
  purpose: string;
  status: ProjectStatus;
  nextAction: string;
  stallReason?: StallReason;
  blockedAt?: string;
  areaOfLife: string;
  lastActive: string;
  milestones: Milestone[];
}

export interface Capture {
  id: string;
  text: string;
  source: 'text' | 'voice' | 'screenshot' | 'forwarded';
  capturedAt: string;
  importance: 'important' | 'interesting' | 'unclassified';
  status: 'unprocessed' | 'absorbed' | 'parked';
  associatedProjectId?: string;
  extractedNextStep?: string;
}

export interface MomentumLog {
  id: string;
  actionType: string;
  points: number;
  description: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  actionType: string;
  linkedPhaseId?: string;
  linkedProjectId?: string;
  createdAt: string;
}

export interface CompassState {
  alignment: 'Aligned' | 'Drifting' | 'Off-Track';
  momentum: 'Flowing' | 'Slow' | 'Stuck';
  chaos: 'Light' | 'Moderate' | 'Heavy';
  stallHeat: 'Cool' | 'Warm' | 'Hot';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
