import React from 'react';

export type Scenario = {
  query: string;
  routes: { text: string; delay: number; status?: string }[];
  answer: string;
  metric: string;
  meta: string;
  followUp?: { text: string; scenarioId: number }[];
};

export type Scenarios = {
  [key: number]: Scenario;
};

export type ChatMessage =
  | { type: 'typing'; id: string }
  | { type: 'user' | 'system'; html: string; meta?: string };

export type CSSVarStyle = React.CSSProperties & Record<`--${string}`, string>;

export type ArchitectureLayer = {
  id: 'normalized' | 'context' | 'cognitive' | 'action';
  level: string;
  title: string;
  subtitle: string;
  metric: string;
  metricLabel: string;
  tone: string;
  icon: React.ComponentType<{ className?: string }>;
  standaloneImpact: string;
  contextImpact: string;
  position?: { x: number; y: number };
};
