
import { ChatInterface } from "@/components/query/chat-interface";
import { DashboardHeader } from "@/components/dashboard-header";

export default function QueryPage() {
  return (
    <div className="flex h-screen w-full flex-col bg-white">
      <DashboardHeader title="Intelligence Terminal" />
      <main className="flex-1 overflow-hidden relative">
        {/* SUBTLE HUD OVERLAY FOR WHITE BACKGROUND */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ 
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
        <ChatInterface />
      </main>
    </div>
  );
}
