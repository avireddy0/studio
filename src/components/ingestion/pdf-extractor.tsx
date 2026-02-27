"use client";

import { useState } from "react";
import { handlePdfExtraction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, FileText, Calendar, User, GitPullRequestArrow } from "lucide-react";
import type { DocumentDataExtractionOutput } from "@/ai/flows/document-data-extraction-flow";

export function PdfExtractor() {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="bg-card/60 backdrop-blur-xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
            <CardDescription>
              Select a PDF document (e.g., RFI, project update) to extract structured data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="pdf-upload">PDF Document</Label>
              <Input id="pdf-upload" type="file" accept=".pdf" onChange={handleFileChange} />
              {fileName && <p className="text-sm text-muted-foreground mt-2">Selected: {fileName}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading || !file} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Extract Data
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Extracted Data</CardTitle>
          <CardDescription>
            The structured information will appear here after processing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {!isLoading && !result && (
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              <p>Awaiting document upload...</p>
            </div>
          )}
          {result && (
            <div className="space-y-4 text-sm">
                <div className="flex items-center">
                    <GitPullRequestArrow className="mr-3 h-5 w-5 text-accent"/>
                    <div>
                        <p className="font-semibold">RFI Number</p>
                        <p className="text-muted-foreground">{result.rfiNumber || "N/A"}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <Calendar className="mr-3 h-5 w-5 text-accent"/>
                    <div>
                        <p className="font-semibold">Document Date</p>
                        <p className="text-muted-foreground">{result.documentDate || "N/A"}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <User className="mr-3 h-5 w-5 text-accent"/>
                    <div>
                        <p className="font-semibold">Sender</p>
                        <p className="text-muted-foreground">{result.sender || "N/A"}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <User className="mr-3 h-5 w-5 text-accent"/>
                    <div>
                        <p className="font-semibold">Recipient</p>
                        <p className="text-muted-foreground">{result.recipient || "N/A"}</p>
                    </div>
                </div>
                 <div className="flex items-start">
                    <FileText className="mr-3 h-5 w-5 text-accent flex-shrink-0 mt-1"/>
                    <div className="flex-1">
                        <p className="font-semibold">Core Content</p>
                        <p className="text-muted-foreground whitespace-pre-wrap">{result.coreContent || "N/A"}</p>
                    </div>
                </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
