export type ThemeMode = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'theme'

function getMediaQuery(): MediaQueryList | null {
  if (typeof window === 'undefined') return null
  try {
    return window.matchMedia('(prefers-color-scheme: dark)')
  } catch {
    return null
  }
}

export function getStoredTheme(): ThemeMode | null {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY)
    if (v === 'light' || v === 'dark' || v === 'system') return v
    return null
  } catch {
    return null
  }
}

export function getEffectiveTheme(mode?: ThemeMode | null): 'light' | 'dark' {
  const mql = getMediaQuery()
  const prefersDark = !!mql?.matches
  const selected = mode ?? getStoredTheme() ?? 'system'
  if (selected === 'dark') return 'dark'
  if (selected === 'light') return 'light'
  return prefersDark ? 'dark' : 'light'
}

export function applyTheme(mode: ThemeMode | null | undefined): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const effective = getEffectiveTheme(mode)
  if (effective === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
  root.style.colorScheme = effective
}

export function setTheme(mode: ThemeMode): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode)
  } catch {}
  applyTheme(mode)
}

export function subscribeSystemThemeChange(callback: () => void): () => void {
  const mql = getMediaQuery()
  if (!mql) return () => {}
  const handler = () => callback()
  mql.addEventListener('change', handler)
  return () => mql.removeEventListener('change', handler)
}

export function subscribeStorageChange(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const handler = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY) callback()
  }
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}


