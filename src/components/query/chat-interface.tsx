
"use client";

import { useState, useRef, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { handleQuery } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage, type Message } from "@/components/query/chat-message";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  message: "",
  data: null,
  error: null,
};

const SUGGESTED_PROMPTS = [
  "Analyze RFI #202",
  "Summarize last meeting",
  "Predict schedule delay",
  "Check budget variance"
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="bg-[#007C5A] text-white hover:bg-[#007C5A]/90 rounded-full h-8 w-8 flex items-center justify-center transition-all shrink-0"
    >
      {pending ? <Loader2 className="animate-spin size-4" /> : <Send className="size-4" />}
    </button>
  );
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "ai", 
      content: "Protocol initialized. Envision OS Intelligence Core is active. Awaiting instruction set." 
    }
  ]);
  const [formState, formAction] = useFormState(handleQuery, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (formState?.data) {
      setMessages((prev) => [
        ...prev.filter(m => m.role !== 'status'),
        { role: "ai", content: formState.data },
      ]);
    }
    if (formState?.error) {
       toast({
        variant: "destructive",
        title: "System Error",
        description: "Protocol interruption detected. Re-attempt transmission.",
      });
      setMessages((prev) => prev.filter(m => m.role !== 'status'));
    }
  }, [formState, toast]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleFormSubmit = async (formData: FormData) => {
    const query = formData.get("query") as string;
    if (query.trim()) {
      setMessages((prev) => [...prev, { role: "user", content: query }]);
      setMessages((prev) => [...prev, { role: "status", content: "ORCHESTRATING_INTEL..." }]);
      formAction(formData);
      formRef.current?.reset();
    }
  };

  const handleSuggestedClick = (prompt: string) => {
    const formData = new FormData();
    formData.append("query", prompt);
    handleFormSubmit(formData);
  };

  return (
    <div className="flex h-full flex-col bg-white relative z-10">
      <ScrollArea className="flex-1 px-4 md:px-8 py-6" ref={scrollAreaRef}>
        <div className="max-w-3xl mx-auto w-full space-y-4">
            {messages.map((msg, index) => <ChatMessage key={index} message={msg} />)}
        </div>
      </ScrollArea>

      <div className="bg-white/80 backdrop-blur-xl p-4 md:p-6 border-t border-black/5">
        {/* SUGGESTED PROMPTS - GREY PILLS */}
        <div className="max-w-3xl mx-auto flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                    key={i}
                    onClick={() => handleSuggestedClick(prompt)}
                    className="px-4 py-1.5 bg-[#F2F2F7] hover:bg-[#E5E5EA] border border-black/5 text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap text-black/60 rounded-full"
                >
                    {prompt}
                </button>
            ))}
        </div>

        <form
          ref={formRef}
          action={handleFormSubmit}
          className="relative mx-auto max-w-3xl flex items-center gap-2 bg-[#F2F2F7] rounded-[24px] px-2 py-1.5 border border-black/5"
        >
          <Input
            name="query"
            placeholder="iMessage"
            className="bg-transparent border-none text-black placeholder:text-black/30 h-10 focus-visible:ring-0 font-sans text-base shadow-none"
            autoComplete="off"
          />
          <SubmitButton />
        </form>
        <div className="mt-4 flex justify-center">
            <p className="text-[8px] font-mono text-black/20 uppercase tracking-[0.5em]">Institutional Intelligence Gateway</p>
        </div>
      </div>
    </div>
  );
}
