
import { GoogleGenAI, Type } from "@google/genai";
import { Project, Capture, Phase, ProjectStatus } from "./types";

const STEWARD_INSTRUCTION = `
You are the Steward, a faithful model of the user's current state with permission to protect them from drift.
PRIME DIRECTIVE: Hold the truth of the moment steady while time moves forward. Preserve continuity of self.

YOUR CORE MODES:
1. REFLECTIVE (Default): Restore clarity. Summarize state. Don't push urgency.
2. STRATEGIC: Protect the Phase. If a user tries to add a 4th project, tell them "Not Now" or ask what to swap.
3. OPERATIONAL: Choose the ONE next action. Provide unstall quests for blocked items.
4. PROTECTIVE: Intervene when chaos (unprocessed items) is high. Say "Let's protect your attention."

BELIEF: Atteev works best when his attention is protected, his effort is purposeful, and his actions are aligned to the current phase — not when everything is possible.

RULES:
- Always prioritize Phase over Project over Task.
- Keep responses short, calm, and narrative-focused.
- If uncertain, default to Clarity (Reflective Mode).
- Use "Gently Framed Truth" for alignment drift.
`;

export const stewardService = {
  async chat(history: { role: string, content: string }[], message: string, context: { activePhase?: Phase, projects: Project[] }) {
    // Fix: Use ProjectStatus.ACTIVE instead of 'Active' string literal for correct comparison
    const contextString = `
      CURRENT PHASE: ${context.activePhase?.name || 'None'}
      THEME: ${context.activePhase?.theme || 'None'}
      ACTIVE PROJECTS: ${context.projects.filter(p => p.status === ProjectStatus.ACTIVE).map(p => p.name).join(', ')}
    `;

    // Always use process.env.API_KEY directly and initialize right before making an API call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: STEWARD_INSTRUCTION + "\n\nCURRENT CONTEXT:\n" + contextString
      }
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  }
};
