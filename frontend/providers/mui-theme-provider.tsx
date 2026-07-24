"use client"

import { useMemo, type ReactNode } from "react"
import { useTheme } from "next-themes"
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter"
import { colors } from "@/lib/design-tokens"

interface MuiProviderProps {
  children: ReactNode
}

export function MuiProvider({ children }: MuiProviderProps) {
  const { resolvedTheme } = useTheme()
  const mode = resolvedTheme === "dark" ? "dark" : "light"
  const palette = colors[mode]

  const theme = useMemo(
    () =>
      createTheme({
        cssVariables: false,
        palette: {
          mode,
          primary: { main: palette.primary, contrastText: palette.primaryForeground },
          secondary: { main: palette.secondary, contrastText: palette.secondaryForeground },
          error: { main: palette.destructive, contrastText: palette.destructiveForeground },
          success: { main: palette.success },
          warning: { main: palette.warning },
          info: { main: palette.info },
          background: { default: palette.background, paper: palette.card },
          text: { primary: palette.foreground, secondary: palette.mutedForeground },
          divider: palette.border,
        },
        shape: { borderRadius: 8 },
        typography: {
          fontFamily: "var(--font-inter), system-ui, sans-serif",
          fontSize: 13,
        },
        components: {
          MuiPopover: {
            defaultProps: { container: () => document.body },
          },
        },
      }),
    [mode, palette]
  )

  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </AppRouterCacheProvider>
  )
}
