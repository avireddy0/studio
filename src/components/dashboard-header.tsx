'use client';

import { Home, Database, Terminal, Zap, Layers, Map as MapIcon, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navItems = [
  { href: "#hero", label: "01_VISION", icon: Home },
  { href: "#ingestion", label: "02_INGEST", icon: Database },
  { href: "#intel", label: "03_INTEL", icon: Terminal },
  { href: "#fusion", label: "04_FUSION", icon: Zap },
  { href: "#tactical-bim", label: "05_BIM", icon: Layers },
  { href: "#site-docs", label: "06_SITE", icon: MapIcon },
];

const FULL_TEXT = "ENVISION OVERSIGHT";
const DROP_INDICES = new Set([10, 11, 12, 14, 15, 16, 17]); // V,E,R from OVER + I,G,H,T from SIGHT

function DroneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 30" fill="currentColor" className={className}>
      {/* Left propeller */}
      <path d="M1 6h15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      {/* Right propeller */}
      <path d="M32 6h15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      {/* Left motor pod */}
      <rect x="6" y="7" width="6" height="4" rx="2" />
      {/* Right motor pod */}
      <rect x="36" y="7" width="6" height="4" rx="2" />
      {/* Left arm */}
      <path d="M12 9.5L19 13" stroke="currentColor" strokeWidth="2.5" fill="none" />
      {/* Right arm */}
      <path d="M36 9.5L29 13" stroke="currentColor" strokeWidth="2.5" fill="none" />
      {/* Body */}
      <path d="M18 11h12l1.5 3v3a4 4 0 01-4 4h-7a4 4 0 01-4-4v-3z" />
      {/* Camera housing */}
      <rect x="20.5" y="20" width="7" height="4.5" rx="1.5" />
      {/* Camera lens */}
      <circle cx="24" cy="22" r="1.6" className="fill-background opacity-40" />
      {/* Landing gear legs */}
      <path d="M18.5 18L15 27M29.5 18L33 27" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Landing skids */}
      <path d="M13 27h7M28 27h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function AnimatedTitle({ isDark }: { isDark: boolean }) {
  const [phase, setPhase] = useState<'typing' | 'pause' | 'morphing' | 'done'>('typing');
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (phase === 'typing') {
      if (charIndex < FULL_TEXT.length) {
        const t = setTimeout(() => setCharIndex(i => i + 1), 65);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase('pause'), 100);
      return () => clearTimeout(t);
    }
    if (phase === 'pause') {
      const t = setTimeout(() => setPhase('morphing'), 900);
      return () => clearTimeout(t);
    }
    if (phase === 'morphing') {
      const t = setTimeout(() => setPhase('done'), 800);
      return () => clearTimeout(t);
    }
  }, [phase, charIndex]);

  const textColor = isDark ? 'text-white' : 'text-black';

  if (phase === 'done') {
    return (
      <div className="flex items-center gap-2.5">
        <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary">
          ENVISION OS
        </span>
        <div
          className="size-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(0,124,90,0.9),0_0_12px_rgba(0,124,90,0.4)]"
          style={{ animation: 'power-on 0.6s ease-out forwards' }}
        />
      </div>
    );
  }

  const isMorphing = phase === 'morphing';

  return (
    <div className="relative">
      {/* Typing/morphing layer */}
      <span
        className={cn(
          "text-xs font-bold tracking-[0.3em] uppercase transition-opacity duration-500",
          isMorphing ? 'opacity-0' : 'opacity-100',
          textColor
        )}
      >
        {FULL_TEXT.split('').map((char, i) => {
          const isDropped = DROP_INDICES.has(i);
          return (
            <span
              key={i}
              className="inline-block transition-all duration-500 ease-in-out"
              style={{
                opacity: i >= charIndex ? 0 : (isMorphing && isDropped) ? 0 : 1,
                transform: (isMorphing && isDropped) ? 'translateY(10px)' : 'translateY(0)',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          );
        })}
      </span>

      {/* Final "ENVISION OS" layer — fades in during morphing */}
      <span
        className={cn(
          "absolute left-0 top-0 text-xs font-bold tracking-[0.3em] uppercase text-primary transition-opacity duration-700 whitespace-nowrap",
          isMorphing ? 'opacity-100' : 'opacity-0'
        )}
      >
        ENVISION OS
      </span>
    </div>
  );
}

export function DashboardHeader({ title }: { title?: string }) {
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const container = document.getElementById('main-scroll-container');
      if (container) {
        const progress = (container.scrollTop / (container.scrollHeight - container.clientHeight)) * 100;
        setScrollProgress(progress);
      }
    };

    const container = document.getElementById('main-scroll-container');
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b px-6 bg-white border-black/5" />
    );
  }

  const isDarkSection = scrollProgress > 45;

  const bgColor = isDarkSection ? 'bg-[#0A0A0F]/95' : 'bg-white/95';
  const textColor = isDarkSection ? 'text-white' : 'text-black';
  const borderColor = isDarkSection ? 'border-white/10' : 'border-black/5';

  return (
    <header className={cn(
        "sticky top-0 z-50 flex h-16 items-center justify-between border-b px-3 sm:px-6 backdrop-blur-md transition-all duration-500",
        borderColor,
        bgColor
    )}>
      <div className="flex items-center gap-8">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button className={cn("lg:hidden p-2 -ml-2", textColor)}>
              <Menu className="size-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className={cn(
            "w-72 p-0",
            isDarkSection ? "bg-[#0A0A0F] border-white/10" : "bg-white border-black/5"
          )}>
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex items-center gap-3 px-6 py-5 border-b border-inherit">
              <DroneIcon className={cn("w-6 h-5 text-primary")} />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary">Envision OS</span>
              <div className="size-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(0,124,90,0.9)]" />
            </div>
            <nav className="flex flex-col py-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setSheetOpen(false)}
                  className={cn(
                    "flex items-center gap-4 px-6 py-4 transition-all hover:bg-primary/5",
                    textColor, "opacity-70 hover:opacity-100"
                  )}
                >
                  <item.icon className="size-4 text-primary" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]">{item.label}</span>
                </a>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-3 group">
            <DroneIcon className={cn("w-6 h-5 transition-colors", isDarkSection ? "text-primary" : "text-black")} />
            <AnimatedTitle isDark={isDarkSection} />
        </Link>

        <nav className={cn("hidden lg:flex items-center gap-6 border-l pl-8", borderColor)}>
            {navItems.map((item) => (
                <a
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-2 group transition-all opacity-60 hover:opacity-100",
                        textColor
                    )}
                >
                    <item.icon className="size-3 text-primary" />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest">{item.label}</span>
                </a>
            ))}
        </nav>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full animate-status bg-primary" />
                <span className={cn(
                    "text-[10px] font-mono font-bold uppercase tracking-widest",
                    isDarkSection ? "text-primary" : "text-black"
                )}>
                    Node: Active
                </span>
            </div>
            <div className={cn(
                "flex items-center gap-3 font-mono text-[10px] font-bold tracking-[0.3em] px-4 py-1.5 border transition-all",
                isDarkSection ? "text-primary bg-primary/5 border-primary/20" : "text-black bg-black/5 border-black/10"
            )}>
                {title || '00:00:00'}
            </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-[2px] bg-primary/20 w-full overflow-hidden">
        <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </header>
  );
}
