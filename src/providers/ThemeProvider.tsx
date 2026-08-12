import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
    theme: Theme
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getInitialTheme(): Theme {
    // 1. Check localStorage first
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') return stored

    // 2. Fall back to OS preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'

    return 'light'
}

function applyTheme(theme: Theme) {
    const root = document.documentElement
    if (theme === 'dark') {
        root.classList.add('dark')
    } else {
        root.classList.remove('dark')
    }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(getInitialTheme)

    // Apply theme to <html> on every change
    useEffect(() => {
        applyTheme(theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    // Also listen to OS preference changes (only if user hasn't set a preference)
    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = (e: MediaQueryListEvent) => {
            // Only react if user hasn't explicitly chosen a theme
            if (!localStorage.getItem('theme')) {
                const newTheme: Theme = e.matches ? 'dark' : 'light'
                setTheme(newTheme)
            }
        }
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [])

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme(): ThemeContextValue {
    const ctx = useContext(ThemeContext)
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
    return ctx
}
