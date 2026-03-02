"use client"

import React, { useEffect, useState } from "react"

// ─── SCENARIO DATA ───────────────────────────────────────

const SIGNALS = [
  {
    platform: "PROCORE",
    type: "RFI #847",
    color: "#F97316",
    message:
      "Structural engineer flagged rebar spacing non-compliance in foundation grid C4-C7.",
  },
  {
    platform: "GMAIL",
    type: "Inbound Email",
    color: "#EA4335",
    message:
      'From: Atlas Concrete — "Revised pour schedule attached per updated specs. Ready to mobilize once approved."',
  },
  {
    platform: "SLACK",
    type: "#tower-b",
    color: "#611F69",
    message:
      'PM: "Engineering review complete. Revised rebar layout approved. No impact to structural design."',
  },
  {
    platform: "SAGE INTACCT",
    type: "Change Order",
    color: "#1B813E",
    message:
      "CO-2847 approved: $38,400 for rebar redesign + labor. Within contingency budget.",
  },
  {
    platform: "ZOOM",
    type: "Meeting Transcript",
    color: "#2D8CFF",
    message:
      "Owner Weekly Sync — Team confirmed 5-day recovery plan to offset foundation delay.",
  },
]

const VERDICT =
  "CO-2847 ($38.4K) under contingency. Confirmed retail tenant early lease pulls stabilization forward 2.5 months. Schedule impact negligible. Recommend Owner proceed. Standby for confirmation."

// ─── COMPONENT ──────────────────────────────────────────

export function ContextSummarizer() {
  const [mounted, setMounted] = useState(false)
  const [cycle, setCycle] = useState(0)
  const [alertVisible, setAlertVisible] = useState(false)
  const [visibleSignals, setVisibleSignals] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [verdictVisible, setVerdictVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    setAlertVisible(false)
    setVisibleSignals(0)
    setProcessing(false)
    setVerdictVisible(false)

    const t: ReturnType<typeof setTimeout>[] = []

    t.push(setTimeout(() => setAlertVisible(true), 500))

    SIGNALS.forEach((_, i) => {
      t.push(setTimeout(() => setVisibleSignals(i + 1), 1800 + i * 800))
    })

    const afterSignals = 1800 + SIGNALS.length * 800

    t.push(setTimeout(() => setProcessing(true), afterSignals + 500))

    t.push(
      setTimeout(() => {
        setProcessing(false)
        setVerdictVisible(true)
      }, afterSignals + 2200)
    )

    t.push(setTimeout(() => setCycle((c) => c + 1), afterSignals + 2200 + 5500))

    return () => t.forEach(clearTimeout)
  }, [mounted, cycle])

  if (!mounted) return null

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 mb-3 md:mb-4">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tighter text-zinc-900 leading-tight mb-1.5 md:mb-2">
          Context is Everything.
        </h2>
        <p className="text-zinc-400 text-xs md:text-sm font-medium max-w-xl leading-relaxed">
          A single delay triggers 5 platforms. Envision OS correlates the noise
          into{" "}
          <span className="text-zinc-800 font-semibold">
            verified intelligence
          </span>
          .
        </p>
      </div>

      {/* Scenario Flow */}
      <div className="flex-1 min-h-0 flex flex-col gap-2 md:gap-2.5 overflow-hidden">
        {/* ── Alert Banner ────────────────────────────────── */}
        <div
          className="shrink-0 p-2.5 md:p-3 rounded-lg border border-red-200 bg-red-50/80 transition-all duration-600"
          style={{
            opacity: alertVisible ? 1 : 0,
            transform: alertVisible ? "translateY(0)" : "translateY(-8px)",
          }}
        >
          <div className="flex items-center gap-2 mb-0.5">
            <div className="relative flex shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            </div>
            <span className="text-[9px] md:text-[10px] font-mono font-bold text-red-600 uppercase tracking-wider">
              Schedule Risk Detected
            </span>
          </div>
          <p className="text-[11px] md:text-xs text-red-800 font-medium">
            Concrete pour delayed 2 weeks — Tower B Foundation
          </p>
        </div>

        {/* ── Platform Signal Cards ───────────────────────── */}
        <div className="shrink-0 flex flex-col gap-1.5">
          {SIGNALS.map((signal, i) => {
            const visible = i < visibleSignals
            return (
              <div
                key={signal.platform}
                className="p-2.5 md:p-3 rounded-lg bg-white border border-zinc-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-500"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(10px)",
                  borderLeftWidth: 3,
                  borderLeftColor: visible ? signal.color : "transparent",
                }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="text-[8px] md:text-[9px] font-mono font-bold uppercase tracking-wider"
                    style={{ color: signal.color }}
                  >
                    {signal.platform}
                  </span>
                  <span className="text-[8px] md:text-[9px] font-mono text-zinc-400 hidden sm:inline">
                    {signal.type}
                  </span>
                </div>
                <p className="text-[10px] md:text-[11px] text-zinc-600 leading-snug line-clamp-2">
                  {signal.message}
                </p>
              </div>
            )
          })}
        </div>

        {/* ── Processing Indicator ────────────────────────── */}
        <div
          className="shrink-0 flex items-center justify-center gap-2 py-2 transition-all duration-500"
          style={{ opacity: processing ? 1 : 0 }}
        >
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#007C5A] animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#007C5A] animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#007C5A] animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-[9px] md:text-[10px] font-mono text-[#007C5A] font-medium tracking-wide">
            Correlating 5 signals across platforms...
          </span>
        </div>

        {/* ── Envision OS Verdict ─────────────────────────── */}
        <div
          className="shrink-0 p-3 md:p-4 rounded-lg border-2 border-[#007C5A]/25 bg-gradient-to-r from-[#007C5A]/[0.04] to-[#007C5A]/[0.08] transition-all duration-700"
          style={{
            opacity: verdictVisible ? 1 : 0,
            transform: verdictVisible ? "translateY(0)" : "translateY(12px)",
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="relative flex shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#007C5A]" />
              <span className="absolute inset-0 w-2 h-2 rounded-full bg-[#007C5A] animate-ping" />
            </div>
            <span className="text-[9px] md:text-[10px] font-mono font-bold text-[#007C5A] uppercase tracking-wider">
              Envision OS — Verified Intelligence
            </span>
          </div>
          <p className="text-[11px] md:text-xs text-zinc-800 font-medium leading-relaxed">
            {VERDICT}
          </p>
        </div>
      </div>
    </div>
  )
}
