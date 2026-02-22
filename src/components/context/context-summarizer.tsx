"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { handleContextSummarization } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2, Zap, Target, ListChecks, ShieldCheck } from "lucide-react";
import type { QualitativeContextSummarizationOutput } from "@/ai/flows/qualitative-context-summarization";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  projectDecisionOrIssue: z.string().min(10, "Please provide a more detailed description."),
  qualitativeData: z.string().min(50, "Please provide more qualitative data for a better summary."),
});

export function ContextSummarizer() {
  const [result, setResult] = useState<QualitativeContextSummarizationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectDecisionOrIssue: "",
      qualitativeData: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    const response = await handleContextSummarization(values);
    
    if (response.data) {
      setResult(response.data);
    } else {
      toast({
        variant: "destructive",
        title: "Summarization Failed",
        description: response.error as string || "An unknown error occurred.",
      });
    }
    setIsLoading(false);
  }

  const getConfidenceColor = (level: 'High' | 'Medium' | 'Low') => {
    switch(level) {
        case 'High': return 'bg-green-500';
        case 'Medium': return 'bg-yellow-500';
        case 'Low': return 'bg-red-500';
        default: return 'bg-gray-500';
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card className="bg-card/60 backdrop-blur-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Context Fusion</CardTitle>
              <CardDescription>
                Input qualitative data to extract, highlight, and verify critical context.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="projectDecisionOrIssue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Decision or Issue</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'Decision on using steel vs. concrete for main structure'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="qualitativeData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualitative Data</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste raw data here (e.g., Slack transcripts, Zoom meeting notes)"
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Generate Summary
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card className="bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Verified Context</CardTitle>
          <CardDescription>The AI-generated summary and insights will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {!isLoading && !result && (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p>Awaiting data for summarization...</p>
            </div>
          )}
          {result && (
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center font-semibold mb-2"><Zap className="mr-2 h-5 w-5 text-accent" />Summary</h3>
                <p className="text-sm text-muted-foreground">{result.summary}</p>
              </div>
              <div>
                <h3 className="flex items-center font-semibold mb-2"><Target className="mr-2 h-5 w-5 text-accent" />Critical Points</h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                  {result.criticalPoints.map((point, i) => <li key={i}>{point}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="flex items-center font-semibold mb-2"><ListChecks className="mr-2 h-5 w-5 text-accent" />Action Items</h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                  {result.actionItems.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
               <div>
                <h3 className="flex items-center font-semibold mb-2"><ShieldCheck className="mr-2 h-5 w-5 text-accent" />Confidence Level</h3>
                <Badge variant={result.confidenceLevel === 'High' ? "default" : result.confidenceLevel === 'Medium' ? 'secondary' : 'destructive'}>
                    <span className={`mr-2 h-2 w-2 rounded-full ${getConfidenceColor(result.confidenceLevel)}`}></span>
                    {result.confidenceLevel}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
