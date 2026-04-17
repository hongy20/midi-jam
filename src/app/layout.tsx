import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StageProvider } from "@/app/play/context/stage-context";
import { CollectionProvider } from "@/features/collection";
import { TrackProvider } from "@/features/midi-assets";
import { GearProvider } from "@/features/midi-hardware";
import { NavigationGuard } from "@/features/navigation";
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <GearProvider>
            <OptionsProvider>
              <CollectionProvider>
                <TrackProvider>
                  <StageProvider>
                    <ScoreProvider>
                      <NavigationGuard>{children}</NavigationGuard>
                    </ScoreProvider>
                  </StageProvider>
                </TrackProvider>
              </CollectionProvider>
            </OptionsProvider>
          </GearProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
