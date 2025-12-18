
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { ChatMessage } from '../types';

interface StewardChatProps {
  onBack: () => void;
}

// Audio Utilities as per guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export const StewardChat: React.FC<StewardChatProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "I've pulled up your notes on the home renovation. It sounds like you're feeling overwhelmed by the timeline. Shall we break down the kitchen phase?",
      timestamp: '10:23 AM'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const endRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const outputAudioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (sessionRef.current) sessionRef.current.close();
      sourcesRef.current.forEach(s => s.stop());
    };
  }, []);

  const startLiveSession = async () => {
    if (isLiveActive) {
      if (sessionRef.current) sessionRef.current.close();
      setIsLiveActive(false);
      setIsListening(false);
      return;
    }

    setIsLoading(true);
    setIsLiveActive(true);
    setIsListening(true);

    try {
      // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputAudioContextRef.current = outputAudioContext;
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsLoading(false);
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64EncodedAudioString) {
              const ctx = outputAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64EncodedAudioString), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }

            if (message.serverContent?.outputTranscription) {
                // Could stream transcription here if needed
            }
          },
          onerror: (e) => {
            console.error('Live Error:', e);
            setIsLiveActive(false);
            setIsListening(false);
          },
          onclose: () => {
            setIsLiveActive(false);
            setIsListening(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          systemInstruction: 'You are Steward, a supportive and strategic AI life partner. You are in a voice conversation. Be natural, concise, and focused on momentum.'
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsLiveActive(false);
      setIsLoading(false);
      setIsListening(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Standard Chat logic remains for text fallback
    try {
        // Mocking for text chat to keep it responsive in this view
        setTimeout(() => {
            const assistantMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I've acknowledged your update. Let's see how this affects our focus for the week.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, assistantMsg]);
            setIsLoading(false);
        }, 1000);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark animate-fade-in overflow-hidden">
      <header className="flex-none pt-safe-top z-10 bg-background-light dark:bg-background-dark border-b border-slate-100 dark:border-slate-800">
        <div className="px-4 pt-4 pb-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full text-slate-800 dark:text-slate-200 hover:bg-black/5 transition-colors">
              <span className="material-symbols-outlined">arrow_back_ios_new</span>
            </button>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Steward</h1>
            <div className="flex items-center gap-2">
                {isLiveActive && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 animate-pulse border border-red-100">
                        <span className="material-symbols-outlined text-sm">radio_button_checked</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Live</span>
                    </div>
                )}
                <button className="flex items-center justify-center h-9 px-3 gap-1.5 rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-transparent text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                    <span>Local</span>
                </button>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all border ${
                isLiveActive ? 'bg-primary/20 border-primary' : 'bg-primary/10 border-primary/20'
            }`}>
              <div className={`w-2 h-2 rounded-full bg-primary ${isLiveActive ? 'animate-ping' : 'animate-pulse'}`}></div>
              <span className="text-xs font-semibold text-primary/90 uppercase tracking-wide">
                {isLiveActive ? 'Live Audio Active' : 'Reflect Mode'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 space-y-6 no-scrollbar pb-32 pt-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : ''} animate-fade-in-up`}>
            {msg.role === 'assistant' && (
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-white/20">
                <span className="material-symbols-outlined text-primary text-xl">smart_toy</span>
              </div>
            )}
            <div className={`flex flex-col gap-1 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <span className="text-[11px] text-slate-400 font-medium px-2">{msg.role === 'user' ? 'Me' : 'Steward'}</span>
              <div className={`p-4 rounded-2xl shadow-sm text-[15px] leading-relaxed border ${
                msg.role === 'user' 
                  ? 'bg-primary/20 text-slate-900 dark:text-white border-primary/10 rounded-tr-sm' 
                  : 'bg-white dark:bg-[#1f2937] text-slate-700 dark:text-slate-200 border-slate-100 dark:border-slate-800 rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
            {msg.role === 'user' && (
               <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 border border-white/20">
                <span className="material-symbols-outlined text-slate-500 text-xl">person</span>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-end gap-3 animate-pulse">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">smart_toy</span>
            </div>
            <div className="bg-white dark:bg-[#1f2937] px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </main>

      <footer className="flex-none bg-background-light dark:bg-background-dark pb-8 pt-2 px-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {['What is my focus?', 'Daily reset', 'Garden updates'].map((suggestion, i) => (
            <button 
              key={i}
              onClick={() => setInput(suggestion)}
              className="shrink-0 px-4 py-2 bg-white dark:bg-[#1f2937] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm hover:border-primary transition-all active:scale-95">
              {suggestion}
            </button>
          ))}
        </div>
        <div className="flex items-end gap-3 relative">
          <div className="flex-1 bg-white dark:bg-[#1f2937] rounded-[24px] shadow-lg border border-slate-100 dark:border-slate-700 flex items-center p-1.5 pl-5 focus-within:ring-2 focus-within:ring-primary/30">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="bg-transparent border-none outline-none flex-1 py-3 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 font-medium" 
              placeholder={isLiveActive ? "Listening..." : "Type a message..."} 
            />
            <button className="p-2 text-slate-400 hover:text-primary transition-colors mr-1">
              <span className="material-symbols-outlined text-[22px]">attach_file</span>
            </button>
          </div>
          <button 
            onClick={startLiveSession}
            className={`flex-none w-[56px] h-[56px] text-white rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95 ${
                isLiveActive ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-primary hover:bg-primary-dark'
            }`}>
            <span className="material-symbols-outlined text-[28px]">{isLiveActive ? 'stop' : 'mic'}</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
