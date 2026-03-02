'use client'

import { useMemo } from 'react'
import {
  Mail,
  MessageSquare,
  FileText,
  MessageCircle,
  Phone,
  FileSpreadsheet,
  FileSignature,
  FileCode,
  Image as ImageIcon,
  Receipt,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ─── DOCUMENT TYPES ─────────────────────────────────────────
// style: 'doc' = white paper card with skeleton lines
// style: 'icon' = standalone icon (no card wrapper)
const FLOW_TYPES: { label: string; color: string; Icon: LucideIcon; style: 'doc' | 'icon' }[] = [
  { label: 'EMAIL', color: '#3B82F6', Icon: Mail, style: 'doc' },
  { label: 'TEXT',  color: '#8B5CF6', Icon: MessageSquare, style: 'icon' },
  { label: 'DOC',   color: '#EF4444', Icon: FileText, style: 'doc' },
  { label: 'MSG',   color: '#F59E0B', Icon: MessageCircle, style: 'icon' },
  { label: 'CALL',  color: '#10B981', Icon: Phone, style: 'icon' },
  { label: 'PDF',   color: '#DC2626', Icon: FileText, style: 'doc' },
  { label: 'XLS',   color: '#16A34A', Icon: FileSpreadsheet, style: 'doc' },
  { label: 'RFI',   color: '#D97706', Icon: FileSignature, style: 'doc' },
  { label: 'BIM',   color: '#7C3AED', Icon: FileCode, style: 'doc' },
  { label: 'PHOTO', color: '#EC4899', Icon: ImageIcon, style: 'icon' },
  { label: 'INV',   color: '#F97316', Icon: Receipt, style: 'doc' },
]

const ITEM_COUNT = 24
const STAGGER = 0.14
const DURATION = 3

// ─── COMPONENT ──────────────────────────────────────────────
export function IngestionFunnel() {
  const flowItems = useMemo(() => {
    const items = []
    // Scrambled delay order so cards arrive randomly, not sequentially
    const delaySlots = Array.from({ length: ITEM_COUNT }, (_, i) => i)
    for (let i = delaySlots.length - 1; i > 0; i--) {
      const j = ((i * 53 + 7) % (i + 1)) // deterministic shuffle
      ;[delaySlots[i], delaySlots[j]] = [delaySlots[j], delaySlots[i]]
    }
    for (let i = 0; i < ITEM_COUNT; i++) {
      const type = FLOW_TYPES[i % FLOW_TYPES.length]
      const topPct = 10 + ((i * 37 + 13) % 80)
      const yToCenter = Math.round((50 - topPct) * 3)
      const rotation = Math.round(((i * 53 + 7) % 30) - 15)
      // Scrambled delay — cards arrive in random order
      const delay = delaySlots[i] * STAGGER - DURATION
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
          {item.style === 'doc' ? (
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
          ) : (
            <div className="flex flex-col items-center gap-0.5">
              <item.Icon className="w-7 h-7 md:w-9 md:h-9 drop-shadow-lg" style={{ color: item.color }} strokeWidth={1.8} />
              <span className="text-[5px] md:text-[6px] font-bold tracking-wider text-white/70">{item.label}</span>
            </div>
          )}
        </div>
      ))}

      {/* ── ENGINE CORE: centered parser ── */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1.5">
        <div className="absolute -inset-8 rounded-2xl bg-primary/10 blur-2xl ingest-core-pulse" />
        <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-lg bg-[#0D0D15] border border-primary/30 flex items-center justify-center shadow-[0_0_30px_rgba(0,124,90,0.3),0_0_60px_rgba(0,124,90,0.1)]">
          <span className="text-primary font-mono text-sm md:text-base font-bold">{'{ }'}</span>
        </div>
        <span className="text-[7px] md:text-[8px] font-mono text-white/40 tracking-[0.2em] uppercase">
          Audit Core
        </span>
      </div>

      {/* ── BEAM: connection line from core → output ── */}
      <div className="absolute left-1/2 top-1/2 -translate-y-px z-10 h-px w-[42%] bg-gradient-to-r from-primary/25 via-primary/12 to-transparent" />

      {/* ── OUTPUT: data streams flowing right from parser ── */}
      <div className="absolute left-[52%] md:left-[52%] top-1/2 -translate-y-1/2 z-10 flex flex-col gap-1.5 md:gap-2">
        {[
          { text: 'rfi_verified.json', sub: 'VERIFIED', d: 0 },
          { text: 'budget_clean.json', sub: '-3.2%', d: 0.8 },
          { text: 'schedule_parsed.json', sub: 'ON_TRACK', d: 1.6 },
          { text: 'submittals.json', sub: 'CLEAR', d: 2.4 },
          { text: 'change_orders.json', sub: '$0 DELTA', d: 3.2 },
        ].map((line, i) => (
          <div
            key={i}
            className="ingest-data-out font-mono flex items-center gap-1.5 whitespace-nowrap border border-primary/20 bg-primary/[0.04] px-2 py-1 rounded-sm"
            style={{ '--out-d': `${line.d}s` } as React.CSSProperties}
          >
            <span className="inline-block w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-primary/50 shrink-0" />
            <span className="text-[7px] md:text-[9px] text-primary/65">{line.text}</span>
            <span className="text-[6px] md:text-[7px] text-primary/30">{line.sub}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
