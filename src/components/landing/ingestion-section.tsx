'use client';

import React from 'react';
import { FileText, Mail } from 'lucide-react';
import type { CSSVarStyle } from '@/types';
import styles from './ingestion-section.module.css';

export default function IngestionSection() {
  return (
    <section id="ingestion" className="scroll-snap-section py-32 border-t border-white/5 bg-[#020202]">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
        <div className="flex-1 text-left">
          <span className="inline-block px-3 py-1 rounded-md bg-accent-violet-dim text-accent-violet font-mono text-[10px] uppercase tracking-widest mb-4">Phase 1: Multi-Stream Ingestion</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">From Chaos <br/> to Control</h2>
          <p className="text-lg text-slate-400 mb-8 leading-relaxed">
            Construction data lives in fragmented silos: thousands of emails, field notes, phone calls, and spreadsheets. Envision OS captures it all simultaneously.
          </p>
          <div className="space-y-4">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-accent-violet/50 transition-colors">
                  <div className="size-10 rounded-xl bg-accent-violet-dim flex items-center justify-center text-accent-violet flex-shrink-0"><Mail className="size-5" /></div>
                  <div>
                      <h4 className="font-bold mb-1">Communication Mining</h4>
                      <p className="text-sm text-slate-500">Unstructured communication is parsed and indexed in real-time.</p>
                  </div>
              </div>
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-accent-violet/50 transition-colors">
                  <div className="size-10 rounded-xl bg-accent-violet-dim flex items-center justify-center text-accent-violet flex-shrink-0"><FileText className="size-5" /></div>
                  <div>
                      <h4 className="font-bold mb-1">Document Normalization</h4>
                      <p className="text-sm text-slate-500">PDFs and spreadsheets are converted into queryable structural truth.</p>
                  </div>
              </div>
          </div>
        </div>
        <div className="flex-1 w-full max-w-2xl">
            <div className={`${styles['ingestion-viz']} w-full`}>
              <div className={styles['ingest-engine-core']}>
                <div className={styles['engine-box']}>
                  <div className="css-icon-parser" aria-label="Parser Interface">{'{ }'}</div>
                  <span className="text-[10px] font-black tracking-[0.2em] mt-3 text-accent-violet">AUDIT CORE</span>
                  <div className={styles['engine-laser']}></div>
                </div>
              </div>
              <div className={styles['organized-stream']}>
                  <div className={`${styles['json-node']} ${styles['data-out-stream']}`} style={{ '--d': '0s' } as CSSVarStyle}>{'{ "job": 402, "delta": "DRYWALL" }'}</div>
                  <div className={`${styles['json-node']} ${styles['data-out-stream']}`} style={{ '--d': '1s' } as CSSVarStyle}>{'{ "rfi": 118, "status": "DRAFT" }'}</div>
                  <div className={`${styles['json-node']} ${styles['data-out-stream']}`} style={{ '--d': '2s' } as CSSVarStyle}>{'{ "permit": "F1", "status": "PASS" }'}</div>
              </div>
              {[...Array(24)].map((_, i) => {
                  const types = ['EMAIL', 'TEXT', 'DOC', 'MSG', 'CALL'];
                  const type = types[i % types.length];
                  return (
                    <div key={i} className={styles['flow-item']} style={{
                        '--d': `${i * 0.12}s`,
                        '--y': `${20 + (i * 15)%60}%`,
                        '--r': `${-25 + (i*12)%50}deg`
                    } as CSSVarStyle}>
                        <div className={styles['flurry-item']}>
                            <div className={styles['skeleton']}></div>
                            <div className={`${styles['skeleton']} w-3/4`}></div>
                            <div className={styles['icon-box']}>{type}</div>
                        </div>
                    </div>
                  );
              })}
            </div>
        </div>
      </div>
    </section>
  );
}
