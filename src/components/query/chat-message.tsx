"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnvisionOSLogo } from "@/components/icons";
import { User } from "lucide-react";

type ToolExecutionPlan = {
  toolName: string;
  parameters: Record<string, unknown>;
};

export type Message =
  | { role: "user" | "status"; content: string }
  | { role: "ai"; content: string | ToolExecutionPlan };

function isToolExecutionPlan(content: Message["content"]): content is ToolExecutionPlan {
  return (
    typeof content === "object" &&
    content !== null &&
    "toolName" in content &&
    "parameters" in content
  );
}

export function ChatMessage({ message }: { message: Message }) {
  const { role, content } = message;

  if (role === 'status') {
    return (
        <div className="flex items-center justify-center text-sm text-muted-foreground my-4">
            {content}
        </div>
    );
  }

  const isAi = role === "ai";

  return (
    <div className={`flex items-start gap-4 my-6 ${isAi ? "" : "justify-end"}`}>
      {isAi && (
        <Avatar className="h-8 w-8 border border-primary/50">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <EnvisionOSLogo className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className={`max-w-2xl ${isAi ? "text-left" : "text-right"}`}>
        {typeof content === "string" ? (
          <div
            className={`rounded-lg px-4 py-2 ${
              isAi
                ? "bg-muted"
                : "bg-primary text-primary-foreground"
            }`}
          >
            <p className="text-sm">{content}</p>
          </div>
        ) : isToolExecutionPlan(content) ? (
          <Card className="bg-card/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-base">Tool Execution Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm">Tool Name:</h3>
                  <p className="font-code text-accent text-sm bg-muted p-2 rounded-md mt-1">
                    {content.toolName}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Parameters:</h3>
                  <pre className="font-code text-sm bg-muted p-3 rounded-md mt-1 overflow-x-auto">
                    {JSON.stringify(content.parameters, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-lg px-4 py-2 bg-muted">
            <p className="text-sm">{JSON.stringify(content)}</p>
          </div>
        )}
      </div>
      {!isAi && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
