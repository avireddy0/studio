'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Zap } from 'lucide-react';
import {
  contextSignals,
  contextReasoningSteps,
  contextStatusByStage,
  contextSequence,
} from '@/lib/constants';
import styles from './context-section.module.css';

export default function ContextSection() {
  const [contextSequenceIndex, setContextSequenceIndex] = useState(0);
  const contextStage = contextSequence[contextSequenceIndex] ?? 0;

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setContextSequenceIndex((prev) => (prev + 1) % contextSequence.length);
    }, 1400);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section id="context" className="scroll-snap-section py-32 border-t border-white/5 bg-[#020202]">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
        <div className="flex-1 order-2 lg:order-1 w-full max-w-2xl">
            <div className={`${styles['context-intelligence-viz']} w-full`} aria-live="polite">
              <div className={styles['context-signal-column']}>
                {contextSignals.map((signal) => (
                  <article
                    key={signal.id}
                    className={`${styles['context-signal-card']} ${
                      contextStage >= signal.revealAt ? styles['is-visible'] : ''
                    }`}
                  >
                    <div className={styles['context-signal-head']}>
                      <span className={styles['context-signal-channel']}>{signal.channel}</span>
                      <span className={styles['context-signal-strength']}>{signal.strength}</span>
                    </div>
                    <p className={styles['context-signal-quote']}>&quot;{signal.quote}&quot;</p>
                    <p className={styles['context-signal-meta']}>{signal.detail}</p>
                  </article>
                ))}
              </div>

              <div className={styles['context-engine-column']}>
                <div className={`${styles['context-engine-core']} ${contextStage >= 3 ? styles['is-hot'] : ''}`}>
                  <Zap className="size-7" />
                </div>
                <p className={styles['context-engine-status']}>{contextStatusByStage[contextStage]}</p>
                <div className={styles['context-progress-track']}>
                  <div
                    className={styles['context-progress-fill']}
                    style={{ width: `${Math.min(100, contextStage * 25)}%` }}
                  />
                </div>
                <ol className={styles['context-reasoning-list']}>
                  {contextReasoningSteps.map((step, index) => (
                    <li
                      key={step.id}
                      className={`${styles['context-reasoning-item']} ${
                        contextStage >= step.revealAt ? styles['is-done'] : ''
                      }`}
                    >
                      <span className={styles['context-reasoning-index']}>{index + 1}</span>
                      <div>
                        <p className={styles['context-reasoning-title']}>{step.title}</p>
                        <p className={styles['context-reasoning-detail']}>{step.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className={`${styles['context-control-column']} ${contextStage >= 4 ? styles['is-visible'] : ''}`}>
                <div className={styles['truth-card']}>
                  <div className={styles['truth-badge']}>
                    <ShieldCheck className="size-4" />
                    <span>CONTEXT VERIFIED</span>
                  </div>
                  <h4 className="text-2xl font-bold mb-6">Lobby Finish Upgrade</h4>
                  <div className={styles['context-control-rows']}>
                    <div className={styles['context-control-row']}>
                      <span className={styles['context-control-label']}>Status</span>
                      <span className={`${styles['context-control-value']} text-emerald-400`}>Authorized by Owner</span>
                    </div>
                    <div className={styles['context-control-row']}>
                      <span className={styles['context-control-label']}>Schedule Risk</span>
                      <span className={styles['context-control-value']}>+4 weeks if single-source marble</span>
                    </div>
                    <div className={styles['context-control-row']}>
                      <span className={styles['context-control-label']}>Recommended Control</span>
                      <span className={styles['context-control-value']}>Issue alternate supplier RFI now</span>
                    </div>
                    <div className={styles['context-control-row']}>
                      <span className={styles['context-control-label']}>Confidence</span>
                      <span className={styles['context-control-value']}>99.2%</span>
                    </div>
                  </div>
                  <p className={styles['context-control-footnote']}>
                    Investor translation: premium finish upside is preserved while execution risk stays controlled.
                  </p>
                </div>
              </div>
            </div>
        </div>
        <div className="flex-1 order-1 lg:order-2 text-left">
          <span className="inline-block px-3 py-1 rounded-md bg-accent-blue-dim text-accent-blue font-mono text-[10px] uppercase tracking-widest mb-4">Phase 2: Project Intelligence</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Context is <br/> Everything.</h2>
          <p className="text-lg text-slate-400 mb-8 leading-relaxed">
            A budget variance is just a number until you have the context. Envision OS tags project reality by cross-referencing qualitative signals with financial data.
          </p>
          <p className="text-lg text-slate-400 leading-relaxed">
            Our <strong>Context Fusion Engine</strong> verifies project decisions through thousands of multi-platform signals to eliminate operational blind spots.
          </p>
        </div>
      </div>
    </section>
  );
}
