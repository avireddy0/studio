'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Radio, Mail, Eye, ChevronRight, ScanFace, CheckCircle2, Shield, Crosshair } from 'lucide-react';
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// FEED CLIPS — Veo 3 generated municipal meeting videos
// Two clips playing sequentially, looping
// ═══════════════════════════════════════════════════════════════
const FEED_CLIPS = [
  {
    src: '/feed-clip-1.mp4',
    label: 'CH-04 • PORTSMOUTH',
    coord: '36.8354°N 76.2983°W',
    org: 'PORTSMOUTH CITY COUNCIL — PUBLIC HEARING',
    ts: '14:22:07 EST',
    freq: '2.4GHz ENC',
  },
  {
    src: '/feed-clip-2.mp4',
    label: 'CH-12 • PHOENIX',
    coord: '33.4484°N 112.0740°W',
    org: 'PLANNING COMMISSION — DENSITY VARIANCE',
    ts: '16:11:53 MST',
    freq: '5.8GHz ENC',
  },
];

// ═══════════════════════════════════════════════════════════════
// FACIAL RECOGNITION SUBJECTS — HUD bio overlays
// Face positions calibrated from Veo 3 frame analysis
// (% of video container, accounting for object-cover crop)
// ═══════════════════════════════════════════════════════════════
interface Subject {
  id: string;
  name: string;
  title: string;
  affiliation: string;
  stance: 'OPPOSED' | 'CAUTIOUS' | 'NEUTRAL' | 'INQUIRING' | 'SUPPORTIVE';
  sentiment: number;
  confidence: number;
  priorAppearances: number;
  keywords: string[];
  threatLevel: 'LOW' | 'MODERATE' | 'HIGH';
  clipIndex: number;
  showFrom: number;
  showUntil: number;
  facePos: { top: string; left: string; width: string; height: string };
}

const SUBJECTS: Subject[] = [
  {
    id: 'SUBJ-4721',
    name: 'CNCL. HARGROVE',
    title: 'Chair — Planning Commission',
    affiliation: 'PORTSMOUTH PLANNING COMM.',
    stance: 'CAUTIOUS',
    sentiment: -0.31,
    confidence: 97.2,
    priorAppearances: 14,
    keywords: ['traffic', 'conditions', 'supplemental'],
    threatLevel: 'MODERATE',
    clipIndex: 0,
    showFrom: 0,
    showUntil: 3.0,
    facePos: { top: '7%', left: '35%', width: '10%', height: '18%' },
  },
  {
    id: 'SUBJ-8134',
    name: 'C. WILLIAMS',
    title: 'Concerned Resident — Maple Street HOA',
    affiliation: 'PUBLIC COMMENT',
    stance: 'INQUIRING',
    sentiment: -0.22,
    confidence: 88.3,
    priorAppearances: 3,
    keywords: ['parking', 'traffic', 'density'],
    threatLevel: 'LOW',
    clipIndex: 0,
    showFrom: 3.0,
    showUntil: 8,
    facePos: { top: '16%', left: '24%', width: '10%', height: '17%' },
  },
  {
    id: 'SUBJ-2956',
    name: 'DIR. KAPOOR',
    title: 'Zoning Administrator',
    affiliation: 'DEPT. OF PLANNING',
    stance: 'NEUTRAL',
    sentiment: -0.08,
    confidence: 94.5,
    priorAppearances: 22,
    keywords: ['setback', 'density', 'overlay'],
    threatLevel: 'LOW',
    clipIndex: 1,
    showFrom: 0,
    showUntil: 3.5,
    facePos: { top: '5%', left: '27%', width: '11%', height: '19%' },
  },
  {
    id: 'SUBJ-6103',
    name: 'A. TORRES',
    title: 'Transportation Planner',
    affiliation: 'PUBLIC WORKS',
    stance: 'CAUTIOUS',
    sentiment: -0.35,
    confidence: 91.0,
    priorAppearances: 8,
    keywords: ['traffic counts', 'school zone', 'afternoon'],
    threatLevel: 'MODERATE',
    clipIndex: 1,
    showFrom: 3.5,
    showUntil: 8,
    facePos: { top: '13%', left: '29%', width: '9%', height: '17%' },
  },
];

// ═══════════════════════════════════════════════════════════════
// CAPTION DATA — Simulated municipal meeting transcript
// ═══════════════════════════════════════════════════════════════
interface CaptionLine {
  afterClips: number;      // how many clips must finish before this caption is eligible
  atVideoTime: number;     // video time (seconds) within the clip to trigger reveal
  time: string;
  text: string;
  sentiment: number;
  speaker: string;
  highlights: Array<{ phrase: string; severity: 'high' | 'medium' }>;
}

const CAPTIONS: CaptionLine[] = [
  {
    afterClips: 0,          // Clip 0 (Portsmouth) — HARGROVE at podium
    atVideoTime: 1.2,
    time: '14:22',
    text: 'The revised site plan addresses several of our previous concerns. Good progress overall.',
    sentiment: 0.1,
    speaker: 'CNCL-01',
    highlights: [],
  },
  {
    afterClips: 0,          // Clip 0 — WILLIAMS at desk
    atVideoTime: 4.2,
    time: '14:23',
    text: 'Could the applicant clarify the proposed parking ratio for the residential units?',
    sentiment: -0.1,
    speaker: 'CITIZEN-01',
    highlights: [],
  },
  {
    afterClips: 1,          // Clip 1 (Phoenix) — KAPOOR at podium
    atVideoTime: 1.2,
    time: '14:24',
    text: 'The setback meets the revised zoning overlay. No code issues on my end.',
    sentiment: 0.05,
    speaker: 'DIR-KAPOOR',
    highlights: [],
  },
  {
    afterClips: 1,          // Clip 1 — TORRES at desk
    atVideoTime: 4.2,
    time: '14:25',
    text: "I'd like to see additional data on afternoon traffic patterns near the school zone before we proceed.",
    sentiment: -0.35,
    speaker: 'A-TORRES',
    highlights: [{ phrase: 'additional data', severity: 'medium' }, { phrase: 'before we proceed', severity: 'medium' }],
  },
  {
    afterClips: 2,          // Clip 0 again — HARGROVE responds
    atVideoTime: 1.5,
    time: '14:26',
    text: "I'm inclined to support this with conditions — let's address the outstanding traffic questions first.",
    sentiment: -0.15,
    speaker: 'CNCL-01',
    highlights: [{ phrase: 'with conditions', severity: 'medium' }],
  },
];

const ALERT_EMAIL = {
  project: 'Phoenix — 14th & Grand',
  body: 'Two commissioners requested supplemental traffic data before final vote. Shadow study extension also mentioned.',
  risk: '52%',
};

const OWNER_EMAIL = {
  to: 'OWNER, VP DEVELOPMENT',
  body: 'Commissioners want supplemental afternoon traffic data and an extended winter shadow study before voting on density variance. Tone was constructive — willingness to approve with conditions.',
  action: 'Meet with Planning Director Kim this week. Submit afternoon traffic counts and winter shadow study before April 12 hearing.',
};


// ═══════════════════════════════════════════════════════════════
// HIGHLIGHTED CAPTION — inline keyword markup
// ═══════════════════════════════════════════════════════════════
function HighlightedCaption({ text, highlights }: {
  text: string;
  highlights: CaptionLine['highlights'];
}) {
  const result: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  const sorted = [...highlights].sort((a, b) =>
    text.toLowerCase().indexOf(a.phrase.toLowerCase()) - text.toLowerCase().indexOf(b.phrase.toLowerCase())
  );

  for (const h of sorted) {
    const idx = remaining.toLowerCase().indexOf(h.phrase.toLowerCase());
    if (idx === -1) continue;
    if (idx > 0) result.push(<span key={key++}>{remaining.slice(0, idx)}</span>);
    result.push(
      <span key={key++} className={cn("font-semibold", h.severity === 'high' ? 'text-red-400' : 'text-amber-400')}>
        {remaining.slice(idx, idx + h.phrase.length)}
      </span>
    );
    remaining = remaining.slice(idx + h.phrase.length);
  }
  if (remaining) result.push(<span key={key++}>{remaining}</span>);
  return <>{result}</>;
}

// ═══════════════════════════════════════════════════════════════
// VIDEO FEED — Plays two Veo 3 clips sequentially, loops
// ═══════════════════════════════════════════════════════════════
function VideoFeed({ currentIndex, onClipEnd, onTimeUpdate }: {
  currentIndex: number;
  onClipEnd: () => void;
  onTimeUpdate: (time: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevIndex = useRef(currentIndex);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const src = FEED_CLIPS[currentIndex].src;
    // Only reload if clip actually changed
    if (v.src !== window.location.origin + src && v.getAttribute('src') !== src) {
      v.src = src;
      v.load();
    }
    v.currentTime = 0;
    const tryPlay = () => {
      v.play().catch(() => {
        setTimeout(() => v.play().catch(() => {}), 300);
      });
    };
    if (v.readyState >= 2) {
      tryPlay();
    } else {
      v.addEventListener('canplay', tryPlay, { once: true });
    }
    prevIndex.current = currentIndex;
  }, [currentIndex]);

  return (
    <video
      ref={videoRef}
      src={FEED_CLIPS[currentIndex].src}
      muted
      autoPlay
      playsInline
      preload="auto"
      onEnded={onClipEnd}
      onTimeUpdate={(e) => onTimeUpdate((e.target as HTMLVideoElement).currentTime)}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════
// VIDEO FACE MAPPING — converts video-native % to container %
// accounting for object-cover scaling and cropping
// ═══════════════════════════════════════════════════════════════
function useVideoFaceMapping(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [mapping, setMapping] = useState<{
    ox: number; oy: number; dw: number; dh: number; cw: number; ch: number;
  } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const compute = () => {
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      if (cw === 0 || ch === 0) return;
      const vr = 16 / 9;
      const cr = cw / ch;
      let dw: number, dh: number, ox: number, oy: number;
      if (cr > vr) {
        dw = cw; dh = cw / vr; ox = 0; oy = (ch - dh) / 2;
      } else {
        dh = ch; dw = ch * vr; ox = (cw - dw) / 2; oy = 0;
      }
      setMapping({ ox, oy, dw, dh, cw, ch });
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  return useCallback((videoPos: { top: string; left: string; width: string; height: string }) => {
    if (!mapping) return videoPos;
    const { ox, oy, dw, dh, cw, ch } = mapping;
    const vt = parseFloat(videoPos.top) / 100;
    const vl = parseFloat(videoPos.left) / 100;
    const vw = parseFloat(videoPos.width) / 100;
    const vh = parseFloat(videoPos.height) / 100;
    return {
      top: `${((oy + vt * dh) / ch) * 100}%`,
      left: `${((ox + vl * dw) / cw) * 100}%`,
      width: `${((vw * dw) / cw) * 100}%`,
      height: `${((vh * dh) / ch) * 100}%`,
    };
  }, [mapping]);
}

// ═══════════════════════════════════════════════════════════════
// FACE DETECTION BOX — Prominent rectangle around detected face
// with compact bio tag below
// ═══════════════════════════════════════════════════════════════
type FacePhase = 'idle' | 'scanning' | 'locking' | 'matched';

function FaceBox({ subject, phase, facePos }: { subject: Subject; phase: FacePhase; facePos: Subject['facePos'] }) {
  const isActive = phase !== 'idle';
  const isMatched = phase === 'matched';
  const isScanning = phase === 'scanning';
  const isLocking = phase === 'locking';

  const stanceColor =
    subject.stance === 'OPPOSED' ? 'text-red-400' :
    subject.stance === 'CAUTIOUS' ? 'text-amber-400' :
    subject.stance === 'NEUTRAL' ? 'text-white/50' :
    subject.stance === 'INQUIRING' ? 'text-amber-300' :
    'text-emerald-400';

  return (
    <div
      className={cn(
        "absolute transition-all ease-out pointer-events-none",
        !isActive ? 'opacity-0 scale-[1.12] duration-300' :
        isScanning ? 'opacity-70 scale-[1.04] duration-600' :
        isLocking ? 'opacity-90 scale-[1.01] duration-400' :
        'opacity-100 scale-100 duration-300'
      )}
      style={{ top: facePos.top, left: facePos.left, width: facePos.width, height: facePos.height }}
    >
      {/* ═══ SUBTLE BORDER — face recognition box ═══ */}
      <div className={cn(
        "absolute inset-0 border transition-all duration-300",
        isMatched ? "border-cyan-400/40" : isLocking ? "border-cyan-400/20" : "border-cyan-400/10"
      )} />

      {/* Corner accents — subtle ticks at corners */}
      <div className="absolute -top-px -left-px w-2 h-2 border-t border-l border-cyan-400/60" />
      <div className="absolute -top-px -right-px w-2 h-2 border-t border-r border-cyan-400/60" />
      <div className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-cyan-400/60" />
      <div className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-cyan-400/60" />

      {/* Scan sweep line */}
      {isScanning && (
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
          style={{ animation: 'faceScanSweep 1.2s ease-in-out infinite' }} />
      )}

      {/* Lock pulse */}
      {isLocking && (
        <div className="absolute inset-[-3px] border border-cyan-400/20 animate-ping" style={{ animationDuration: '0.7s' }} />
      )}

      {/* ═══ SIDE HUD PANEL — slides in from right, Palantir style ═══ */}
      <div className={cn(
        "absolute transition-all duration-500 ease-out flex items-center gap-0",
        isMatched ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
      )} style={{ top: '15%', left: '100%', height: '70%' }}>
        {/* Connecting line from face box to panel */}
        <div className={cn(
          "w-6 h-px shrink-0 transition-all duration-300",
          isMatched ? "bg-cyan-400/40" : "bg-transparent"
        )} />
        {/* Data readout panel */}
        <div className="bg-black/85 backdrop-blur-sm border-l-2 border-cyan-400/40 pl-2 pr-3 py-1.5 min-w-[120px] max-w-[180px]">
          <div className="text-[8px] font-mono text-cyan-400/80 tracking-wider leading-tight truncate">{subject.title}</div>
          <div className="flex items-center gap-2 mt-1">
            <div className={cn(
              "text-[10px] font-mono font-bold tabular-nums tracking-wide",
              subject.sentiment < -0.3 ? "text-amber-400" : subject.sentiment < 0 ? "text-white/50" : "text-emerald-400"
            )}>
              {subject.sentiment > 0 ? '+' : ''}{subject.sentiment.toFixed(2)}
            </div>
            <span className={cn("text-[7px] font-mono font-bold tracking-wider uppercase", stanceColor)}>{subject.stance}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SENTIMENT BAR — Compact horizontal gauge below video
// ═══════════════════════════════════════════════════════════════
function SentimentBar({ score }: { score: number }) {
  const pct = ((score + 1) / 2) * 100;
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 bg-black/40 border-t border-white/[0.04]">
      <span className="text-[8px] font-mono text-white/20 tracking-[0.2em] uppercase shrink-0">SENTIMENT</span>
      <div className="flex-1 relative h-1.5 bg-white/5 overflow-hidden rounded-full">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 via-amber-500/30 to-emerald-500/30 rounded-full" />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 border-white/70 transition-all duration-1000 ease-out"
          style={{
            left: `${pct}%`,
            backgroundColor: score < -0.3 ? '#f59e0b' : score < 0 ? '#64748b' : '#10b981',
            boxShadow: `0 0 10px ${score < -0.3 ? '#f59e0b' : score < 0 ? '#94a3b8' : '#10b981'}50`,
          }}
        />
      </div>
      <span className={cn(
        "text-[10px] font-mono font-bold tabular-nums shrink-0 min-w-[36px] text-right",
        score < -0.3 ? "text-amber-400" : score < 0 ? "text-white/40" : "text-emerald-400"
      )}>{score > 0 ? '+' : ''}{score.toFixed(2)}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export function PredictSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [visibleCaptions, setVisibleCaptions] = useState(0);
  const [sentimentScore, setSentimentScore] = useState(-0.12);
  const [processing, setProcessing] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [currentFeed, setCurrentFeed] = useState(0);
  const [facePhase, setFacePhase] = useState<FacePhase>('idle');
  const [feedSwitching, setFeedSwitching] = useState(false);
  const [emailPhase, setEmailPhase] = useState<'hidden' | 'composing' | 'sending' | 'sent'>('hidden');
  const [hudTime, setHudTime] = useState('14:22:07');
  const [facesDetected, setFacesDetected] = useState(0);
  const [videoTime, setVideoTime] = useState(0);
  const [clipPlayCount, setClipPlayCount] = useState(0);

  // Refs for video-synced caption sequencing
  const clipPlayCountRef = useRef(0);
  const sequenceBaseRef = useRef(0);
  const waitingForClipRef = useRef(false);

  // Map video-native face positions to container positions (accounts for object-cover)
  const mapFacePos = useVideoFaceMapping(videoContainerRef);

  // Determine active face subject from video time + current clip
  const activeSubject = useMemo(() => {
    if (!inView) return null;
    return SUBJECTS.find(s =>
      s.clipIndex === currentFeed &&
      videoTime >= s.showFrom &&
      videoTime < s.showUntil
    ) ?? null;
  }, [currentFeed, videoTime, inView]);

  // Track subject changes to trigger face recognition animation
  const prevSubjectId = useRef<string | null>(null);

  // Intersection observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Face recognition sequence — scan → lock → match (triggered by subject change)
  const faceTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    if (!inView || !activeSubject) {
      setFacePhase('idle');
      setFacesDetected(0);
      prevSubjectId.current = null;
      return;
    }
    if (activeSubject.id === prevSubjectId.current) return;
    prevSubjectId.current = activeSubject.id;
    faceTimers.current.forEach(clearTimeout);
    faceTimers.current = [];
    setFacePhase('idle');
    setFacesDetected(0);
    faceTimers.current.push(setTimeout(() => setFacePhase('scanning'), 100));
    faceTimers.current.push(setTimeout(() => setFacePhase('locking'), 500));
    faceTimers.current.push(setTimeout(() => { setFacePhase('matched'); setFacesDetected(1); }, 900));
    return () => faceTimers.current.forEach(clearTimeout);
  }, [inView, activeSubject]);

  // Feed switch glitch
  useEffect(() => {
    if (!inView) return;
    setFeedSwitching(true);
    const t = setTimeout(() => setFeedSwitching(false), 500);
    return () => clearTimeout(t);
  }, [inView, currentFeed]);

  const handleClipEnd = () => {
    // Reset videoTime FIRST to prevent race condition where stale time
    // from the old clip triggers captions meant for the new clip
    setVideoTime(0);
    setCurrentFeed(prev => (prev + 1) % FEED_CLIPS.length);
    clipPlayCountRef.current += 1;
    setClipPlayCount(prev => prev + 1);
    if (waitingForClipRef.current) {
      waitingForClipRef.current = false;
    }
  };

  // HUD clock tick
  useEffect(() => {
    if (!inView) return;
    const base = [14, 22, 7];
    const interval = setInterval(() => {
      base[2]++;
      if (base[2] >= 60) { base[2] = 0; base[1]++; }
      setHudTime(`${String(base[0]).padStart(2, '0')}:${String(base[1]).padStart(2, '0')}:${String(base[2]).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [inView]);

  // ═══ VIDEO-SYNCED CAPTION REVEAL ═══
  // Captions appear based on clip play count + video time, not fixed timers
  useEffect(() => {
    if (!inView || waitingForClipRef.current) return;
    const relativeClips = clipPlayCount - sequenceBaseRef.current;
    const nextIdx = visibleCaptions;
    if (nextIdx >= CAPTIONS.length) return;

    const cap = CAPTIONS[nextIdx];
    const shouldShow =
      relativeClips > cap.afterClips ||
      (relativeClips === cap.afterClips && videoTime >= cap.atVideoTime);

    if (shouldShow) {
      setVisibleCaptions(nextIdx + 1);
      setSentimentScore(cap.sentiment);
    }
  }, [inView, videoTime, clipPlayCount, visibleCaptions]);

  // ═══ ALERT/EMAIL SEQUENCE — triggers when all captions shown ═══
  useEffect(() => {
    if (visibleCaptions < CAPTIONS.length) return;

    const t: ReturnType<typeof setTimeout>[] = [];
    t.push(setTimeout(() => setProcessing(true), 300));
    t.push(setTimeout(() => { setProcessing(false); setAlertVisible(true); }, 2200));
    t.push(setTimeout(() => setEmailPhase('composing'), 3800));
    t.push(setTimeout(() => setEmailPhase('sending'), 5400));
    t.push(setTimeout(() => setEmailPhase('sent'), 6600));

    // Reset sequence after holding "sent" state for viewing
    t.push(setTimeout(() => {
      setVisibleCaptions(0);
      setSentimentScore(-0.12);
      setProcessing(false);
      setAlertVisible(false);
      setEmailPhase('hidden');
      sequenceBaseRef.current = clipPlayCountRef.current;
      waitingForClipRef.current = true;
    }, 14000));

    return () => t.forEach(clearTimeout);
  }, [visibleCaptions]);

  const feed = FEED_CLIPS[currentFeed];

  return (
    <div ref={containerRef} className="flex flex-col h-full">
      <style>{`
        @keyframes faceScanSweep { 0%, 100% { top: 0%; } 50% { top: 100%; } }
        @keyframes hudScanLine { 0% { top: -2px; } 100% { top: 100%; } }
        @keyframes captionSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glitchFlicker { 0%, 94%, 100% { opacity: 1; } 95% { opacity: 0.2; } 96% { opacity: 0.9; } 97% { opacity: 0.3; } 98% { opacity: 0.7; } }
      `}</style>

      {/* Section Header */}
      <div className="shrink-0 mb-3 md:mb-5">
        <div className="flex items-center gap-3 mb-1.5">
          <Radio className="size-4 text-primary" />
          <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-black/30">06_Predictive_Intelligence</h2>
        </div>
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter leading-tight text-black">Predictive Intelligence.</h3>
        <p className="text-black/50 max-w-xl text-sm sm:text-base font-medium mt-1.5">
          Monitor municipal proceedings and media signals. Detect sentiment shifts before they become project risks.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-3 md:gap-4 overflow-hidden">

        {/* ═══════════════════════════════════════════════════════
            LEFT — Surveillance Feed with Full Military HUD
            ═══════════════════════════════════════════════════════ */}
        <div className="flex-[1.3] flex flex-col border border-white/[0.06] overflow-hidden bg-[#08080D]">
          {/* Feed header bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06] bg-white/[0.02] shrink-0">
            <div className="flex items-center gap-2">
              <div className="relative flex shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              </div>
              <span className="text-[9px] font-mono text-white/50 tracking-[0.2em] font-bold">LIVE FEED</span>
              <span className="text-[8px] font-mono text-white/15 hidden sm:inline">•</span>
              <span className="text-[8px] font-mono text-white/15 tracking-wider hidden sm:inline">{feed.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="size-2.5 text-emerald-400/40 hidden sm:block" />
              <span className="text-[7px] font-mono text-white/10 tracking-wider hidden md:inline">{feed.freq}</span>
              <span className="text-[8px] font-mono text-emerald-400/50 tabular-nums font-bold">{hudTime}</span>
            </div>
          </div>

          {/* Video container with HUD */}
          <div ref={videoContainerRef} className="relative flex-1 min-h-[200px] overflow-hidden bg-[#0a0a12]">
            {/* Video feed */}
            <VideoFeed currentIndex={currentFeed} onClipEnd={handleClipEnd} onTimeUpdate={setVideoTime} />

            {/* Dark overlay for HUD readability */}
            <div className="absolute inset-0 bg-black/15 pointer-events-none" />

            {/* Feed switch glitch */}
            {feedSwitching && (
              <div className="absolute inset-0 z-40 pointer-events-none" style={{ animation: 'glitchFlicker 0.5s ease-out' }}>
                <div className="absolute inset-0 bg-black/85 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map(i => (
                        <div key={i} className="w-0.5 h-5 bg-cyan-400/40 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                      ))}
                    </div>
                    <span className="text-[8px] font-mono text-cyan-400/50 tracking-[0.4em]">ACQUIRING SIGNAL</span>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ HUD OVERLAY ═══ */}
            <div className="absolute inset-0 pointer-events-none z-10">
              {/* Scan lines — subtle horizontal stripes */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.06) 2px, rgba(0,255,255,0.06) 4px)',
              }} />

              {/* Grid overlay — very faint */}
              <div className="absolute inset-0 opacity-[0.015]" style={{
                backgroundImage: `
                  linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
              }} />

              {/* Slow scan line moving down */}
              <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent z-20"
                style={{ animation: 'hudScanLine 8s linear infinite' }} />

              {/* Vignette — darkens edges */}
              <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
              }} />

              {/* Outer corner brackets */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t border-l border-white/8" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t border-r border-white/8" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b border-l border-white/8" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b border-r border-white/8" />

              {/* Top-left: Channel info */}
              <div className="absolute top-4 left-5">
                <div className="text-[8px] font-mono text-white/35 tracking-[0.2em] font-bold">{feed.label}</div>
                <div className="text-[7px] font-mono text-white/12 tracking-wider mt-0.5">{feed.coord}</div>
              </div>

              {/* Top-right: Encryption + face counter */}
              <div className="absolute top-4 right-5 text-right">
                <div className="text-[7px] font-mono text-emerald-400/25 tracking-wider">AES-256 • ENCRYPTED</div>
                <div className="flex items-center justify-end gap-1.5 mt-1">
                  <Crosshair className="size-2.5 text-cyan-400/35" />
                  <span className={cn(
                    "text-[8px] font-mono tracking-wider font-bold transition-all duration-300",
                    facesDetected > 0 ? "text-cyan-400/50" : "text-white/15"
                  )}>
                    FACES: {facesDetected} DETECTED
                  </span>
                </div>
              </div>

              {/* ═══ FACE DETECTION BOX + BIO TAG ═══ */}
              {activeSubject && (
                <FaceBox subject={activeSubject} phase={facePhase} facePos={mapFacePos(activeSubject.facePos)} />
              )}

              {/* Bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />

              {/* Bottom bar */}
              <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between">
                <span className="text-[8px] font-mono text-white/35 tracking-wider transition-all duration-500 truncate mr-4">{feed.org}</span>
                <span className="text-[7px] font-mono text-white/15 tabular-nums shrink-0">{hudTime} EST</span>
              </div>
            </div>
          </div>

          {/* Sentiment bar below video */}
          <SentimentBar score={sentimentScore} />
        </div>

        {/* ═══════════════════════════════════════════════════════
            RIGHT — Intelligence Panel (morphs between phases)
            ═══════════════════════════════════════════════════════ */}
        <div className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-700 border",
          alertVisible && emailPhase !== 'sent'
            ? "border-amber-400/30 bg-amber-500/[0.02]"
            : emailPhase === 'sent'
            ? "border-primary/20 bg-primary/[0.02]"
            : "border-white/[0.06] bg-[#08080D]"
        )}>
          {/* Dynamic header — morphs with phase */}
          <div className={cn(
            "flex items-center justify-between px-3 py-2.5 shrink-0 border-b transition-all duration-500",
            alertVisible && emailPhase !== 'sent'
              ? "border-amber-400/20 bg-amber-500/[0.04]"
              : emailPhase === 'sent'
              ? "border-primary/10 bg-primary/[0.03]"
              : "border-white/[0.06] bg-white/[0.02]"
          )}>
            <div className="flex items-center gap-2">
              {alertVisible && emailPhase !== 'sent' ? (
                <>
                  <div className="relative flex shrink-0">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="absolute inset-0 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  </div>
                  <span className="text-[10px] font-mono tracking-[0.3em] text-amber-400 font-bold">EARLY_WARNING</span>
                </>
              ) : emailPhase === 'sent' ? (
                <>
                  <CheckCircle2 className="size-3.5 text-primary" />
                  <span className="text-[10px] font-mono tracking-[0.3em] text-primary font-bold">OWNER_NOTIFIED</span>
                </>
              ) : (
                <>
                  <Eye className="size-3 text-cyan-400/50" />
                  <span className="text-[10px] font-mono tracking-[0.3em] text-white/40">Transcript_Analysis</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 text-[8px] font-mono">
              {alertVisible && emailPhase !== 'sent' ? (
                <span className="text-amber-400/70 tracking-wider font-bold animate-pulse">CAUTION</span>
              ) : emailPhase === 'sent' ? (
                <span className="text-primary font-bold tracking-wider">DELIVERED</span>
              ) : (
                <>
                  <div className="size-1.5 rounded-full bg-cyan-400/60 animate-pulse" />
                  <span className="text-cyan-400/40 tracking-wider">MONITORING</span>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden">
            {/* Amber scan line during alert */}
            {alertVisible && emailPhase !== 'sent' && (
              <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                <div className="absolute left-0 right-0 h-px bg-amber-500/15" style={{ animation: 'hudScanLine 4s ease-in-out infinite' }} />
              </div>
            )}

            {/* ═══ LAYER 1: TRANSCRIPT CAROUSEL ═══ */}
            <div className={cn(
              "absolute inset-0 overflow-hidden transition-all duration-600 ease-out z-10",
              alertVisible ? "opacity-0 scale-[0.97] blur-sm pointer-events-none" : "opacity-100"
            )}>
              {/* Top fade mask */}
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#08080D] via-[#08080D]/80 to-transparent z-10 pointer-events-none" />

              {/* Captions anchored to bottom, push upward */}
              <div className="absolute inset-0 flex flex-col justify-end px-3 pb-3 gap-1.5">
                {CAPTIONS.slice(0, visibleCaptions).map((caption, i) => {
                  const age = Math.max(0, visibleCaptions - 1 - i);
                  const isNewest = i === visibleCaptions - 1;
                  return (
                    <div
                      key={i}
                      className={cn(
                        "shrink-0 transition-all duration-700 ease-out",
                        "border-l-2 pl-3 pr-2 py-2",
                        caption.sentiment < -0.3 ? "border-l-amber-500 bg-amber-500/[0.04]" : "border-l-white/[0.06] bg-white/[0.02]"
                      )}
                      style={{
                        opacity: Math.max(0.15, 1 - age * 0.2),
                        animation: isNewest ? 'captionSlideIn 400ms ease-out' : undefined,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-mono text-white/20 tabular-nums">[{caption.time}]</span>
                        <span className="text-[9px] font-mono text-white/40 font-bold tracking-wider">{caption.speaker}</span>
                        <span className={cn(
                          "text-[7px] font-mono font-bold uppercase tracking-wider ml-auto px-1.5 py-0.5",
                          caption.sentiment < -0.3 ? "text-amber-400 bg-amber-400/[0.08]" : "text-white/20 bg-white/[0.03]"
                        )}>
                          {caption.sentiment < -0.3 ? 'FLAG' : 'OK'}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 leading-relaxed">
                        <HighlightedCaption text={caption.text} highlights={caption.highlights} />
                      </p>
                    </div>
                  );
                })}

                {/* Processing indicator */}
                <div className={cn(
                  "shrink-0 flex items-center gap-2 py-2 pl-3 transition-all duration-500",
                  processing ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}>
                  <div className="flex gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[9px] font-mono text-amber-400/60 tracking-wide font-bold">Analyzing patterns...</span>
                </div>
              </div>
            </div>

            {/* ═══ LAYER 2: WARNING + EMAIL ═══ */}
            <div className={cn(
              "absolute inset-0 flex flex-col transition-all duration-700 ease-out z-10",
              alertVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
            )}>
              <div className="flex-1 flex flex-col p-4 md:p-5">
                {/* Warning banner — fades when recommendation appears */}
                <div className={cn(
                  "text-center mb-3 transition-all duration-500",
                  emailPhase === 'sent' ? "opacity-0 scale-95 h-0 mb-0 overflow-hidden" : "opacity-100"
                )}>
                  <div className="text-xl md:text-2xl font-bold text-amber-400 tracking-tight">
                    Caution Flagged
                  </div>
                  <div className="text-[9px] font-mono text-white/20 tracking-[0.2em] uppercase mt-1.5">{ALERT_EMAIL.project}</div>
                </div>

                {/* Risk bar */}
                <div className={cn("mb-3 transition-all duration-500", emailPhase === 'sent' ? "opacity-0 h-0 mb-0 overflow-hidden" : "opacity-100")}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono text-white/25 tracking-[0.2em] uppercase">Risk_Level</span>
                    <span className="text-sm font-mono font-bold text-amber-400 tracking-wider">{ALERT_EMAIL.risk}</span>
                  </div>
                  <div className="relative h-2 bg-white/5 overflow-hidden">
                    <div className={cn(
                      "h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-[1500ms] ease-out",
                      alertVisible ? "w-[52%]" : "w-0"
                    )}>
                      <div className="absolute inset-0 opacity-30" style={{
                        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.3) 4px, rgba(0,0,0,0.3) 8px)',
                      }} />
                    </div>
                  </div>
                </div>

                {/* Alert body */}
                <div className={cn("space-y-3 transition-all duration-500", emailPhase === 'sent' ? "opacity-0 h-0 overflow-hidden" : "opacity-100")}>
                  <p className="text-[11px] md:text-xs text-white/45 leading-relaxed">{ALERT_EMAIL.body}</p>
                  <div className="flex items-center gap-2">
                    <Mail className="size-3 text-white/15 animate-pulse" />
                    <span className="text-[9px] font-mono text-white/25 tracking-wider">
                      {emailPhase === 'composing' ? 'Composing notification...' :
                       emailPhase === 'sending' ? `Sending to ${OWNER_EMAIL.to}...` : ''}
                    </span>
                  </div>
                </div>

                {/* ═══ COUNTER RECOMMENDATION ═══ */}
                <div className={cn(
                  "flex-1 flex flex-col transition-all duration-700 ease-out",
                  emailPhase === 'sent' ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none absolute"
                )}>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                    <span className="text-[9px] font-mono text-primary font-bold tracking-wider">SENT TO {OWNER_EMAIL.to.toUpperCase()}</span>
                  </div>

                  <div className="text-lg md:text-xl font-bold text-white/85 tracking-tight mb-3">
                    Counter Recommendation
                  </div>

                  <div className="bg-primary/[0.06] border-l-[3px] border-primary py-3 px-4 mb-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <ChevronRight className="size-3 text-primary" />
                      <span className="text-[8px] font-mono font-bold text-primary uppercase tracking-wider">Recommended Action</span>
                    </div>
                    <p className="text-[11px] md:text-xs text-white/50 leading-relaxed">{OWNER_EMAIL.action}</p>
                  </div>

                  <p className="text-[10px] text-white/30 leading-relaxed">{OWNER_EMAIL.body}</p>

                  <div className="mt-auto pt-3 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-[7px] font-mono text-white/12 tracking-[0.2em] uppercase">Envision OS — Predictive Intelligence</span>
                      <div className="h-1 w-12 bg-white/5 overflow-hidden">
                        <div className="h-full w-full bg-primary/40" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
