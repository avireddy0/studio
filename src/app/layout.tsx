import type {Metadata} from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

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
    <html lang="en" className={`dark ${inter.variable} ${jetBrainsMono.variable}`}>
      <body className="font-body antialiased bg-[#030303] text-white">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
