'use client'

import { motion, useAnimationControls } from 'framer-motion'
import { useRef, useState, useEffect, useMemo } from 'react'
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

// Document card data — each has unique visual personality
const DOC_ITEMS = [
  { Icon: FileText, label: "PDF", accent: "#EF4444", startY: 4, rotate: -18, lines: [100, 80, 90, 60] },
  { Icon: FileSpreadsheet, label: "XLS", accent: "#22C55E", startY: 15, rotate: 12, lines: [100, 100, 70] },
  { Icon: FileSignature, label: "RFI", accent: "#F59E0B", startY: 27, rotate: -8, lines: [90, 75, 100, 50, 85] },
  { Icon: FileCode, label: "BIM", accent: "#A855F7", startY: 39, rotate: 22, lines: [100, 60, 80] },
  { Icon: Mail, label: "EMAIL", accent: "#3B82F6", startY: 51, rotate: -14, lines: [100, 90, 70, 100] },
  { Icon: Phone, label: "CALL", accent: "#10B981", startY: 63, rotate: 6, lines: [80, 100, 60] },
  { Icon: MessageSquare, label: "SMS", accent: "#EC4899", startY: 74, rotate: -20, lines: [100, 70, 90, 50] },
  { Icon: Receipt, label: "INVOICE", accent: "#F97316", startY: 85, rotate: 15, lines: [100, 80, 100, 70, 60] },
  { Icon: Camera, label: "PHOTO", accent: "#0EA5E9", startY: 94, rotate: -10, lines: [80, 100] },
]

// Realistic paper document card
function DocCard({ accent, Icon, label, lines, rotate }: {
  accent: string
  Icon: typeof FileText
  label: string
  lines: number[]
  rotate: number
}) {
  return (
    <div
      className="relative"
      style={{
        transform: `rotate(${rotate}deg) perspective(600px) rotateY(-3deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Shadow layer */}
      <div className="absolute inset-0 rounded-lg bg-black/20 blur-xl translate-y-2 translate-x-1" />

      {/* Main card */}
      <div className="relative bg-white rounded-lg overflow-hidden"
        style={{
          boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.9)`,
          width: 'clamp(52px, 8vw, 110px)',
          padding: 'clamp(6px, 1vw, 14px)',
        }}
      >
        {/* Accent stripe top */}
        <div className="h-[3px] sm:h-1 rounded-full mb-1.5 sm:mb-2.5" style={{ background: accent }} />

        {/* Icon */}
        <div className="flex items-center gap-1 sm:gap-1.5 mb-1.5 sm:mb-2">
          <Icon
            className="size-3 sm:size-4 md:size-5 shrink-0"
            style={{ color: accent }}
          />
          <span
            className="text-[5px] sm:text-[7px] md:text-[8px] font-black uppercase tracking-[0.15em] truncate"
            style={{ color: accent }}
          >
            {label}
          </span>
        </div>

        {/* Text lines */}
        <div className="flex flex-col gap-[2px] sm:gap-1">
          {lines.map((w, i) => (
            <div
              key={i}
              className="h-[2px] sm:h-[3px] rounded-full bg-gray-200"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>

        {/* Corner fold */}
        <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4">
          <div className="absolute top-0 right-0 w-full h-full bg-gray-100"
            style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
          />
          <div className="absolute top-0 right-0 w-full h-full bg-gray-200/80"
            style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }}
          />
        </div>
      </div>
    </div>
  )
}

export function IngestionFunnel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 800, h: 400 })

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setSize({ w: rect.width, h: rect.height })
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const centerX = size.w * 0.5
  const centerY = size.h * 0.5

  return (
    <div ref={containerRef} className="relative w-full h-full rounded-2xl overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.04) 0%, rgba(10,10,15,0.02) 60%, transparent 100%)',
      }}
    >
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Radial glow behind Audit Core */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[80%] rounded-full z-0"
        style={{
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)',
        }}
      />

      {/* FLYING DOCUMENT CARDS — VACUUMED INTO AUDIT CORE */}
      {DOC_ITEMS.map((item, i) => {
        const startX = 8
        const startYpx = (item.startY / 100) * size.h
        const dx = centerX - startX - 20
        const dy = centerY - startYpx
        const dur = 4.5 + (i % 3) * 0.4

        return (
          <motion.div
            key={item.label}
            className="absolute pointer-events-none z-10"
            style={{ left: startX, top: `${item.startY}%` }}
            animate={{
              x: [0, dx * 0.15, dx * 0.4, dx * 0.75, dx],
              y: [0, dy * 0.08, dy * 0.3, dy * 0.65, dy],
              scale: [1, 0.95, 0.7, 0.3, 0.02],
              opacity: [0, 1, 1, 0.7, 0],
              rotate: [0, item.rotate * 0.3, item.rotate * -0.2, item.rotate * 0.5, 0],
            }}
            transition={{
              duration: dur,
              repeat: Infinity,
              delay: i * 0.45,
              ease: [0.22, 0.03, 0.36, 1],
              times: [0, 0.1, 0.35, 0.75, 1],
            }}
          >
            <DocCard
              accent={item.accent}
              Icon={item.Icon}
              label={item.label}
              lines={item.lines}
              rotate={item.rotate}
            />
          </motion.div>
        )
      })}

      {/* AUDIT CORE — CENTER with layered glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        {/* Outer pulse ring */}
        <motion.div
          className="absolute -inset-4 sm:-inset-6 md:-inset-8 rounded-[2rem] border border-indigo-500/20"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.03, 1],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Glow halo */}
        <div className="absolute -inset-8 sm:-inset-12 md:-inset-16 rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.05) 40%, transparent 70%)',
          }}
        />

        {/* Main core container */}
        <div className="relative w-32 sm:w-44 md:w-56 lg:w-64 h-36 sm:h-48 md:h-56 lg:h-64 rounded-3xl flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(15,15,30,0.98) 0%, rgba(10,10,20,0.99) 100%)',
            border: '1px solid rgba(99,102,241,0.25)',
            boxShadow: '0 0 60px rgba(99,102,241,0.12), 0 0 120px rgba(99,102,241,0.06), inset 0 1px 0 rgba(99,102,241,0.1), inset 0 0 40px rgba(99,102,241,0.03)',
          }}
        >
          {/* Inner grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />

          {/* Scan line with glow trail */}
          <motion.div
            className="absolute left-0 right-0 h-[2px] z-10"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(129,140,248,0.6) 20%, rgba(129,140,248,0.8) 50%, rgba(129,140,248,0.6) 80%, transparent 100%)',
              boxShadow: '0 0 20px rgba(99,102,241,0.5), 0 0 60px rgba(99,102,241,0.2)',
            }}
            animate={{ top: ['-2%', '102%'] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
          />

          {/* Curly braces icon */}
          <motion.span
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-mono mb-2 sm:mb-3 relative z-10"
            style={{ color: 'rgba(129,140,248,0.4)' }}
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            &#123; &#125;
          </motion.span>

          {/* Label */}
          <span className="text-[9px] sm:text-[11px] md:text-sm font-bold uppercase tracking-[0.3em] text-white/80 relative z-10">
            Audit Core
          </span>

          {/* Sublabel */}
          <motion.span
            className="text-[6px] sm:text-[7px] md:text-[8px] font-mono text-indigo-400/40 uppercase tracking-[0.2em] mt-1 relative z-10"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            processing...
          </motion.span>
        </div>
      </div>

      {/* VERIFIED JSON OUTPUT — RIGHT SIDE */}
      <div className="absolute right-[2%] sm:right-[4%] md:right-[6%] top-1/2 -translate-y-1/2 flex flex-col gap-2 sm:gap-3 z-10">
        {[
          { json: `{ "permit": "F1",\n  "status": "PASS" }`, delay: 0 },
          { json: `{ "rfi": "042",\n  "stage": "VERIFIED" }`, delay: 1.2 },
          { json: `{ "bim": "REV_4",\n  "sync": true }`, delay: 2.4 },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="rounded-lg overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(0,124,90,0.12) 0%, rgba(0,124,90,0.06) 100%)',
              border: '1px solid rgba(0,124,90,0.2)',
              boxShadow: '0 4px 20px rgba(0,124,90,0.08), inset 0 1px 0 rgba(0,124,90,0.1)',
              opacity: i === 2 ? 0.4 : i === 1 ? 0.7 : 1,
              transform: `translateX(${i * 4}px)`,
            }}
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: item.delay,
            }}
          >
            <div className="px-2.5 py-1.5 sm:px-4 sm:py-2.5 md:px-5 md:py-3">
              {/* Status dot */}
              <div className="flex items-center gap-1.5 mb-1 sm:mb-1.5">
                <div className="size-1 sm:size-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[5px] sm:text-[6px] md:text-[7px] font-mono text-primary/60 uppercase tracking-widest">
                  verified
                </span>
              </div>
              <pre className="text-[6px] sm:text-[8px] md:text-[10px] font-mono text-primary leading-relaxed whitespace-pre">
                {item.json}
              </pre>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Subtle border */}
      <div className="absolute inset-0 rounded-2xl border border-white/[0.06] pointer-events-none z-30" />
    </div>
  )
}
