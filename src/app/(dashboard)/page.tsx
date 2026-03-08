'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Database,
  Zap,
  Target,
  Terminal,
  Map as MapIcon,
  Layers,
  FileText,
  FileSpreadsheet,
  FileCode,
  FileSignature,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatInterface } from "@/components/query/chat-interface";
import { ContextSummarizer } from "@/components/context/context-summarizer";
import { TacticalBimOverlay } from "@/components/visualizations/tactical-bim-overlay";
import { FeasibilitySection } from "@/components/sections/feasibility-section";
import { PredictSection } from "@/components/sections/predict-section";
import { IngestionFunnel } from "@/components/visualizations/ingestion-funnel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useRef } from 'react';

function ClosingDroneIcon({ className, propSpeed = 'off' }: { className?: string; propSpeed?: 'off' | 'fast' | 'slow' }) {
  // Realistic propeller rendering:
  // fast = layered translucent discs (motion blur) + shimmer
  // slow = visible blade rotation decelerating
  // off = static blades
  const renderProp = (cx: number) => {
    if (propSpeed === 'fast') {
      return (
        <g>
          {/* Outer motion blur ring */}
          <ellipse cx={cx} cy="6" rx="8" ry="3" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
          {/* Mid blur disc */}
          <ellipse cx={cx} cy="6" rx="7" ry="2.2" fill="currentColor" opacity="0.08" />
          {/* Inner concentrated disc */}
          <ellipse cx={cx} cy="6" rx="5.5" ry="1.6" fill="currentColor" opacity="0.12" />
          {/* Hot center — blade root blur */}
          <ellipse cx={cx} cy="6" rx="3" ry="1" fill="currentColor" opacity="0.18" />
          {/* Shimmer — two ghost blades at different angles */}
          <line x1={cx - 7} y1="6" x2={cx + 7} y2="6" stroke="currentColor" strokeWidth="0.8" opacity="0.04"
            style={{ transformOrigin: `${cx}px 6px`, animation: 'propBlur 0.08s linear infinite' }} />
          <line x1={cx - 7} y1="6" x2={cx + 7} y2="6" stroke="currentColor" strokeWidth="0.8" opacity="0.04"
            style={{ transformOrigin: `${cx}px 6px`, animation: 'propBlur 0.08s linear infinite 0.04s' }} />
        </g>
      );
    }
    if (propSpeed === 'slow') {
      return (
        <g>
          {/* Fading blur disc */}
          <ellipse cx={cx} cy="6" rx="6" ry="1.8" fill="currentColor" opacity="0.05" />
          {/* Visible blade — decelerating rotation */}
          <line x1={cx - 7.5} y1="6" x2={cx + 7.5} y2="6" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" opacity="0.7"
            style={{ transformOrigin: `${cx}px 6px`, animation: 'propDecel 1.5s cubic-bezier(0.35, 0, 0.25, 1) forwards' }} />
        </g>
      );
    }
    // off — static blade
    return (
      <line x1={cx - 7.5} y1="6" x2={cx + 7.5} y2="6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    );
  };

  return (
    <svg viewBox="0 0 48 30" fill="currentColor" className={className}>
      {renderProp(8.5)}
      {renderProp(39.5)}
      <rect x="6" y="7" width="6" height="4" rx="2" />
      <rect x="36" y="7" width="6" height="4" rx="2" />
      <path d="M12 9.5L19 13" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M36 9.5L29 13" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M18 11h12l1.5 3v3a4 4 0 01-4 4h-7a4 4 0 01-4-4v-3z" />
      <rect x="20.5" y="20" width="7" height="4.5" rx="1.5" />
      <circle cx="24" cy="22" r="1.6" className="fill-white opacity-40" />
      <path d="M18.5 18L15 27M29.5 18L33 27" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M13 27h7M28 27h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

const CLOSING_FULL = "ENVISION OVERSIGHT";
const CLOSING_DROP = new Set([10, 11, 12, 14, 15, 16, 17]);
const CLOSING_DROP_ORDER = [10, 11, 12, 14, 15, 16, 17];

// Clean 2D dust — small sharp particles radiate outward, no ovals or rings
function DustParticles({ active }: { active: boolean }) {
  // Rotor wash — dust rises upward from drone perimeter like a ramp, then dissipates
  const particles = useRef(
    Array.from({ length: 28 }, (_, i) => {
      const side = i < 14 ? -1 : 1;
      const idx = i % 14;
      const startX = side * (15 + idx * 3 + Math.random() * 5);
      const endX = side * (30 + idx * 5 + Math.random() * 20);
      const endY = -(25 + Math.random() * 45);
      return {
        id: i, startX, endX, endY,
        size: 1.5 + Math.random() * 2,
        delay: idx * 30 + Math.random() * 150,
        duration: 800 + Math.random() * 600,
      };
    })
  ).current;

  if (!active) return null;

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-8 pointer-events-none">
      {particles.map(p => (
        <div
          key={`d-${p.id}`}
          className="absolute rounded-full bg-black/20"
          style={{
            width: p.size,
            height: p.size,
            animation: `dustRise ${p.duration}ms cubic-bezier(0.2, 0.6, 0.3, 1) ${p.delay}ms forwards`,
            ['--startX' as string]: `${p.startX}px`,
            ['--endX' as string]: `${p.endX}px`,
            ['--endY' as string]: `${p.endY}px`,
          }}
        />
      ))}
    </div>
  );
}

// Catmull-Rom spline — buttery smooth curve through control points
function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number) {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

function getSplinePoint(points: number[][], progress: number) {
  const n = points.length - 1;
  const scaled = progress * n;
  const seg = Math.min(Math.floor(scaled), n - 1);
  const lt = scaled - seg;
  const p0 = points[Math.max(0, seg - 1)];
  const p1 = points[seg];
  const p2 = points[Math.min(n, seg + 1)];
  const p3 = points[Math.min(n, seg + 2)];
  return p0.map((_, i) => catmullRom(p0[i], p1[i], p2[i], p3[i], lt));
}

function ClosingSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const droneRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [ghostPhase, setGhostPhase] = useState<'hidden' | 'visible' | 'hovering' | 'exiting' | 'gone'>('hidden');
  const [ghostPos, setGhostPos] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [flying, setFlying] = useState(false);
  const [landed, setLanded] = useState(false);
  const [propSpeed, setPropSpeed] = useState<'off' | 'fast' | 'slow'>('off');
  const [dustActive, setDustActive] = useState(false);
  const [shadowProgress, setShadowProgress] = useState(0);
  const [typePhase, setTypePhase] = useState<'idle' | 'typing' | 'pause' | 'dropping' | 'done'>('idle');
  const [charIndex, setCharIndex] = useState(0);
  const [powerOn, setPowerOn] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.dispatchEvent(new CustomEvent('show-header-drone'));
      window.dispatchEvent(new CustomEvent('show-header-title'));
    };
  }, []);

  // Master timeline — slowed down for realism
  useEffect(() => {
    if (!inView) return;

    const headerDrone = document.querySelector('[data-header-drone]');
    if (headerDrone) {
      const rect = headerDrone.getBoundingClientRect();
      setGhostPos({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    }

    window.dispatchEvent(new CustomEvent('hide-header-drone'));
    window.dispatchEvent(new CustomEvent('hide-header-title'));
    setGhostPhase('visible');
    setPropSpeed('fast');

    const t: ReturnType<typeof setTimeout>[] = [];
    // Lift up from header — deliberate hover (like a real takeoff)
    t.push(setTimeout(() => setGhostPhase('hovering'), 300));
    // Hold hover for 2.5 seconds, then depart
    t.push(setTimeout(() => setGhostPhase('exiting'), 2800));
    t.push(setTimeout(() => setGhostPhase('gone'), 4000));
    t.push(setTimeout(() => setFlying(true), 4000));
    // Text types during flight — "ENVISION OVERSIGHT" visible before landing
    t.push(setTimeout(() => setTypePhase('typing'), 7000));
    // Dust as drone nears ground
    t.push(setTimeout(() => setDustActive(true), 10000));
    // Dust fades out
    t.push(setTimeout(() => setDustActive(false), 12200));
    // Props decelerate
    t.push(setTimeout(() => setPropSpeed('slow'), 11000));
    // TOUCHDOWN — dramatic letter-drop + green light flash, all at once
    t.push(setTimeout(() => {
      setLanded(true); setFlying(false); setPropSpeed('off');
      setTypePhase('dropping');
    }, 12000));
    return () => t.forEach(clearTimeout);
  }, [inView]);

  // Physics-based flight simulation — real forces: gravity, thrust, drag, angular momentum
  useEffect(() => {
    if (!flying || !droneRef.current) return;

    // State: position, velocity, angle
    let x = -320, y = -220;     // start off-screen left, high
    let vx = 70, vy = 5;         // initial velocity: gentler entry
    let angle = -10;              // initial bank angle (degrees)

    // Target position (center of section)
    const tx = 0, ty = 0;

    // Physics constants — stable, well-tuned DJI-like flight controller
    const GRAVITY = 22;           // px/s² — light gravity, floaty
    const DRAG = 0.98;            // velocity damping — smooth deceleration
    const THRUST_POWER = 400;     // max thrust px/s² — gentle
    const ANGULAR_DRAG = 0.85;    // heavy rotation damping — very stable
    const MAX_BANK = 6;           // max tilt degrees — barely noticeable, pro pilot
    const GROUND_EFFECT = 35;     // y threshold where ground effect kicks in
    const dt = 1 / 60;            // 60fps timestep

    // Flight phases by time
    const totalTime = 8000;       // 8 seconds — crisp purposeful flight
    const startTime = performance.now();
    let lastTime = startTime;

    let rafId: number;
    const frame = (now: number) => {
      const elapsed = now - startTime;
      const raw = Math.min(1, elapsed / totalTime);

      // Adaptive dt for frame-rate independence
      const frameDt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Phase-based thrust targets (simulates pilot input)
      let thrustX = 0, thrustY = 0;

      if (raw < 0.18) {
        // Phase 1: Gentle entry from left — cruising right
        thrustX = THRUST_POWER * 0.45;
        thrustY = -GRAVITY * 1.2;
      } else if (raw < 0.3) {
        // Phase 2: Ease off lateral thrust, begin banking — graceful arc
        thrustX = THRUST_POWER * 0.1;
        thrustY = -GRAVITY * 0.95;
      } else if (raw < 0.5) {
        // Phase 3: Swoop back left — the S-curve return, gentle descent
        thrustX = -THRUST_POWER * 0.3;
        thrustY = -GRAVITY * 0.75;
      } else if (raw < 0.65) {
        // Phase 4: Correct back toward center — smooth steering
        const errX = tx - x;
        const errY = (ty - 50) - y;
        thrustX = errX * 2;
        thrustY = errY * 1.8 - GRAVITY * 0.5;
      } else if (raw < 0.8) {
        // Phase 5: Controlled hover approach — PD controller, gentle
        const errX = tx - x;
        const errY = (ty - 20) - y;
        const dampX = -vx * 3.5;
        const dampY = -vy * 4;
        thrustX = errX * 3 + dampX;
        thrustY = errY * 2.5 + dampY - GRAVITY * 0.4;
      } else {
        // Phase 6: Final precision descent — very gentle PD
        const errX = tx - x;
        const errY = ty - y;
        const dampX = -vx * 5;
        const dampY = -vy * 6;
        thrustX = errX * 4 + dampX;
        thrustY = errY * 3 + dampY - GRAVITY * 0.3;

        // Ground effect — air cushion near surface
        if (y > -GROUND_EFFECT) {
          const groundFactor = 1 - (y + GROUND_EFFECT) / GROUND_EFFECT;
          thrustY -= groundFactor * 150;
        }
      }

      // Clamp thrust
      thrustX = Math.max(-THRUST_POWER, Math.min(THRUST_POWER, thrustX));
      thrustY = Math.max(-THRUST_POWER * 1.5, Math.min(THRUST_POWER, thrustY));

      // Apply forces
      vx += (thrustX + 0) * frameDt;              // no wind for now
      vy += (thrustY + GRAVITY) * frameDt;          // gravity always pulls down

      // Drag
      vx *= Math.pow(DRAG, frameDt * 60);
      vy *= Math.pow(DRAG, frameDt * 60);

      // Update position
      x += vx * frameDt;
      y += vy * frameDt;

      // Bank angle — subtle tilt into movement, heavily damped for precision feel
      const targetAngle = Math.max(-MAX_BANK, Math.min(MAX_BANK, -(thrustX / THRUST_POWER) * MAX_BANK * 0.8));
      // Slow spring toward target angle — no overshoot
      angle += (targetAngle - angle) * 2.5 * frameDt;

      // Scale based on progress (distant = small, close = full)
      const scale = 0.35 + raw * 0.65;

      // Final landing snap — last 5%, ease to exact position
      if (raw > 0.95) {
        const snap = (raw - 0.95) / 0.05;
        const ease = snap * snap * (3 - 2 * snap); // smoothstep
        x = x * (1 - ease);
        y = y * (1 - ease);
        angle = angle * (1 - ease);
      }

      if (droneRef.current) {
        droneRef.current.style.transform = `translate(${x}px, ${y}px) scale(${Math.min(1, scale)}) rotate(${angle}deg)`;
        droneRef.current.style.opacity = raw > 0.01 ? '1' : '0';
      }
      setShadowProgress(Math.max(0, 1 - Math.pow(1 - raw, 2.5)));

      if (raw < 1) {
        rafId = requestAnimationFrame(frame);
      }
    };

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [flying]);

  // Typewriter effect
  useEffect(() => {
    if (typePhase === 'typing') {
      if (charIndex < CLOSING_FULL.length) {
        const t = setTimeout(() => setCharIndex(i => i + 1), 65);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setTypePhase('pause'), 100);
      return () => clearTimeout(t);
    }
    if (typePhase === 'pause') {
      // Hold here — dropping is triggered by the master timeline at touchdown
      return;
    }
    if (typePhase === 'dropping') {
      // Power on immediately as letters start dropping
      setPowerOn(true);
      const t = setTimeout(() => setTypePhase('done'), 1200);
      return () => clearTimeout(t);
    }
  }, [typePhase, charIndex]);

  const isDropping = typePhase === 'dropping' || typePhase === 'done';
  const isGreen = typePhase === 'dropping' || typePhase === 'done';

  // Ghost style
  const ghostStyle: React.CSSProperties = (() => {
    if (!ghostPos || ghostPhase === 'hidden' || ghostPhase === 'gone') {
      return { position: 'fixed' as const, opacity: 0, pointerEvents: 'none' as const, zIndex: 100 };
    }
    if (ghostPhase === 'visible') {
      return {
        position: 'fixed' as const, top: ghostPos.top, left: ghostPos.left,
        width: ghostPos.width, height: ghostPos.height,
        opacity: 1, transition: 'opacity 0.15s', zIndex: 100, pointerEvents: 'none' as const,
      };
    }
    if (ghostPhase === 'hovering') {
      // Lift up ~12px from header — subtle hover, stays in frame on mobile
      return {
        position: 'fixed' as const,
        top: ghostPos.top - 12,
        left: ghostPos.left,
        width: ghostPos.width,
        height: ghostPos.height,
        opacity: 1,
        transition: 'top 600ms cubic-bezier(0.2, 0, 0.4, 1)',
        zIndex: 100,
        pointerEvents: 'none' as const,
      };
    }
    // exiting — fly off-screen left and down
    return {
      position: 'fixed' as const,
      top: ghostPos.top + 200,
      left: -150,
      width: ghostPos.width,
      height: ghostPos.height,
      opacity: 0,
      transition: 'all 1000ms cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 100,
      pointerEvents: 'none' as const,
    };
  })();

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <style>{`
        @keyframes propSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes propBlur {
          from { transform: rotate(0deg); }
          to { transform: rotate(180deg); }
        }
        @keyframes propDecel {
          0% { transform: rotate(0deg); }
          20% { transform: rotate(360deg); }
          45% { transform: rotate(580deg); }
          65% { transform: rotate(710deg); }
          80% { transform: rotate(755deg); }
          90% { transform: rotate(768deg); }
          100% { transform: rotate(770deg); }
        }
        @keyframes dustRise {
          0% { left: var(--startX); top: 8px; opacity: 0.5; }
          40% { opacity: 0.4; }
          70% { opacity: 0.2; }
          100% { left: var(--endX); top: var(--endY); opacity: 0; }
        }
        @keyframes powerFlash {
          0% { opacity: 0; transform: scale(0.3); box-shadow: 0 0 0 rgba(0,124,90,0); }
          15% { opacity: 1; transform: scale(1.8); box-shadow: 0 0 30px rgba(0,124,90,0.9), 0 0 60px rgba(0,124,90,0.4); }
          40% { transform: scale(1); box-shadow: 0 0 15px rgba(0,124,90,0.7), 0 0 30px rgba(0,124,90,0.3); }
          100% { opacity: 1; transform: scale(1); box-shadow: 0 0 8px rgba(0,124,90,0.6), 0 0 16px rgba(0,124,90,0.2); }
        }
      `}</style>

      {/* Ghost drone — departs from header */}
      {(ghostPhase === 'visible' || ghostPhase === 'hovering' || ghostPhase === 'exiting') && (
        <div style={ghostStyle}>
          <ClosingDroneIcon className="w-full h-full text-black" propSpeed="fast" />
        </div>
      )}

      {/* Main drone — 60fps rAF spline flight */}
      <div
        ref={droneRef}
        className="relative"
        style={{
          opacity: 0,
          willChange: 'transform, opacity',
          transform: landed ? 'translate(0px, 0px) scale(1) rotate(0deg)' : undefined,
        }}
      >
        <ClosingDroneIcon
          className={cn(
            "w-20 h-14 sm:w-28 sm:h-[72px] md:w-36 md:h-[88px] transition-colors duration-700",
            isGreen ? "text-primary" : "text-black"
          )}
          propSpeed={propSpeed}
        />
        {/* Ground shadow */}
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
          style={{
            bottom: -14,
            width: 60 * shadowProgress,
            height: 6 * shadowProgress,
            opacity: 0.25 * shadowProgress,
            background: 'rgba(0,0,0,0.15)',
            filter: `blur(${Math.max(1, 6 - shadowProgress * 5)}px)`,
          }}
        />
        <DustParticles active={dustActive} />
      </div>

      {/* Title */}
      <div className={cn(
        "mt-8 sm:mt-10 transition-opacity duration-500",
        typePhase === 'idle' ? "opacity-0" : "opacity-100"
      )}>
        <div className="flex items-center justify-center gap-3">
          <span className={cn(
            "text-2xl sm:text-4xl md:text-5xl font-bold uppercase transition-colors duration-500",
            isGreen ? 'text-primary' : 'text-black'
          )}>
            {CLOSING_FULL.split('').map((char, i) => {
              const shouldDrop = CLOSING_DROP.has(i);
              const dropped = isDropping && shouldDrop;
              const stagger = shouldDrop ? CLOSING_DROP_ORDER.indexOf(i) * 40 : 0;

              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    overflow: 'hidden',
                    verticalAlign: 'top',
                    transition: dropped
                      ? `max-width 400ms ease-in-out ${250 + stagger}ms, margin-right 400ms ease-in-out ${250 + stagger}ms`
                      : 'max-width 400ms ease-in-out, margin-right 400ms ease-in-out',
                    maxWidth: dropped ? 0 : '1em',
                    marginRight: dropped ? 0 : '0.25em',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      transition: dropped
                        ? `opacity 300ms ease-in-out ${stagger}ms, transform 350ms ease-in-out ${stagger}ms`
                        : 'opacity 300ms ease-in-out, transform 350ms ease-in-out',
                      opacity: i >= charIndex ? 0 : dropped ? 0 : 1,
                      transform: dropped ? 'translateY(1.2em)' : 'translateY(0)',
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                </span>
              );
            })}
          </span>
          {powerOn && (
            <div
              className="size-2.5 sm:size-3 rounded-full bg-primary"
              style={{ animation: 'powerFlash 1.2s ease-out forwards' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TypewriterUntilNow() {
  const [charIndex, setCharIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const text = "Until now.";

  useEffect(() => {
    const delay = setTimeout(() => setStarted(true), 100);
    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    if (!started) return;
    if (charIndex < text.length) {
      const t = setTimeout(() => setCharIndex(i => i + 1), 80);
      return () => clearTimeout(t);
    }
  }, [started, charIndex]);

  if (!started) return null;

  return (
    <>
      {' '}
      <span className="text-primary font-bold">
        {text.slice(0, charIndex)}
        {charIndex < text.length && (
          <span className="inline-block w-[2px] h-[1em] bg-primary ml-[1px] align-middle animate-pulse" />
        )}
      </span>
    </>
  );
}

const HERO_LINES = [
  { text: "Where", green: false },
  { text: "Development", green: true },
  { text: "Meets Data", green: false },
];
const TOTAL_TITLE_CHARS = HERO_LINES.reduce((s, l) => s + l.text.length, 0);
const SUBTITLE_WORDS = ["Emails.", "Photos.", "Zooms.", "Inspections.", "RFIs.", "Waivers."];

function HeroSequence() {
  const [headerDone, setHeaderDone] = useState(false);
  const [titleChars, setTitleChars] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [secondLineVisible, setSecondLineVisible] = useState(false);
  const [untilNowReady, setUntilNowReady] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeaderDone(true), 4000);
    return () => clearTimeout(t);
  }, []);

  // Type title characters
  useEffect(() => {
    if (!headerDone) return;
    if (titleChars < TOTAL_TITLE_CHARS) {
      const t = setTimeout(() => setTitleChars(c => c + 1), 55);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setWordIndex(1), 400);
    return () => clearTimeout(t);
  }, [headerDone, titleChars]);

  // Sequential word fade-in
  useEffect(() => {
    if (wordIndex < 1) return;
    if (wordIndex < SUBTITLE_WORDS.length) {
      const t = setTimeout(() => setWordIndex(w => w + 1), 280);
      return () => clearTimeout(t);
    }
    if (wordIndex === SUBTITLE_WORDS.length && !secondLineVisible) {
      const t = setTimeout(() => setSecondLineVisible(true), 500);
      return () => clearTimeout(t);
    }
  }, [wordIndex, secondLineVisible]);

  // Start "Until now." typewriter
  useEffect(() => {
    if (!secondLineVisible) return;
    const t = setTimeout(() => setUntilNowReady(true), 800);
    return () => clearTimeout(t);
  }, [secondLineVisible]);

  // Show button after "Until now." finishes
  useEffect(() => {
    if (!untilNowReady) return;
    const t = setTimeout(() => setButtonVisible(true), 1200);
    return () => clearTimeout(t);
  }, [untilNowReady]);

  let rendered = 0;
  const titleContent = HERO_LINES.map((line, i) => {
    const start = rendered;
    rendered += line.text.length;
    const visible = Math.max(0, Math.min(line.text.length, titleChars - start));
    const isCurrent = titleChars >= start && titleChars < start + line.text.length;
    const showCursor = isCurrent && titleChars < TOTAL_TITLE_CHARS;

    return (
      <React.Fragment key={i}>
        {line.green ? (
          <span className="text-primary">{line.text.slice(0, visible)}</span>
        ) : (
          line.text.slice(0, visible)
        )}
        {showCursor && (
          <span className="inline-block w-[3px] h-[0.8em] bg-current ml-0.5 align-middle animate-pulse" />
        )}
        {i < HERO_LINES.length - 1 && <br />}
      </React.Fragment>
    );
  });

  return (
    <>
      <div>
        <h1 className="text-5xl sm:text-7xl md:text-[7.5rem] lg:text-[9.5rem] xl:text-[11rem] font-semibold tracking-[-0.05em] leading-[1.05] max-w-[95%] mb-12 sm:mb-14 md:mb-20 min-h-[3.15em]">
          {titleContent}
        </h1>

        <div className="text-sm sm:text-base md:text-lg text-black/35 max-w-md leading-relaxed font-medium">
          <p className="mb-2">
            {SUBTITLE_WORDS.map((word, i) => (
              <span
                key={i}
                className={cn(
                  "inline-block mr-[0.35em] transition-opacity duration-500",
                  i < wordIndex ? "opacity-100" : "opacity-0"
                )}
              >
                {word}
              </span>
            ))}
          </p>
          <p className={cn(
            "transition-opacity duration-700 mb-2",
            secondLineVisible ? "opacity-100" : "opacity-0"
          )}>
            A billion fragments of &ldquo;truth&rdquo;, without the full picture.
          </p>
          {untilNowReady && (
            <p className="transition-opacity duration-700">
              <TypewriterUntilNow />
            </p>
          )}
        </div>
      </div>

      <div className={cn(
        "flex-1 flex items-center justify-center font-mono transition-opacity duration-500",
        buttonVisible ? "opacity-100" : "opacity-0"
      )}>
        <a href="#ingestion" className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 sm:px-10 sm:py-4 text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-primary/90 transition-all duration-300">
          INITIALIZE_SYSTEM <ArrowRight className="size-3.5" />
        </a>
      </div>
    </>
  );
}

export default function UnifiedPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto-scroll to section via query param (for Simulator screenshots)
    const params = new URLSearchParams(window.location.search);
    const section = params.get('s');
    if (section) {
      setTimeout(() => {
        document.getElementById(section)?.scrollIntoView({ behavior: 'instant' });
      }, 500);
    }
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-white" />;
  }


  return (
    <div
        id="main-scroll-container"
        className="flex flex-col w-full selection:bg-primary/20 font-sans snap-y snap-mandatory overflow-y-auto h-[calc(100vh-64px)] no-scrollbar"
    >

      {/* SECTION 01: INSTITUTIONAL HERO (WHITE) */}
      <section id="hero" className="snap-start relative flex flex-col bg-white text-black h-[calc(100vh-64px)] w-full shrink-0 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] tactical-grid" />
        <div className="relative z-10 w-full h-full flex flex-col px-6 sm:px-12 md:px-20 lg:px-28 pt-[12vh] sm:pt-[14vh] md:pt-[16vh]">
          <HeroSequence />
        </div>
      </section>

      {/* SECTION 02: INGESTION PIPELINE (OBSIDIAN) - CHAOS TO CONTROL */}
      <section id="ingestion" className="snap-start relative h-[calc(100vh-64px)] w-full bg-[#0A0A0F] text-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 overflow-hidden shrink-0">
          <div className="absolute inset-0 tactical-grid pointer-events-none opacity-[0.03] z-0" />
          <div className="relative z-10 w-full max-w-7xl h-full flex flex-col justify-between py-6 md:py-12 gap-4 md:gap-8">

              <div className="space-y-2 sm:space-y-4 shrink-0">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <Database className="size-3 sm:size-4 text-primary" />
                      <h2 className="text-[9px] sm:text-[10px] font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase text-white/40">02_Unified_Dataflow</h2>
                  </div>
                  <h3 className="text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tighter leading-tight">From Chaos to Control.</h3>
                  <p className="text-sm sm:text-base md:text-lg text-white/60 max-w-2xl leading-relaxed font-medium">
                      From juggling dozens of consultants or being cc&apos;ed on a thousand emails, Envision OS consumes all the noise and delivers <span className="text-white font-bold">data-driven clarity</span>.
                  </p>
              </div>

              <div className="relative w-full flex-1 min-h-0">
                  <IngestionFunnel />
              </div>
          </div>
      </section>

      {/* SECTION 03: INTELLIGENCE COMMAND (WHITE) */}
      <section id="intel" className="snap-start relative h-[calc(100vh-64px)] w-full bg-white text-black flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 overflow-hidden shrink-0">
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] tactical-grid" />
        <div className="relative z-10 w-full max-w-7xl h-full flex flex-col">
            <div className="flex items-center gap-3 mb-3 md:mb-6 shrink-0">
                <Terminal className="size-4 text-primary" />
                <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-black/40">03_Construction_Intelligence</h2>
            </div>

            <div className="mb-4 md:mb-8 shrink-0">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tighter leading-tight">Command Central.</h2>
              <p className="text-black/60 max-w-xl text-base sm:text-lg font-medium mt-2 md:mt-4">Welcome to the future of Development.</p>
            </div>

            <Card className="bg-white border-black/5 shadow-2xl flex-1 flex flex-col overflow-hidden rounded-none">
                <CardHeader className="border-b border-black/5 bg-gray-50/50 py-3 shrink-0">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-[10px] tracking-[0.3em] text-black/60">Secure_Command_Interface</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="size-1.5 rounded-full bg-primary animate-status" />
                            <span className="text-[9px] font-mono text-primary uppercase tracking-widest">Live</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 overflow-hidden relative">
                    <ChatInterface />
                </CardContent>
            </Card>
        </div>
      </section>

      {/* SECTION 04: CONTEXT FUSION (OBSIDIAN) */}
      <section id="fusion" className="snap-start relative h-[calc(100vh-64px)] w-full bg-white text-zinc-900 flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 shrink-0 overflow-hidden">
          <div className="relative z-10 w-full max-w-7xl flex flex-col h-full">
              <div className="flex items-center gap-3 mb-3 md:mb-6 shrink-0">
                  <Zap className="size-4 text-[#007C5A]" />
                  <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-zinc-400">04_Context_Engine</h2>
              </div>
              <ContextSummarizer />
          </div>
      </section>

      {/* SECTION 05: BIM + TELEMETRY (OBSIDIAN) */}
      <section id="tactical-bim" className="snap-start relative h-[calc(100vh-64px)] w-full bg-[#0A0A0F] text-white flex flex-col items-center p-4 sm:p-6 md:p-12 shrink-0 overflow-hidden">
        <div className="absolute inset-0 tactical-grid pointer-events-none opacity-[0.03] z-0" />
        <div className="relative z-10 w-full max-w-7xl h-full flex flex-col gap-4 md:gap-6 overflow-hidden">
            <div className="shrink-0 space-y-2">
              <div className="flex items-center gap-3 mb-2">
                <Layers className="size-4 text-primary" />
                <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">05_Digital_Twin_Overlay</h2>
              </div>
              <h3 className="text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tighter leading-tight">Expectations Meet Reality.</h3>
              <p className="text-white/50 max-w-xl text-sm sm:text-base font-medium mt-2">
                Real-time LiDAR scans overlay Site progress that turns your project into a living model that fits in your pocket.
              </p>
            </div>
            <div className="flex-1 relative overflow-hidden min-h-0">
                <TacticalBimOverlay />
            </div>
        </div>
      </section>

      {/* SECTION 06: PREDICTIVE INTELLIGENCE (WHITE) */}
      <section id="predict" className="snap-start relative h-[calc(100vh-64px)] w-full bg-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 overflow-hidden shrink-0">
        <div className="absolute inset-0 tactical-grid pointer-events-none opacity-[0.02] z-0" />
        <div className="relative z-10 w-full max-w-7xl h-full flex flex-col gap-4 md:gap-8 overflow-hidden">
          <PredictSection />
        </div>
      </section>

      {/* SECTION 07: SKY SCRAPE — SITE + DOCUMENTS (OBSIDIAN) */}
      <section id="site-docs" className="snap-start relative h-[calc(100vh-64px)] w-full bg-[#0A0A0F] text-white flex flex-col items-center p-4 sm:p-6 md:p-12 shrink-0 overflow-hidden">
        <div className="absolute inset-0 tactical-grid pointer-events-none opacity-[0.03] z-0" />
        <div className="relative z-10 w-full max-w-7xl flex flex-col gap-4 md:gap-6 h-full">
            <div className="shrink-0 space-y-2">
              <div className="flex items-center gap-3 mb-2">
                <MapIcon className="size-4 text-primary" />
                <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">07_Instant_Feasibility</h2>
              </div>
              <h3 className="text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tighter leading-tight">Sky Scrape.</h3>
              <p className="text-white/50 max-w-xl text-sm sm:text-base font-medium mt-2">
                Where air rights meet drone flights. Every parcel, every permit, every risk, mapped and verified in real time.
              </p>
            </div>
            <FeasibilitySection />
        </div>
      </section>

      {/* SECTION 08: CLOSING — DRONE + ENVISION OS */}
      <section id="closing" className="snap-start relative h-[calc(100vh-64px)] w-full bg-white text-black flex flex-col items-center justify-center shrink-0 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] tactical-grid" />
        <ClosingSequence />
      </section>

    </div>
  );
}
