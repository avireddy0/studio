import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ENVISION OS | Command Terminal",
  description: "Institutional-grade construction intelligence. Verified multi-platform data fusion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="antialiased bg-[#020202] text-[#00FF41] min-h-screen font-mono">
        <div className="fixed inset-0 scanlines pointer-events-none z-50"></div>
        {children}
      </body>
    </html>
  );
}
