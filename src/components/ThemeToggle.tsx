'use client'

type Theme = 'light' | 'dark'

const storageKey = 'ozzilab-theme'

function getCurrentTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  if (document.documentElement.classList.contains('dark')) return 'dark'
  const stored = window.localStorage.getItem(storageKey)
  return stored === 'dark' ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.classList.toggle('light', theme === 'light')
  root.dataset.theme = theme
  root.style.colorScheme = theme
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  function toggleTheme() {
    const next = getCurrentTheme() === 'dark' ? 'light' : 'dark'
    window.localStorage.setItem(storageKey, next)
    applyTheme(next)
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light and dark mode"
      title="Toggle light/dark mode"
      className={compact ? 'theme-toggle theme-toggle-compact' : 'theme-toggle'}
    >
      <span className="material-symbols-outlined text-[18px]">contrast</span>
      {!compact ? <span>Theme</span> : null}
    </button>
  )
}
