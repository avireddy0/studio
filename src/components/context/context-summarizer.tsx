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
import { Loader2, Wand2, Zap, Target, ListChecks, ShieldAlert, Layers, ShieldCheck, Cpu } from "lucide-react";
import type { QualitativeContextSummarizationOutput } from "@/ai/flows/qualitative-context-summarization";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  projectDecisionOrIssue: z.string().min(5, "Title required."),
  qualitativeData: z.string().min(20, "More data required for fusion."),
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
        title: "Fusion Failed",
        description: response.error as string || "An unknown error occurred.",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* INPUT SIDE */}
      <div className="space-y-8">
        <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-white uppercase">Initialize Fusion</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
                Connect fragmented communication nodes to the verified project baseline.
            </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="projectDecisionOrIssue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-primary">Context_Target</FormLabel>
                  <FormControl>
                    <Input 
                        placeholder="e.g., 'Steel Procurement Delay'" 
                        {...field} 
                        className="bg-[#0A0A0F] border-[#1E1E2E] text-white h-11"
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
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-primary">Signal_Input_Stream</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste Slack logs, Zoom transcripts, or field notes..."
                      className="min-h-[150px] bg-[#0A0A0F] border-[#1E1E2E] text-white/70 leading-relaxed font-mono text-xs"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full h-14 group">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Cpu className="mr-2 h-4 w-4" />}
              EXECUTE_CONTEXT_FUSION
            </Button>
          </form>
        </Form>
      </div>

      {/* VISUALIZATION SIDE */}
      <div className="relative min-h-[500px] flex flex-col gap-6">
        {!result && !isLoading ? (
            <div className="flex-1 border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-12 gap-6 bg-white/[0.01]">
                <div className="relative">
                    <Layers className="size-16 text-white/10" />
                    <ShieldAlert className="size-6 text-destructive absolute -top-1 -right-1 animate-pulse" />
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-bold text-white/40 uppercase tracking-[0.2em]">Data Without Context is Dangerous</p>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase leading-relaxed">
                        Raw data points are liability. <br/> Initialize fusion to generate verified intelligence.
                    </p>
                </div>
            </div>
        ) : isLoading ? (
            <div className="flex-1 border border-primary/20 bg-primary/5 flex flex-col items-center justify-center gap-4">
                <Loader2 className="size-10 text-primary animate-spin" />
                <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-[0.4em]">Fusing_Intelligence_Layers...</span>
            </div>
        ) : (
            <div className="flex-1 flex flex-col gap-6">
                {/* INTERACTIVE LAYERING VISUAL */}
                <div className="relative h-64 border border-white/10 bg-black/40 overflow-hidden group">
                    <div className="absolute inset-0 tactical-grid opacity-20" />
                    
                    {/* DATA LAYER (BOTTOM) */}
                    <div className="absolute inset-4 border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center gap-2 transform translate-z-[-10px] group-hover:translate-y-[-10px] transition-transform duration-500">
                        <span className="text-[8px] font-mono text-white/20 uppercase">Baseline_Data_Stream</span>
                        <div className="flex gap-2">
                            {[1, 2, 3].map(i => <div key={i} className="h-1 w-8 bg-white/5" />)}
                        </div>
                    </div>

                    {/* CONTEXT LAYER (TOP) */}
                    <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm border-t-2 border-primary flex flex-col items-center justify-center gap-3 transform translate-z-[10px] transition-all duration-700 animate-in fade-in slide-in-from-bottom-4">
                        <ShieldCheck className="size-10 text-primary" />
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">CONTEXT_VERIFIED</p>
                            <p className="text-[8px] font-mono text-primary uppercase tracking-widest">{result.confidenceLevel}_Confidence_Vector</p>
                        </div>
                    </div>
                </div>

                {/* RESULTS CONTENT */}
                <div className="space-y-6 font-mono">
                    <div className="space-y-2">
                        <h4 className="text-[9px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                            <Zap className="size-3" /> FUSED_SUMMARY
                        </h4>
                        <p className="text-xs text-white/70 leading-relaxed bg-white/[0.02] p-4 border border-white/5">
                            {result.summary}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <h4 className="text-[9px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                                <Target className="size-3" /> CRITICAL_NODES
                            </h4>
                            <ul className="space-y-2 text-[10px] text-white/50">
                                {result.criticalPoints.map((p, i) => <li key={i} className="flex gap-2"><span>-</span> {p}</li>)}
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-[9px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                                <ListChecks className="size-3" /> ACTION_QUEUE
                            </h4>
                            <ul className="space-y-2 text-[10px] text-white/50">
                                {result.actionItems.map((p, i) => <li key={i} className="flex gap-2"><span>•</span> {p}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}