import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  FileDown,
  BookText,
  LayoutGrid,
  ArrowRight,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";

const features = [
  {
    title: "Natural Language Query",
    description: "Ask project questions in plain English and get AI-powered answers.",
    href: "/query",
    icon: MessageSquare,
  },
  {
    title: "Data Ingestion",
    description: "Process and normalize fragmented data from diverse sources like PDFs.",
    href: "/ingestion",
    icon: FileDown,
  },
  {
    title: "Context Fusion",
    description: "Extract and verify critical context from qualitative data sources.",
    href: "/context",
    icon: BookText,
  },
  {
    title: "Visualizations",
    description: "Explore dynamic visual modules for data flows and architecture.",
    href: "/visualizations",
    icon: LayoutGrid,
  },
];

export default function DashboardHomePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="font-headline text-2xl font-bold tracking-tight">
            Welcome to Envision OS
          </h1>
        </div>
        <p className="max-w-3xl text-muted-foreground">
          The all-seeing eye for construction project management. Utilize our suite of AI-powered tools to gain unparalleled insights into your projects. Select a tool below to get started.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="transform-gpu bg-card/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {feature.title}
                </CardTitle>
                <feature.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 text-xs">
                  {feature.description}
                </CardDescription>
                <Button asChild size="sm" variant="outline">
                  <Link href={feature.href}>
                    Launch Tool <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
