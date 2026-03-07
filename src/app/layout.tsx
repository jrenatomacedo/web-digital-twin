import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "José Renato Oliveira | Executive Technology & Architecture",
  description: "Portfolio of José Renato Oliveira - Tech Lead, Systems Architecture, and Executive Development Manager.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-background text-foreground selection:bg-brand-cyan selection:text-background`}
      >
        {children}
      </body>
    </html>
  );
}
