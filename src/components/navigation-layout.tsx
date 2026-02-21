"use client";

import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

interface NavigationLayoutProps {
  children: ReactNode;
  title: string;
  step?: number;
  totalSteps?: number;
  footer?: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  accentColor?: "blue" | "purple" | "green" | "primary";
  hideHeaderIcon?: boolean;
}

export function NavigationLayout({
  children,
  title,
  step,
  totalSteps,
  footer,
  onBack,
  backLabel,
  accentColor = "primary",
}: NavigationLayoutProps) {
  const accentClasses = {
    blue: "text-blue-500 bg-blue-600/10",
    purple: "text-purple-500 bg-purple-600/10",
    green: "text-green-500 bg-green-600/10",
    primary: "text-accent-primary bg-accent-primary/10",
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center p-6 overflow-hidden animate-fade-in transition-colors duration-500">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute ${
            accentColor === "blue" || accentColor === "primary"
              ? "top-[20%] right-[10%]"
              : "bottom-[10%] left-[10%]"
          } w-[60%] h-[60%] rounded-full blur-[120px] ${
            accentColor === "blue"
              ? "bg-blue-600/10"
              : accentColor === "purple"
                ? "bg-purple-600/10"
                : accentColor === "green"
                  ? "bg-green-600/10"
                  : "bg-accent-primary/5"
          }`}
        />
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col h-full max-h-[85vh] animate-slide-up">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 flex-shrink-0">
          <div className="flex flex-col">
            {step && totalSteps && (
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`font-bold uppercase tracking-widest text-[10px] sm:text-xs ${accentClasses[accentColor].split(" ")[0]}`}
                >
                  Step {step} of {totalSteps}
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                      key={`step-${i + 1}`}
                      className={`h-1 w-6 rounded-full transition-all duration-500 ${
                        i + 1 <= step
                          ? accentColor === "blue"
                            ? "bg-blue-500"
                            : accentColor === "purple"
                              ? "bg-purple-500"
                              : accentColor === "green"
                                ? "bg-green-500"
                                : "bg-accent-primary"
                          : "bg-foreground/10"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl font-black text-foreground uppercase tracking-tighter">
              {title}
            </h1>
          </div>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="group flex items-center gap-2 px-4 py-2 border border-foreground/10 rounded-full text-foreground/50 font-bold text-[10px] sm:text-xs uppercase hover:text-foreground hover:border-foreground/30 transition-all active:scale-95"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              {backLabel || "Back"}
            </button>
          )}
        </header>

        {/* Content */}
        <main className="flex-grow overflow-y-auto overflow-x-hidden no-scrollbar py-4 px-8 -mx-8">
          {children}
        </main>

        {/* Footer */}
        {footer && (
          <footer className="mt-8 flex justify-end flex-shrink-0">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
