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
  { src: '/feed-clip-1.mp4', label: 'CH-04 • PORTSMOUTH', coord: '36.8354°N 76.2983°W', org: 'PORTSMOUTH CITY COUNCIL — PUBLIC HEARING', ts: '14:22:07 EST', face: { top: '8%', left: '30%', width: '25%', height: '44%' } },
  { src: '/feed-clip-2.mp4', label: 'CH-12 • PHOENIX', coord: '33.4484°N 112.0740°W', org: 'PLANNING COMMISSION — DENSITY VARIANCE', ts: '16:11:53 MST', face: { top: '6%', left: '28%', width: '26%', height: '46%' } },
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
  facePos: { top: string; left: string; width: string; height: string };
}

const SUBJECTS: Subject[] = [
  {
    name: 'COUNCILMAN 01',
    title: 'Chair — Planning Commission',
    affiliation: 'Planning Commission',
    stance: 'CAUTIOUS',
    stanceColor: 'text-amber-400',
    sentiment: -0.31,
    confidence: 97.2,
    priorAppearances: 14,
    keywords: ['traffic', 'conditions'],
    facePos: { top: '6%', left: '22%', width: '28%', height: '48%' },
  },
  {
    name: 'CONCERNED CITIZEN 01',
    title: 'Resident — Maple Street HOA',
    affiliation: 'Public Comment',
    stance: 'INQUIRING',
    stanceColor: 'text-amber-500',
    sentiment: -0.22,
    confidence: 88.3,
    priorAppearances: 3,
    keywords: ['parking', 'traffic'],
    facePos: { top: '4%', left: '34%', width: '26%', height: '46%' },
  },
  {
    name: 'DIR. KAPOOR',
    title: 'Zoning Administrator',
    affiliation: 'Dept. of Planning',
    stance: 'NEUTRAL',
    stanceColor: 'text-white/60',
    sentiment: -0.08,
    confidence: 94.5,
    priorAppearances: 22,
    keywords: ['setback', 'density'],
    facePos: { top: '8%', left: '55%', width: '24%', height: '44%' },
  },
  {
    name: 'A. TORRES',
    title: 'Transportation Planner',
    affiliation: 'Public Works',
    stance: 'CAUTIOUS',
    stanceColor: 'text-amber-400',
    sentiment: -0.35,
    confidence: 91.0,
    priorAppearances: 8,
    keywords: ['traffic counts', 'school zone'],
    facePos: { top: '10%', left: '6%', width: '24%', height: '44%' },
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
  subjectIdx: number;
  highlights: Array<{ phrase: string; severity: 'high' | 'medium' }>;
}

const CAPTIONS: CaptionLine[] = [
  {
    time: '14:22',
    text: 'The revised site plan addresses several of our previous concerns. Good progress overall.',
    sentiment: 0.1,
    speaker: 'CNCL-01',
    subjectIdx: 0,
    highlights: [],
  },
  {
    time: '14:23',
    text: 'Could the applicant clarify the proposed parking ratio for the residential units?',
    sentiment: -0.1,
    speaker: 'CITIZEN-01',
    subjectIdx: 1,
    highlights: [],
  },
  {
    time: '14:24',
    text: 'The setback meets the revised zoning overlay. No code issues on my end.',
    sentiment: 0.05,
    speaker: 'DIR-KAPOOR',
    subjectIdx: 2,
    highlights: [],
  },
  {
    time: '14:25',
    text: "I'd like to see additional data on afternoon traffic patterns near the school zone before we proceed.",
    sentiment: -0.35,
    speaker: 'A-TORRES',
    subjectIdx: 3,
    highlights: [{ phrase: 'additional data', severity: 'medium' }, { phrase: 'before we proceed', severity: 'medium' }],
  },
  {
    time: '14:26',
    text: "I'm inclined to support this with conditions — let's address the outstanding traffic questions first.",
    sentiment: -0.15,
    speaker: 'CNCL-01',
    subjectIdx: 0,
    highlights: [{ phrase: 'with conditions', severity: 'medium' }],
  },
];

const ALERT_EMAIL = {
  subject: 'EARLY WARNING',
  project: 'Phoenix — 14th & Grand',
  body: 'Two commissioners requested supplemental traffic data before final vote. Shadow study extension also mentioned.',
  recommendation: 'Schedule pre-application meeting with Planning Director. Prepare afternoon traffic counts and winter shadow study.',
  risk: 'MODERATE (52%)',
};

const OWNER_EMAIL = {
  to: 'OWNER, VP DEVELOPMENT',
  email: 'owner@meridian.dev',
  subject: '14th & Grand — Outstanding Conditions',
  body: 'Commissioners want supplemental afternoon traffic data and an extended winter shadow study before voting on density variance. Tone was constructive — willingness to approve with conditions.',
  action: 'Meet with Planning Director Kim this week. Submit afternoon traffic counts and winter shadow study before April 12 hearing.',
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
      {/* Face detection reticle */}
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
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-400/60" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-400/60" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-cyan-400/60" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan-400/60" />

        {/* Scan sweep */}
        {phase === 'scanning' && (
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
            style={{ animation: 'scanSweep 2s ease-in-out infinite' }} />
        )}

        {/* Lock pulse */}
        {phase === 'locking' && (
          <div className="absolute inset-0 border border-cyan-400/15 animate-ping" style={{ animationDuration: '1.2s' }} />
        )}
      </div>

      {/* Minimal bio badge — fixed position, slides in from right */}
      <div
        className={cn(
          "absolute z-20 right-3 transition-all duration-400 ease-out",
          phase === 'matched'
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-6'
        )}
        style={{ top: `${parseFloat(facePosition.top) + parseFloat(facePosition.height) + 3}%` }}
      >
        <div className="bg-black/75 backdrop-blur-sm border border-cyan-400/20 px-2.5 py-1.5 flex items-center gap-2">
          <ScanFace className="size-3 text-cyan-400/60 shrink-0" />
          <div>
            <div className="text-[9px] font-mono text-white/90 font-bold tracking-wide">{subject.name}</div>
            <div className="text-[7px] font-mono text-white/40 tracking-wider">{subject.title}</div>
          </div>
          <span className={cn("text-[8px] font-mono font-bold ml-1 shrink-0", subject.stanceColor)}>{subject.stance}</span>
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
  const [currentSubject, setCurrentSubject] = useState(-1);
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

  // Face recognition sequence — triggered when subject changes (speaker switches)
  const faceTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!inView || currentSubject < 0) return;
    // Clear previous face timers
    faceTimers.current.forEach(clearTimeout);
    faceTimers.current = [];

    // Fast scan → lock → match for every speaker switch
    setFacePhase('idle');
    faceTimers.current.push(setTimeout(() => setFacePhase('scanning'), 80));
    faceTimers.current.push(setTimeout(() => setFacePhase('locking'), 300));
    faceTimers.current.push(setTimeout(() => setFacePhase('matched'), 550));

    return () => faceTimers.current.forEach(clearTimeout);
  }, [inView, currentSubject]);

  // Feed switch glitch — triggered when video clip changes
  useEffect(() => {
    if (!inView) return;
    setFeedSwitching(true);
    const t = setTimeout(() => setFeedSwitching(false), 400);
    return () => clearTimeout(t);
  }, [inView, currentFeed]);

  // Handle video clip ending — advance to next clip
  const handleClipEnd = () => {
    setCurrentFeed(prev => (prev + 1) % FEED_CLIPS.length);
  };

  // Caption + alert sequence
  useEffect(() => {
    if (!inView) return;

    setVisibleCaptions(0);
    setSentimentScore(-0.12);
    setProcessing(false);
    setAlertVisible(false);
    setEmailPhase('hidden');
    setCurrentSubject(-1);
    setFacePhase('idle');

    const t: ReturnType<typeof setTimeout>[] = [];

    CAPTIONS.forEach((caption, i) => {
      t.push(setTimeout(() => {
        setVisibleCaptions(i + 1);
        setSentimentScore(caption.sentiment);
        setCurrentSubject(caption.subjectIdx);
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
  const subject = currentSubject >= 0 ? SUBJECTS[currentSubject] : null;

  return (
    <div ref={containerRef} className="flex flex-col h-full">
      <style>{`
        @keyframes scanSweep { 0%, 100% { top: 0%; } 50% { top: 100%; } }
        @keyframes captionSlideIn { from { opacity: 0; transform: translateY(16px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
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
              <span className="text-[8px] font-mono text-black/25 transition-all duration-500">{feed.ts}</span>
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
                  <div className="text-[7px] font-mono text-white/20 tracking-wider">ENC: AES-256</div>
                  <div className="text-[7px] font-mono text-white/15 tracking-wider mt-0.5">{feed.ts}</div>
                </div>


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

        {/* RIGHT — Unified Intelligence Panel (morphs between phases) */}
        <Card className={cn(
          "flex-1 flex flex-col rounded-none overflow-hidden transition-all duration-700",
          alertVisible && emailPhase !== 'sent'
            ? "border-amber-400/40 shadow-[0_0_60px_-12px_rgba(245,158,11,0.2)]"
            : emailPhase === 'sent'
            ? "border-primary/25 shadow-[0_0_60px_-12px_rgba(0,124,90,0.2)]"
            : "border-black/5 shadow-2xl"
        )}>
          {/* Dynamic header — morphs with phase */}
          <CardHeader className={cn(
            "py-2.5 shrink-0 transition-all duration-500",
            alertVisible && emailPhase !== 'sent'
              ? "bg-amber-500/[0.06] border-b border-amber-300/40"
              : emailPhase === 'sent'
              ? "bg-primary/5 border-b border-primary/10"
              : "bg-gray-50/50 border-b border-black/5"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {alertVisible && emailPhase !== 'sent' ? (
                  <>
                    <div className="relative flex shrink-0">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="absolute inset-0 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    </div>
                    <CardTitle className="text-[10px] tracking-[0.3em] text-amber-600 font-bold">EARLY_WARNING</CardTitle>
                  </>
                ) : emailPhase === 'sent' ? (
                  <>
                    <CheckCircle2 className="size-3.5 text-primary" />
                    <CardTitle className="text-[10px] tracking-[0.3em] text-primary font-bold">OWNER_NOTIFIED</CardTitle>
                  </>
                ) : (
                  <>
                    <Eye className="size-3 text-primary/50" />
                    <CardTitle className="text-[10px] tracking-[0.3em] text-black/60">Transcript_Analysis</CardTitle>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 text-[8px] font-mono">
                {alertVisible && emailPhase !== 'sent' ? (
                  <span className="text-amber-500/70 uppercase tracking-wider font-bold animate-pulse">CAUTION</span>
                ) : emailPhase === 'sent' ? (
                  <span className="text-primary font-bold tracking-wider">DELIVERED</span>
                ) : (
                  <>
                    <div className="size-1.5 rounded-full bg-primary animate-status" />
                    <span className="text-primary/60 uppercase tracking-wider">Analyzing</span>
                  </>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 relative overflow-hidden">
            {/* Scan line when alert is active */}
            {alertVisible && emailPhase !== 'sent' && (
              <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                <div className="absolute left-0 right-0 h-px bg-amber-500/15" style={{ animation: 'scanSweep 4s ease-in-out infinite' }} />
              </div>
            )}

            {/* ═══ LAYER 1: TRANSCRIPT CAROUSEL (anchored bottom, scrolls up) ═══ */}
            <div className={cn(
              "absolute inset-0 overflow-hidden transition-all duration-600 ease-out z-10",
              alertVisible ? "opacity-0 scale-[0.97] blur-sm pointer-events-none" : "opacity-100 scale-100 blur-0"
            )}>
              {/* Top gradient mask — fades old captions out */}
              <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />

              {/* Captions anchored to bottom, push upward — only render visible ones */}
              <div className="absolute inset-0 flex flex-col justify-end px-3 pb-3 gap-2">
                {CAPTIONS.slice(0, visibleCaptions).map((caption, i) => {
                  const age = Math.max(0, visibleCaptions - 1 - i);
                  const isNewest = i === visibleCaptions - 1;
                  return (
                    <div
                      key={i}
                      className={cn(
                        "shrink-0 transition-all duration-700 ease-out",
                        "border-l-2 pl-3 pr-2 py-2 bg-black/[0.02]",
                        caption.sentiment < -0.6 ? "border-l-red-500" : caption.sentiment < -0.3 ? "border-l-amber-500" : "border-l-primary/40"
                      )}
                      style={{
                        opacity: Math.max(0.15, 1 - age * 0.2),
                        transform: isNewest ? 'translateY(0) scale(1)' : `translateY(0) scale(${1 - age * 0.008})`,
                        animation: isNewest ? 'captionSlideIn 500ms ease-out' : undefined,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-black/30">[{caption.time}]</span>
                        <span className="text-[10px] font-mono text-black/50 font-bold tracking-wider">{caption.speaker}</span>
                        <span className={cn(
                          "text-[8px] font-mono font-bold uppercase tracking-wider ml-auto px-1.5 py-0.5",
                          caption.sentiment < -0.6 ? "text-red-500 bg-red-500/[0.06]" : caption.sentiment < -0.3 ? "text-amber-500 bg-amber-500/[0.06]" : "text-primary/50 bg-primary/[0.04]"
                        )}>
                          {caption.sentiment < -0.6 ? 'HIGH' : caption.sentiment < -0.3 ? 'MOD' : 'LOW'}
                        </span>
                      </div>
                      <p className="text-xs text-black/75 leading-relaxed">
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
                  <span className="text-[10px] font-mono text-amber-500/70 tracking-wide font-bold">Analyzing sentiment patterns...</span>
                </div>
              </div>
            </div>

            {/* ═══ LAYER 2: WARNING + EMAIL (fades in when alert triggers) ═══ */}
            <div className={cn(
              "absolute inset-0 flex flex-col transition-all duration-700 ease-out z-10",
              alertVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
            )}>
              <div className="flex-1 flex flex-col p-4 md:p-5">
                {/* Warning banner — fades when counter recommendation appears */}
                <div className={cn(
                  "text-center mb-3 md:mb-4 transition-all duration-500",
                  emailPhase === 'sent' ? "opacity-0 scale-95 h-0 mb-0 overflow-hidden" : "opacity-100 scale-100"
                )}>
                  <div className="text-xl md:text-3xl font-bold text-amber-600 tracking-tight leading-tight">
                    Caution Flagged
                  </div>
                  <div className="text-[10px] font-mono text-black/35 tracking-[0.2em] uppercase mt-2">{ALERT_EMAIL.project}</div>
                </div>

                {/* Risk bar — fades when counter recommendation appears */}
                <div className={cn("mb-3 md:mb-4 transition-all duration-500", emailPhase === 'sent' ? "opacity-0 h-0 mb-0 overflow-hidden" : "opacity-100")}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-black/40 uppercase">Risk_Level</span>
                    <span className="text-sm font-mono font-bold text-amber-500 tracking-wider">MODERATE — 52%</span>
                  </div>
                  <div className="relative h-3 bg-black/[0.04] overflow-hidden">
                    <div className={cn(
                      "h-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 transition-all duration-[1500ms] ease-out",
                      alertVisible ? "w-[52%]" : "w-0"
                    )}>
                      <div className="absolute inset-0 opacity-25" style={{
                        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(255,255,255,0.4) 6px, rgba(255,255,255,0.4) 12px)',
                      }} />
                    </div>
                  </div>
                </div>

                {/* Alert body — fades when counter recommendation appears */}
                <div className={cn("space-y-3 transition-all duration-500", emailPhase === 'sent' ? "opacity-0 h-0 overflow-hidden" : "opacity-100")}>
                  <p className="text-xs md:text-sm text-black/70 leading-relaxed">{ALERT_EMAIL.body}</p>
                  <div className="flex items-center gap-2">
                    <Mail className="size-3.5 text-black/30 animate-pulse" />
                    <span className="text-[10px] font-mono text-black/40 tracking-wider">
                      {emailPhase === 'composing' ? 'Composing owner notification...' :
                       emailPhase === 'sending' ? `Sending to ${OWNER_EMAIL.to}...` : ''}
                    </span>
                  </div>
                </div>

                {/* COUNTER RECOMMENDATION — appears when OWNER_NOTIFIED */}
                <div className={cn(
                  "flex-1 flex flex-col transition-all duration-700 ease-out",
                  emailPhase === 'sent' ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none absolute"
                )}>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="size-4 text-primary shrink-0" />
                    <span className="text-[10px] font-mono text-primary font-bold tracking-wider">SENT TO {OWNER_EMAIL.to.toUpperCase()}</span>
                  </div>

                  <div className="text-lg md:text-2xl font-bold text-black/85 tracking-tight leading-tight mb-3">
                    Counter Recommendation
                  </div>

                  <div className="bg-primary/[0.05] border-l-[3px] border-primary py-3 px-4 mb-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <ChevronRight className="size-3 text-primary" />
                      <span className="text-[9px] font-mono font-bold text-primary uppercase tracking-wider">Recommended Action</span>
                    </div>
                    <p className="text-xs md:text-sm text-black/70 leading-relaxed">{OWNER_EMAIL.action}</p>
                  </div>

                  <p className="text-[11px] md:text-xs text-black/50 leading-relaxed">{OWNER_EMAIL.body}</p>

                  <div className="mt-auto pt-3 border-t border-primary/10">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-mono text-black/25 tracking-[0.2em] uppercase">Envision OS — Predictive Intelligence</span>
                      <div className="h-1 w-16 bg-primary/10 overflow-hidden">
                        <div className="h-full w-full bg-primary/40 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
