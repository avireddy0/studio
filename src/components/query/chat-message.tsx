
"use client";

import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export type Message = {
  role: "user" | "ai" | "status";
  content: any;
};

export function ChatMessage({ message }: { message: Message }) {
  const { role, content } = message;
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';

  if (role === 'status') {
    return (
        <div className={cn(
            "flex items-center justify-center text-[8px] font-mono my-3 tracking-[0.4em] uppercase",
            isDashboard ? "text-primary/60" : "text-black/30"
        )}>
            <div className={cn(
                "size-1 animate-ping mr-3",
                isDashboard ? "bg-primary" : "bg-black/40"
            )} />
            {content}
        </div>
    );
  }

  const isAi = role === "ai";

  return (
    <div className={cn(
        "flex w-full mb-2",
        isAi ? "justify-start" : "justify-end"
    )}>
      <div className={cn(
        "max-w-[85%] md:max-w-[70%] px-4 py-2 text-[13px] leading-tight shadow-sm",
        isAi 
            ? isDashboard 
                ? "bg-[#1E1E2E] text-white/80 rounded-none border border-[#1E1E2E]" 
                : "bg-[#E9E9EB] text-black rounded-[20px] rounded-bl-none"
            : "bg-[#007C5A] text-white rounded-[20px] rounded-br-none font-medium",
        isAi && isDashboard && "font-mono text-[11px]"
      )}>
        {typeof content === "string" ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="space-y-4 py-1">
            <div className={cn(
                "flex items-center gap-2 border-b pb-2 mb-2",
                isDashboard ? "border-white/10" : "border-black/10"
            )}>
                <Terminal className="size-3 opacity-40" />
                <span className="text-[8px] font-bold uppercase tracking-widest opacity-40">PAYLOAD</span>
            </div>
            <div className="space-y-4">
                <div>
                  <h3 className="text-[7px] font-mono opacity-40 uppercase tracking-widest mb-1">TARGET</h3>
                  <p className={cn(
                    "font-mono text-[9px] p-2 border",
                    isDashboard ? "bg-black/40 border-white/5" : "bg-black/5 border-black/5"
                  )}>
                    {content.toolName}
                  </p>
                </div>
                <div>
                  <h3 className="text-[7px] font-mono opacity-40 uppercase tracking-widest mb-1">DATA</h3>
                  <pre className={cn(
                    "font-mono text-[8px] p-2 border overflow-x-auto",
                    isDashboard ? "bg-black/20 border-white/5" : "bg-white/50 border-black/5"
                  )}>
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
