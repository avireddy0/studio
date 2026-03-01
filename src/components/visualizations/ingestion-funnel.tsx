'use client'

import { useRef, useState, useEffect } from 'react'
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
  sublabel: string
  accent: string
  linePattern: number[][]  // [width%, opacity%] pairs
}

const DOC_TYPES: DocType[] = [
  {
    Icon: FileText,
    label: 'PDF',
    sublabel: 'CONTRACT',
    accent: '#EF4444',
    linePattern: [[100, 90], [88, 70], [95, 80], [60, 60]],
  },
  {
    Icon: FileSpreadsheet,
    label: 'XLS',
    sublabel: 'BUDGET',
    accent: '#22C55E',
    linePattern: [[100, 90], [100, 85], [72, 70]],
  },
  {
    Icon: FileSignature,
    label: 'RFI',
    sublabel: 'REQUEST',
    accent: '#F59E0B',
    linePattern: [[90, 85], [75, 70], [100, 90], [50, 60]],
  },
  {
    Icon: FileCode,
    label: 'BIM',
    sublabel: 'MODEL',
    accent: '#A855F7',
    linePattern: [[100, 90], [60, 70], [80, 80]],
  },
  {
    Icon: Mail,
    label: 'EMAIL',
    sublabel: 'THREAD',
    accent: '#3B82F6',
    linePattern: [[100, 85], [90, 75], [70, 65], [100, 80]],
  },
  {
    Icon: Phone,
    label: 'CALL',
    sublabel: 'TRANSCRIPT',
    accent: '#10B981',
    linePattern: [[80, 80], [100, 90], [60, 65]],
  },
  {
    Icon: MessageSquare,
    label: 'SMS',
    sublabel: 'LOG',
    accent: '#EC4899',
    linePattern: [[100, 90], [70, 75], [90, 80]],
  },
  {
    Icon: Receipt,
    label: 'INVOICE',
    sublabel: 'AP/AR',
    accent: '#F97316',
    linePattern: [[100, 90], [80, 80], [100, 85], [70, 70]],
  },
  {
    Icon: Camera,
    label: 'PHOTO',
    sublabel: 'SITE',
    accent: '#0EA5E9',
    linePattern: [[80, 80], [100, 90]],
  },
]

// ─── FLYING CARD STATE ─────────────────────────────────────────
interface FlyingCard {
  id: number
  typeIdx: number
  // Start position (as fraction of container)
  startXFrac: number
  startYFrac: number
  // Current physics state
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotSpeed: number
  scale: number
  opacity: number
  progress: number  // 0..1 travel progress
  wobblePhase: number
  depth: number     // 0..1 z-depth for parallax (0=far, 1=near)
  trailOpacity: number
}

// Ease functions
function easeInQuart(t: number) {
  return t * t * t * t
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

// Cubic bezier point
function cubicBez(p0: number, p1: number, p2: number, p3: number, t: number) {
  const u = 1 - t
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
}

// ─── JSON OUTPUT DATA ───────────────────────────────────────────
const JSON_OUTPUTS = [
  {
    key: 'permit',
    lines: ['{ "permit": "F1-2024",', '  "status": "PASS",', '  "verified": true }'],
    label: 'PERMIT',
    color: '#007C5A',
  },
  {
    key: 'rfi',
    lines: ['{ "rfi": "042",', '  "stage": "CLOSED",', '  "risk": "LOW" }'],
    label: 'RFI',
    color: '#007C5A',
  },
  {
    key: 'bim',
    lines: ['{ "model": "R4",', '  "lod": 400,', '  "sync": true }'],
    label: 'BIM',
    color: '#007C5A',
  },
]

// ─── MAIN COMPONENT ────────────────────────────────────────────
export function IngestionFunnel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 800, h: 400 })
  const [cards, setCards] = useState<FlyingCard[]>([])
  const [corePhase, setCorePhase] = useState(0)  // 0..2PI continuous
  const [scanY, setScanY] = useState(0)
  const [jsonPhase, setJsonPhase] = useState(0)  // for JSON output cycling
  const nextId = useRef(0)
  const lastSpawn = useRef(0)
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)

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
    const SPAWN_INTERVAL = 520  // ms between card spawns
    const MAX_CARDS = 14

    const loop = (time: number) => {
      const dt = prevTime ? Math.min((time - prevTime) / 1000, 0.05) : 0.016
      prevTime = time
      timeRef.current = time

      // Spawn new card
      if (time - lastSpawn.current > SPAWN_INTERVAL) {
        const id = ++nextId.current
        const typeIdx = (id - 1) % DOC_TYPES.length
        // Spawn from left band: x in [0..12%], y spread across full height
        const startXFrac = 0.02 + Math.random() * 0.10
        const startYFrac = 0.05 + Math.random() * 0.90
        const depth = 0.3 + Math.random() * 0.7  // depth stratification

        setCards(prev => {
          const active = prev.filter(c => c.progress < 1)
          if (active.length >= MAX_CARDS) return active
          const startX = startXFrac * size.w
          const startY = startYFrac * size.h
          return [...active, {
            id,
            typeIdx,
            startXFrac,
            startYFrac,
            x: startX,
            y: startY,
            vx: 0,
            vy: 0,
            rotation: (Math.random() - 0.5) * 35,
            rotSpeed: (Math.random() - 0.5) * 50,
            scale: lerp(0.6, 1.0, depth),
            opacity: 0,
            progress: 0,
            wobblePhase: Math.random() * Math.PI * 2,
            depth,
            trailOpacity: 0,
          }]
        })
        lastSpawn.current = time
      }

      // Core physics center
      const cx = size.w * 0.5
      const cy = size.h * 0.5

      // Update cards
      setCards(prev => prev.map(c => {
        const newProgress = Math.min(1, c.progress + dt * lerp(0.06, 0.14, c.depth))

        // Quadratic bezier path: start -> control point above center -> core
        const startX = c.startXFrac * size.w
        const startY = c.startYFrac * size.h

        // Control point: mid-left, slightly converging toward center y
        const cpX = size.w * 0.28
        const cpY = startY + (cy - startY) * 0.4 + Math.sin(time * 0.0008 + c.wobblePhase) * 20

        const t = easeInQuart(newProgress)
        const pathX = cubicBez(startX, cpX, cpX + 30, cx, t)
        const pathY = cubicBez(startY, cpY, cy + (cpY - cy) * 0.2, cy, t)

        // Wobble perpendicular — decreases as it approaches core
        const wobbleMag = Math.sin(c.wobblePhase + newProgress * 10) * 12 * (1 - t * t) * c.depth
        const x = pathX
        const y = pathY + wobbleMag

        // Rotation accelerates as card gets sucked in
        const newRotation = c.rotation + c.rotSpeed * dt * (1 + newProgress * 3)

        // Scale crushes toward zero at the end
        const newScale = c.scale * (1 - easeInQuart(Math.max(0, newProgress - 0.75)) * 3.5)

        // Opacity: fade in quickly, hold, then obliterate at core
        let newOpacity: number
        if (newProgress < 0.06) {
          newOpacity = newProgress / 0.06
        } else if (newProgress > 0.80) {
          newOpacity = Math.max(0, (1 - newProgress) / 0.20)
        } else {
          newOpacity = 1
        }

        return {
          ...c,
          x,
          y,
          progress: newProgress,
          rotation: newRotation,
          scale: Math.max(0, newScale),
          opacity: newOpacity,
          trailOpacity: newOpacity * newProgress * 0.6,
        }
      }).filter(c => c.progress < 1))

      // Core phase for animations
      setCorePhase(time * 0.0025)

      // Scan line
      setScanY(prev => {
        const next = prev + dt * 28
        return next > 100 ? 0 : next
      })

      // JSON output phase
      setJsonPhase(time * 0.001)

      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [size])

  const cx = size.w * 0.5
  const cy = size.h * 0.5

  // Core pulse (breathing)
  const corePulse = 1 + Math.sin(corePhase * 1.3) * 0.025
  const coreGlowIntensity = 0.5 + Math.sin(corePhase * 0.8) * 0.15

  // Card dimensions based on container size
  const cardW = Math.max(72, Math.min(size.w * 0.11, 120))
  const cardH = cardW * 1.32

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none"
      style={{ background: 'transparent' }}
    >
      {/* ─── BACKGROUND ATMOSPHERE ─── */}

      {/* Deep vacuum vortex — radial gradient from center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 55% 70% at 50% 50%,
            rgba(0,124,90,0.055) 0%,
            rgba(0,124,90,0.02) 30%,
            transparent 65%)`,
        }}
      />

      {/* Left ingestion zone glow */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[30%] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(239,68,68,0.02) 0%, transparent 100%)',
        }}
      />

      {/* Right output zone glow */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[28%] pointer-events-none"
        style={{
          background: 'linear-gradient(270deg, rgba(0,124,90,0.04) 0%, transparent 100%)',
        }}
      />

      {/* ─── VACUUM FORCE FIELD LINES ─── */}
      {/* SVG field lines showing magnetic pull toward center */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.06 }}
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="fieldGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#007C5A" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#007C5A" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Horizontal field lines converging from left */}
        {Array.from({ length: 7 }).map((_, i) => {
          const yFrac = 0.15 + i * 0.12
          const y = yFrac * 100
          return (
            <path
              key={`field-${i}`}
              d={`M 0 ${y} Q 25 ${y + (50 - y) * 0.3} 50 50`}
              fill="none"
              stroke="#007C5A"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />
          )
        })}
      </svg>

      {/* ─── FLYING DOCUMENT CARDS ─── */}
      {cards.map(card => {
        const type = DOC_TYPES[card.typeIdx]
        const isNear = card.progress > 0.65  // entering the vacuum zone

        return (
          <div
            key={card.id}
            className="absolute top-0 left-0 pointer-events-none"
            style={{
              transform: `translate(${card.x - cardW / 2}px, ${card.y - cardH / 2}px)
                          rotate(${card.rotation}deg)
                          scale(${card.scale})`,
              opacity: card.opacity,
              willChange: 'transform, opacity',
              zIndex: Math.round(card.depth * 10) + 5,
            }}
          >
            {/* Motion blur trail — elongated shadow behind card */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: '6px',
                background: type.accent,
                opacity: card.trailOpacity * 0.3,
                transform: `scaleX(${1 + card.progress * 0.8}) translateX(-${card.progress * 15}%)`,
                filter: 'blur(8px)',
              }}
            />

            {/* Approach glow — intensifies near core */}
            {isNear && (
              <div
                className="absolute pointer-events-none"
                style={{
                  inset: '-8px',
                  borderRadius: '12px',
                  background: type.accent,
                  opacity: (card.progress - 0.65) * 0.35,
                  filter: 'blur(10px)',
                }}
              />
            )}

            {/* ─── PAPER CARD BODY ─── */}
            <div
              style={{
                width: `${cardW}px`,
                height: `${cardH}px`,
                borderRadius: '5px',
                background: 'linear-gradient(160deg, #FFFFFF 0%, #F5F4F0 40%, #EEECE6 100%)',
                boxShadow: `
                  0 ${3 + card.depth * 10}px ${8 + card.depth * 20}px rgba(0,0,0,${0.3 + card.depth * 0.25}),
                  0 1px 2px rgba(0,0,0,0.15),
                  inset 0 1px 0 rgba(255,255,255,0.9),
                  inset 0 -1px 0 rgba(0,0,0,0.04)
                `,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Paper texture grain overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.035,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  backgroundSize: '128px 128px',
                }}
              />

              {/* Accent stripe at top */}
              <div
                style={{
                  height: '3px',
                  background: `linear-gradient(90deg, ${type.accent} 0%, ${type.accent}88 100%)`,
                  flexShrink: 0,
                }}
              />

              {/* Inner content */}
              <div style={{ padding: `${cardW * 0.10}px ${cardW * 0.11}px`, flex: 1 }}>
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: `${cardW * 0.06}px`, marginBottom: `${cardW * 0.07}px` }}>
                  <type.Icon
                    style={{
                      width: `${cardW * 0.22}px`,
                      height: `${cardW * 0.22}px`,
                      color: type.accent,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div
                      style={{
                        fontSize: `${cardW * 0.095}px`,
                        fontWeight: 900,
                        fontFamily: 'monospace',
                        textTransform: 'uppercase' as const,
                        letterSpacing: '0.08em',
                        color: type.accent,
                        lineHeight: 1,
                      }}
                    >
                      {type.label}
                    </div>
                    <div
                      style={{
                        fontSize: `${cardW * 0.072}px`,
                        fontFamily: 'monospace',
                        textTransform: 'uppercase' as const,
                        letterSpacing: '0.06em',
                        color: '#9CA3AF',
                        lineHeight: 1,
                        marginTop: '1px',
                      }}
                    >
                      {type.sublabel}
                    </div>
                  </div>
                </div>

                {/* Text lines — simulated document body */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: `${cardW * 0.045}px` }}>
                  {type.linePattern.map(([width, opacity], j) => (
                    <div
                      key={j}
                      style={{
                        height: `${cardW * 0.045}px`,
                        borderRadius: '2px',
                        width: `${width}%`,
                        background: `rgba(30,30,30,${opacity / 100 * 0.65})`,
                      }}
                    />
                  ))}
                </div>

                {/* Bottom stamp / footer */}
                <div
                  style={{
                    marginTop: `${cardW * 0.10}px`,
                    paddingTop: `${cardW * 0.07}px`,
                    borderTop: '1px solid rgba(0,0,0,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      fontSize: `${cardW * 0.062}px`,
                      fontFamily: 'monospace',
                      color: '#C0BDB5',
                      textTransform: 'uppercase' as const,
                      letterSpacing: '0.05em',
                    }}
                  >
                    ENV-{String(card.id).padStart(4, '0')}
                  </div>
                  {/* Tiny colored dot */}
                  <div
                    style={{
                      width: `${cardW * 0.065}px`,
                      height: `${cardW * 0.065}px`,
                      borderRadius: '50%',
                      background: type.accent,
                      opacity: 0.6,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* ─── AUDIT CORE ─── */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${cx}px`,
          top: `${cy}px`,
          transform: 'translate(-50%, -50%)',
          zIndex: 20,
        }}
      >
        {/* Outer diffuse glow halos */}
        <div
          style={{
            position: 'absolute',
            inset: '-80px',
            borderRadius: '50%',
            background: `radial-gradient(ellipse,
              rgba(0,124,90,${0.08 * coreGlowIntensity}) 0%,
              rgba(0,124,90,${0.04 * coreGlowIntensity}) 40%,
              transparent 70%)`,
            transform: `scale(${corePulse * 1.1})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '-50px',
            borderRadius: '50%',
            background: `radial-gradient(ellipse,
              rgba(0,124,90,${0.15 * coreGlowIntensity}) 0%,
              rgba(0,124,90,${0.06 * coreGlowIntensity}) 50%,
              transparent 75%)`,
            transform: `scale(${corePulse})`,
          }}
        />

        {/* Orbit ring — slow rotation */}
        {[0, 1, 2].map(i => (
          <div
            key={`ring-${i}`}
            style={{
              position: 'absolute',
              inset: `${-28 - i * 14}px`,
              borderRadius: '50%',
              border: `1px solid rgba(0,124,90,${0.12 - i * 0.03})`,
              transform: `scale(${corePulse + i * 0.008}) rotate(${corePhase * (12 - i * 3)}deg)`,
              borderStyle: i === 0 ? 'solid' : 'dashed',
            }}
          />
        ))}

        {/* Corner bracket decorations */}
        {[
          { top: -8, left: -8, rotate: 0 },
          { top: -8, right: -8, rotate: 90 },
          { bottom: -8, right: -8, rotate: 180 },
          { bottom: -8, left: -8, rotate: 270 },
        ].map((pos, i) => (
          <div
            key={`bracket-${i}`}
            style={{
              position: 'absolute',
              width: '12px',
              height: '12px',
              top: pos.top,
              left: pos.left,
              right: (pos as { right?: number }).right,
              bottom: (pos as { bottom?: number }).bottom,
              transform: `rotate(${pos.rotate}deg)`,
              borderTop: i === 0 || i === 3 ? '1.5px solid rgba(0,124,90,0.6)' : 'none',
              borderBottom: i === 1 || i === 2 ? '1.5px solid rgba(0,124,90,0.6)' : 'none',
              borderLeft: i === 0 || i === 1 ? 'none' : '1.5px solid rgba(0,124,90,0.6)',
              borderRight: i === 0 || i === 1 ? '1.5px solid rgba(0,124,90,0.6)' : 'none',
            }}
          />
        ))}

        {/* Main core box */}
        <div
          style={{
            width: `${Math.max(110, Math.min(size.w * 0.16, 200))}px`,
            height: `${Math.max(120, Math.min(size.h * 0.40, 220))}px`,
            borderRadius: '8px',
            background: `linear-gradient(180deg,
              rgba(10,12,20,0.98) 0%,
              rgba(6,10,16,0.99) 100%)`,
            border: `1px solid rgba(0,124,90,${0.2 + coreGlowIntensity * 0.15})`,
            boxShadow: `
              0 0 0 1px rgba(0,124,90,${0.06 + coreGlowIntensity * 0.04}),
              0 0 30px rgba(0,124,90,${0.12 + coreGlowIntensity * 0.08}),
              0 0 60px rgba(0,124,90,${0.06 + coreGlowIntensity * 0.04}),
              0 0 100px rgba(0,124,90,0.03),
              inset 0 1px 0 rgba(0,124,90,0.12),
              inset 0 0 20px rgba(0,124,90,0.04)
            `,
            transform: `scale(${corePulse})`,
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Inner micro grid */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.04,
              backgroundImage: `
                linear-gradient(rgba(0,124,90,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,124,90,0.5) 1px, transparent 1px)
              `,
              backgroundSize: '14px 14px',
            }}
          />

          {/* Scan line */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${scanY}%`,
              height: '1.5px',
              background: `linear-gradient(90deg,
                transparent 0%,
                rgba(0,200,120,0.5) 15%,
                rgba(0,200,120,0.85) 50%,
                rgba(0,200,120,0.5) 85%,
                transparent 100%)`,
              boxShadow: '0 0 8px rgba(0,200,120,0.5), 0 0 20px rgba(0,124,90,0.3)',
              zIndex: 5,
            }}
          />

          {/* Bright horizontal accent lines */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '20%',
              height: '1px',
              background: `rgba(0,124,90,${0.08 + Math.sin(corePhase * 2) * 0.04})`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: '20%',
              height: '1px',
              background: `rgba(0,124,90,${0.08 + Math.cos(corePhase * 2) * 0.04})`,
            }}
          />

          {/* Braces — the iconic parser symbol */}
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: `${Math.max(28, Math.min(size.w * 0.045, 52))}px`,
              fontWeight: 700,
              color: `rgba(0,200,120,${0.25 + Math.sin(corePhase) * 0.08})`,
              letterSpacing: '0.15em',
              lineHeight: 1,
              position: 'relative',
              zIndex: 10,
              textShadow: `0 0 20px rgba(0,200,120,${0.3 + Math.sin(corePhase) * 0.1})`,
            }}
          >
            {'{ }'}
          </div>

          <div
            style={{
              fontSize: `${Math.max(7, Math.min(size.w * 0.011, 11))}px`,
              fontWeight: 800,
              fontFamily: 'monospace',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.75)',
              position: 'relative',
              zIndex: 10,
              marginTop: '6px',
            }}
          >
            Audit Core
          </div>

          <div
            style={{
              fontSize: `${Math.max(5, Math.min(size.w * 0.008, 8))}px`,
              fontFamily: 'monospace',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.25em',
              color: `rgba(0,200,120,${0.35 + Math.sin(corePhase * 1.5) * 0.2})`,
              position: 'relative',
              zIndex: 10,
              marginTop: '4px',
            }}
          >
            {['synthesizing', 'parsing', 'verifying', 'indexing'][Math.floor(corePhase * 0.3) % 4]}...
          </div>

          {/* Bottom status bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: `linear-gradient(90deg,
                transparent 0%,
                rgba(0,124,90,${0.3 + Math.sin(corePhase * 3) * 0.2}) ${(((corePhase * 20) % 100 + 100) % 100)}%,
                transparent 100%)`,
            }}
          />
        </div>

        {/* Feed arrows — left side intake indicators */}
        <div
          style={{
            position: 'absolute',
            right: '100%',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            marginRight: '8px',
          }}
        >
          {[0, 1, 2].map(i => (
            <div
              key={`arrow-${i}`}
              style={{
                width: '16px',
                height: '1px',
                background: `rgba(0,124,90,${0.15 + Math.sin(corePhase * 2 + i * 1.2) * 0.1})`,
                transform: `scaleX(${0.6 + Math.sin(corePhase * 3 + i) * 0.4})`,
                transformOrigin: 'right',
              }}
            />
          ))}
        </div>

        {/* Output arrow — right side */}
        <div
          style={{
            position: 'absolute',
            left: '100%',
            top: '50%',
            transform: 'translateY(-50%)',
            marginLeft: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <div
            style={{
              width: '24px',
              height: '1px',
              background: `rgba(0,124,90,${0.3 + Math.sin(corePhase) * 0.1})`,
            }}
          />
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: '3px solid transparent',
              borderBottom: '3px solid transparent',
              borderLeft: `5px solid rgba(0,124,90,${0.5 + Math.sin(corePhase) * 0.1})`,
            }}
          />
        </div>
      </div>

      {/* ─── JSON OUTPUT STREAM (right side) ─── */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: '2%',
          top: '50%',
          transform: 'translateY(-52%)',
          zIndex: 15,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {JSON_OUTPUTS.map((item, i) => {
          // Each card floats at a slightly different phase
          const floatY = Math.sin(jsonPhase + i * 2.1) * 5
          const glowPulse = 0.5 + Math.sin(jsonPhase * 1.3 + i * 1.4) * 0.25
          const dotPulse = 0.6 + Math.sin(jsonPhase * 2 + i * 0.9) * 0.4
          // Staggered opacity: first card brightest
          const baseOpacity = [1, 0.70, 0.42][i]

          return (
            <div
              key={item.key}
              style={{
                transform: `translateY(${floatY}px) translateX(${i * 3}px)`,
                opacity: baseOpacity,
                transition: 'transform 0.05s linear',
              }}
            >
              {/* Card glow */}
              <div
                style={{
                  borderRadius: '6px',
                  background: `linear-gradient(135deg,
                    rgba(0,124,90,${0.09 + glowPulse * 0.04}) 0%,
                    rgba(0,124,90,${0.04 + glowPulse * 0.02}) 100%)`,
                  border: `1px solid rgba(0,124,90,${0.18 + glowPulse * 0.08})`,
                  boxShadow: `
                    0 2px 16px rgba(0,124,90,${0.06 + glowPulse * 0.04}),
                    inset 0 1px 0 rgba(0,200,120,0.06)
                  `,
                  overflow: 'hidden',
                }}
              >
                {/* Top accent bar */}
                <div
                  style={{
                    height: '2px',
                    background: `linear-gradient(90deg,
                      rgba(0,124,90,${0.4 + glowPulse * 0.2}) 0%,
                      rgba(0,200,120,${0.3 + glowPulse * 0.15}) 50%,
                      transparent 100%)`,
                  }}
                />

                <div style={{ padding: '8px 10px' }}>
                  {/* Status header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                    <div
                      style={{
                        width: `${5 + dotPulse * 1}px`,
                        height: `${5 + dotPulse * 1}px`,
                        borderRadius: '50%',
                        background: '#007C5A',
                        boxShadow: `0 0 ${4 + dotPulse * 4}px rgba(0,200,120,${dotPulse * 0.6})`,
                        transition: 'all 0.1s',
                      }}
                    />
                    <span
                      style={{
                        fontSize: `${Math.max(5, Math.min(size.w * 0.0065, 7))}px`,
                        fontFamily: 'monospace',
                        textTransform: 'uppercase' as const,
                        letterSpacing: '0.2em',
                        color: 'rgba(0,200,120,0.6)',
                        fontWeight: 700,
                      }}
                    >
                      {item.label} · verified
                    </span>
                  </div>

                  {/* JSON content */}
                  <pre
                    style={{
                      fontSize: `${Math.max(6, Math.min(size.w * 0.0085, 9))}px`,
                      fontFamily: 'monospace',
                      color: 'rgba(0,200,120,0.9)',
                      lineHeight: 1.5,
                      margin: 0,
                      whiteSpace: 'pre',
                    }}
                  >
                    {item.lines.join('\n')}
                  </pre>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ─── SECTION LABELS ─── */}
      {/* Left label — CHAOS / INPUTS */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '1.5%',
          top: '6%',
          zIndex: 25,
        }}
      >
        <div
          style={{
            fontSize: `${Math.max(6, Math.min(size.w * 0.009, 9))}px`,
            fontFamily: 'monospace',
            fontWeight: 700,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.3em',
            color: 'rgba(255,255,255,0.18)',
          }}
        >
          RAW_INPUT
        </div>
        <div
          style={{
            width: '20px',
            height: '1px',
            background: 'rgba(255,255,255,0.08)',
            marginTop: '3px',
          }}
        />
      </div>

      {/* Right label — CONTROL / OUTPUT */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: '1.5%',
          top: '6%',
          zIndex: 25,
        }}
      >
        <div
          style={{
            fontSize: `${Math.max(6, Math.min(size.w * 0.009, 9))}px`,
            fontFamily: 'monospace',
            fontWeight: 700,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.3em',
            color: 'rgba(0,200,120,0.3)',
            textAlign: 'right' as const,
          }}
        >
          VERIFIED_OUTPUT
        </div>
        <div
          style={{
            width: '100%',
            height: '1px',
            background: 'rgba(0,124,90,0.12)',
            marginTop: '3px',
          }}
        />
      </div>

      {/* ─── PARTICLE FIELD (background depth) ─── */}
      {/* Static micro-dots suggesting data density */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.3, zIndex: 1 }}
      >
        {Array.from({ length: 24 }).map((_, i) => {
          const px = (((i * 137.5) % 100))
          const py = ((i * 73.1) % 100)
          const r = 0.8 + (i % 3) * 0.4
          return (
            <circle
              key={`dot-${i}`}
              cx={`${px}%`}
              cy={`${py}%`}
              r={r}
              fill="rgba(0,124,90,0.4)"
            />
          )
        })}
      </svg>

      {/* Border frame */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          border: '1px solid rgba(255,255,255,0.04)',
          zIndex: 30,
        }}
      />
    </div>
  )
}
