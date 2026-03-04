'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Radio, Mail, Eye, ChevronRight, ScanFace, Send, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// FEED CLIPS — Veo 3 generated municipal meeting videos
// Two clips playing sequentially, looping
// ═══════════════════════════════════════════════════════════════
const FEED_CLIPS = [
  { src: '/feed-clip-1.mp4', label: 'CH-04 • PORTSMOUTH', coord: '36.8354°N 76.2983°W', org: 'PORTSMOUTH CITY COUNCIL — PUBLIC HEARING', ts: '14:22:07 EST', face: { top: '8%', left: '25%', width: '30%', height: '50%' } },
  { src: '/feed-clip-2.mp4', label: 'CH-12 • PHOENIX', coord: '33.4484°N 112.0740°W', org: 'PLANNING COMMISSION — DENSITY VARIANCE', ts: '16:11:53 MST', face: { top: '5%', left: '28%', width: '28%', height: '52%' } },
];

// ═══════════════════════════════════════════════════════════════
// FACIAL RECOGNITION SUBJECTS — HUD bio overlays
// ═══════════════════════════════════════════════════════════════
interface Subject {
  name: string;
  title: string;
  affiliation: string;
  stance: string;
  stanceColor: string;
  sentiment: number;
  confidence: number;
  priorAppearances: number;
  keywords: string[];
}

const SUBJECTS: Subject[] = [
  {
    name: 'COUNCILWOMAN 01',
    title: 'Commissioner — District 4',
    affiliation: 'Planning Commission',
    stance: 'OPPOSED',
    stanceColor: 'text-red-400',
    sentiment: -0.73,
    confidence: 97.2,
    priorAppearances: 14,
    keywords: ['traffic', 'density', 'shadow impact'],
  },
  {
    name: 'CONCERNED CITIZEN 01',
    title: 'Resident — Maple Street HOA',
    affiliation: 'Public Comment',
    stance: 'HOSTILE',
    stanceColor: 'text-red-500',
    sentiment: -0.85,
    confidence: 88.3,
    priorAppearances: 3,
    keywords: ['property values', 'traffic congestion'],
  },
];

// ═══════════════════════════════════════════════════════════════
// CAPTION DATA — Simulated municipal meeting transcript
// ═══════════════════════════════════════════════════════════════
interface CaptionLine {
  time: string;
  text: string;
  sentiment: number;
  speaker: string;
  highlights: Array<{ phrase: string; severity: 'high' | 'medium' }>;
}

const CAPTIONS: CaptionLine[] = [
  {
    time: '14:22',
    text: 'The traffic study presented does not adequately address peak hour congestion on Grand Avenue.',
    sentiment: -0.45,
    speaker: 'CITIZEN-01',
    highlights: [{ phrase: 'does not adequately', severity: 'medium' }],
  },
  {
    time: '14:23',
    text: 'Residents on Maple have voiced serious concerns about shadow impact on the adjacent park.',
    sentiment: -0.52,
    speaker: 'CITIZEN-01',
    highlights: [{ phrase: 'serious concerns', severity: 'medium' }],
  },
  {
    time: '14:24',
    text: "I'm not convinced the parking ratio meets our municipal code requirements for this density.",
    sentiment: -0.61,
    speaker: 'CNCL-01',
    highlights: [{ phrase: 'not convinced', severity: 'medium' }],
  },
  {
    time: '14:25',
    text: 'This is the third time this project has come before us without proper environmental review.',
    sentiment: -0.78,
    speaker: 'CNCL-01',
    highlights: [
      { phrase: 'third time', severity: 'high' },
      { phrase: 'without proper', severity: 'high' },
    ],
  },
  {
    time: '14:26',
    text: 'I move to table this application pending a revised traffic impact analysis.',
    sentiment: -0.85,
    speaker: 'CNCL-01',
    highlights: [{ phrase: 'table this application', severity: 'high' }],
  },
];

const ALERT_EMAIL = {
  subject: 'NEGATIVE SENTIMENT ALERT',
  project: 'Phoenix — 14th & Grand',
  body: 'Three commissioners signaled intent to table density variance. Traffic study cited as deficient.',
  recommendation: 'Meet with Planning Director before next hearing.',
  risk: 'HIGH (78%)',
};

const OWNER_EMAIL = {
  to: 'M. Rodriguez, VP Development',
  email: 'm.rodriguez@meridian.dev',
  subject: '14th & Grand — Planning Commission Opposition',
  body: 'Three of five commissioners indicated they will vote to table your density variance application. Primary objection: traffic study does not address peak-hour congestion on Grand Ave. Secondary: shadow impact on adjacent park.',
  action: 'Request meeting with Planning Director Kim before April 12 hearing. Submit revised traffic study with peak-hour analysis.',
};

const CYCLE_DURATION = 20000;

// ═══════════════════════════════════════════════════════════════
// HIGHLIGHTED CAPTION
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
      <span key={key++} className={cn("font-semibold", h.severity === 'high' ? 'text-red-500' : 'text-amber-500')}>
        {remaining.slice(idx, idx + h.phrase.length)}
      </span>
    );
    remaining = remaining.slice(idx + h.phrase.length);
  }
  if (remaining) result.push(<span key={key++}>{remaining}</span>);
  return <>{result}</>;
}

// ═══════════════════════════════════════════════════════════════
// SENTIMENT GAUGE
// ═══════════════════════════════════════════════════════════════
function SentimentGauge({ score }: { score: number }) {
  const pct = ((score + 1) / 2) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-black/40 uppercase">Sentiment_Score</span>
        <span className={cn(
          "text-[11px] font-mono font-bold tabular-nums",
          score < -0.5 ? "text-red-500" : score < -0.2 ? "text-amber-500" : "text-primary"
        )}>{score.toFixed(2)}</span>
      </div>
      <div className="relative h-1.5 rounded-full overflow-hidden">
        <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(to right, #ef4444 0%, #f59e0b 40%, #007C5A 100%)', opacity: 0.2 }} />
        <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(to right, #ef4444 0%, #f59e0b 40%, #007C5A 100%)' }} />
      </div>
      <div className="relative h-0 -mt-[9px]">
        <div className="absolute -translate-y-1/2 transition-all duration-1000 ease-out" style={{ left: `${pct}%` }}>
          <div className={cn("w-3 h-3 rounded-full border-2 border-white shadow-md -ml-1.5", score < -0.5 ? "bg-red-500" : score < -0.2 ? "bg-amber-500" : "bg-primary")}>
            <div className={cn("absolute inset-0 rounded-full animate-ping", score < -0.5 ? "bg-red-500/30" : score < -0.2 ? "bg-amber-500/30" : "bg-primary/30")} />
          </div>
        </div>
      </div>
      <div className="flex justify-between text-[7px] font-mono text-black/20 pt-1.5">
        <span>NEGATIVE</span><span>NEUTRAL</span><span>POSITIVE</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// VIDEO FEED — Plays two Veo 3 clips sequentially, loops
// ═══════════════════════════════════════════════════════════════
function VideoFeed({ currentIndex, onClipEnd }: { currentIndex: number; onClipEnd: () => void }) {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    // Play the current clip, pause others
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === currentIndex) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [currentIndex]);

  return (
    <div className="absolute inset-0 bg-[#0a0a12] overflow-hidden">
      {FEED_CLIPS.map((clip, i) => (
        <video
          key={clip.src}
          ref={el => { videoRefs.current[i] = el; }}
          src={clip.src}
          muted
          playsInline
          onEnded={onClipEnd}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
            i === currentIndex ? "opacity-100" : "opacity-0"
          )}
        />
      ))}
      {/* Darken slightly for HUD readability */}
      <div className="absolute inset-0 bg-black/20" />
      {/* Vignette */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
      }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FACE RECOGNITION HUD — Scanning reticle + bio panel
// ═══════════════════════════════════════════════════════════════
type FacePhase = 'scanning' | 'locking' | 'matched' | 'idle';

function FaceRecognitionHUD({ subject, phase, facePosition }: { subject: Subject; phase: FacePhase; facePosition: { top: string; left: string; width: string; height: string } }) {
  return (
    <>
      {/* Face detection reticle — position tracks face in each clip */}
      <div
        className={cn(
          "absolute transition-all ease-out",
          phase === 'idle' ? 'opacity-0 scale-110 duration-300' :
          phase === 'scanning' ? 'opacity-60 scale-[1.08] duration-1000' :
          phase === 'locking' ? 'opacity-80 scale-[1.02] duration-700' :
          'opacity-100 scale-100 duration-500'
        )}
        style={{ top: facePosition.top, left: facePosition.left, width: facePosition.width, height: facePosition.height }}
      >
        {/* Reticle corners */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cyan-400/70" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-cyan-400/70" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-cyan-400/70" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-cyan-400/70" />

        {/* Crosshair lines */}
        <div className="absolute top-1/2 left-0 w-2 h-px bg-cyan-400/30" />
        <div className="absolute top-1/2 right-0 w-2 h-px bg-cyan-400/30" />
        <div className="absolute top-0 left-1/2 w-px h-2 bg-cyan-400/30" />
        <div className="absolute bottom-0 left-1/2 w-px h-2 bg-cyan-400/30" />

        {/* Scan sweep */}
        {phase === 'scanning' && (
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
            style={{ animation: 'scanSweep 2s ease-in-out infinite' }} />
        )}

        {/* Lock pulse */}
        {phase === 'locking' && (
          <div className="absolute inset-0 border border-cyan-400/20 animate-ping" style={{ animationDuration: '1.2s' }} />
        )}

        {/* Status label */}
        <div className="absolute -top-5 left-0 right-0 text-center">
          <span className={cn(
            "text-[8px] font-mono tracking-[0.25em] uppercase font-bold transition-all duration-500",
            phase === 'scanning' ? 'text-cyan-400/60' :
            phase === 'locking' ? 'text-amber-400/80' :
            phase === 'matched' ? 'text-green-400/80' : 'text-transparent'
          )}>
            {phase === 'scanning' ? 'SCANNING...' :
             phase === 'locking' ? 'ANALYZING...' :
             phase === 'matched' ? `MATCH: ${subject.confidence}%` : ''}
          </span>
        </div>

        {/* Face outline dots (biometric points) — only when locking/matched */}
        {(phase === 'locking' || phase === 'matched') && (
          <>
            <div className="absolute top-[18%] left-[30%] w-1 h-1 rounded-full bg-cyan-400/60" />
            <div className="absolute top-[18%] right-[30%] w-1 h-1 rounded-full bg-cyan-400/60" />
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400/40" />
            <div className="absolute top-[55%] left-1/2 -translate-x-1/2 w-1.5 h-px bg-cyan-400/40" />
            <div className="absolute top-[25%] left-[25%] right-[25%] h-px bg-cyan-400/10" />
            <div className="absolute top-[45%] left-[28%] right-[28%] h-px bg-cyan-400/10" />
          </>
        )}
      </div>

      {/* Bio panel */}
      <div className={cn(
        "absolute right-2 top-[8%] w-[44%] max-w-[210px] transition-all duration-700 ease-out",
        phase === 'matched' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
      )}>
        <div className="bg-black/85 backdrop-blur-sm border border-cyan-400/25 p-2.5">
          <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-cyan-400/15">
            <ScanFace className="size-3 text-cyan-400/70" />
            <span className="text-[7px] font-mono text-cyan-400/70 tracking-[0.2em] font-bold">ID CONFIRMED</span>
            <div className="ml-auto size-1.5 rounded-full bg-green-400/70 animate-pulse" />
          </div>

          <div className="mb-2">
            <div className="text-[10px] font-mono text-white/95 font-bold tracking-wide">{subject.name}</div>
            <div className="text-[7px] font-mono text-white/45 tracking-wider mt-0.5">{subject.title}</div>
            <div className="text-[7px] font-mono text-white/30 tracking-wider">{subject.affiliation}</div>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-2">
            <div>
              <div className="text-[6px] font-mono text-white/20 tracking-widest uppercase">Stance</div>
              <div className={cn("text-[9px] font-mono font-bold", subject.stanceColor)}>{subject.stance}</div>
            </div>
            <div>
              <div className="text-[6px] font-mono text-white/20 tracking-widest uppercase">Sentiment</div>
              <div className={cn("text-[9px] font-mono font-bold",
                subject.sentiment < -0.5 ? "text-red-400" : subject.sentiment < -0.2 ? "text-amber-400" : "text-green-400"
              )}>{subject.sentiment.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-[6px] font-mono text-white/20 tracking-widest uppercase">Appearances</div>
              <div className="text-[9px] font-mono text-white/65">{subject.priorAppearances}</div>
            </div>
            <div>
              <div className="text-[6px] font-mono text-white/20 tracking-widest uppercase">Confidence</div>
              <div className="text-[9px] font-mono text-green-400">{subject.confidence}%</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 pt-1.5 border-t border-white/8">
            {subject.keywords.map((kw) => (
              <span key={kw} className="text-[6px] font-mono bg-white/8 text-white/45 px-1 py-0.5 tracking-wider uppercase">{kw}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export function PredictSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [visibleCaptions, setVisibleCaptions] = useState(0);
  const [sentimentScore, setSentimentScore] = useState(-0.12);
  const [processing, setProcessing] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const [currentFeed, setCurrentFeed] = useState(0);
  const [facePhase, setFacePhase] = useState<FacePhase>('idle');
  const [currentSubject, setCurrentSubject] = useState(0);
  const [feedSwitching, setFeedSwitching] = useState(false);
  const [emailPhase, setEmailPhase] = useState<'hidden' | 'composing' | 'sending' | 'sent'>('hidden');

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

  // Face recognition sequence — triggered when feed changes
  const faceTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!inView) return;
    // Clear previous face timers
    faceTimers.current.forEach(clearTimeout);
    faceTimers.current = [];

    setFacePhase('idle');
    setFeedSwitching(true);

    faceTimers.current.push(setTimeout(() => setFeedSwitching(false), 400));
    faceTimers.current.push(setTimeout(() => setFacePhase('scanning'), 1200));
    faceTimers.current.push(setTimeout(() => setFacePhase('locking'), 3000));
    faceTimers.current.push(setTimeout(() => setFacePhase('matched'), 4200));

    return () => faceTimers.current.forEach(clearTimeout);
  }, [inView, currentFeed]);

  // Handle video clip ending — advance to next clip
  const handleClipEnd = () => {
    setCurrentFeed(prev => (prev + 1) % FEED_CLIPS.length);
    setCurrentSubject(prev => (prev + 1) % SUBJECTS.length);
  };

  // Caption + alert sequence
  useEffect(() => {
    if (!inView) return;

    setVisibleCaptions(0);
    setSentimentScore(-0.12);
    setProcessing(false);
    setAlertVisible(false);
    setEmailPhase('hidden');

    const t: ReturnType<typeof setTimeout>[] = [];

    CAPTIONS.forEach((caption, i) => {
      t.push(setTimeout(() => {
        setVisibleCaptions(i + 1);
        setSentimentScore(caption.sentiment);
      }, 1000 + i * 1400));
    });

    const afterCaptions = 1000 + CAPTIONS.length * 1400;
    t.push(setTimeout(() => setProcessing(true), afterCaptions + 200));
    t.push(setTimeout(() => { setProcessing(false); setAlertVisible(true); }, afterCaptions + 1800));
    // Email sequence — composing → sending → sent
    t.push(setTimeout(() => setEmailPhase('composing'), afterCaptions + 3200));
    t.push(setTimeout(() => setEmailPhase('sending'), afterCaptions + 4800));
    t.push(setTimeout(() => setEmailPhase('sent'), afterCaptions + 6000));
    t.push(setTimeout(() => setCycle(c => c + 1), CYCLE_DURATION));

    return () => t.forEach(clearTimeout);
  }, [inView, cycle]);

  const feed = FEED_CLIPS[currentFeed];
  const subject = SUBJECTS[currentSubject];

  return (
    <div ref={containerRef} className="flex flex-col h-full">
      <style>{`
        @keyframes scanSweep { 0%, 100% { top: 0%; } 50% { top: 100%; } }
      `}</style>

      {/* Header */}
      <div className="shrink-0 mb-2 md:mb-4">
        <div className="flex items-center gap-3 mb-1.5 md:mb-2">
          <Radio className="size-4 text-primary" />
          <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-black/40">06_Predictive_Intelligence</h2>
        </div>
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter leading-tight">Predictive Intelligence.</h3>
        <p className="text-black/60 max-w-xl text-sm sm:text-base font-medium mt-1.5 md:mt-2">
          Monitor municipal proceedings and media signals. Detect sentiment shifts before they become project risks.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-3 md:gap-4 overflow-hidden">

        {/* LEFT — Surveillance Feed + Sentiment Gauge */}
        <Card className="bg-white border-black/5 shadow-2xl overflow-hidden flex-[1.2] flex flex-col rounded-none">
          <CardHeader className="border-b border-black/5 bg-gray-50/50 py-2.5 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-red-500 animate-pulse" />
                <CardTitle className="text-[10px] tracking-[0.3em] text-black/60">Municipal_Meeting_Feed</CardTitle>
              </div>
              <div className="flex items-center gap-3 text-[8px] font-mono">
                <span className="text-red-500/70 uppercase tracking-wider font-bold">LIVE</span>
                <span className="text-black/25 transition-all duration-500">{feed.label}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col min-h-0">
            <div className="relative flex-1 min-h-[180px] overflow-hidden">
              {/* Video feed — Veo 3 municipal meeting clips */}
              <VideoFeed currentIndex={currentFeed} onClipEnd={handleClipEnd} />

              {/* Feed switch glitch */}
              {feedSwitching && (
                <div className="absolute inset-0 z-30 bg-black/90 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-0.5 h-4 bg-cyan-400/50 animate-pulse" style={{ animationDelay: `${i * 120}ms` }} />
                      ))}
                    </div>
                    <span className="text-[7px] font-mono text-cyan-400/40 tracking-[0.3em]">ACQUIRING FEED</span>
                  </div>
                </div>
              )}

              {/* HUD overlay */}
              <div className="absolute inset-0 pointer-events-none z-10">
                {/* Scan lines */}
                <div className="absolute inset-0 opacity-[0.04]" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)',
                }} />

                {/* REC */}
                <div className="absolute top-2.5 left-3 flex items-center gap-1.5">
                  <div className="relative flex shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  </div>
                  <span className="text-[8px] font-mono text-white/60 uppercase tracking-[0.2em] font-bold">REC</span>
                </div>

                {/* Channel info */}
                <div className="absolute top-2.5 right-3 text-right">
                  <div className="text-[7px] font-mono text-cyan-400/40 tracking-wider transition-all duration-500">{feed.label}</div>
                  <div className="text-[7px] font-mono text-white/20 tracking-wider">ENC: AES-256</div>
                  <div className="text-[7px] font-mono text-white/15 tracking-wider mt-0.5">{feed.ts}</div>
                </div>

                {/* Face recognition */}
                <FaceRecognitionHUD subject={subject} phase={facePhase} facePosition={feed.face} />

                {/* Corner brackets */}
                <div className="absolute top-1 left-1 w-4 h-4 border-t border-l border-white/10" />
                <div className="absolute top-1 right-1 w-4 h-4 border-t border-r border-white/10" />
                <div className="absolute bottom-1 left-1 w-4 h-4 border-b border-l border-white/10" />
                <div className="absolute bottom-1 right-1 w-4 h-4 border-b border-r border-white/10" />

                {/* Bottom bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent h-16" />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                  <span className="text-[8px] font-mono text-white/50 tracking-wider transition-all duration-500">{feed.org}</span>
                  <span className="text-[7px] font-mono text-white/25 transition-all duration-500">{feed.coord}</span>
                </div>
              </div>
            </div>

            <div className="p-3 md:p-4 border-t border-black/5 shrink-0">
              <SentimentGauge score={sentimentScore} />
            </div>
          </CardContent>
        </Card>

        {/* RIGHT — Intelligence Feed */}
        <div className="flex flex-col gap-3 md:gap-3 flex-1 min-h-0 overflow-auto no-scrollbar">
          {/* Caption Transcript */}
          <Card className="bg-white border-black/5 shadow-2xl overflow-hidden flex-1 flex flex-col rounded-none">
            <CardHeader className="border-b border-black/5 bg-gray-50/50 py-2.5 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="size-3 text-primary/50" />
                  <CardTitle className="text-[10px] tracking-[0.3em] text-black/60">Realtime_Transcript_Analysis</CardTitle>
                </div>
                <div className="flex items-center gap-2 text-[8px] font-mono">
                  <div className="size-1.5 rounded-full bg-primary animate-status" />
                  <span className="text-primary/60 uppercase tracking-wider">Analyzing</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 flex-1 overflow-auto no-scrollbar">
              <div className="space-y-2.5">
                {CAPTIONS.map((caption, i) => {
                  const visible = i < visibleCaptions;
                  return (
                    <div key={i} className="transition-all duration-500" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)' }}>
                      <div className="flex items-start gap-2">
                        <span className="text-[9px] font-mono text-black/25 mt-0.5 shrink-0">[{caption.time}]</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[8px] font-mono text-black/40 font-bold tracking-wider">{caption.speaker}</span>
                          </div>
                          <p className="text-[11px] text-black/70 leading-relaxed">
                            {visible ? <HighlightedCaption text={caption.text} highlights={caption.highlights} /> : caption.text}
                          </p>
                          {visible && (
                            <div className="flex items-center gap-2 mt-1">
                              <div className={cn("h-0.5 rounded-full transition-all duration-700",
                                caption.sentiment < -0.6 ? "bg-red-500/40 w-16" : caption.sentiment < -0.3 ? "bg-amber-500/40 w-12" : "bg-primary/40 w-8"
                              )} />
                              <span className={cn("text-[8px] font-mono font-bold uppercase tracking-wider",
                                caption.sentiment < -0.6 ? "text-red-500/50" : caption.sentiment < -0.3 ? "text-amber-500/50" : "text-primary/50"
                              )}>
                                {caption.sentiment < -0.6 ? 'HIGH_NEG' : caption.sentiment < -0.3 ? 'MOD_NEG' : 'LOW_NEG'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="flex items-center gap-2 py-1.5 transition-all duration-500" style={{ opacity: processing ? 1 : 0 }}>
                  <div className="flex gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[9px] font-mono text-primary/60 tracking-wide">Analyzing sentiment patterns...</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alert Email */}
          <Card className={cn(
            "bg-white border-red-200 shadow-2xl overflow-hidden shrink-0 rounded-none transition-all duration-700",
            alertVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          )}>
            <CardHeader className="border-b border-red-100 bg-red-50/50 py-2 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative flex shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  </div>
                  <CardTitle className="text-[9px] tracking-[0.2em] text-red-600 font-bold uppercase">{ALERT_EMAIL.subject}</CardTitle>
                </div>
                <Mail className="size-3 text-red-400/50" />
              </div>
            </CardHeader>
            <CardContent className="p-2.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono text-black/30 uppercase tracking-wider">{ALERT_EMAIL.project}</span>
                <span className="text-[8px] font-mono text-red-500 font-bold">RISK: {ALERT_EMAIL.risk}</span>
              </div>
              <p className="text-[10px] text-black/70 leading-relaxed">{ALERT_EMAIL.body}</p>
              <div className="flex items-center gap-1 pt-1 border-t border-red-100">
                <ChevronRight className="size-2.5 text-primary" />
                <span className="text-[9px] font-mono text-primary/70">{ALERT_EMAIL.recommendation}</span>
              </div>
            </CardContent>
          </Card>

          {/* Owner Email Notification — slides in after alert */}
          <Card className={cn(
            "shrink-0 rounded-none overflow-hidden transition-all duration-700 ease-out",
            emailPhase !== 'hidden'
              ? "opacity-100 translate-y-0 border-primary/20 shadow-2xl"
              : "opacity-0 translate-y-4 border-transparent shadow-none",
            emailPhase === 'sent' && "border-primary/30"
          )}>
            <CardHeader className={cn(
              "py-2 shrink-0 transition-colors duration-500",
              emailPhase === 'sent' ? "bg-primary/5 border-b border-primary/10" : "bg-gray-50/50 border-b border-black/5"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {emailPhase === 'sent' ? (
                    <CheckCircle2 className="size-3 text-primary" />
                  ) : emailPhase === 'sending' ? (
                    <Send className="size-3 text-primary animate-pulse" />
                  ) : (
                    <Mail className="size-3 text-black/40" />
                  )}
                  <CardTitle className="text-[9px] tracking-[0.2em] text-black/60 font-bold uppercase">
                    {emailPhase === 'sent' ? 'Notification Delivered' : emailPhase === 'sending' ? 'Sending Notification...' : 'Composing Notification'}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-1.5">
                  {emailPhase === 'sending' && (
                    <div className="flex gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '100ms' }} />
                      <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '200ms' }} />
                    </div>
                  )}
                  {emailPhase === 'sent' && (
                    <span className="text-[8px] font-mono text-primary font-bold tracking-wider">DELIVERED</span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              {/* To / Subject */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-mono text-black/30 uppercase tracking-wider w-7 shrink-0">To:</span>
                  <span className="text-[10px] font-mono text-black/70 font-medium">{OWNER_EMAIL.to}</span>
                  <span className="text-[8px] font-mono text-black/25">&lt;{OWNER_EMAIL.email}&gt;</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[8px] font-mono text-black/30 uppercase tracking-wider w-7 shrink-0 mt-0.5">Subj:</span>
                  <span className="text-[10px] font-mono text-black/70 font-medium">{OWNER_EMAIL.subject}</span>
                </div>
              </div>
              <div className="border-t border-black/5 pt-2">
                <p className="text-[10px] text-black/60 leading-relaxed">{OWNER_EMAIL.body}</p>
              </div>
              <div className="bg-primary/[0.03] border border-primary/10 p-2">
                <div className="flex items-center gap-1 mb-1">
                  <ChevronRight className="size-2.5 text-primary" />
                  <span className="text-[8px] font-mono font-bold text-primary uppercase tracking-wider">Recommended Action</span>
                </div>
                <p className="text-[10px] text-black/55 leading-relaxed">{OWNER_EMAIL.action}</p>
              </div>
              {/* Send progress bar */}
              <div className="pt-1">
                <div className="h-0.5 w-full bg-black/[0.03] rounded-full overflow-hidden">
                  <div className={cn(
                    "h-full rounded-full transition-all ease-out",
                    emailPhase === 'composing' ? "w-[30%] bg-black/10 duration-1000" :
                    emailPhase === 'sending' ? "w-[85%] bg-primary/40 duration-1200" :
                    emailPhase === 'sent' ? "w-full bg-primary duration-500" : "w-0 duration-0"
                  )} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[7px] font-mono text-black/20 tracking-[0.3em] uppercase">Envision OS — Predictive Intelligence</span>
                {emailPhase === 'sent' && (
                  <span className="text-[7px] font-mono text-primary/50 tracking-wider">
                    {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} EST
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
