import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebasePerf } from "@/components/firebase-perf"

export const metadata: Metadata = {
  title: 'Envision OS | Where Development Meets Data',
  description: 'Emails. Photos. Zooms. Inspections. RFIs. Waivers. A billion fragments of truth, without the full picture. Until now.',
  openGraph: {
    title: 'Envision OS | Where Development Meets Data',
    description: 'Emails. Photos. Zooms. Inspections. RFIs. Waivers. A billion fragments of truth, without the full picture. Until now.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
        <FirebasePerf />
      </body>
    </html>
  );
}
