"use client";

import { useState, useRef, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { handleQuery } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, MessageSquare, Zap } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage, type Message } from "@/components/query/chat-message";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  message: "",
  data: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      size="icon" 
      aria-label="Send message" 
      disabled={pending}
      className="bg-white text-[#007C5A] hover:bg-white/90 rounded-none h-10 w-10"
    >
      {pending ? <Loader2 className="animate-spin" /> : <Send className="size-4" />}
    </Button>
  );
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [formState, formAction] = useFormState(handleQuery, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (formState?.data) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: formState.data },
      ]);
    }
    if (formState?.error) {
       toast({
        variant: "destructive",
        title: "System Error",
        description: "Protocol interruption detected. Re-attempt transmission.",
      });
      setMessages((prev) => prev.slice(0, -1)); // Remove the loading message
    }
  }, [formState, toast]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100);
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

  return (
    <div className="flex h-full flex-col bg-transparent">
      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="max-w-4xl mx-auto w-full">
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center text-white/60">
                    <Zap size={64} className="mb-6 text-white/20 animate-pulse" />
                    <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-tighter">AI_COMMAND_INIT</h2>
                    <p className="text-xs font-mono uppercase tracking-[0.3em]">Awaiting Instruction_Set</p>
                </div>
            ) : (
                messages.map((msg, index) => <ChatMessage key={index} message={msg} />)
            )}
        </div>
      </ScrollArea>
      <div className="bg-black/20 backdrop-blur-md p-6 border-t border-white/10">
        <form
          ref={formRef}
          action={handleFormSubmit}
          className="relative mx-auto max-w-4xl"
        >
          <Input
            name="query"
            placeholder="ENTER COMMAND OR QUERY..."
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-14 rounded-none pr-16 focus-visible:ring-white/30 font-mono text-sm tracking-widest"
            autoComplete="off"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <SubmitButton />
          </div>
        </form>
        <div className="mt-4 flex justify-center">
            <p className="text-[8px] font-mono text-white/30 uppercase tracking-[0.5em]">Secure_Institutional_Node_Locked</p>
        </div>
      </div>
    </div>
  );
}
