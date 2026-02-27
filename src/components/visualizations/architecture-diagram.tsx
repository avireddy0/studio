import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Share2, Database, Layers, BrainCircuit } from "lucide-react";

const layers = [
  {
    name: "UI Layer",
    description: "Next.js, React, Tailwind CSS",
    icon: Layers,
    color: "text-blue-400",
  },
  {
    name: "AI Orchestration",
    description: "Genkit Semantic Router",
    icon: BrainCircuit,
    color: "text-cyan-400",
  },
  {
    name: "Integration Layer",
    description: "Multi-Platform Connectors",
    icon: Share2,
    color: "text-purple-400",
  },
  {
    name: "Data Layer",
    description: "Structured Data Models",
    icon: Database,
    color: "text-green-400",
  },
];

export function ArchitectureDiagram() {
  return (
    <Card className="bg-card/60 backdrop-blur-xl h-full">
      <CardHeader>
        <CardTitle>System Architecture</CardTitle>
        <CardDescription>
          High-level overview of Envision OS components.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          {layers.map((layer) => (
            <div key={layer.name} className="relative z-10 flex items-center">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg bg-muted ${layer.color}`}
              >
                <layer.icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h4 className="font-semibold">{layer.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {layer.description}
                </p>
              </div>
            </div>
          ))}
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border -z-0"></div>
        </div>
      </CardContent>
    </Card>
  );
}
