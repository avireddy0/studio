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
import type { LucideIcon } from 'lucide-react'

// ─── DOCUMENT TYPES ────────────────────────────────────────────
interface DocType {
  Icon: LucideIcon
  label: string
  sublabel: string
  accent: string
  bg: string            // card background tint
  linePattern: Array<{ w: number; h: number; opacity: number }>
  gridStyle?: 'ruled' | 'graph' | 'ledger' | 'plain'
}

const DOC_TYPES: DocType[] = [
  {
    Icon: FileText,
    label: 'PDF',
    sublabel: 'CONTRACT',
    accent: '#EF4444',
    bg: 'linear-gradient(155deg, #FFFEFE 0%, #FDF5F5 50%, #F9EEEE 100%)',
    linePattern: [
      { w: 100, h: 2, opacity: 0.55 },
      { w: 88, h: 2, opacity: 0.45 },
      { w: 95, h: 2, opacity: 0.50 },
      { w: 62, h: 2, opacity: 0.38 },
    ],
    gridStyle: 'ruled',
  },
  {
    Icon: FileSpreadsheet,
    label: 'XLS',
    sublabel: 'BUDGET',
    accent: '#16A34A',
    bg: 'linear-gradient(155deg, #FEFFFE 0%, #F2FBF4 50%, #E8F7EC 100%)',
    linePattern: [
      { w: 100, h: 6, opacity: 0.12 },
      { w: 100, h: 6, opacity: 0.10 },
      { w: 100, h: 6, opacity: 0.08 },
    ],
    gridStyle: 'ledger',
  },
  {
    Icon: FileSignature,
    label: 'RFI',
    sublabel: 'REQUEST',
    accent: '#D97706',
    bg: 'linear-gradient(155deg, #FFFFF8 0%, #FFFBEE 50%, #FFF6DC 100%)',
    linePattern: [
      { w: 90, h: 2, opacity: 0.50 },
      { w: 75, h: 2, opacity: 0.42 },
      { w: 100, h: 2, opacity: 0.55 },
      { w: 50, h: 2, opacity: 0.35 },
    ],
    gridStyle: 'ruled',
  },
  {
    Icon: FileCode,
    label: 'BIM',
    sublabel: 'MODEL',
    accent: '#9333EA',
    bg: 'linear-gradient(155deg, #FEFEFF 0%, #F8F3FF 50%, #F2EAFF 100%)',
    linePattern: [
      { w: 100, h: 2, opacity: 0.45 },
      { w: 60, h: 2, opacity: 0.35 },
      { w: 80, h: 2, opacity: 0.40 },
    ],
    gridStyle: 'graph',
  },
  {
    Icon: Mail,
    label: 'EMAIL',
    sublabel: 'THREAD',
    accent: '#2563EB',
    bg: 'linear-gradient(155deg, #FEFEFF 0%, #F0F4FF 50%, #E8EEFF 100%)',
    linePattern: [
      { w: 100, h: 2, opacity: 0.50 },
      { w: 90, h: 2, opacity: 0.42 },
      { w: 70, h: 2, opacity: 0.38 },
      { w: 100, h: 2, opacity: 0.45 },
    ],
    gridStyle: 'plain',
  },
  {
    Icon: Phone,
    label: 'CALL',
    sublabel: 'TRANSCRIPT',
    accent: '#059669',
    bg: 'linear-gradient(155deg, #FEFFFE 0%, #F0FBF7 50%, #E4F7EF 100%)',
    linePattern: [
      { w: 80, h: 2, opacity: 0.48 },
      { w: 100, h: 2, opacity: 0.52 },
      { w: 60, h: 2, opacity: 0.38 },
    ],
    gridStyle: 'ruled',
  },
  {
    Icon: MessageSquare,
    label: 'SMS',
    sublabel: 'LOG',
    accent: '#DB2777',
    bg: 'linear-gradient(155deg, #FFFEFF 0%, #FFF0F8 50%, #FFE4F2 100%)',
    linePattern: [
      { w: 100, h: 2, opacity: 0.50 },
      { w: 70, h: 2, opacity: 0.42 },
      { w: 90, h: 2, opacity: 0.48 },
    ],
    gridStyle: 'plain',
  },
  {
    Icon: Receipt,
    label: 'INVOICE',
    sublabel: 'AP/AR',
    accent: '#EA580C',
    bg: 'linear-gradient(155deg, #FFFEFB 0%, #FFF8F0 50%, #FFF0E0 100%)',
    linePattern: [
      { w: 100, h: 2, opacity: 0.52 },
      { w: 80, h: 2, opacity: 0.42 },
      { w: 100, h: 2, opacity: 0.50 },
      { w: 70, h: 2, opacity: 0.38 },
    ],
    gridStyle: 'ledger',
  },
  {
    Icon: Camera,
    label: 'PHOTO',
    sublabel: 'SITE',
    accent: '#0284C7',
    bg: 'linear-gradient(155deg, #FEFEFF 0%, #F0F8FF 50%, #E0F2FF 100%)',
    linePattern: [
      { w: 80, h: 2, opacity: 0.45 },
      { w: 100, h: 2, opacity: 0.50 },
    ],
    gridStyle: 'plain',
  },
]

// ─── ABSORPTION SPARK ───────────────────────────────────────────
interface Spark {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number        // 0..1 (1=alive, 0=dead)
  color: string
  size: number
}

// ─── FLYING CARD ───────────────────────────────────────────────
interface FlyingCard {
  id: number
  typeIdx: number
  startXFrac: number
  startYFrac: number
  // Bezier control points (absolute px, computed once)
  cp1x: number
  cp1y: number
  cp2x: number
  cp2y: number
  progress: number        // 0..1
  baseSpeed: number
  rotation: number
  rotSpeed: number
  scale: number           // base scale (depth-based)
  depth: number           // 0..1
  wobblePhase: number
}

// ─── MATH HELPERS ───────────────────────────────────────────────
function cubicBez(p0: number, p1: number, p2: number, p3: number, t: number) {
  const u = 1 - t
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
}

function easeInQuint(t: number) { return t * t * t * t * t }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }

// ─── JSON OUTPUTS ───────────────────────────────────────────────
const JSON_BLOCKS = [
  {
    label: 'PERMIT · F1-2024',
    lines: [
      '{ "permit": "F1-2024",',
      '  "status": "PASS",',
      '  "risk_score": 0.02 }',
    ],
  },
  {
    label: 'RFI · 042',
    lines: [
      '{ "rfi": "042",',
      '  "stage": "CLOSED",',
      '  "delta_days": -1 }',
    ],
  },
  {
    label: 'BIM · R4-LOD400',
    lines: [
      '{ "model": "R4",',
      '  "lod": 400,',
      '  "clash_count": 0 }',
    ],
  },
]

// ─── COMPONENT ─────────────────────────────────────────────────
export function IngestionFunnel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 800, h: 400 })

  // All animated state stored in refs — avoids React re-render cost
  const cardsRef = useRef<FlyingCard[]>([])
  const sparksRef = useRef<Spark[]>([])
  const nextIdRef = useRef(0)
  const lastSpawnRef = useRef(0)
  const animRef = useRef(0)

  // Canvas for high-performance rendering
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Refs for values used in animation loop
  const sizeRef = useRef({ w: 800, h: 400 })
  const timeRef = useRef(0)

  // Separate lightweight React state for DOM-based elements (JSON cards, labels)
  const [corePhase, setCorePhase] = useState(0)
  const [scanY, setScanY] = useState(0)
  const [jsonReveal, setJsonReveal] = useState([0, 0, 0])   // 0..1 typewriter reveal per block

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect()
        const s = { w: r.width, h: r.height }
        setSize(s)
        sizeRef.current = s
        // Resize canvas
        if (canvasRef.current) {
          const dpr = window.devicePixelRatio || 1
          canvasRef.current.width = s.w * dpr
          canvasRef.current.height = s.h * dpr
          canvasRef.current.style.width = `${s.w}px`
          canvasRef.current.style.height = `${s.h}px`
          const ctx = canvasRef.current.getContext('2d')
          if (ctx) ctx.scale(dpr, dpr)
        }
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // ── DRAW A DOCUMENT CARD ON CANVAS ───────────────────────────
  const drawCard = useCallback((
    ctx: CanvasRenderingContext2D,
    card: FlyingCard,
    cx: number,
    cy: number,
    cardW: number,
    cardH: number,
    time: number,
  ) => {
    const type = DOC_TYPES[card.typeIdx]
    const t = easeInQuint(card.progress)

    // Position along cubic bezier
    const x = cubicBez(card.startXFrac * sizeRef.current.w, card.cp1x, card.cp2x, cx, t)
    const y = cubicBez(card.startYFrac * sizeRef.current.h, card.cp1y, card.cp2y, cy, t)

    // Wobble (perpendicular, dies off near core)
    const wobble = Math.sin(card.wobblePhase + card.progress * 12) * 14 * (1 - t * t)
    const finalX = x + wobble * 0.18
    const finalY = y + wobble

    // Scale: depth-based, crushes to zero as absorbed
    const absorbCrush = 1 - easeInQuint(clamp((card.progress - 0.72) / 0.28, 0, 1))
    const scale = card.scale * absorbCrush

    // Rotation: spins faster as sucked in
    const rot = (card.rotation + card.rotSpeed * card.progress * (1 + card.progress * 3)) * (Math.PI / 180)

    // Opacity
    let opacity: number
    if (card.progress < 0.07) {
      opacity = card.progress / 0.07
    } else if (card.progress > 0.78) {
      opacity = clamp((1 - card.progress) / 0.22, 0, 1)
    } else {
      opacity = 1
    }

    if (scale < 0.01 || opacity < 0.01) return

    ctx.save()
    ctx.globalAlpha = opacity
    ctx.translate(finalX, finalY)
    ctx.rotate(rot)
    ctx.scale(scale, scale)

    const w = cardW
    const h = cardH
    const hw = w / 2
    const hh = h / 2
    const r = 5  // corner radius

    // ── MOTION TRAIL ────────────────────────────────────────────
    if (card.progress > 0.1) {
      const trailLen = card.progress * 30 * (1 - absorbCrush * 0.7)
      const trailGrad = ctx.createLinearGradient(-hw - trailLen, 0, -hw, 0)
      trailGrad.addColorStop(0, `${type.accent}00`)
      trailGrad.addColorStop(1, `${type.accent}30`)
      ctx.fillStyle = trailGrad
      ctx.beginPath()
      ctx.ellipse(-hw - trailLen / 2, 0, trailLen / 2 + 2, hh * 0.4, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    // ── DROP SHADOW ──────────────────────────────────────────────
    ctx.shadowColor = 'rgba(0,0,0,0.35)'
    ctx.shadowBlur = 12 + card.depth * 16
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 4 + card.depth * 8

    // ── PAPER BODY ───────────────────────────────────────────────
    // Parse bg gradient — use simulated flat color for canvas
    // We'll draw a warm white background
    const paperGrad = ctx.createLinearGradient(-hw, -hh, hw * 0.6, hh)

    // Different paper tints per doc type
    const tints: Record<string, [string, string, string]> = {
      '#EF4444': ['#FFFEFE', '#FDF5F5', '#F8EEEE'],
      '#16A34A': ['#FEFFFE', '#F2FBF4', '#E9F7ED'],
      '#D97706': ['#FFFFF8', '#FFFBEE', '#FFF5DC'],
      '#9333EA': ['#FEFEFF', '#F8F3FF', '#F1EAFF'],
      '#2563EB': ['#FEFEFF', '#F0F4FF', '#E8EEFF'],
      '#059669': ['#FEFFFE', '#F0FBF7', '#E3F7F0'],
      '#DB2777': ['#FFFEFF', '#FFF0F7', '#FFE4F2'],
      '#EA580C': ['#FFFEFB', '#FFF8F0', '#FFF0E0'],
      '#0284C7': ['#FEFEFF', '#F0F8FF', '#E0F2FF'],
    }
    const tint = tints[type.accent] || ['#FFFFFF', '#F8F8F8', '#F0F0F0']
    paperGrad.addColorStop(0, tint[0])
    paperGrad.addColorStop(0.5, tint[1])
    paperGrad.addColorStop(1, tint[2])

    ctx.beginPath()
    ctx.moveTo(-hw + r, -hh)
    ctx.lineTo(hw - r, -hh)
    ctx.arcTo(hw, -hh, hw, -hh + r, r)
    ctx.lineTo(hw, hh - r)
    ctx.arcTo(hw, hh, hw - r, hh, r)
    ctx.lineTo(-hw + r, hh)
    ctx.arcTo(-hw, hh, -hw, hh - r, r)
    ctx.lineTo(-hw, -hh + r)
    ctx.arcTo(-hw, -hh, -hw + r, -hh, r)
    ctx.closePath()
    ctx.fillStyle = paperGrad
    ctx.fill()
    ctx.shadowColor = 'transparent'

    // ── PAPER EDGE LIGHTING (top-left highlight) ─────────────────
    const edgeGrad = ctx.createLinearGradient(-hw, -hh, hw, hh)
    edgeGrad.addColorStop(0, 'rgba(255,255,255,0.70)')
    edgeGrad.addColorStop(0.15, 'rgba(255,255,255,0.08)')
    edgeGrad.addColorStop(1, 'rgba(0,0,0,0.04)')
    ctx.fillStyle = edgeGrad
    ctx.beginPath()
    ctx.moveTo(-hw + r, -hh)
    ctx.lineTo(hw - r, -hh)
    ctx.arcTo(hw, -hh, hw, -hh + r, r)
    ctx.lineTo(hw, hh - r)
    ctx.arcTo(hw, hh, hw - r, hh, r)
    ctx.lineTo(-hw + r, hh)
    ctx.arcTo(-hw, hh, -hw, hh - r, r)
    ctx.lineTo(-hw, -hh + r)
    ctx.arcTo(-hw, -hh, -hw + r, -hh, r)
    ctx.closePath()
    ctx.fill()

    // ── SUBTLE GRID LINES (per doc type) ─────────────────────────
    if (type.gridStyle === 'ruled') {
      ctx.strokeStyle = 'rgba(100,120,200,0.06)'
      ctx.lineWidth = 0.5
      const lineSpacing = h * 0.145
      for (let ly = -hh + h * 0.32; ly < hh - 4; ly += lineSpacing) {
        ctx.beginPath()
        ctx.moveTo(-hw + 6, ly)
        ctx.lineTo(hw - 6, ly)
        ctx.stroke()
      }
      // Red margin line (like real ruled paper)
      ctx.strokeStyle = 'rgba(239,68,68,0.10)'
      ctx.lineWidth = 0.75
      ctx.beginPath()
      ctx.moveTo(-hw + w * 0.22, -hh + h * 0.28)
      ctx.lineTo(-hw + w * 0.22, hh - 6)
      ctx.stroke()
    } else if (type.gridStyle === 'graph') {
      ctx.strokeStyle = 'rgba(147,51,234,0.07)'
      ctx.lineWidth = 0.5
      const gs = 8
      for (let gx = -hw + gs; gx < hw; gx += gs) {
        ctx.beginPath(); ctx.moveTo(gx, -hh + h * 0.26); ctx.lineTo(gx, hh - 4); ctx.stroke()
      }
      for (let gy = -hh + h * 0.26; gy < hh - 4; gy += gs) {
        ctx.beginPath(); ctx.moveTo(-hw + 4, gy); ctx.lineTo(hw - 4, gy); ctx.stroke()
      }
    } else if (type.gridStyle === 'ledger') {
      // Spreadsheet-like alternating rows
      const rowH = h * 0.145
      for (let ri = 0; ri < 4; ri++) {
        const rowY = -hh + h * 0.30 + ri * rowH
        if (ri % 2 === 0) {
          ctx.fillStyle = 'rgba(22,163,74,0.04)'
          ctx.fillRect(-hw + 4, rowY, w - 8, rowH)
        }
        // Column divider
        ctx.strokeStyle = 'rgba(22,163,74,0.12)'
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(hw * 0.5, rowY)
        ctx.lineTo(hw * 0.5, rowY + rowH)
        ctx.stroke()
      }
    }

    // ── TOP ACCENT STRIPE ─────────────────────────────────────────
    const stripeGrad = ctx.createLinearGradient(-hw, 0, hw, 0)
    stripeGrad.addColorStop(0, type.accent)
    stripeGrad.addColorStop(0.7, type.accent + 'AA')
    stripeGrad.addColorStop(1, type.accent + '44')
    ctx.fillStyle = stripeGrad
    ctx.fillRect(-hw, -hh, w, 3)

    // ── FOLD CREASE (subtle diagonal shadow in corner) ────────────
    const foldGrad = ctx.createLinearGradient(hw - 14, -hh, hw, -hh + 14)
    foldGrad.addColorStop(0, 'rgba(0,0,0,0.09)')
    foldGrad.addColorStop(0.5, 'rgba(0,0,0,0.04)')
    foldGrad.addColorStop(1, 'rgba(255,255,255,0.12)')
    ctx.fillStyle = foldGrad
    ctx.beginPath()
    ctx.moveTo(hw - 12, -hh)
    ctx.lineTo(hw - r, -hh)
    ctx.arcTo(hw, -hh, hw, -hh + r, r)
    ctx.lineTo(hw, -hh + 12)
    ctx.closePath()
    ctx.fill()

    // ── ICON + LABEL ─────────────────────────────────────────────
    const iconSize = w * 0.24
    const iconX = -hw + w * 0.14
    const iconY = -hh + h * 0.16
    const labelSize = Math.max(5, w * 0.095)

    // Draw icon background pill
    ctx.fillStyle = type.accent + '18'
    ctx.beginPath()
    ctx.roundRect(iconX - 2, iconY - 2, iconSize + 4, iconSize + 4, 3)
    ctx.fill()

    // Icon placeholder (canvas can't render SVG icons directly — draw a shape)
    ctx.fillStyle = type.accent
    ctx.font = `bold ${iconSize * 0.65}px monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(type.label[0], iconX + iconSize / 2, iconY + iconSize / 2)

    // Label
    ctx.fillStyle = type.accent
    ctx.font = `800 ${labelSize}px monospace`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText(type.label, iconX + iconSize + 4, iconY + 1)

    // Sublabel
    ctx.fillStyle = '#9CA3AF'
    ctx.font = `600 ${labelSize * 0.72}px monospace`
    ctx.fillText(type.sublabel, iconX + iconSize + 4, iconY + labelSize + 2)

    // ── TEXT LINES ───────────────────────────────────────────────
    const lineStartY = -hh + h * 0.38
    const lineAreaW = w - 12
    const lineX = -hw + 6

    type.linePattern.forEach((line, j) => {
      const ly = lineStartY + j * (h * 0.135)
      ctx.fillStyle = `rgba(30,30,30,${line.opacity})`
      ctx.beginPath()
      ctx.roundRect(lineX, ly, lineAreaW * (line.w / 100), 2, 1)
      ctx.fill()
    })

    // ── BOTTOM FOOTER ─────────────────────────────────────────────
    const footerY = hh - h * 0.16
    ctx.strokeStyle = 'rgba(0,0,0,0.07)'
    ctx.lineWidth = 0.75
    ctx.beginPath()
    ctx.moveTo(-hw + 6, footerY)
    ctx.lineTo(hw - 6, footerY)
    ctx.stroke()

    // Doc ID
    ctx.fillStyle = 'rgba(180,175,168,0.8)'
    ctx.font = `500 ${Math.max(4, w * 0.062)}px monospace`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText(`ENV-${String(card.id).padStart(4, '0')}`, -hw + 7, footerY + 3)

    // Status dot
    ctx.fillStyle = type.accent + '99'
    ctx.beginPath()
    ctx.arc(hw - 10, footerY + 5, 2.5, 0, Math.PI * 2)
    ctx.fill()

    // ── BORDER ───────────────────────────────────────────────────
    ctx.strokeStyle = 'rgba(0,0,0,0.08)'
    ctx.lineWidth = 0.75
    ctx.beginPath()
    ctx.moveTo(-hw + r, -hh)
    ctx.lineTo(hw - r, -hh)
    ctx.arcTo(hw, -hh, hw, -hh + r, r)
    ctx.lineTo(hw, hh - r)
    ctx.arcTo(hw, hh, hw - r, hh, r)
    ctx.lineTo(-hw + r, hh)
    ctx.arcTo(-hw, hh, -hw, hh - r, r)
    ctx.lineTo(-hw, -hh + r)
    ctx.arcTo(-hw, -hh, -hw + r, -hh, r)
    ctx.closePath()
    ctx.stroke()

    // ── APPROACH ENERGY AURA (green glow when near core) ─────────
    if (card.progress > 0.60) {
      const auraIntensity = (card.progress - 0.60) / 0.40
      const auraGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, hw * 1.8)
      auraGrad.addColorStop(0, `rgba(0,200,120,${auraIntensity * 0.15})`)
      auraGrad.addColorStop(1, 'rgba(0,200,120,0)')
      ctx.fillStyle = auraGrad
      ctx.beginPath()
      ctx.arc(0, 0, hw * 1.8, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }, [])

  // ── DRAW SPARKS ───────────────────────────────────────────────
  const drawSparks = useCallback((ctx: CanvasRenderingContext2D) => {
    sparksRef.current.forEach(spark => {
      if (spark.life <= 0) return
      ctx.save()
      ctx.globalAlpha = spark.life * spark.life  // quadratic fadeout
      ctx.fillStyle = spark.color
      ctx.shadowColor = spark.color
      ctx.shadowBlur = 4
      ctx.beginPath()
      ctx.arc(spark.x, spark.y, spark.size * spark.life, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })
  }, [])

  // ── DRAW VACUUM DISTORTION FIELD ──────────────────────────────
  const drawVacuumField = useCallback((
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    time: number,
  ) => {
    const w = sizeRef.current.w
    const h = sizeRef.current.h
    const pulse = 1 + Math.sin(time * 0.0015) * 0.06

    // Gravitational lensing rings — concentric ovals distorting toward center
    for (let ring = 0; ring < 5; ring++) {
      const radiusX = (0.28 + ring * 0.09) * w * pulse
      const radiusY = (0.22 + ring * 0.07) * h * pulse
      const alpha = (0.04 - ring * 0.007) * (1 + Math.sin(time * 0.001 + ring * 0.8) * 0.3)

      ctx.strokeStyle = `rgba(0,124,90,${Math.max(0, alpha)})`
      ctx.lineWidth = ring === 0 ? 0.8 : 0.5
      ctx.setLineDash(ring % 2 === 0 ? [] : [3, 6])
      ctx.beginPath()
      ctx.ellipse(cx, cy, radiusX, radiusY, 0, 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.setLineDash([])

    // Radial spokes — field line indicators
    for (let spoke = 0; spoke < 12; spoke++) {
      const angle = (spoke / 12) * Math.PI * 2 + time * 0.0003
      const innerR = 0.06 * Math.min(w, h)
      const outerR = 0.30 * Math.min(w, h)
      const alpha = 0.025 + Math.sin(time * 0.001 + spoke * 0.5) * 0.012

      const spokeGrad = ctx.createLinearGradient(
        cx + Math.cos(angle) * outerR,
        cy + Math.sin(angle) * outerR,
        cx + Math.cos(angle) * innerR,
        cy + Math.sin(angle) * innerR,
      )
      spokeGrad.addColorStop(0, `rgba(0,124,90,0)`)
      spokeGrad.addColorStop(1, `rgba(0,124,90,${alpha})`)

      ctx.strokeStyle = spokeGrad
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR)
      ctx.lineTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR)
      ctx.stroke()
    }
  }, [])

  // ── MAIN RENDER LOOP ──────────────────────────────────────────
  useEffect(() => {
    if (sizeRef.current.w < 10) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = sizeRef.current.w * dpr
    canvas.height = sizeRef.current.h * dpr
    ctx.scale(dpr, dpr)

    const SPAWN_INTERVAL = 480
    const MAX_CARDS = 12
    let prevTime = 0

    const loop = (time: number) => {
      const dt = prevTime ? Math.min((time - prevTime) / 1000, 0.05) : 0.016
      prevTime = time
      timeRef.current = time

      const { w, h } = sizeRef.current
      const cx = w * 0.5
      const cy = h * 0.5
      const cardW = clamp(w * 0.105, 68, 112)
      const cardH = cardW * 1.35

      // ── SPAWN ──────────────────────────────────────────────────
      if (time - lastSpawnRef.current > SPAWN_INTERVAL && cardsRef.current.length < MAX_CARDS) {
        const id = ++nextIdRef.current
        const typeIdx = (id - 1) % DOC_TYPES.length
        const startXFrac = 0.01 + Math.random() * 0.08
        const startYFrac = 0.04 + Math.random() * 0.92
        const depth = 0.35 + Math.random() * 0.65

        const startX = startXFrac * w
        const startY = startYFrac * h

        // Control points for S-curve into center
        const cp1x = w * 0.18 + Math.random() * w * 0.08
        const cp1y = startY + (cy - startY) * 0.15 + (Math.random() - 0.5) * h * 0.25
        const cp2x = w * 0.36 + Math.random() * w * 0.05
        const cp2y = cy + (Math.random() - 0.5) * h * 0.12

        cardsRef.current.push({
          id,
          typeIdx,
          startXFrac,
          startYFrac,
          cp1x,
          cp1y,
          cp2x,
          cp2y,
          progress: 0,
          baseSpeed: lerp(0.09, 0.15, depth),
          rotation: (Math.random() - 0.5) * 40,
          rotSpeed: (Math.random() - 0.5) * 55,
          scale: lerp(0.55, 1.0, depth),
          depth,
          wobblePhase: Math.random() * Math.PI * 2,
        })
        lastSpawnRef.current = time
      }

      // ── UPDATE CARDS ───────────────────────────────────────────
      const toRemove: number[] = []
      cardsRef.current = cardsRef.current.map(card => {
        const accel = 1 + easeInQuint(card.progress) * 5
        const newProgress = Math.min(1, card.progress + card.baseSpeed * dt * accel)

        if (newProgress >= 1) {
          // Spawn absorption sparks
          const absX = cx
          const absY = cy
          for (let s = 0; s < 8; s++) {
            const angle = (s / 8) * Math.PI * 2 + Math.random() * 0.5
            const speed = 30 + Math.random() * 80
            sparksRef.current.push({
              id: nextIdRef.current * 100 + s,
              x: absX,
              y: absY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              life: 1,
              color: DOC_TYPES[card.typeIdx].accent,
              size: 1.5 + Math.random() * 2,
            })
          }
          toRemove.push(card.id)
          return card
        }

        return { ...card, progress: newProgress }
      }).filter(c => !toRemove.includes(c.id))

      // ── UPDATE SPARKS ──────────────────────────────────────────
      sparksRef.current = sparksRef.current.map(spark => ({
        ...spark,
        x: spark.x + spark.vx * dt,
        y: spark.y + spark.vy * dt,
        vx: spark.vx * (1 - dt * 3),
        vy: spark.vy * (1 - dt * 3),
        life: spark.life - dt * 2.8,
      })).filter(s => s.life > 0)

      // ── RENDER ─────────────────────────────────────────────────
      ctx.clearRect(0, 0, w, h)

      // Background atmosphere: radial glow from center
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.55)
      bgGrad.addColorStop(0, 'rgba(0,124,90,0.045)')
      bgGrad.addColorStop(0.4, 'rgba(0,100,70,0.015)')
      bgGrad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, w, h)

      // Left zone (chaos) subtle warm glow
      const leftGrad = ctx.createLinearGradient(0, 0, w * 0.25, 0)
      leftGrad.addColorStop(0, 'rgba(30,0,0,0.03)')
      leftGrad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = leftGrad
      ctx.fillRect(0, 0, w * 0.25, h)

      // Vacuum field lines
      drawVacuumField(ctx, cx, cy, time)

      // Background particle dots
      for (let i = 0; i < 28; i++) {
        const px = ((i * 139.7) % 100) / 100 * w
        const py = ((i * 71.3 + 33) % 100) / 100 * h
        const alpha = 0.10 + Math.sin(time * 0.0007 + i * 0.7) * 0.06
        ctx.fillStyle = `rgba(0,124,90,${alpha})`
        ctx.beginPath()
        ctx.arc(px, py, 0.8 + (i % 3) * 0.35, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw cards back-to-front (depth sorted)
      const sorted = [...cardsRef.current].sort((a, b) => a.depth - b.depth)
      sorted.forEach(card => drawCard(ctx, card, cx, cy, cardW, cardH, time))

      // Draw sparks
      drawSparks(ctx)

      // ── CORE GLOW (drawn after cards so it blooms over them) ───
      const coreRadius = clamp(Math.min(w, h) * 0.11, 55, 105)
      const coreGlow1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * 2.8)
      const glowPulse = 0.5 + Math.sin(time * 0.0020) * 0.2
      coreGlow1.addColorStop(0, `rgba(0,200,120,${0.09 + glowPulse * 0.04})`)
      coreGlow1.addColorStop(0.4, `rgba(0,124,90,${0.04 + glowPulse * 0.02})`)
      coreGlow1.addColorStop(1, 'rgba(0,124,90,0)')
      ctx.fillStyle = coreGlow1
      ctx.beginPath()
      ctx.arc(cx, cy, coreRadius * 2.8, 0, Math.PI * 2)
      ctx.fill()

      // Update React state (throttled — only what DOM elements need)
      setCorePhase(time * 0.0025)
      setScanY(prev => { const n = prev + dt * 28; return n > 100 ? 0 : n })

      // JSON typewriter reveal — cycle every ~4s per block
      setJsonReveal(prev => prev.map((r, i) => {
        const cycleMs = 4000 + i * 1400
        const phase = (time % cycleMs) / cycleMs
        if (phase < 0.7) return clamp(phase / 0.7, 0, 1)
        return 1
      }) as [number, number, number])

      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [drawCard, drawSparks, drawVacuumField])

  const { w: sw, h: sh } = size
  const cx = sw * 0.5
  const cy = sh * 0.5
  const corePulse = 1 + Math.sin(corePhase * 1.3) * 0.022
  const coreGlow = 0.5 + Math.sin(corePhase * 0.85) * 0.18
  const coreW = clamp(sw * 0.155, 108, 195)
  const coreH = clamp(sh * 0.42, 118, 215)

  // Status word cycling
  const statusWords = ['synthesizing', 'parsing', 'verifying', 'indexing', 'normalizing']
  const statusWord = statusWords[Math.floor(corePhase * 0.32) % statusWords.length]

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none"
    >
      {/* High-performance canvas layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ zIndex: 5 }}
      />

      {/* ─── AUDIT CORE (DOM — precise control) ─── */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${cx}px`,
          top: `${cy}px`,
          transform: 'translate(-50%, -50%)',
          zIndex: 20,
        }}
      >
        {/* Outermost diffuse halo */}
        <div
          style={{
            position: 'absolute',
            inset: `${-coreW * 0.55}px`,
            borderRadius: '50%',
            background: `radial-gradient(ellipse,
              rgba(0,124,90,${0.07 * coreGlow}) 0%,
              rgba(0,124,90,${0.025 * coreGlow}) 45%,
              transparent 70%)`,
            transform: `scale(${corePulse * 1.08})`,
            pointerEvents: 'none',
          }}
        />

        {/* Mid glow */}
        <div
          style={{
            position: 'absolute',
            inset: `${-coreW * 0.30}px`,
            borderRadius: '50%',
            background: `radial-gradient(ellipse,
              rgba(0,200,120,${0.10 * coreGlow}) 0%,
              rgba(0,124,90,${0.04 * coreGlow}) 50%,
              transparent 75%)`,
            transform: `scale(${corePulse})`,
          }}
        />

        {/* Chromatic aberration rings */}
        {[
          { offset: 0, color: 'rgba(0,255,150,0.06)', dash: false, speed: 1 },
          { offset: 18, color: 'rgba(0,180,90,0.05)', dash: true, speed: -0.7 },
          { offset: 34, color: 'rgba(0,124,90,0.04)', dash: true, speed: 0.4 },
          { offset: 50, color: 'rgba(0,90,60,0.025)', dash: false, speed: -0.3 },
        ].map((ring, i) => (
          <div
            key={`ring-${i}`}
            style={{
              position: 'absolute',
              inset: `-${ring.offset}px`,
              borderRadius: '50%',
              border: `${i < 2 ? 1 : 0.5}px ${ring.dash ? 'dashed' : 'solid'} ${ring.color}`,
              transform: `scale(${corePulse + i * 0.006}) rotate(${corePhase * ring.speed * 20}deg)`,
            }}
          />
        ))}

        {/* Corner HUD brackets */}
        {[
          { top: -10, left: -10, borderT: true, borderL: true },
          { top: -10, right: -10, borderT: true, borderR: true },
          { bottom: -10, right: -10, borderB: true, borderR: true },
          { bottom: -10, left: -10, borderB: true, borderL: true },
        ].map((b, i) => (
          <div
            key={`bracket-${i}`}
            style={{
              position: 'absolute',
              width: '14px',
              height: '14px',
              top: b.top,
              left: b.left,
              right: (b as { right?: number }).right,
              bottom: (b as { bottom?: number }).bottom,
              borderTop: b.borderT ? `1.5px solid rgba(0,200,120,${0.5 + coreGlow * 0.2})` : 'none',
              borderBottom: b.borderB ? `1.5px solid rgba(0,200,120,${0.5 + coreGlow * 0.2})` : 'none',
              borderLeft: b.borderL ? `1.5px solid rgba(0,200,120,${0.5 + coreGlow * 0.2})` : 'none',
              borderRight: b.borderR ? `1.5px solid rgba(0,200,120,${0.5 + coreGlow * 0.2})` : 'none',
            }}
          />
        ))}

        {/* Main core box */}
        <div
          style={{
            width: `${coreW}px`,
            height: `${coreH}px`,
            borderRadius: '7px',
            background: `linear-gradient(175deg,
              rgba(8,14,22,0.98) 0%,
              rgba(5,10,16,0.99) 100%)`,
            border: `1px solid rgba(0,200,120,${0.14 + coreGlow * 0.12})`,
            boxShadow: `
              0 0 0 1px rgba(0,124,90,${0.05 + coreGlow * 0.03}),
              0 0 24px rgba(0,200,120,${0.10 + coreGlow * 0.07}),
              0 0 56px rgba(0,124,90,${0.05 + coreGlow * 0.04}),
              0 0 100px rgba(0,124,90,0.025),
              inset 0 1px 0 rgba(0,255,150,0.09),
              inset 0 0 24px rgba(0,124,90,0.04)
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
          {/* Micro grid */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.045,
              backgroundImage: `
                linear-gradient(rgba(0,200,120,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,200,120,0.5) 1px, transparent 1px)
              `,
              backgroundSize: '13px 13px',
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
                rgba(0,255,150,0.45) 15%,
                rgba(0,255,150,0.80) 50%,
                rgba(0,255,150,0.45) 85%,
                transparent 100%)`,
              boxShadow: `
                0 0 6px rgba(0,255,150,0.5),
                0 0 18px rgba(0,200,120,0.35),
                0 0 40px rgba(0,124,90,0.2)
              `,
              zIndex: 5,
            }}
          />

          {/* Data stream lines (faint, moving) */}
          {[0.22, 0.78].map((pos, i) => (
            <div
              key={`accent-line-${i}`}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${pos * 100}%`,
                height: '1px',
                background: `rgba(0,200,120,${0.06 + Math.sin(corePhase * 2 + i * 1.5) * 0.03})`,
              }}
            />
          ))}

          {/* Side accent glows */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: '2px',
              background: `linear-gradient(180deg,
                transparent 0%,
                rgba(0,200,120,${0.3 + coreGlow * 0.2}) 40%,
                rgba(0,200,120,${0.3 + coreGlow * 0.2}) 60%,
                transparent 100%)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              width: '2px',
              background: `linear-gradient(180deg,
                transparent 0%,
                rgba(0,200,120,${0.15 + coreGlow * 0.08}) 40%,
                rgba(0,200,120,${0.15 + coreGlow * 0.08}) 60%,
                transparent 100%)`,
            }}
          />

          {/* Braces */}
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: `${clamp(sw * 0.042, 26, 50)}px`,
              fontWeight: 700,
              color: `rgba(0,255,150,${0.22 + Math.sin(corePhase) * 0.07})`,
              letterSpacing: '0.12em',
              lineHeight: 1,
              position: 'relative',
              zIndex: 10,
              textShadow: `
                0 0 15px rgba(0,255,150,${0.25 + Math.sin(corePhase) * 0.08}),
                0 0 35px rgba(0,200,120,${0.12 + Math.sin(corePhase) * 0.04})
              `,
            }}
          >
            {'{ }'}
          </div>

          <div
            style={{
              fontSize: `${clamp(sw * 0.010, 7, 11)}px`,
              fontWeight: 800,
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.28em',
              color: 'rgba(255,255,255,0.72)',
              position: 'relative',
              zIndex: 10,
              marginTop: '7px',
            }}
          >
            Audit Core
          </div>

          <div
            style={{
              fontSize: `${clamp(sw * 0.0075, 5.5, 8)}px`,
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: `rgba(0,255,150,${0.3 + Math.sin(corePhase * 1.7) * 0.18})`,
              position: 'relative',
              zIndex: 10,
              marginTop: '4px',
            }}
          >
            {statusWord}...
          </div>

          {/* Bottom progress bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: `rgba(0,40,25,0.8)`,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${((corePhase * 18) % 100)}%`,
                background: `linear-gradient(90deg,
                  transparent,
                  rgba(0,255,150,${0.5 + coreGlow * 0.3}),
                  rgba(0,200,120,${0.3 + coreGlow * 0.2}))`,
                transition: 'width 0.05s linear',
              }}
            />
          </div>
        </div>

        {/* Intake feed indicator lines (left) */}
        <div
          style={{
            position: 'absolute',
            right: '100%',
            top: '50%',
            transform: 'translateY(-50%)',
            marginRight: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
          }}
        >
          {[0, 1, 2].map(i => (
            <div
              key={`feed-${i}`}
              style={{
                height: '1px',
                background: `rgba(0,200,120,${0.12 + Math.sin(corePhase * 2 + i * 1.3) * 0.08})`,
                width: `${16 + Math.sin(corePhase * 3 + i) * 6}px`,
                transformOrigin: 'right',
              }}
            />
          ))}
        </div>

        {/* Output arrow (right) */}
        <div
          style={{
            position: 'absolute',
            left: '100%',
            top: '50%',
            transform: 'translateY(-50%)',
            marginLeft: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
          }}
        >
          <div
            style={{
              height: '1px',
              width: `${22 + Math.sin(corePhase) * 4}px`,
              background: `rgba(0,200,120,${0.28 + coreGlow * 0.12})`,
            }}
          />
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: '3.5px solid transparent',
              borderBottom: '3.5px solid transparent',
              borderLeft: `5px solid rgba(0,200,120,${0.5 + coreGlow * 0.15})`,
            }}
          />
        </div>
      </div>

      {/* ─── JSON OUTPUT STREAM ─── */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: '2%',
          top: '50%',
          transform: 'translateY(-52%)',
          zIndex: 15,
          display: 'flex',
          flexDirection: 'column',
          gap: '7px',
        }}
      >
        {JSON_BLOCKS.map((block, i) => {
          const floatY = Math.sin(corePhase + i * 2.1) * 5
          const glowP = 0.5 + Math.sin(corePhase * 1.4 + i * 1.3) * 0.25
          const dotP = 0.6 + Math.sin(corePhase * 2.1 + i * 0.9) * 0.4
          const baseOpacity = [1, 0.68, 0.40][i]
          const reveal = jsonReveal[i] || 0
          // Typewriter: reveal characters progressively
          const totalChars = block.lines.join('').length
          const visibleChars = Math.floor(reveal * totalChars)
          let rendered = ''
          let charCount = 0
          const visibleLines = block.lines.map(line => {
            if (charCount >= visibleChars) return ''
            const remaining = visibleChars - charCount
            charCount += line.length
            return line.slice(0, remaining) + (remaining < line.length ? '▌' : '')
          })

          return (
            <div
              key={block.label}
              style={{
                transform: `translateY(${floatY}px) translateX(${i * 2}px)`,
                opacity: baseOpacity,
              }}
            >
              <div
                style={{
                  borderRadius: '6px',
                  background: `linear-gradient(145deg,
                    rgba(0,124,90,${0.08 + glowP * 0.04}) 0%,
                    rgba(0,80,55,${0.04 + glowP * 0.02}) 100%)`,
                  border: `1px solid rgba(0,200,120,${0.15 + glowP * 0.08})`,
                  boxShadow: `
                    0 2px 14px rgba(0,124,90,${0.06 + glowP * 0.04}),
                    inset 0 1px 0 rgba(0,255,150,0.05)
                  `,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '2px',
                    background: `linear-gradient(90deg,
                      rgba(0,200,120,${0.45 + glowP * 0.2}) 0%,
                      rgba(0,255,150,${0.25 + glowP * 0.1}) 60%,
                      transparent 100%)`,
                  }}
                />
                <div style={{ padding: '7px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                    <div
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: '#007C5A',
                        boxShadow: `0 0 ${3 + dotP * 5}px rgba(0,200,120,${dotP * 0.7})`,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: `${clamp(sw * 0.0062, 5, 7)}px`,
                        fontFamily: 'monospace',
                        textTransform: 'uppercase',
                        letterSpacing: '0.18em',
                        color: 'rgba(0,220,130,0.55)',
                        fontWeight: 700,
                      }}
                    >
                      {block.label}
                    </span>
                  </div>
                  <pre
                    style={{
                      fontSize: `${clamp(sw * 0.0082, 6, 9.5)}px`,
                      fontFamily: 'monospace',
                      color: 'rgba(0,230,140,0.88)',
                      lineHeight: 1.55,
                      margin: 0,
                      whiteSpace: 'pre',
                      minHeight: `${block.lines.length * 1.55 * clamp(sw * 0.0082, 6, 9.5)}px`,
                    }}
                  >
                    {visibleLines.filter(l => l.length > 0).join('\n')}
                  </pre>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ─── SECTION LABELS ─── */}
      <div
        className="absolute pointer-events-none"
        style={{ left: '1.5%', top: '7%', zIndex: 25 }}
      >
        <div
          style={{
            fontSize: `${clamp(sw * 0.009, 6, 9)}px`,
            fontFamily: 'monospace',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.32em',
            color: 'rgba(255,255,255,0.16)',
          }}
        >
          RAW_INPUT
        </div>
        <div style={{ width: '18px', height: '1px', background: 'rgba(255,255,255,0.07)', marginTop: '3px' }} />
      </div>

      <div
        className="absolute pointer-events-none"
        style={{ right: '1.5%', top: '7%', zIndex: 25, textAlign: 'right' }}
      >
        <div
          style={{
            fontSize: `${clamp(sw * 0.009, 6, 9)}px`,
            fontFamily: 'monospace',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.28em',
            color: 'rgba(0,220,130,0.28)',
          }}
        >
          VERIFIED_OUTPUT
        </div>
        <div style={{ width: '100%', height: '1px', background: 'rgba(0,124,90,0.10)', marginTop: '3px' }} />
      </div>

      {/* Outer frame */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: '1px solid rgba(255,255,255,0.04)',
          borderRadius: '12px',
          zIndex: 30,
        }}
      />
    </div>
  )
}
