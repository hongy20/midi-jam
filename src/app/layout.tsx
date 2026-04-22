import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CollectionProvider } from "@/features/collection";
import { GearProvider } from "@/features/midi-hardware";
import { NavigationGuard } from "@/features/navigation";
import { PlayProvider } from "@/features/play-session";
import { ScoreProvider } from "@/features/score";
import { OptionsProvider } from "@/features/settings";
import { ThemeProvider } from "@/features/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Midi Jam",
  description: "The ultimate immersive piano experience",
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
                <ScoreProvider>
                  <PlayProvider>
                    <NavigationGuard>{children}</NavigationGuard>
                  </PlayProvider>
                </ScoreProvider>
              </CollectionProvider>
            </OptionsProvider>
          </GearProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
