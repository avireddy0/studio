"use client";

import { useState, useEffect, useMemo } from "react";
import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export type Message = {
  role: "user" | "ai" | "status";
  content: any;
};

type ChatMessageProps = {
  message: Message;
  isStreaming?: boolean;
  onStreamComplete?: () => void;
  onLineReveal?: () => void;
};

// Detect ALL_CAPS section headers (COST_SITREP, ACTIONS:, THREATS:, etc.)
function isHeaderLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > 45) return false;
  return /^[A-Z][A-Z_]{3,}([\s\u2014:\-]|$)/.test(trimmed);
}

function FormattedLine({ line, isDashboard }: { line: string; isDashboard: boolean }) {
  const trimmed = line.trim();

  if (!trimmed) return <span className="block h-3" />;

  if (isHeaderLine(trimmed)) {
    return (
      <span className={cn(
        "block text-[10px] font-bold tracking-wider mt-2 first:mt-0",
        isDashboard ? "text-white/50" : "text-black/45"
      )}>
        {trimmed}
      </span>
    );
  }

  if (trimmed.startsWith("\u26A0")) {
    return (
      <span className={cn(
        "block",
        isDashboard ? "text-amber-400/90" : "text-amber-700"
      )}>
        {trimmed}
      </span>
    );
  }

  if (/^\d+\./.test(trimmed)) {
    return (
      <span className={cn(
        "block pl-1",
        isDashboard ? "text-white/70" : "text-black/80"
      )}>
        {trimmed}
      </span>
    );
  }

  return <span className="block">{trimmed}</span>;
}

function StreamingContent({
  text,
  isDashboard,
  onComplete,
  onLineReveal,
}: {
  text: string;
  isDashboard: boolean;
  onComplete?: () => void;
  onLineReveal?: () => void;
}) {
  const lines = useMemo(() => text.split("\n"), [text]);
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    if (visibleCount >= lines.length) {
      onComplete?.();
      return;
    }
    const nextLine = lines[visibleCount]?.trim() ?? "";
    const delay = nextLine === "" ? 40 : isHeaderLine(nextLine) ? 160 : 80;
    const timer = setTimeout(() => {
      setVisibleCount((v) => v + 1);
      onLineReveal?.();
    }, delay);
    return () => clearTimeout(timer);
  }, [visibleCount, lines, onComplete, onLineReveal]);

  const isComplete = visibleCount >= lines.length;

  return (
    <div>
      {lines.slice(0, visibleCount).map((line, i) => (
        <FormattedLine key={i} line={line} isDashboard={isDashboard} />
      ))}
      {!isComplete && (
        <span
          className={cn(
            "inline-block w-[5px] h-[13px] animate-pulse ml-px align-text-bottom",
            isDashboard ? "bg-white/60" : "bg-black/40"
          )}
        />
      )}
    </div>
  );
}

export function ChatMessage({ message, isStreaming, onStreamComplete, onLineReveal }: ChatMessageProps) {
  const { role, content } = message;
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  if (role === "status") {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-[8px] font-mono my-3 tracking-[0.4em] uppercase",
          isDashboard ? "text-primary/60" : "text-black/30"
        )}
      >
        <div
          className={cn(
            "size-1 animate-ping mr-3",
            isDashboard ? "bg-primary" : "bg-black/40"
          )}
        />
        {content}
      </div>
    );
  }

  const isAi = role === "ai";

  return (
    <div
      className={cn(
        "flex w-full mb-2",
        isAi ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] md:max-w-[70%] px-4 py-2.5 shadow-sm",
          isAi
            ? isDashboard
              ? "bg-[#1E1E2E] text-white/80 rounded-none border border-[#1E1E2E]"
              : "bg-[#E9E9EB] text-black rounded-[20px] rounded-bl-none"
            : "bg-[#007C5A] text-white rounded-[20px] rounded-br-none",
          isAi
            ? "text-[13px] leading-[1.6] font-semibold"
            : "text-[13px] leading-tight font-semibold",
          isAi && isDashboard && "font-mono text-[11px]"
        )}
      >
        {typeof content === "string" ? (
          isStreaming ? (
            <StreamingContent
              text={content}
              isDashboard={isDashboard}
              onComplete={onStreamComplete}
              onLineReveal={onLineReveal}
            />
          ) : (
            <div>
              {content.split("\n").map((line: string, i: number) => (
                <FormattedLine key={i} line={line} isDashboard={isDashboard} />
              ))}
            </div>
          )
        ) : (
          <div className="space-y-4 py-1">
            <div
              className={cn(
                "flex items-center gap-2 border-b pb-2 mb-2",
                isDashboard ? "border-white/10" : "border-black/10"
              )}
            >
              <Terminal className="size-3 opacity-40" />
              <span className="text-[8px] font-bold uppercase tracking-widest opacity-40">
                PAYLOAD
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-[7px] font-mono opacity-40 uppercase tracking-widest mb-1">
                  TARGET
                </h3>
                <p
                  className={cn(
                    "font-mono text-[9px] p-2 border",
                    isDashboard
                      ? "bg-black/40 border-white/5"
                      : "bg-black/5 border-black/5"
                  )}
                >
                  {content.toolName}
                </p>
              </div>
              <div>
                <h3 className="text-[7px] font-mono opacity-40 uppercase tracking-widest mb-1">
                  DATA
                </h3>
                <pre
                  className={cn(
                    "font-mono text-[8px] p-2 border overflow-x-auto",
                    isDashboard
                      ? "bg-black/20 border-white/5"
                      : "bg-white/50 border-black/5"
                  )}
                >
                  {JSON.stringify(content.parameters, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
