
"use client";

import { useState } from "react";
import { handlePdfExtraction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, FileText, Calendar, User, GitPullRequestArrow } from "lucide-react";
import type { DocumentDataExtractionOutput } from "@/ai/flows/document-data-extraction-flow";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function PdfExtractor() {
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';
  
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState<DocumentDataExtractionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please choose a PDF file to upload.",
      });
      return;
    }
    
    setIsLoading(true);
    setResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const dataUri = reader.result as string;
      const response = await handlePdfExtraction(dataUri);

      if (response.data) {
        setResult(response.data);
        toast({
            title: "Extraction Complete",
            description: `Parsed: ${file.name}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Extraction Failed",
          description: response.error as string || "An unknown error occurred.",
        });
      }
      setIsLoading(false);
    };
    reader.onerror = () => {
        toast({
            variant: "destructive",
            title: "File Read Error",
            description: "Could not read the selected file.",
        });
        setIsLoading(false);
    }
  };

  return (
    <div className={cn(
        "grid gap-6",
        isDashboard ? "grid-cols-1" : "md:grid-cols-2"
    )}>
      <div className="space-y-4">
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="pdf-upload" className={cn(
            "text-[10px] font-bold uppercase tracking-widest",
            isDashboard ? "text-muted-foreground" : ""
          )}>
            Select Source Document
          </Label>
          <div className="flex gap-2">
            <Input 
                id="pdf-upload" 
                type="file" 
                accept=".pdf" 
                onChange={handleFileChange}
                className={cn(
                    "flex-1 h-10 text-xs",
                    isDashboard ? "bg-[#0A0A0F] border-[#1E1E2E] text-white" : ""
                )}
            />
            <Button 
                onClick={handleSubmit} 
                disabled={isLoading || !file}
                className="shrink-0"
                variant={isDashboard ? "default" : "default"}
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            </Button>
          </div>
          {fileName && <p className="text-[9px] font-mono text-primary uppercase mt-1">Ready: {fileName}</p>}
        </div>
      </div>

      <div className={cn(
        "border p-4 min-h-[150px]",
        isDashboard ? "bg-[#0A0A0F] border-[#1E1E2E]" : "bg-card/60 backdrop-blur-xl border-border"
      )}>
        {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-primary/40 animate-pulse">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-[9px] font-mono uppercase">Parsing_Telemetry...</span>
            </div>
        ) : !result ? (
            <div className="flex items-center justify-center h-full text-center p-4">
              <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest leading-loose">
                Awaiting_Input_Stream...<br/>
                Load_PDF_For_Deterministic_Parsing
              </p>
            </div>
        ) : (
            <div className="space-y-3 text-[11px] font-mono">
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <p className="text-[8px] text-muted-foreground uppercase">RFI_ID</p>
                        <p className="text-white font-bold">{result.rfiNumber || "---"}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[8px] text-muted-foreground uppercase">SIG_DATE</p>
                        <p className="text-white font-bold">{result.documentDate || "---"}</p>
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-[8px] text-muted-foreground uppercase">ORCHESTRATOR / RECIPIENT</p>
                    <p className="text-white/80">{result.sender || "N/A"} → {result.recipient || "N/A"}</p>
                </div>
                 <div className="space-y-1 pt-2 border-t border-white/5">
                    <p className="text-[8px] text-muted-foreground uppercase">CORE_INTEL_EXTRACT</p>
                    <p className="text-white/60 line-clamp-3 italic leading-normal">{result.coreContent || "N/A"}</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
