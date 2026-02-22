import { DashboardHeader } from "@/components/dashboard-header";
import { ArchitectureDiagram } from "@/components/visualizations/architecture-diagram";
import { DataFlowDiagram } from "@/components/visualizations/data-flow-diagram";

export default function VisualizationsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Dynamic Visualizations" />
      <main className="flex-1 p-4 md:p-8">
        <div className="grid gap-8 lg:grid-cols-2">
            <DataFlowDiagram />
            <ArchitectureDiagram />
        </div>
      </main>
    </div>
  );
}
