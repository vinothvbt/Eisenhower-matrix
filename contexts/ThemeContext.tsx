'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
  accentColor: string
  setAccentColor: (color: string) => void
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false)
  const [accentColor, setAccentColor] = useState('#3B82F6')

  useEffect(() => {
    // Load theme preference from localStorage
    const saved = localStorage.getItem('theme')
    const savedAccent = localStorage.getItem('accentColor')
    
    if (saved) {
      setIsDark(saved === 'dark')
    } else {
      // Default to system preference
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    
    if (savedAccent) {
      setAccentColor(savedAccent)
    }
  }, [])

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    // Apply accent color CSS variable
    document.documentElement.style.setProperty('--accent-color', accentColor)
    localStorage.setItem('accentColor', accentColor)
  }, [accentColor])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const value = {
    isDark,
    toggleTheme,
    accentColor,
    setAccentColor,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}