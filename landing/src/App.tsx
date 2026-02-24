import React, { useState, useCallback, useEffect } from 'react'
import { useCommandPalette } from 'use-command-palette'
import type { CommandItem } from 'use-command-palette'
import { Palette } from './Palette'
import { Nav } from './Nav'
import { Hero } from './Hero'
import { Features } from './Features'
import { CodeSection } from './CodeSection'
import { Comparison } from './Comparison'
import { HowItWorks } from './HowItWorks'
import { Footer } from './Footer'

export type PaletteCommand = CommandItem & {
  icon: string
  description?: string
  
}

const commands: PaletteCommand[] = [
  // Navigate
  { id: 'nav-features',  label: 'Jump to Features',     icon: '✦', group: 'Navigate', description: 'See what the hook can do' },
  { id: 'nav-code',      label: 'Jump to Code',         icon: '✦', group: 'Navigate', description: 'Minimal working example' },
  { id: 'nav-compare',   label: 'Jump to Comparison',   icon: '✦', group: 'Navigate', description: 'vs cmdk and kbar' },
  { id: 'nav-howitworks',label: 'Jump to How it works', icon: '✦', group: 'Navigate', description: 'The prop getters pattern' },
  // Links
  { id: 'link-github',   label: 'View on GitHub',       icon: '⌥', group: 'Links',    description: 'Star the repo', keywords: ['star','repo','source'] },
  { id: 'link-npm',      label: 'Open on npm',          icon: '⌥', group: 'Links',    description: 'Package page', keywords: ['npm','package','registry'] },
  { id: 'link-copy',     label: 'Copy install command', icon: '⌥', group: 'Links',    description: 'npm install use-command-palette', keywords: ['copy','install','npm'] },
  // Demos
  { id: 'demo-css',      label: 'Plain CSS demo',       icon: '◈', group: 'Demos',    description: 'Dark mode, CSS custom properties' },
  { id: 'demo-tailwind', label: 'Tailwind demo',        icon: '◈', group: 'Demos',    description: 'Utility-first, dark/light' },
  { id: 'demo-mui',      label: 'MUI demo',             icon: '◈', group: 'Demos',    description: 'Material UI, no custom CSS' },
]

function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark'
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') return saved
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), [])

  return { theme, toggleTheme }
}

export default function App() {
  const [copied, setCopied] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const handleSelect = useCallback((item: CommandItem) => {
    switch (item.id) {
      case 'nav-features':    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); break
      case 'nav-code':        document.getElementById('code')?.scrollIntoView({ behavior: 'smooth' }); break
      case 'nav-compare':     document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' }); break
      case 'nav-howitworks':  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); break
      case 'link-github':     window.open('https://github.com/your-repo/use-command-palette', '_blank'); break
      case 'link-npm':        window.open('https://www.npmjs.com/package/use-command-palette', '_blank'); break
      case 'link-copy':
        navigator.clipboard.writeText('npm install use-command-palette')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        break
      case 'demo-css':        window.open(`${import.meta.env.BASE_URL}demo-css/`, '_blank'); break
      case 'demo-tailwind':   window.open(`${import.meta.env.BASE_URL}demo-tailwind/`, '_blank'); break
      case 'demo-mui':        window.open(`${import.meta.env.BASE_URL}demo-mui/`, '_blank'); break
    }
  }, [])

  const palette = useCommandPalette({
    items: commands,
    onSelect: handleSelect,
    hotkey: ['mod+k', 'mod+p'],
    recent: { enabled: true },
    animationDuration: 180,
  })

  return (
    <>
      <Nav onOpenPalette={palette.open} theme={theme} onToggleTheme={toggleTheme} />
      <Hero onOpenPalette={palette.open} copied={copied} />
      <Features />
      <CodeSection />
      <Comparison />
      <HowItWorks />
      <Footer onOpenPalette={palette.open} />
      <Palette palette={palette} commands={commands} />
    </>
  )
}
