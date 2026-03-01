"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnvisionOSLogo } from "@/components/icons";
import { User, Terminal } from "lucide-react";

export type Message = {
  role: "user" | "ai" | "status";
  content: any;
};

export function ChatMessage({ message }: { message: Message }) {
  const { role, content } = message;

  if (role === 'status') {
    return (
        <div className="flex items-center justify-center text-[10px] font-mono text-white/40 my-6 tracking-[0.5em] uppercase">
            <div className="size-1 bg-white animate-ping mr-3" />
            {content}
        </div>
    );
  }

  const isAi = role === "ai";

  return (
    <div className={`flex items-start gap-4 my-8 ${isAi ? "" : "justify-end"}`}>
      {isAi && (
        <Avatar className="h-10 w-10 border border-white/20 rounded-none">
          <AvatarFallback className="bg-black text-white rounded-none">
            <EnvisionOSLogo className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className={`max-w-2xl ${isAi ? "text-left" : "text-right"}`}>
        {typeof content === "string" ? (
          <div
            className={`px-6 py-4 rounded-none shadow-xl ${
              isAi
                ? "bg-black text-white border border-white/10"
                : "bg-white text-[#007C5A] font-bold"
            }`}
          >
            <p className="text-sm leading-relaxed">{content}</p>
          </div>
        ) : (
          <Card className="bg-black border-white/10 rounded-none shadow-2xl">
            <CardHeader className="border-b border-white/5 bg-white/[0.02]">
              <CardTitle className="text-[10px] tracking-[0.3em] uppercase text-white/60 flex items-center gap-2">
                <Terminal className="size-3 text-primary" />
                Specialized_Orchestration_Output
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-[9px] font-mono text-white/40 uppercase tracking-widest mb-2">Protocol_Target</h3>
                  <p className="font-mono text-primary text-sm bg-white/5 p-3 border border-white/5">
                    {content.toolName}
                  </p>
                </div>
                <div>
                  <h3 className="text-[9px] font-mono text-white/40 uppercase tracking-widest mb-2">Extracted_Payload</h3>
                  <pre className="font-mono text-xs bg-black p-4 border border-white/5 overflow-x-auto text-white/80">
                    {JSON.stringify(content.parameters, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      {!isAi && (
        <Avatar className="h-10 w-10 border border-white/20 rounded-none">
          <AvatarFallback className="bg-white text-[#007C5A] rounded-none">
            <User className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
