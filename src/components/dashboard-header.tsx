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
const DROP_INDICES = new Set([10, 11, 12, 14, 15, 16, 17]);
const DROP_ORDER = [10, 11, 12, 14, 15, 16, 17];

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
  const [phase, setPhase] = useState<'typing' | 'pause' | 'dropping' | 'settling' | 'done'>('typing');
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
      const t = setTimeout(() => setPhase('dropping'), 900);
      return () => clearTimeout(t);
    }
    if (phase === 'dropping') {
      const t = setTimeout(() => setPhase('settling'), 1000);
      return () => clearTimeout(t);
    }
    if (phase === 'settling') {
      const t = setTimeout(() => setPhase('done'), 600);
      return () => clearTimeout(t);
    }
  }, [phase, charIndex]);

  const isDropping = phase === 'dropping' || phase === 'settling' || phase === 'done';
  const isGreen = phase === 'settling' || phase === 'done';
  const showPower = phase === 'done';
  const textColor = isDark ? 'text-white' : 'text-black';

  return (
    <div className="flex items-center gap-2.5">
      <span className={cn(
        "text-xs font-bold uppercase transition-colors duration-500",
        isGreen ? 'text-primary' : textColor
      )}>
        {FULL_TEXT.split('').map((char, i) => {
          const shouldDrop = DROP_INDICES.has(i);
          const dropped = isDropping && shouldDrop;
          const stagger = shouldDrop ? DROP_ORDER.indexOf(i) * 40 : 0;

          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                overflow: 'hidden',
                verticalAlign: 'top',
                transition: dropped
                  ? `max-width 400ms ease-in-out ${250 + stagger}ms, margin-right 400ms ease-in-out ${250 + stagger}ms`
                  : 'max-width 400ms ease-in-out, margin-right 400ms ease-in-out',
                maxWidth: dropped ? 0 : '1em',
                marginRight: dropped ? 0 : '0.3em',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  transition: dropped
                    ? `opacity 300ms ease-in-out ${stagger}ms, transform 350ms ease-in-out ${stagger}ms`
                    : 'opacity 300ms ease-in-out, transform 350ms ease-in-out',
                  opacity: i >= charIndex ? 0 : dropped ? 0 : 1,
                  transform: dropped ? 'translateY(1.2em)' : 'translateY(0)',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            </span>
          );
        })}
      </span>
      {showPower && (
        <div
          className="size-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(0,124,90,0.9),0_0_12px_rgba(0,124,90,0.4)]"
          style={{ animation: 'power-on 0.6s ease-out forwards' }}
        />
      )}
    </div>
  );
}

export function DashboardHeader({ title }: { title?: string }) {
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [droneHidden, setDroneHidden] = useState(false);
  const [titleHidden, setTitleHidden] = useState(false);

  useEffect(() => {
    const hide = () => setDroneHidden(true);
    const show = () => setDroneHidden(false);
    const hideTitle = () => setTitleHidden(true);
    const showTitle = () => setTitleHidden(false);
    window.addEventListener('hide-header-drone', hide);
    window.addEventListener('show-header-drone', show);
    window.addEventListener('hide-header-title', hideTitle);
    window.addEventListener('show-header-title', showTitle);
    return () => {
      window.removeEventListener('hide-header-drone', hide);
      window.removeEventListener('show-header-drone', show);
      window.removeEventListener('hide-header-title', hideTitle);
      window.removeEventListener('show-header-title', showTitle);
    };
  }, []);

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
        "sticky top-0 z-50 flex h-16 items-center justify-center border-b px-3 sm:px-6 backdrop-blur-md transition-all duration-500 relative",
        borderColor,
        bgColor
    )}>
      {/* Mobile menu — pinned left */}
      <div className="absolute left-3 sm:left-6 lg:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button className={cn("p-2", textColor)}>
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
      </div>

      {/* Center — logo + nav */}
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-3 group">
            <span data-header-drone className={cn("inline-flex transition-opacity duration-300", droneHidden && "opacity-0")}>
              <DroneIcon className={cn("w-6 h-5 transition-colors", isDarkSection ? "text-primary" : "text-black")} />
            </span>
            <span className={cn("transition-opacity duration-500", titleHidden && "opacity-0")}>
              <AnimatedTitle isDark={isDarkSection} />
            </span>
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

      {/* Right — status indicators, pinned right */}
      <div className="absolute right-3 sm:right-6 hidden md:flex items-center gap-6">
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

      <div className="absolute bottom-0 left-0 h-[2px] bg-primary/20 w-full overflow-hidden">
        <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </header>
  );
}
