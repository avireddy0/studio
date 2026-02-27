import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'Envision OS | The All-Seeing Eye for Construction',
  description: 'Verified profit protection and institutional-grade transparency for commercial construction through continuous multi-platform audit cycles.',
  keywords: ['Construction Management', 'AI Orchestration', 'Profit Protection', 'Audit Transparency', 'Envision OS'],
  openGraph: {
    title: 'Envision OS | The All-Seeing Eye for Construction',
    description: 'Where Development meets Data. Verified profit protection through continuous multi-platform audit cycles.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-[#030303] text-white">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
