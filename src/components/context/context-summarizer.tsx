
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { handleContextSummarization } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2, Zap, Target, ListChecks, ShieldCheck } from "lucide-react";
import type { QualitativeContextSummarizationOutput } from "@/ai/flows/qualitative-context-summarization";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  projectDecisionOrIssue: z.string().min(5, "Title required."),
  qualitativeData: z.string().min(20, "More data required for fusion."),
});

export function ContextSummarizer() {
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';
  
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
        title: "Fusion Failed",
        description: response.error as string || "An unknown error occurred.",
      });
    }
    setIsLoading(false);
  }

  const getConfidenceColor = (level: 'High' | 'Medium' | 'Low') => {
    switch(level) {
        case 'High': return 'bg-primary';
        case 'Medium': return 'bg-yellow-500';
        case 'Low': return 'bg-destructive';
        default: return 'bg-muted-foreground';
    }
  }

  return (
    <div className={cn(
        "grid gap-6",
        isDashboard ? "grid-cols-1" : "lg:grid-cols-2"
    )}>
      <div className={cn(
        "space-y-4",
        isDashboard ? "p-4 border border-white/5 bg-black/20" : ""
      )}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="projectDecisionOrIssue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    isDashboard ? "text-muted-foreground" : ""
                  )}>Issue_Identifier</FormLabel>
                  <FormControl>
                    <Input 
                        placeholder="e.g., 'Steel Procurement'" 
                        {...field} 
                        className={cn(
                            "h-9 text-xs",
                            isDashboard ? "bg-[#0A0A0F] border-[#1E1E2E] text-white" : ""
                        )}
                    />
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
                  <FormLabel className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    isDashboard ? "text-muted-foreground" : ""
                  )}>Raw_Intelligence_Stream</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste transcripts, notes, or chat logs..."
                      className={cn(
                        "min-h-[100px] text-xs leading-relaxed",
                        isDashboard ? "bg-[#0A0A0F] border-[#1E1E2E] text-white/70" : ""
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              {isDashboard ? "FUSE_CONTEXT" : "Generate Summary"}
            </Button>
          </form>
        </Form>
      </div>

      <div className={cn(
        "border p-4 min-h-[200px] overflow-auto",
        isDashboard ? "bg-[#0A0A0F] border-[#1E1E2E]" : "bg-card/60 backdrop-blur-xl border-border"
      )}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-primary/40 animate-pulse">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-[9px] font-mono uppercase">Analyzing_Correlation...</span>
          </div>
        ) : !result ? (
          <div className="flex items-center justify-center h-full text-center p-4">
            <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest leading-loose">
              Awaiting_Fusion_Target...<br/>
              Map_Qualitative_Nodes_To_Verified_Truth
            </p>
          </div>
        ) : (
          <div className="space-y-5 font-mono">
            <div className="space-y-1">
              <h3 className="text-[8px] text-primary font-bold flex items-center gap-2 uppercase tracking-widest">
                <Zap className="size-3" /> FUSED_SUMMARY
              </h3>
              <p className="text-[11px] text-white/70 leading-normal">{result.summary}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <h3 className="text-[8px] text-primary font-bold flex items-center gap-2 uppercase tracking-widest">
                        <Target className="size-3" /> CRITICAL_NODES
                    </h3>
                    <ul className="space-y-1 text-[10px] text-white/50">
                        {result.criticalPoints.slice(0, 3).map((point, i) => <li key={i} className="flex gap-2"><span>-</span> {point}</li>)}
                    </ul>
                </div>
                <div className="space-y-1">
                    <h3 className="text-[8px] text-primary font-bold flex items-center gap-2 uppercase tracking-widest">
                        <ListChecks className="size-3" /> ACTION_QUEUE
                    </h3>
                    <ul className="space-y-1 text-[10px] text-white/50">
                        {result.actionItems.slice(0, 3).map((item, i) => <li key={i} className="flex gap-2"><span>•</span> {item}</li>)}
                    </ul>
                </div>
            </div>

             <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <h3 className="text-[8px] text-muted-foreground uppercase tracking-widest">CONFIDENCE_VECTOR</h3>
                <div className="flex items-center gap-2">
                    <div className={cn("size-1.5 rounded-full animate-status", getConfidenceColor(result.confidenceLevel))} />
                    <span className="text-[9px] font-bold text-white uppercase">{result.confidenceLevel}</span>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
