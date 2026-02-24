import React from 'react'

interface Props {
  onOpenPalette: () => void
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

export function Nav({ onOpenPalette, theme, onToggleTheme }: Props) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      height: 60,
      background: 'var(--bg-nav)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 28,
          height: 28,
          borderRadius: 7,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          color: '#fff',
        }}>⌘</div>
        <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-2)', letterSpacing: '-0.01em' }}>
          use-command-palette
        </span>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Search trigger */}
        <button
          onClick={onOpenPalette}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 12px',
            background: 'var(--bg-5)',
            border: '1px solid var(--border-2)',
            borderRadius: 8,
            color: 'var(--text-5)',
            fontSize: 13,
            transition: 'border-color 150ms, color 150ms',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-3)'
            e.currentTarget.style.color = 'var(--text-4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-2)'
            e.currentTarget.style.color = 'var(--text-5)'
          }}
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
          <span>Search</span>
          <kbd style={{
            background: 'var(--bg-2)',
            border: '1px solid var(--border-2)',
            borderRadius: 4,
            padding: '1px 5px',
            fontSize: 11,
            fontFamily: 'monospace',
            color: 'var(--text-5)',
          }}>⌘K</kbd>
        </button>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'var(--bg-5)',
            border: '1px solid var(--border-2)',
            color: 'var(--text-4)',
            transition: 'border-color 150ms, color 150ms',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border-3)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--text-3)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--text-4)'
          }}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* GitHub */}
        <a
          href="https://github.com/your-repo/use-command-palette"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'var(--bg-5)',
            border: '1px solid var(--border-2)',
            color: 'var(--text-4)',
            transition: 'border-color 150ms, color 150ms',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border-3)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--text-3)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--text-4)'
          }}
          aria-label="GitHub"
        >
          <GitHubIcon />
        </a>

        {/* npm */}
        <a
          href="https://www.npmjs.com/package/use-command-palette"
          target="_blank"
          rel="noreferrer"
          style={{
            padding: '6px 14px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            color: '#fff',
            transition: 'opacity 150ms',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
        >
          npm install
        </a>
      </div>
    </header>
  )
}

function SunIcon() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}
