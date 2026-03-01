
"use client";

import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export type Message = {
  role: "user" | "ai" | "status";
  content: any;
};

export function ChatMessage({ message }: { message: Message }) {
  const { role, content } = message;

  if (role === 'status') {
    return (
        <div className="flex items-center justify-center text-[9px] font-mono text-black/30 my-4 tracking-[0.4em] uppercase">
            <div className="size-1 bg-black/40 animate-ping mr-3" />
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
        "max-w-[85%] md:max-w-[70%] px-4 py-2.5 text-[15px] leading-tight shadow-sm",
        isAi 
            ? "bg-[#E9E9EB] text-black rounded-[20px] rounded-bl-none" 
            : "bg-[#007C5A] text-white rounded-[20px] rounded-br-none font-medium"
      )}>
        {typeof content === "string" ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="space-y-4 py-1">
            <div className="flex items-center gap-2 border-b border-black/10 pb-2 mb-2">
                <Terminal className="size-3 opacity-40" />
                <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">Intelligence_Payload</span>
            </div>
            <div className="space-y-4">
                <div>
                  <h3 className="text-[8px] font-mono opacity-40 uppercase tracking-widest mb-1">Target_Node</h3>
                  <p className="font-mono text-[10px] bg-black/5 p-2 border border-black/5">
                    {content.toolName}
                  </p>
                </div>
                <div>
                  <h3 className="text-[8px] font-mono opacity-40 uppercase tracking-widest mb-1">Data_Stream</h3>
                  <pre className="font-mono text-[9px] bg-white/50 p-2 border border-black/5 overflow-x-auto">
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
