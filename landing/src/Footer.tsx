import React from 'react'

interface Props {
  onOpenPalette: () => void
}

export function Footer({ onOpenPalette }: Props) {
  const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform)
  const shortcut = isMac ? '⌘K' : 'Ctrl+K'

  return (
    <footer style={{ borderTop: '1px solid var(--border)', marginTop: 40 }}>
      {/* CTA band */}
      <div style={{
        padding: '80px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        background: 'linear-gradient(180deg, var(--bg-2), var(--bg))',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 300,
          background: 'radial-gradient(ellipse at bottom, rgba(99,102,241,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, var(--text) 30%, var(--text-3))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 16,
          lineHeight: 1.1,
        }}>
          Ready to build?
        </h2>
        <p style={{ fontSize: 17, color: 'var(--text-5)', marginBottom: 36, maxWidth: 420, lineHeight: 1.6 }}>
          Add a production-ready command palette to your React app in minutes.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={onOpenPalette}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 22px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              borderRadius: 10,
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'opacity 150ms',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
          >
            Try it now
            <kbd style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 5,
              padding: '2px 7px',
              fontSize: 12,
              fontFamily: 'monospace',
              fontWeight: 700,
            }}>{shortcut}</kbd>
          </button>

          <a
            href="https://github.com/your-repo/use-command-palette"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 22px',
              background: 'var(--bg-5)',
              border: '1px solid var(--border-2)',
              borderRadius: 10,
              color: 'var(--text-3)',
              fontSize: 15,
              fontWeight: 500,
              transition: 'border-color 150ms, color 150ms',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-3)'
              ;(e.currentTarget as HTMLElement).style.color = 'var(--text-2)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)'
              ;(e.currentTarget as HTMLElement).style.color = 'var(--text-3)'
            }}
          >
            <GitHubIcon /> View on GitHub
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 32px',
        borderTop: '1px solid var(--border)',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 22,
            height: 22,
            borderRadius: 5,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            color: '#fff',
          }}>⌘</div>
          <span style={{ fontSize: 13, color: 'var(--text-6)', fontWeight: 500 }}>use-command-palette</span>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {[
            ['GitHub', 'https://github.com/your-repo/use-command-palette'],
            ['npm',    'https://www.npmjs.com/package/use-command-palette'],
            ['Docs',   '#how-it-works'],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noreferrer' : undefined}
              style={{
                fontSize: 13,
                color: 'var(--text-6)',
                transition: 'color 150ms',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-4)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-6)' }}
            >
              {label}
            </a>
          ))}
        </div>

        <p style={{ fontSize: 12, color: 'var(--text-7)' }}>
          MIT License · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}
