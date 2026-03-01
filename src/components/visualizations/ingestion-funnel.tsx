'use client'

import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import {
  FileText,
  FileSpreadsheet,
  FileCode,
  FileSignature,
  Mail,
  Phone,
  MessageSquare,
  Target,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { Icon: FileText, label: "PDF", color: "text-red-500", startY: 3 },
  { Icon: FileSpreadsheet, label: "XLS", color: "text-green-600", startY: 14 },
  { Icon: FileSignature, label: "RFI", color: "text-amber-500", startY: 26 },
  { Icon: FileCode, label: "BIM", color: "text-purple-500", startY: 38 },
  { Icon: Mail, label: "EMAIL", color: "text-blue-500", startY: 50 },
  { Icon: Phone, label: "CALL", color: "text-emerald-500", startY: 62 },
  { Icon: MessageSquare, label: "TEXT", color: "text-pink-500", startY: 74 },
  { Icon: FileText, label: "INVOICE", color: "text-orange-500", startY: 85 },
  { Icon: Target, label: "PHOTO", color: "text-sky-500", startY: 94 },
]

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
    <div ref={containerRef} className="relative w-full h-full bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">

      {/* FLYING CARDS — VACUUMED FROM LEFT INTO AUDIT CORE */}
      {items.map((item, i) => {
        const startX = 12
        const startYpx = (item.startY / 100) * size.h
        const dx = centerX - startX - 30
        const dy = centerY - startYpx

        return (
          <motion.div
            key={item.label}
            className="absolute pointer-events-none z-10"
            style={{ left: startX, top: `${item.startY}%` }}
            animate={{
              x: [0, dx * 0.25, dx * 0.65, dx],
              y: [0, dy * 0.15, dy * 0.55, dy],
              scale: [1, 0.92, 0.45, 0.04],
              opacity: [0, 1, 0.85, 0],
              rotate: [0, -4, 8, 18],
            }}
            transition={{
              duration: 4.2 + i * 0.18,
              repeat: Infinity,
              delay: i * 0.48,
              ease: [0.45, 0.05, 0.55, 0.95],
              times: [0, 0.12, 0.7, 1],
            }}
          >
            <div className="bg-white rounded-lg shadow-2xl p-2 sm:p-3 md:p-4 flex flex-col items-center gap-1 sm:gap-1.5">
              <item.Icon className={cn("size-7 sm:size-10 md:size-14 lg:size-16", item.color)} />
              <span className="text-[6px] sm:text-[8px] md:text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                {item.label}
              </span>
            </div>
          </motion.div>
        )
      })}

      {/* AUDIT CORE — CENTER */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="relative w-32 sm:w-44 md:w-56 lg:w-64 h-36 sm:h-48 md:h-56 lg:h-64 rounded-3xl bg-[#0A0A14] border border-indigo-500/30 shadow-[0_0_80px_rgba(99,102,241,0.15)] flex flex-col items-center justify-center overflow-hidden">
          {/* Scan line */}
          <motion.div
            className="absolute inset-x-0 h-[2px] bg-indigo-400/60 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
          <span className="text-3xl sm:text-4xl md:text-5xl font-mono text-indigo-300/50 mb-2 sm:mb-3">
            &#123; &#125;
          </span>
          <span className="text-[9px] sm:text-[11px] md:text-sm font-bold uppercase tracking-[0.3em] text-white/80">
            Audit Core
          </span>
        </div>
      </div>

      {/* VERIFIED JSON OUTPUT — RIGHT SIDE */}
      <div className="absolute right-[3%] sm:right-[5%] md:right-[8%] top-1/2 -translate-y-1/2 flex flex-col gap-2 sm:gap-3 z-10">
        <motion.div
          className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 shadow-lg"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <pre className="text-[7px] sm:text-[9px] md:text-[11px] font-mono text-primary leading-relaxed whitespace-pre">
            {`{ "permit": "F1",\n  "status": "PASS" }`}
          </pre>
        </motion.div>
        <motion.div
          className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 shadow-lg opacity-60 translate-x-2"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <pre className="text-[7px] sm:text-[9px] md:text-[11px] font-mono text-primary leading-relaxed whitespace-pre">
            {`{ "rfi": "042",\n  "stage": "DRAFT" }`}
          </pre>
        </motion.div>
      </div>
    </div>
  )
}
