'use client';

import React, { useEffect, useCallback, useMemo, useState } from 'react';
import type { ArchitectureLayer, CSSVarStyle } from '@/types';
import { architectureLayers } from '@/lib/constants';
import styles from './intelligence-layer.module.css';

export default function IntelligenceLayer() {
  const architectureLayerCycle = useMemo(
    () => architectureLayers.map((layer) => layer.id),
    []
  );
  const [activeArchitectureLayerId, setActiveArchitectureLayerId] =
    useState<ArchitectureLayer['id']>('context');
  const [isArchitectureAutoplay, setIsArchitectureAutoplay] = useState(true);

  const activeArchitectureLayer = useMemo(
    () =>
      architectureLayers.find((layer) => layer.id === activeArchitectureLayerId) ??
      architectureLayers[1],
    [activeArchitectureLayerId]
  );

  const architectureContextLinks = useMemo(
    () =>
      architectureLayers
        .filter((layer) => layer.id !== 'context' && layer.position)
        .map((layer) => {
          const x = layer.position?.x ?? 50;
          const y = layer.position?.y ?? 50;
          const dx = x - 50;
          const dy = y - 50;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

          return {
            id: layer.id,
            tone: layer.tone,
            style: {
              '--tone': layer.tone,
              '--len': `${length}%`,
              '--angle': `${angle}deg`,
            } as CSSVarStyle,
          };
        }),
    []
  );

  const spotlightArchitectureLayer = useCallback((layerId: ArchitectureLayer['id']) => {
    setActiveArchitectureLayerId(layerId);
    setIsArchitectureAutoplay(false);
  }, []);

  const resumeArchitectureAutoplay = useCallback(() => {
    setIsArchitectureAutoplay(true);
  }, []);

  useEffect(() => {
    if (!isArchitectureAutoplay) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveArchitectureLayerId((prev) => {
        const currentIndex = architectureLayerCycle.indexOf(prev);
        const safeIndex = currentIndex === -1 ? 0 : currentIndex;
        const nextIndex = (safeIndex + 1) % architectureLayerCycle.length;
        return architectureLayerCycle[nextIndex] ?? 'context';
      });
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [architectureLayerCycle, isArchitectureAutoplay]);

  return (
    <section id="architecture" className="scroll-snap-section py-32 border-t border-white/5 bg-[#020202]">
      <div className="container mx-auto px-6 text-center mb-20">
        <span className="inline-block px-3 py-1 rounded-md bg-accent-violet-dim text-accent-violet font-mono text-[10px] uppercase tracking-widest mb-4">Phase 3: The Intelligence Layer</span>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Intelligence Layer</h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Our multi-tiered architecture handles massive construction telemetry, turning high-latency silos into a singular source of real-time intelligence.
        </p>
      </div>
      <div className="container mx-auto px-6">
          <div className={styles['layer-impact-showcase']} onMouseLeave={resumeArchitectureAutoplay}>
            <div
              className={styles['layer-impact-canvas']}
              role="img"
              aria-label="Interactive map showing the context layer amplifying normalized data, reasoning, and execution layers."
            >
              {architectureContextLinks.map((link) => (
                <div
                  key={link.id}
                  className={`${styles['layer-link']} ${
                    activeArchitectureLayerId === 'context' || activeArchitectureLayerId === link.id
                      ? styles['is-active']
                      : ''
                  }`}
                  style={link.style}
                >
                  <span className={styles['layer-link-dot']}></span>
                  <span className={`${styles['layer-link-dot']} ${styles['delay']}`}></span>
                </div>
              ))}

              {architectureLayers.map((layer) => {
                const Icon = layer.icon;
                const isActive = activeArchitectureLayerId === layer.id;
                const isContextLayer = layer.id === 'context';

                return (
                  <button
                    key={layer.id}
                    type="button"
                    onMouseEnter={() => spotlightArchitectureLayer(layer.id)}
                    onFocus={() => spotlightArchitectureLayer(layer.id)}
                    onClick={() => spotlightArchitectureLayer(layer.id)}
                    className={`${styles['layer-node']} ${
                      isContextLayer ? styles['layer-node-context'] : styles['layer-node-orbit']
                    } ${isActive ? styles['is-active'] : ''}`}
                    style={
                      {
                        '--x': layer.position ? `${layer.position.x}%` : '50%',
                        '--y': layer.position ? `${layer.position.y}%` : '50%',
                        '--tone': layer.tone,
                      } as CSSVarStyle
                    }
                  >
                    <span className={styles['layer-node-icon']}>
                      <Icon className="size-5" />
                    </span>
                    <span className={styles['layer-node-level']}>{layer.level}</span>
                    <span className={styles['layer-node-title']}>{layer.title}</span>
                    <span className={styles['layer-node-stat']}>{layer.metric}</span>
                  </button>
                );
              })}

              <p className={styles['layer-canvas-caption']}>
                Hover or tap layers to trace how the Context Layer compounds speed, confidence,
                and margin protection.
              </p>
            </div>

            <div className={styles['layer-impact-panel']}>
              <div className={styles['layer-panel-header']}>
                <span className={styles['layer-panel-kicker']}>Live Impact Narrative</span>
                <span className={`${styles['layer-autoplay-pill']} ${isArchitectureAutoplay ? styles['is-live'] : ''}`}>
                  {isArchitectureAutoplay ? 'Autoplay On' : 'Autoplay Paused'}
                </span>
              </div>

              <article className={styles['layer-insight-card']}>
                <div className={styles['layer-insight-top']}>
                  <span className={styles['layer-insight-level']}>{activeArchitectureLayer.level}</span>
                  <div className={styles['layer-insight-metric']}>
                    <span className={styles['layer-insight-metric-value']}>{activeArchitectureLayer.metric}</span>
                    <span className={styles['layer-insight-metric-label']}>{activeArchitectureLayer.metricLabel}</span>
                  </div>
                </div>
                <h3 className={styles['layer-insight-title']}>{activeArchitectureLayer.title}</h3>
                <p className={styles['layer-insight-subtitle']}>{activeArchitectureLayer.subtitle}</p>
                <div className={styles['layer-impact-block']}>
                  <h4>Without Context Layer</h4>
                  <p>{activeArchitectureLayer.standaloneImpact}</p>
                </div>
                <div className={`${styles['layer-impact-block']} ${styles['context-boost']}`}>
                  <h4>With Context Layer</h4>
                  <p>{activeArchitectureLayer.contextImpact}</p>
                </div>
              </article>

              <div className={styles['layer-selector-list']}>
                {architectureLayers.map((layer) => (
                  <button
                    key={layer.id}
                    type="button"
                    className={`${styles['layer-selector']} ${
                      activeArchitectureLayerId === layer.id ? styles['is-active'] : ''
                    }`}
                    onMouseEnter={() => spotlightArchitectureLayer(layer.id)}
                    onFocus={() => spotlightArchitectureLayer(layer.id)}
                    onClick={() => spotlightArchitectureLayer(layer.id)}
                  >
                    <span className={styles['layer-selector-level']}>{layer.level}</span>
                    <span className={styles['layer-selector-title']}>{layer.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
      </div>
    </section>
  );
}
