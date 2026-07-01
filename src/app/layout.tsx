import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { GridBackground } from "@/components/grid-background";
import { DotBackground } from "@/components/dot-background";
import { CustomCursor } from "@/components/custom-cursor";
import { CommandPalette } from "@/components/command-palette";
import { SmoothScroll } from "@/components/smooth-scroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Oasif Ahmed Rikto Portfolio | Full Stack Developer",
  description: "Premium portfolio of a Full Stack Developer specializing in Security and Modern Web Apps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} font-sans antialiased bg-background text-foreground transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem themes={["light", "dark", "cream"]}>
          <CustomCursor />
          <GridBackground />
          <DotBackground />
          <CommandPalette />
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
