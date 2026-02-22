import { DashboardHeader } from "@/components/dashboard-header";
import { PdfExtractor } from "@/components/ingestion/pdf-extractor";

export default function IngestionPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Data Ingestion Pipeline" />
      <main className="flex-1 p-4 md:p-8">
        <PdfExtractor />
      </main>
    </div>
  );
}
