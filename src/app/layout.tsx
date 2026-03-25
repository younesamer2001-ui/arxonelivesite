'use client'

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <title>Arxon — AI som jobber for deg</title>
        <meta name="description" content="Automatiser kundeservice, booking og salg med norsk AI. Fra 4 990 kr/mnd." />
      </head>
      <body className="min-h-screen bg-black text-white overflow-x-hidden" style={{ isolation: 'isolate' }}>
        {children}
      </body>
    </html>
  );
}
