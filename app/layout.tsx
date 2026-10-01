import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { ContentProvider } from "@/lib/content-context";
import { ContentGate } from "@/components/content-gate";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Samuel Charles — AI / Data Scientist",
  description:
    "Portfolio of Samuel Charles, AI & Data Scientist — projects, research, talks, and writing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} font-body`}
      >
        <ThemeProvider>
          <ContentProvider>
            <ContentGate>
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </ContentGate>
          </ContentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
