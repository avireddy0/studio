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
const STAGGER = 0.14
const DURATION = 3.5

// ─── COMPONENT ──────────────────────────────────────────────
export function IngestionFunnel() {
  const flowItems = useMemo(() => {
    const items = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      const type = FLOW_TYPES[i % FLOW_TYPES.length]
      // Spread cards vertically across 8%–92% for wide ">" funnel
      const topPct = 8 + (i / (ITEM_COUNT - 1)) * 84
      // How far from center each card starts (converges to 50% Y)
      const yToCenter = Math.round((50 - topPct) * 2.5)
      const rotation = Math.round(Math.sin(i * 4.7) * 14)
      // Negative delay pre-populates the scene
      const delay = i * STAGGER - DURATION
      items.push({ ...type, topPct, yToCenter, rotation, delay, id: i })
    }
    return items
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden">

      {/* ── FLOW ITEMS: documents vacuumed from left → parser ── */}
      {flowItems.map((item) => (
        <div
          key={item.id}
          className="ingest-flow-item absolute"
          style={{
            '--d': `${item.delay}s`,
            '--yc': `${item.yToCenter}px`,
            '--r': `${item.rotation}deg`,
            left: '2%',
            top: `${item.topPct}%`,
          } as React.CSSProperties}
        >
          <div className="w-16 h-11 md:w-[76px] md:h-[52px] bg-white rounded-[3px] shadow-lg shadow-black/30 relative overflow-hidden flex flex-col p-1.5 gap-[3px]">
            <div className="w-full h-[2px] rounded-full bg-neutral-300/80" />
            <div className="w-[72%] h-[2px] rounded-full bg-neutral-300/60" />
            <div className="w-[88%] h-[2px] rounded-full bg-neutral-300/40" />
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
        <div className="absolute -inset-6 rounded-2xl bg-primary/10 blur-2xl ingest-core-pulse" />
        <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#0D0D15] border border-primary/25 flex items-center justify-center shadow-[0_0_24px_rgba(0,124,90,0.25),0_0_48px_rgba(0,124,90,0.08)]">
          <span className="text-primary font-mono text-xs md:text-sm font-bold">{'{ }'}</span>
        </div>
        <span className="text-[6px] md:text-[7px] font-mono text-white/35 tracking-[0.2em] uppercase mt-0.5">
          Audit Core
        </span>
      </div>

      {/* ── BEAM: connection line from core → output ── */}
      <div className="absolute left-1/2 top-1/2 -translate-y-px z-10 h-px w-[40%] bg-gradient-to-r from-primary/25 via-primary/12 to-transparent" />

      {/* ── OUTPUT: single verified data stream line ── */}
      <div className="absolute left-[55%] md:left-[54%] top-1/2 -translate-y-1/2 z-10 ingest-data-out">
        <div className="font-mono text-[8px] md:text-[10px] text-primary/70 flex items-center gap-2 whitespace-nowrap">
          <span className="inline-block w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary/60 ingest-core-pulse" />
          <span className="text-primary/40">▸</span>
          <span>ENVISION_VERIFIED_STREAM.json</span>
          <span className="text-primary/30 ml-1">—</span>
          <span className="text-primary/40 text-[7px] md:text-[8px]">verified · deterministic · institutional-grade</span>
        </div>
      </div>
    </div>
  )
}
