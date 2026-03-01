'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import {
  FileText,
  FileSpreadsheet,
  FileCode,
  FileSignature,
  Mail,
  Phone,
  MessageSquare,
  Camera,
  Receipt,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

// ─── DOCUMENT TYPES ────────────────────────────────────────────
interface DocType {
  Icon: LucideIcon
  label: string
  accent: string
  lines: number[]
}

const DOC_TYPES: DocType[] = [
  { Icon: FileText, label: "PDF", accent: "#EF4444", lines: [100, 80, 90, 60] },
  { Icon: FileSpreadsheet, label: "XLS", accent: "#22C55E", lines: [100, 100, 70] },
  { Icon: FileSignature, label: "RFI", accent: "#F59E0B", lines: [90, 75, 100, 50] },
  { Icon: FileCode, label: "BIM", accent: "#A855F7", lines: [100, 60, 80] },
  { Icon: Mail, label: "EMAIL", accent: "#3B82F6", lines: [100, 90, 70, 100] },
  { Icon: Phone, label: "CALL", accent: "#10B981", lines: [80, 100, 60] },
  { Icon: MessageSquare, label: "SMS", accent: "#EC4899", lines: [100, 70, 90] },
  { Icon: Receipt, label: "INVOICE", accent: "#F97316", lines: [100, 80, 100, 70] },
  { Icon: Camera, label: "PHOTO", accent: "#0EA5E9", lines: [80, 100] },
]

// ─── FLYING CARD STATE ─────────────────────────────────────────
interface FlyingCard {
  id: number
  typeIdx: number
  startX: number
  startY: number
  progress: number
  speed: number
  rotation: number
  rotSpeed: number
  wobblePhase: number
  wobbleAmp: number
}

// Cubic ease-in for vacuum acceleration
function easeInCubic(t: number) {
  return t * t * t
}

// Quadratic bezier
function qBez(a: number, b: number, c: number, t: number) {
  const u = 1 - t
  return u * u * a + 2 * u * t * b + t * t * c
}

// ─── MAIN COMPONENT ────────────────────────────────────────────
export function IngestionFunnel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 800, h: 400 })
  const [cards, setCards] = useState<FlyingCard[]>([])
  const [scanY, setScanY] = useState(0)
  const [pulseScale, setPulseScale] = useState(1)
  const nextId = useRef(0)
  const lastSpawn = useRef(0)
  const animRef = useRef<number>(0)

  // Measure container
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect()
        setSize({ w: r.width, h: r.height })
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Main animation loop
  useEffect(() => {
    if (size.w < 10) return

    let prevTime = 0

    const loop = (time: number) => {
      const dt = prevTime ? (time - prevTime) / 1000 : 0.016
      prevTime = time

      // Spawn a new card every ~600ms
      if (time - lastSpawn.current > 600) {
        const typeIdx = nextId.current % DOC_TYPES.length
        nextId.current++
        const startY = 8 + Math.random() * 84

        setCards(prev => {
          // Keep max ~12 active cards
          const active = prev.filter(c => c.progress < 1)
          return [...active, {
            id: nextId.current,
            typeIdx,
            startX: -10 + Math.random() * 20,
            startY,
            progress: 0,
            speed: 0.12 + Math.random() * 0.06,
            rotation: (Math.random() - 0.5) * 40,
            rotSpeed: (Math.random() - 0.5) * 60,
            wobblePhase: Math.random() * Math.PI * 2,
            wobbleAmp: 8 + Math.random() * 16,
          }]
        })
        lastSpawn.current = time
      }

      // Update card progress
      setCards(prev => prev.map(c => {
        // Accelerating progress — faster as it approaches core
        const accel = 1 + c.progress * 4
        const newProgress = Math.min(1, c.progress + c.speed * dt * accel)
        return { ...c, progress: newProgress, rotation: c.rotation + c.rotSpeed * dt }
      }).filter(c => c.progress < 1))

      // Scan line
      setScanY(prev => {
        const next = prev + dt * 30
        return next > 100 ? 0 : next
      })

      // Pulse
      setPulseScale(1 + Math.sin(time * 0.002) * 0.03)

      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [size])

  const cx = size.w * 0.5
  const cy = size.h * 0.5

  return (
    <div ref={containerRef} className="relative w-full h-full rounded-2xl overflow-hidden select-none"
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.05) 0%, rgba(10,10,15,0.02) 50%, transparent 100%)',
      }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: 'linear-gradient(rgba(99,102,241,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.4) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      {/* Energy field around core */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[90%] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, rgba(99,102,241,0.02) 40%, transparent 70%)',
        }}
      />

      {/* ─── FLYING CARDS ─── */}
      {cards.map(card => {
        const t = easeInCubic(card.progress)
        const type = DOC_TYPES[card.typeIdx]

        // Curved path via quadratic bezier
        const controlX = cx * 0.35
        const startYpx = (card.startY / 100) * size.h
        const controlY = startYpx + (cy - startYpx) * 0.25

        const x = qBez(card.startX, controlX, cx - 20, t)
        const y = qBez(startYpx, controlY, cy, t)

        // Wobble perpendicular to path
        const wobble = Math.sin(card.wobblePhase + card.progress * 8) * card.wobbleAmp * (1 - t)

        const scale = 1 - t * 0.97
        const opacity = card.progress < 0.08
          ? card.progress / 0.08
          : card.progress > 0.82
            ? Math.max(0, (1 - card.progress) / 0.18)
            : 1

        return (
          <div
            key={card.id}
            className="absolute top-0 left-0 pointer-events-none z-10"
            style={{
              transform: `translate(${x + wobble * 0.3}px, ${y + wobble}px) rotate(${card.rotation}deg) scale(${scale})`,
              opacity,
              willChange: 'transform, opacity',
            }}
          >
            {/* Card glow trail */}
            <div className="absolute inset-0 rounded-lg blur-md -z-10"
              style={{
                background: type.accent,
                opacity: 0.15 * (1 - t),
                transform: `scale(${1.3 + t})`,
              }}
            />
            {/* Card body */}
            <div className="bg-white rounded-lg overflow-hidden"
              style={{
                boxShadow: `0 ${4 + (1 - t) * 8}px ${12 + (1 - t) * 24}px rgba(0,0,0,${0.15 + (1 - t) * 0.2}), 0 1px 3px rgba(0,0,0,0.1)`,
                width: 'clamp(48px, 7.5vw, 100px)',
                padding: 'clamp(5px, 0.8vw, 12px)',
              }}
            >
              <div className="h-[2px] sm:h-[3px] rounded-full mb-1 sm:mb-2" style={{ background: type.accent }} />
              <div className="flex items-center gap-1 mb-1 sm:mb-1.5">
                <type.Icon className="size-2.5 sm:size-3.5 md:size-4 shrink-0" style={{ color: type.accent }} />
                <span className="text-[4px] sm:text-[6px] md:text-[7px] font-black uppercase tracking-wider truncate" style={{ color: type.accent }}>
                  {type.label}
                </span>
              </div>
              <div className="flex flex-col gap-[1.5px] sm:gap-[2px]">
                {type.lines.map((w, j) => (
                  <div key={j} className="h-[1.5px] sm:h-[2px] rounded-full bg-gray-200/80" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
          </div>
        )
      })}

      {/* ─── AUDIT CORE ─── */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        {/* Outer pulse ring */}
        <div
          className="absolute -inset-3 sm:-inset-5 md:-inset-7 rounded-[1.5rem] border border-indigo-400/15 pointer-events-none"
          style={{ transform: `scale(${pulseScale})`, transition: 'transform 0.1s linear' }}
        />
        <div
          className="absolute -inset-6 sm:-inset-9 md:-inset-12 rounded-[2rem] border border-indigo-400/8 pointer-events-none"
          style={{ transform: `scale(${2 - pulseScale})`, transition: 'transform 0.1s linear' }}
        />

        {/* Core glow */}
        <div className="absolute -inset-10 sm:-inset-14 md:-inset-20 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.04) 45%, transparent 70%)',
          }}
        />

        {/* Main core box */}
        <div className="relative w-28 sm:w-40 md:w-52 lg:w-60 h-32 sm:h-44 md:h-52 lg:h-60 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(12,12,28,0.98) 0%, rgba(8,8,18,0.99) 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
            boxShadow: '0 0 40px rgba(99,102,241,0.1), 0 0 80px rgba(99,102,241,0.05), inset 0 1px 0 rgba(99,102,241,0.08), inset 0 0 30px rgba(99,102,241,0.02)',
          }}
        >
          {/* Inner grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }} />

          {/* Scan line */}
          <div
            className="absolute left-0 right-0 h-[2px] pointer-events-none z-10"
            style={{
              top: `${scanY}%`,
              background: 'linear-gradient(90deg, transparent 0%, rgba(129,140,248,0.5) 15%, rgba(129,140,248,0.7) 50%, rgba(129,140,248,0.5) 85%, transparent 100%)',
              boxShadow: '0 0 12px rgba(99,102,241,0.4), 0 0 40px rgba(99,102,241,0.15)',
            }}
          />

          {/* Braces */}
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mono relative z-10"
            style={{ color: `rgba(129,140,248,${0.3 + Math.sin(Date.now() * 0.002) * 0.1})` }}
          >
            &#123; &#125;
          </span>

          <span className="text-[8px] sm:text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-white/75 relative z-10 mt-1 sm:mt-2">
            Audit Core
          </span>

          <span className="text-[5px] sm:text-[6px] md:text-[7px] font-mono text-indigo-400/40 uppercase tracking-wider mt-0.5 relative z-10"
            style={{ opacity: 0.4 + Math.sin(Date.now() * 0.003) * 0.3 }}
          >
            synthesizing...
          </span>
        </div>
      </div>

      {/* ─── JSON OUTPUT ─── */}
      <div className="absolute right-[2%] sm:right-[4%] md:right-[6%] top-1/2 -translate-y-[55%] flex flex-col gap-1.5 sm:gap-2 z-10">
        {[
          { json: '{ "permit": "F1",\n  "status": "PASS" }', opacity: 1, tx: 0 },
          { json: '{ "rfi": "042",\n  "stage": "VERIFIED" }', opacity: 0.65, tx: 3 },
          { json: '{ "bim": "R4",\n  "sync": true }', opacity: 0.35, tx: 6 },
        ].map((item, i) => (
          <div
            key={i}
            className="rounded-md sm:rounded-lg overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(0,124,90,0.1) 0%, rgba(0,124,90,0.04) 100%)',
              border: '1px solid rgba(0,124,90,0.15)',
              boxShadow: '0 2px 12px rgba(0,124,90,0.06)',
              opacity: item.opacity,
              transform: `translateX(${item.tx}px) translateY(${Math.sin(Date.now() * 0.001 + i * 1.2) * 4}px)`,
            }}
          >
            <div className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5">
              <div className="flex items-center gap-1 mb-0.5 sm:mb-1">
                <div className="size-1 sm:size-1.5 rounded-full bg-primary" style={{
                  boxShadow: '0 0 4px rgba(0,124,90,0.5)',
                  opacity: 0.6 + Math.sin(Date.now() * 0.004 + i) * 0.4,
                }} />
                <span className="text-[4px] sm:text-[5px] md:text-[6px] font-mono text-primary/50 uppercase tracking-widest">verified</span>
              </div>
              <pre className="text-[5px] sm:text-[7px] md:text-[9px] font-mono text-primary/90 leading-relaxed whitespace-pre">{item.json}</pre>
            </div>
          </div>
        ))}
      </div>

      {/* Border frame */}
      <div className="absolute inset-0 rounded-2xl border border-white/[0.05] pointer-events-none z-30" />
    </div>
  )
}
