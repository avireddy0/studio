"use client"

import React, { useEffect, useState } from "react"

// ─── LAYOUT CONSTANTS ───────────────────────────────────────

const HUB = { x: 500, y: 310 }

const platforms = [
  { id: "procore", label: "PROCORE", x: 140, y: 115, metric: "2.4K RFIs/mo" },
  { id: "gmail", label: "GMAIL", x: 840, y: 95, metric: "12K Emails/mo" },
  { id: "slack", label: "SLACK", x: 880, y: 370, metric: "8.7K Messages" },
  { id: "sage", label: "SAGE INTACCT", x: 760, y: 545, metric: "$4.2M Tracked" },
  { id: "zoom", label: "ZOOM", x: 230, y: 540, metric: "340 Hours/mo" },
  { id: "drive", label: "GOOGLE DRIVE", x: 90, y: 390, metric: "1.2K Documents" },
]

const diamonds = [
  { x: 310, y: 190, s: 8, o: 0.15 },
  { x: 710, y: 170, s: 6, o: 0.1 },
  { x: 340, y: 460, s: 7, o: 0.12 },
  { x: 690, y: 455, s: 5, o: 0.08 },
  { x: 175, y: 260, s: 5, o: 0.06 },
  { x: 810, y: 250, s: 6, o: 0.07 },
  { x: 430, y: 150, s: 4, o: 0.05 },
  { x: 600, y: 500, s: 5, o: 0.06 },
]

// 3D disk helpers
function diskSide(cx: number, cy: number, rx: number, ry: number, h: number) {
  return `M${cx - rx},${cy} A${rx},${ry},0,0,0,${cx + rx},${cy} L${cx + rx},${cy + h} A${rx},${ry},0,0,1,${cx - rx},${cy + h} Z`
}

// ─── COMPONENT ──────────────────────────────────────────────

export function ContextSummarizer() {
  const [mounted, setMounted] = useState(false)
  const [active, setActive] = useState(0)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    const t = setInterval(() => setActive(p => (p + 1) % platforms.length), 2500)
    return () => clearInterval(t)
  }, [mounted])

  if (!mounted) return null

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Header */}
      <div className="shrink-0 space-y-3 md:space-y-4 mb-2 md:mb-4">
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tighter text-white leading-tight">
          Context is Everything.
        </h2>
        <p className="text-white/40 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
          12+ platforms. One truth. Envision OS fuses every signal into <span className="text-white font-semibold">verified intelligence</span>.
        </p>
      </div>

      {/* SVG Network Visualization */}
      <div className="flex-1 relative min-h-0">
        <svg viewBox="0 0 1000 620" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <style>{`
              @keyframes flow { to { stroke-dashoffset: -30; } }
              @keyframes flow-fast { to { stroke-dashoffset: -30; } }
              @keyframes hub-breathe { 0%,100% { opacity: 0.06; } 50% { opacity: 0.14; } }
              @keyframes dot-pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
              .conn { stroke-dasharray: 6 14; animation: flow 3s linear infinite; }
              .conn-active { stroke-dasharray: 8 10; animation: flow-fast 1.2s linear infinite; }
              .hub-breathe { animation: hub-breathe 4s ease-in-out infinite; }
              .dot-pulse { animation: dot-pulse 2s ease-in-out infinite; }
            `}</style>
            <filter id="glow-sm">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feComposite in="SourceGraphic" in2="b" operator="over" />
            </filter>
            <filter id="glow-lg">
              <feGaussianBlur stdDeviation="12" result="b" />
              <feComposite in="SourceGraphic" in2="b" operator="over" />
            </filter>
          </defs>

          {/* ── Hub ambient glow ──────────────────────────── */}
          <ellipse cx={HUB.x} cy={HUB.y} rx="160" ry="90" fill="#007C5A" className="hub-breathe" />

          {/* ── Connection lines ──────────────────────────── */}
          {platforms.map((p, i) => {
            const isActive = active === i
            return (
              <g key={p.id}>
                <line
                  x1={p.x} y1={p.y} x2={HUB.x} y2={HUB.y}
                  stroke={isActive ? "#007C5A" : "rgba(255,255,255,0.03)"}
                  strokeWidth={isActive ? 1.5 : 0.7}
                  className={isActive ? "conn-active" : "conn"}
                />
                {isActive && (
                  <circle r="3.5" fill="#007C5A" filter="url(#glow-sm)">
                    <animateMotion
                      dur="1.8s"
                      repeatCount="indefinite"
                      path={`M${p.x},${p.y} L${HUB.x},${HUB.y}`}
                    />
                  </circle>
                )}
              </g>
            )
          })}

          {/* ── Central Hub: 3D Stacked Disks ────────────── */}

          {/* Bottom disk — RAW SIGNALS (red) */}
          <path d={diskSide(HUB.x, HUB.y + 20, 112, 30, 18)} fill="rgba(239,68,68,0.2)" />
          <ellipse cx={HUB.x} cy={HUB.y + 20} rx="112" ry="30"
            fill="rgba(239,68,68,0.06)" stroke="rgba(239,68,68,0.25)" strokeWidth="1" />
          <text x={HUB.x} y={HUB.y + 25} textAnchor="middle"
            fill="rgba(239,68,68,0.45)" fontSize="9" fontFamily="ui-monospace, monospace" fontWeight="700" letterSpacing="0.2em">
            RAW SIGNALS
          </text>

          {/* Middle disk — CORRELATED (amber) */}
          <path d={diskSide(HUB.x, HUB.y - 18, 107, 28, 18)} fill="rgba(245,158,11,0.22)" />
          <ellipse cx={HUB.x} cy={HUB.y - 18} rx="107" ry="28"
            fill="rgba(245,158,11,0.06)" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
          <text x={HUB.x} y={HUB.y - 13} textAnchor="middle"
            fill="rgba(245,158,11,0.55)" fontSize="9" fontFamily="ui-monospace, monospace" fontWeight="700" letterSpacing="0.2em">
            CORRELATED
          </text>

          {/* Top disk — VERIFIED TRUTH (green) */}
          <path d={diskSide(HUB.x, HUB.y - 56, 102, 26, 18)} fill="rgba(0,124,90,0.3)" />
          <ellipse cx={HUB.x} cy={HUB.y - 56} rx="102" ry="26"
            fill="rgba(0,124,90,0.1)" stroke="rgba(0,124,90,0.5)" strokeWidth="1.5" />
          <text x={HUB.x} y={HUB.y - 51} textAnchor="middle"
            fill="#007C5A" fontSize="10" fontFamily="ui-monospace, monospace" fontWeight="700" letterSpacing="0.25em">
            VERIFIED TRUTH
          </text>

          {/* ── Hub label ────────────────────────────────── */}
          <text x={HUB.x} y={HUB.y - 100} textAnchor="middle"
            fill="#007C5A" fontSize="13" fontFamily="ui-monospace, monospace" fontWeight="700" letterSpacing="0.4em">
            ENVISION OS
          </text>
          <circle cx={HUB.x + 62} cy={HUB.y - 104} r="3" fill="#007C5A" className="dot-pulse" />

          {/* ── Platform nodes ───────────────────────────── */}
          {platforms.map((p, i) => {
            const isActive = active === i
            const boxW = Math.max(p.label.length * 8.5 + 28, 90)
            return (
              <g key={p.id}>
                <rect
                  x={p.x - boxW / 2} y={p.y - 22}
                  width={boxW} height="44" rx="2"
                  fill={isActive ? "rgba(0,124,90,0.06)" : "rgba(255,255,255,0.015)"}
                  stroke={isActive ? "rgba(0,124,90,0.3)" : "rgba(255,255,255,0.05)"}
                  strokeWidth="1"
                  style={{ transition: "all 0.5s ease-out" }}
                />
                {/* Active indicator bar */}
                {isActive && (
                  <rect x={p.x - boxW / 2} y={p.y - 22} width={boxW} height="2" rx="1" fill="#007C5A" opacity="0.6" />
                )}
                <text
                  x={p.x} y={p.y - 3}
                  textAnchor="middle"
                  fill={isActive ? "#007C5A" : "rgba(255,255,255,0.2)"}
                  fontSize="10" fontFamily="ui-monospace, monospace" fontWeight="700" letterSpacing="0.2em"
                  style={{ transition: "fill 0.5s ease-out" }}
                >
                  {p.label}
                </text>
                <text
                  x={p.x} y={p.y + 14}
                  textAnchor="middle"
                  fill={isActive ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.08)"}
                  fontSize="8" fontFamily="ui-monospace, monospace" letterSpacing="0.1em"
                  style={{ transition: "fill 0.5s ease-out" }}
                >
                  {p.metric}
                </text>
              </g>
            )
          })}

          {/* ── Decorative diamonds ──────────────────────── */}
          {diamonds.map((d, i) => (
            <rect
              key={i}
              x={d.x - d.s / 2} y={d.y - d.s / 2}
              width={d.s} height={d.s}
              fill="#007C5A" opacity={d.o}
              transform={`rotate(45 ${d.x} ${d.y})`}
            />
          ))}

          {/* ── Floating metric badge ────────────────────── */}
          <g>
            <rect x="415" y="575" width="170" height="26" rx="2"
              fill="rgba(0,124,90,0.05)" stroke="rgba(0,124,90,0.18)" strokeWidth="0.5" />
            <text x="500" y="592" textAnchor="middle"
              fill="#007C5A" fontSize="9" fontFamily="ui-monospace, monospace" fontWeight="700" letterSpacing="0.2em">
              847 CORRELATIONS / SEC
            </text>
          </g>
        </svg>
      </div>
    </div>
  )
}
