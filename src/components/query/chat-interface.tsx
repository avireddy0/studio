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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" aria-label="Send message" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <Send />}
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
        title: "Error",
        description: "An error occurred while processing your query. Please try again.",
      });
      setMessages((prev) => prev.slice(0, -1)); // Remove the loading message
    }
  }, [formState, toast]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        // A slight delay to allow the new message to render
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
      setMessages((prev) => [...prev, { role: "status", content: "AI is thinking..." }]);
      formAction(formData);
      formRef.current?.reset();
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="max-w-4xl mx-auto w-full">
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <MessageSquare size={48} className="mb-4" />
                    <h2 className="text-2xl font-bold">Start a Conversation</h2>
                    <p>Ask Envision OS anything about your project.</p>
                </div>
            ) : (
                messages.map((msg, index) => <ChatMessage key={index} message={msg} />)
            )}
        </div>
      </ScrollArea>
      <div className="border-t bg-background/80 backdrop-blur-sm p-4">
        <form
          ref={formRef}
          action={handleFormSubmit}
          className="relative mx-auto max-w-4xl"
        >
          <Input
            name="query"
            placeholder="e.g., 'List all open RFIs for Project Phoenix'"
            className="pr-16"
            autoComplete="off"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}
