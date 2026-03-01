import { ChatInterface } from "@/components/query/chat-interface";
import { DashboardHeader } from "@/components/dashboard-header";

export default function QueryPage() {
  return (
    <div className="flex h-screen w-full flex-col bg-[#007C5A]">
      <DashboardHeader title="Intelligence Terminal" />
      <main className="flex-1 overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  );
}
