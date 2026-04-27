import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { CollectionProvider } from "@/features/collection";
import { GameplayProvider } from "@/features/gameplay";
import { GearProvider } from "@/features/midi-hardware";
import { OptionsProvider } from "@/features/options";
import { ThemeProvider } from "@/features/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Midi Jam",
  description: "The ultimate immersive MIDI instrument experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <GearProvider>
            <OptionsProvider>
              <CollectionProvider>
                <GameplayProvider>{children}</GameplayProvider>
              </CollectionProvider>
            </OptionsProvider>
          </GearProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
