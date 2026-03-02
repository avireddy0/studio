'use client'

import { useMemo } from 'react'

// ─── DOCUMENT TYPES ─────────────────────────────────────────
const FLOW_TYPES = [
  { label: 'EMAIL', color: '#3B82F6' },
  { label: 'TEXT',  color: '#8B5CF6' },
  { label: 'DOC',   color: '#EF4444' },
  { label: 'MSG',   color: '#F59E0B' },
  { label: 'CALL',  color: '#10B981' },
  { label: 'PDF',   color: '#DC2626' },
  { label: 'XLS',   color: '#16A34A' },
  { label: 'RFI',   color: '#D97706' },
  { label: 'BIM',   color: '#7C3AED' },
  { label: 'PHOTO', color: '#EC4899' },
  { label: 'INV',   color: '#F97316' },
] as const

const ITEM_COUNT = 24
const STAGGER = 0.14   // seconds between each item's start
const DURATION = 3.5   // seconds for one flight across

// ─── OUTPUT JSON LINES ──────────────────────────────────────
const OUTPUT_LINES = [
  '{ "type": "rfi", "status": "verified", "confidence": 0.97 }',
  '{ "budget": "$2.4M", "variance": "-3.2%", "flagged": false }',
  '{ "milestone": "Phase_2", "days_ahead": 4, "risk": "low" }',
]

// ─── COMPONENT ──────────────────────────────────────────────
export function IngestionFunnel() {
  const flowItems = useMemo(() => {
    const items = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      const type = FLOW_TYPES[i % FLOW_TYPES.length]
      // Distribute Y offsets evenly across ±120px with deterministic jitter
      const baseY = -120 + (i / (ITEM_COUNT - 1)) * 240
      const jitter = Math.sin(i * 7.3) * 18
      const yOffset = Math.round(baseY + jitter)
      const rotation = Math.round(Math.sin(i * 4.7) * 14)
      // Negative delay so scene is pre-populated from frame 1
      const delay = i * STAGGER - DURATION
      items.push({ ...type, yOffset, rotation, delay, id: i })
    }
    return items
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden">

      {/* ── FLOW ITEMS: chaotic documents vacuumed from left → center ── */}
      {flowItems.map((item) => (
        <div
          key={item.id}
          className="ingest-flow-item absolute left-[2%] top-1/2"
          style={{
            '--d': `${item.delay}s`,
            '--y': `${item.yOffset}px`,
            '--r': `${item.rotation}deg`,
          } as React.CSSProperties}
        >
          {/* White document card */}
          <div className="w-16 h-11 md:w-[76px] md:h-[52px] bg-white rounded-[3px] shadow-lg shadow-black/30 relative overflow-hidden flex flex-col p-1.5 gap-[3px]">
            {/* Skeleton text lines */}
            <div className="w-full h-[2px] rounded-full bg-neutral-300/80" />
            <div className="w-[72%] h-[2px] rounded-full bg-neutral-300/60" />
            <div className="w-[88%] h-[2px] rounded-full bg-neutral-300/40" />
            {/* Type badge */}
            <div
              className="absolute bottom-[3px] right-[3px] px-1 py-[1px] rounded-[2px] text-[5.5px] md:text-[6.5px] font-bold text-white leading-none tracking-wider"
              style={{ backgroundColor: item.color }}
            >
              {item.label}
            </div>
          </div>
        </div>
      ))}

      {/* ── ENGINE CORE: small centered parser ── */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1">
        {/* Glow ring */}
        <div className="absolute -inset-6 rounded-2xl bg-primary/10 blur-2xl ingest-core-pulse" />
        {/* Core box */}
        <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#0D0D15] border border-primary/25 flex items-center justify-center shadow-[0_0_24px_rgba(0,124,90,0.25),0_0_48px_rgba(0,124,90,0.08)]">
          <span className="text-primary font-mono text-xs md:text-sm font-bold">{'{ }'}</span>
        </div>
        <span className="text-[6px] md:text-[7px] font-mono text-white/35 tracking-[0.2em] uppercase mt-0.5">
          Audit Core
        </span>
      </div>

      {/* ── BEAM: subtle connection line from core → output ── */}
      <div className="absolute left-1/2 top-1/2 -translate-y-px z-10 h-px w-[22%] bg-gradient-to-r from-primary/20 via-primary/8 to-transparent" />

      {/* ── OUTPUT STREAM: clean verified JSON data ── */}
      <div className="absolute right-[3%] md:right-[6%] top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
        {OUTPUT_LINES.map((line, i) => (
          <div
            key={i}
            className="ingest-data-out font-mono text-[7px] md:text-[9px] text-primary/60 bg-primary/[0.03] border border-primary/10 px-2 py-1 md:px-3 md:py-1.5 rounded-sm whitespace-nowrap"
            style={{ '--out-d': `${i * 1.2}s` } as React.CSSProperties}
          >
            <span className="text-primary/25 mr-1">{'\u25B8'}</span>
            {line}
          </div>
        ))}
      </div>
    </div>
  )
}
