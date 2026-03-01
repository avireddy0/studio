'use client';

import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { MousePointerClick } from 'lucide-react';
import type { ChatMessage, Scenarios } from '@/types';
import { initialSuggestions, scenarios as scenarioData } from '@/lib/constants';


export default function CommandCenter() {
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const [suggestedReplies, setSuggestedReplies] = useState(initialSuggestions);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const isRunning = useRef(false);
  const hasBootstrappedMessage = useRef(false);

  const scenarios = useMemo<Scenarios>(() => scenarioData, []);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const scrollToBottom = useCallback(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  const addMessage = useCallback((html: string, type: 'user' | 'system', meta = '') => {
    setMessages(prev => [...prev, {html, type, meta}])
  }, []);

  const addTyping = useCallback(() => {
    const id = 'typing-' + Date.now();
    setMessages(prev => [...prev, {id, type: 'typing'}]);
    return id;
  }, []);

  const runSimulation = useCallback(
    async (id: keyof typeof scenarios) => {
      if (isRunning.current) return;
      isRunning.current = true;
      setSuggestedReplies([]);

      const data = scenarios[id];
      addMessage(data.query, 'user');
      await sleep(200);
      scrollToBottom();

      const typingId = addTyping();
      scrollToBottom();

      await sleep(1000);
      setMessages(prev => prev.filter(m => m.type !== 'typing' || m.id !== typingId));

      addMessage(
        `${data.answer}<br><br>${data.metric}`,
        'system',
        data.meta
      );

      scrollToBottom();
      await sleep(500);

      if (data.followUp) {
          setSuggestedReplies(data.followUp);
      }

      isRunning.current = false;
    },
    [addMessage, addTyping, scenarios, scrollToBottom]
  );

  useEffect(() => {
      if (hasBootstrappedMessage.current) {
        return;
      }

      hasBootstrappedMessage.current = true;
      addMessage(
          `<strong>Envision OS is online.</strong><br/><span class="text-slate-500 text-xs md:text-sm">Continuous Audit Engine: Active. Monitoring 23 data streams.</span>`,
          'system'
      );
  }, [addMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom, suggestedReplies]);

  return (
    <section id="command-center" className="scroll-snap-section py-32 border-t border-white/5 bg-[#020202]">
      <div className="container mx-auto px-6 text-center mb-20">
        <span className="inline-block px-3 py-1 rounded-md bg-accent-emerald-dim text-accent-emerald font-mono text-[10px] uppercase tracking-widest mb-4">Phase 0: The Command Center</span>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Command Center</h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Experience the multimodal AI that monitors 23 software platforms and protects project margins in real-time.
        </p>
      </div>
      <div className="container mx-auto px-6 flex items-center justify-center">
        <div className="w-full max-w-5xl h-[700px] glass-card p-1 shadow-2xl overflow-hidden group">
          <div className="bg-[#121212] rounded-[31px] border border-white/5 flex h-full flex-col overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-emerald animate-pulse"></div>
                  <div className="font-bold text-sm tracking-tight">ENVISION OS COMMAND</div>
              </div>
              <div className="font-mono text-[11px] text-slate-500 bg-white/5 px-3 py-1 rounded-full uppercase tracking-tighter">Live Audit Stream</div>
            </div>

            {/* iMessage Inspired Chat Interface */}
            <div className="flex-1 p-6 md:p-12 overflow-y-auto flex flex-col gap-4 bg-[#0a0a0a]" ref={chatBodyRef}>
              {messages.map((msg, index) => {
                  if (msg.type === 'typing') {
                    return (
                        <div key={msg.id} className="flex justify-start items-end gap-2 mb-2">
                            <div className="bg-[#e9e9eb] px-4 py-3 rounded-2xl rounded-bl-sm">
                              <div className="typing-indicator flex gap-1">
                                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                              </div>
                            </div>
                        </div>
                    );
                  }

                  const isUser = msg.type === 'user';
                  return (
                      <div key={index} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}>
                          <div className={`max-w-[85%] px-5 py-3 text-sm md:text-base ${isUser ? 'bg-[#007AFF] text-white rounded-3xl rounded-br-sm' : 'bg-[#e9e9eb] text-black rounded-3xl rounded-bl-sm'} shadow-sm`}>
                              <div dangerouslySetInnerHTML={{ __html: msg.html }} />
                              {msg.meta && <div className="mt-2 text-[10px] opacity-60 font-mono uppercase tracking-tighter border-t border-black/10 pt-1">{msg.meta}</div>}
                          </div>
                      </div>
                  );
              })}

              {/* Pick an Option Highlight */}
              {suggestedReplies.length > 0 && (
                <div className="mt-12 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-700">
                    <div className="flex items-center gap-2 px-6 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold animate-pulse">
                      <MousePointerClick className="size-4" />
                      <span>PICK AN OPTION TO START SIMULATION</span>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {suggestedReplies.map((reply, index) => (
                            <button
                                key={index}
                                className="px-8 py-4 bg-white text-black hover:bg-primary hover:text-white rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_4px_15px_rgba(255,255,255,0.1)] border border-transparent"
                                onClick={() => runSimulation(reply.scenarioId)}
                                disabled={isRunning.current}
                            >
                                {reply.text}
                            </button>
                        ))}
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
