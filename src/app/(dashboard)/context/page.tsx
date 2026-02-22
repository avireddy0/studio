import { DashboardHeader } from "@/components/dashboard-header";
import { ContextSummarizer } from "@/components/context/context-summarizer";

export default function ContextPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Context Fusion & Verification" />
      <main className="flex-1 p-4 md:p-8">
        <ContextSummarizer />
      </main>
    </div>
  );
}
