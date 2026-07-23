/**
 * Fonte única da paleta de cores do projeto.
 *
 * Estes valores espelham exatamente as CSS variables definidas em
 * `app/globals.css` (consumidas por Tailwind/Shadcn). O MUI não lê CSS
 * custom properties automaticamente no seu sistema de tema, então o
 * `providers/mui-theme-provider.tsx` importa este arquivo para montar a
 * paleta do MUI X Data Grid. Ao alterar uma cor aqui, replique a mudança em
 * `app/globals.css` (e vice-versa) para manter os dois em sincronia.
 */

export const colors = {
  light: {
    background: "#F8FAFC",
    foreground: "#0F172A",
    card: "#FFFFFF",
    cardForeground: "#0F172A",
    primary: "#2563EB",
    primaryForeground: "#FFFFFF",
    secondary: "#F1F5F9",
    secondaryForeground: "#0F172A",
    muted: "#F1F5F9",
    mutedForeground: "#64748B",
    accent: "#EFF6FF",
    accentForeground: "#1D4ED8",
    destructive: "#DC2626",
    destructiveForeground: "#FFFFFF",
    success: "#16A34A",
    warning: "#F59E0B",
    info: "#0EA5E9",
    border: "#E2E8F0",
    input: "#E2E8F0",
    ring: "#2563EB",
  },
  dark: {
    background: "#0F172A",
    foreground: "#F1F5F9",
    card: "#1E293B",
    cardForeground: "#F1F5F9",
    primary: "#3B82F6",
    primaryForeground: "#FFFFFF",
    secondary: "#1E293B",
    secondaryForeground: "#F1F5F9",
    muted: "#1E293B",
    mutedForeground: "#94A3B8",
    accent: "#1E3A5F",
    accentForeground: "#BFDBFE",
    destructive: "#F87171",
    destructiveForeground: "#0F172A",
    success: "#22C55E",
    warning: "#FBBF24",
    info: "#38BDF8",
    border: "#334155",
    input: "#334155",
    ring: "#3B82F6",
  },
  sidebar: {
    background: "#111827",
    foreground: "#F9FAFB",
    border: "rgba(255,255,255,0.06)",
    accent: "rgba(255,255,255,0.06)",
    primary: "#2563EB",
    mutedForeground: "#9CA3AF",
  },
} as const

export type ThemeMode = "light" | "dark"
