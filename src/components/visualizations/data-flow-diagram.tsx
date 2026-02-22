import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const flowSteps = [
  { name: "External Platforms" },
  { name: "Data Ingestion" },
  { name: "Context Fusion" },
  { name: "AI Orchestrator" },
  { name: "UI Display" },
];

export function DataFlowDiagram() {
  return (
    <Card className="bg-card/60 backdrop-blur-xl h-full">
      <CardHeader>
        <CardTitle>Data Flow</CardTitle>
        <CardDescription>
          From fragmented data to verified intelligence.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center pt-8">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
          {flowSteps.map((step, index) => (
            <div key={step.name} className="flex items-center gap-2 md:gap-4">
              <div className="rounded-md border bg-secondary px-3 py-2 text-center text-xs sm:text-sm">
                {step.name}
              </div>
              {index < flowSteps.length - 1 && (
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
