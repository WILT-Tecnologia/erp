import { isPlatformBrowser } from '@angular/common';
import { computed, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

import { STORAGE_KEYS } from '../constants/api-endpoints';

export type ThemePreference = 'light' | 'dark' | 'system';
type ResolvedScheme = 'light' | 'dark';

const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly systemPrefersDark = signal(this.readSystemPrefersDark());

  readonly theme = signal<ThemePreference>(this.readStoredTheme());

  readonly resolvedScheme = computed<ResolvedScheme>(() => {
    const theme = this.theme();
    return theme === 'system' ? (this.systemPrefersDark() ? 'dark' : 'light') : theme;
  });

  constructor() {
    if (this.isBrowser) {
      window
        .matchMedia(DARK_MEDIA_QUERY)
        .addEventListener('change', (event) => this.systemPrefersDark.set(event.matches));
    }

    effect(() => {
      const scheme = this.resolvedScheme();
      if (!this.isBrowser) {
        return;
      }
      document.documentElement.classList.toggle('dark', scheme === 'dark');
      document.documentElement.style.colorScheme = scheme;
    });
  }

  setTheme(value: ThemePreference): void {
    this.theme.set(value);
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEYS.theme, value);
    }
  }

  private readStoredTheme(): ThemePreference {
    if (!this.isBrowser) {
      return 'system';
    }
    const stored = localStorage.getItem(STORAGE_KEYS.theme);
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
  }

  private readSystemPrefersDark(): boolean {
    return this.isBrowser && window.matchMedia(DARK_MEDIA_QUERY).matches;
  }
}
