import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavigationGuard } from "@/components/navigation-guard";
import { SelectionProvider } from "@/context/selection-context";
import { ThemeProvider } from "@/context/theme-context";

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
          <SelectionProvider>
            <NavigationGuard>{children}</NavigationGuard>
          </SelectionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
