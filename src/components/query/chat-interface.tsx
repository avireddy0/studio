"use client";

import { useState, useRef, useEffect, useActionState, startTransition, useCallback } from "react";
import { useFormStatus } from "react-dom";
import { handleQuery } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage, type Message } from "@/components/query/chat-message";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type QueryState =
  | { message: string; error?: undefined; data?: undefined; followUps?: undefined }
  | { message: string; error: { query?: string[] }; data?: undefined; followUps?: undefined }
  | { message: string; data: string; followUps: string[]; error?: undefined };

const initialState: QueryState = { message: "", error: undefined };

const INITIAL_PROMPTS = [
  "On Budget?",
  "On Schedule?",
  "Quick Debrief",
  "What If?",
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

const INITIAL_MESSAGE: Message = {
  role: "ai",
  content: "ENVISION OS online. Phoenix \u2014 74.2% complete. Awaiting tasking.",
};

const STORAGE_KEY = "envision-chat-history";
const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [followUpPrompts, setFollowUpPrompts] = useState<string[] | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [isStreamingActive, setIsStreamingActive] = useState(false);
  const [showFollowUps, setShowFollowUps] = useState(true);

  const [formState, formAction] = useActionState<QueryState, FormData>(handleQuery as (state: QueryState, payload: FormData) => Promise<QueryState>, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const pendingFollowUps = useRef<string[] | null>(null);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset chat to initial state
  const resetChat = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([INITIAL_MESSAGE]);
    setFollowUpPrompts(null);
    setIsStreamingActive(false);
    setShowFollowUps(true);
  }, []);

  // Inactivity timer — resets chat storage after 5 min of no user interaction
  useEffect(() => {
    const resetTimer = () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(resetChat, INACTIVITY_TIMEOUT_MS);
    };
    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();
    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [resetChat]);

  // Restore messages from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch { /* ignore corrupt storage */ }
    setHydrated(true);
  }, []);

  // Persist messages to localStorage (skip status messages)
  useEffect(() => {
    if (!hydrated) return;
    const toSave = messages.filter((m) => m.role !== "status");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [messages, hydrated]);

  useEffect(() => {
    if (formState?.data) {
      if (formState.followUps) {
        pendingFollowUps.current = formState.followUps;
      }
      setShowFollowUps(false);
      setIsStreamingActive(true);
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.role !== "status");
        return [...filtered, { role: "ai", content: formState.data }];
      });
    }
    if (formState?.error) {
      toast({
        variant: "destructive",
        title: "COMMS FAILURE",
        description: "Routing interrupted. Retry.",
      });
      setMessages((prev) => prev.filter((m) => m.role !== "status"));
      setShowFollowUps(true);
    }
  }, [formState, toast]);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (viewport) {
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleStreamComplete = useCallback(() => {
    setIsStreamingActive(false);
    if (pendingFollowUps.current) {
      setFollowUpPrompts(pendingFollowUps.current);
      pendingFollowUps.current = null;
    }
    setTimeout(() => setShowFollowUps(true), 150);
  }, []);

  const handleFormSubmit = async (formData: FormData) => {
    const query = formData.get("query") as string;
    if (query.trim()) {
      setIsStreamingActive(false); // cancel any in-progress streaming

      const history = messages
        .filter((m) => m.role !== "status")
        .map((m) => ({
          role: m.role,
          content:
            typeof m.content === "string"
              ? m.content
              : JSON.stringify(m.content),
        }));
      formData.append("history", JSON.stringify(history));

      setMessages((prev) => [...prev, { role: "user", content: query }]);
      setMessages((prev) => [...prev, { role: "status", content: "ROUTING..." }]);
      setShowFollowUps(false);

      startTransition(() => {
        formAction(formData);
      });

      formRef.current?.reset();
    }
  };

  const handleSuggestedClick = (prompt: string) => {
    const formData = new FormData();
    formData.append("query", prompt);
    handleFormSubmit(formData);
  };

  return (
    <div className="flex h-full flex-col relative z-10 bg-white">
      <ScrollArea className="flex-1 px-4 md:px-6 py-4" ref={scrollAreaRef}>
        <div className="max-w-3xl mx-auto w-full space-y-4">
          {messages.map((msg, index) => {
            const isLastAi = isStreamingActive && index === messages.length - 1 && msg.role === "ai";
            return (
              <ChatMessage
                key={index}
                message={msg}
                isStreaming={isLastAi}
                onStreamComplete={isLastAi ? handleStreamComplete : undefined}
                onLineReveal={isLastAi ? scrollToBottom : undefined}
              />
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-white/95 backdrop-blur-xl border-black/5">
        <div className="max-w-3xl mx-auto flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {(followUpPrompts || INITIAL_PROMPTS).map((prompt, i) => (
            <button
              key={`${followUpPrompts ? "fu" : "init"}-${i}`}
              onClick={() => handleSuggestedClick(prompt)}
              disabled={!showFollowUps}
              style={{ transitionDelay: showFollowUps ? `${i * 80}ms` : "0ms" }}
              className={cn(
                "px-3 py-1 text-[9px] font-bold uppercase tracking-widest whitespace-nowrap rounded-full border transition-all duration-300",
                showFollowUps
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-1 pointer-events-none",
                followUpPrompts
                  ? "bg-primary/5 border-primary/20 text-primary/80 hover:bg-primary/10"
                  : "bg-[#F2F2F7] border-black/5 text-black/60 hover:bg-[#E5E5EA]"
              )}
            >
              {prompt}
            </button>
          ))}
        </div>

        <form
          ref={formRef}
          action={handleFormSubmit}
          className="relative mx-auto max-w-3xl flex items-center gap-2 rounded-[24px] px-2 py-1 border bg-[#F2F2F7] border-black/5"
        >
          <Input
            name="query"
            placeholder="Query..."
            className="bg-transparent border-none h-9 focus-visible:ring-0 font-sans text-sm shadow-none rounded-none text-black placeholder:text-black/30"
            autoComplete="off"
          />
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
