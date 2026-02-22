import { ChatInterface } from "@/components/query/chat-interface";
import { DashboardHeader } from "@/components/dashboard-header";

export default function QueryPage() {
  return (
    <div className="flex h-screen w-full flex-col bg-muted/20">
      <DashboardHeader title="Natural Language Query" />
      <main className="flex-1">
        <ChatInterface />
      </main>
    </div>
  );
}
