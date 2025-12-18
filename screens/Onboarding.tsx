
import React, { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Life happens in Phases.",
      desc: "Stop trying to do everything at once. A Phase helps you group long-term projects and quiet the noise.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAw27rJCPcM7964qnmkZTsgN1CiYZHWMpgcYilpt51I0pGGfbY_iN2IRmDPQ0Dn4uHjE9IZGXTq0hjJygzDFcFfL38PXvFOY_q2p8XBlzrJOf1_v7lvBho1WFInJcgzSJr7p-FhDoZho_AihNxUNCiiIi8xP5Jzjs2-WqtIran_jXUHcwqGLblDmVrVwzwp_yum-HaR5C6BYkNNh2_9hA1Qg4BG96rmFK17ZVLv9czkkuQzI01K4nJrZDSjct14WbAayHcr4QkrQn8"
    },
    {
      title: "Meet Your Phase Compass",
      desc: "A qualitative check-in to navigate your current season without the guilt.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcdMCKxtOALBykxNnnCUgwiiu_rR4xAUv3KPKjh723Fqe9M5FtFP61puzoeK4Ov87U2U_7JpFKDmXkDad6AdGzIG945bVm3RohDJ4Hy1VgaEMEhURcIRuBKIrynspBx_41kX-s9iiVRHpJWJnxNpXYhBOQ78gThOqk1K13qqCJgbWh2xZ2HRbwPKMSSyE2yzkugQKnaFHbNf5d7DNWJTkdYsT415P2vh9Avvu5J_QGEdy82ZQ6eAIjnff-1nzdZDqsFGghNcTH0As"
    }
  ];

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else onComplete();
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark p-6 justify-between animate-fade-in">
      <div className="flex justify-end pt-4">
        <button onClick={onComplete} className="text-slate-400 font-bold text-sm">Skip</button>
      </div>

      <div className="flex flex-col items-center flex-grow justify-center gap-8">
        <div className="w-full aspect-[4/3] rounded-2xl bg-slate-100 overflow-hidden relative">
          <img src={steps[step].img} alt="intro" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background-light/50 to-transparent"></div>
        </div>

        <div className="text-center flex flex-col gap-4">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">{steps[step].title}</h1>
          <p className="text-slate-500 text-lg font-medium leading-relaxed">{steps[step].desc}</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 pb-8">
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all ${step === i ? 'w-8 bg-primary' : 'w-2 bg-slate-300'}`}></div>
          ))}
        </div>
        <button 
          onClick={next}
          className="w-full h-14 bg-primary text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all">
          <span>{step === steps.length - 1 ? 'Let\'s Begin' : 'Next'}</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
