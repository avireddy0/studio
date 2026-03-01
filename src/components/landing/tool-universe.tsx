'use client';

import React, { useEffect, useRef } from 'react';
import { toolCategories } from '@/lib/constants';
import styles from './tool-universe.module.css';

export default function ToolUniverse() {
  const tuContainerRef = useRef<HTMLDivElement>(null);
  const tuSceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const tuScene = tuSceneRef.current;
    const orbRadius = isMobile ? 180 : 320;

    if (tuScene) {
      tuScene.innerHTML = '<div class="tu-grid"></div>';

      const hub = document.createElement('div');
      hub.className = 'tu-hub';
      hub.innerHTML = `
        <div class="tu-hub-front">
            <div class="tu-hub-layer" style="transform: translateZ(0px)"></div>
            <div class="tu-hub-layer" style="transform: translateZ(20px)"></div>
            <div class="tu-hub-layer" style="transform: translateZ(40px); border-color: var(--accent-blue); box-shadow: 0 0 50px var(--accent-blue-dim), inset 0 0 30px var(--accent-blue-dim)"></div>
            <div class="tu-billboard-container" style="transform: translateZ(100px)">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)">
                    <div class="tu-billboard" style="border-top-color: var(--accent-blue)">
                        <h3 style="font-size: 1.1rem; font-weight: 800">Envision OS</h3>
                        <p style="color: var(--accent-blue); font-size: 0.7rem; text-transform: uppercase; font-weight: 700">Orchestrator</p>
                    </div>
                </div>
            </div>
        </div>
      `;
      tuScene.appendChild(hub);

      toolCategories.forEach((p, i) => {
          const angle = (i / toolCategories.length) * Math.PI * 2;
          const x = Math.cos(angle) * orbRadius;
          const y = Math.sin(angle) * orbRadius;

          const line = document.createElement('div');
          line.className = 'tu-line';
          line.style.width = `${orbRadius}px`;
          line.style.transform = `rotateZ(${angle}rad)`;
          line.innerHTML = `<div class="tu-pulse" style="background: ${p.color}; box-shadow: 0 0 15px ${p.color}; animation-delay: ${Math.random() * 2}s"></div>`;
          tuScene.appendChild(line);

          const sat = document.createElement('div');
          sat.className = 'tu-sat';
          sat.style.transform = `translate3d(${x}px, ${y}px, 0)`;

          sat.innerHTML = `
            <div class="tu-sat-layer" style="transform: translateZ(0px); border-color: ${p.color}40; background: ${p.color}10"></div>
            <div class="tu-sat-layer" style="transform: translateZ(15px); border-color: ${p.color}80; background: ${p.color}20"></div>
            <div class="tu-sat-layer" style="transform: translateZ(30px); border-color: ${p.color}; background: ${p.color}40; box-shadow: 0 0 30px ${p.color}40"></div>
            <div class="tu-billboard-container" style="transform: translateZ(70px)">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)">
                    <div class="tu-billboard" style="border-top-color: ${p.color}">
                        <h3 style="color: ${p.color}; font-weight: 700">${p.name}</h3>
                        <p style="font-size: 0.65rem; color: var(--text-secondary)">${p.tools} Platforms Syncing</p>
                    </div>
                </div>
            </div>
          `;
          tuScene.appendChild(sat);
      });
    }

    let tuGlobalRotation = 0;
    let tuTargetRotation = 0;
    const tuIsHovered = false;
    let animationFrameId: number;

    function animateTuScene() {
        if (!tuIsHovered) {
            tuTargetRotation += 0.01;
        }
        tuGlobalRotation += (tuTargetRotation - tuGlobalRotation) * 0.05;

        if (tuScene) {
          tuScene.style.transform = `rotateX(60deg) rotateZ(${tuGlobalRotation}deg)`;
          const billboards = tuScene.querySelectorAll('.tu-billboard-container');
          billboards.forEach(b => {
              const htmlB = b as HTMLElement;
              htmlB.style.transform = `rotateZ(${-tuGlobalRotation}deg) rotateX(-60deg)`;
          });
        }
        animationFrameId = requestAnimationFrame(animateTuScene);
    }
    animateTuScene();

    return () => {
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section id="ecosystem" className="scroll-snap-section py-32 border-t border-white/5 bg-[#020202]">
      <div className="container mx-auto px-6 text-center mb-20">
        <span className="inline-block px-3 py-1 rounded-md bg-accent-emerald-dim text-accent-emerald font-mono text-[10px] uppercase tracking-widest mb-4">Phase 4: Tool Universe</span>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">390 Tools. One Reality.</h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Eliminate silos by orchestrating real-time data flows across your entire construction software ecosystem.
        </p>
      </div>
      <div className="container mx-auto px-6 h-[800px] flex items-center justify-center">
        <div className={`${styles['tu-container']} w-full`} ref={tuContainerRef}>
          <div className={styles['tu-scene']} ref={tuSceneRef}>
              <div className={styles['tu-grid']} aria-hidden="true"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
