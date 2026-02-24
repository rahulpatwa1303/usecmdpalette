import React, { useState } from 'react'

interface Props {
  onOpenPalette: () => void
  copied: boolean
}

export function Hero({ onOpenPalette, copied }: Props) {
  const [hoverBtn, setHoverBtn] = useState(false)
  const [hoverInstall, setHoverInstall] = useState(false)

  const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform)
  const shortcut = isMac ? '⌘K' : 'Ctrl+K'

  function copyInstall() {
    navigator.clipboard.writeText('npm install use-command-palette')
  }

  return (
    <section style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: '100px 24px 80px',
      overflow: 'hidden',
    }}>
      {/* Radial glow behind hero */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 800,
        height: 500,
        background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '5px 12px 5px 8px',
        background: 'rgba(99,102,241,0.1)',
        border: '1px solid rgba(99,102,241,0.25)',
        borderRadius: 100,
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--accent-2)',
        marginBottom: 28,
        letterSpacing: '0.01em',
      }}>
        <span style={{
          background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
          borderRadius: 100,
          padding: '2px 8px',
          color: '#fff',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.04em',
        }}>NEW</span>
        Zero dependencies · No Provider required
      </div>

      {/* Headline */}
      <h1 style={{
        fontSize: 'clamp(36px, 6vw, 72px)',
        fontWeight: 900,
        lineHeight: 1.1,
        letterSpacing: '-0.03em',
        maxWidth: 780,
        marginBottom: 20,
      }}>
        <span style={{
          background: 'linear-gradient(135deg, var(--text) 30%, var(--text-3))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          The command palette hook{' '}
        </span>
        <span style={{
          background: 'linear-gradient(135deg, #818cf8, #a78bfa, #c084fc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          you actually want
        </span>
      </h1>

      {/* Subheadline */}
      <p style={{
        fontSize: 'clamp(16px, 2vw, 20px)',
        color: 'var(--text-4)',
        maxWidth: 560,
        lineHeight: 1.65,
        marginBottom: 44,
      }}>
        Headless logic for{' '}
        <span style={{ color: 'var(--text-3)', fontWeight: 500 }}>fuzzy search</span>,{' '}
        <span style={{ color: 'var(--text-3)', fontWeight: 500 }}>keyboard navigation</span>,{' '}
        <span style={{ color: 'var(--text-3)', fontWeight: 500 }}>nested pages</span>, and{' '}
        <span style={{ color: 'var(--text-3)', fontWeight: 500 }}>ARIA</span>.
        {' '}You own every pixel of UI.
      </p>

      {/* CTAs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 52 }}>
        {/* Open palette */}
        <button
          onClick={onOpenPalette}
          onMouseEnter={() => setHoverBtn(true)}
          onMouseLeave={() => setHoverBtn(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 22px',
            background: hoverBtn
              ? 'linear-gradient(135deg, #4f52e0, #7c3aed)'
              : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: 10,
            border: 'none',
            color: '#fff',
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            boxShadow: hoverBtn
              ? '0 0 0 4px rgba(99,102,241,0.25), 0 8px 24px rgba(99,102,241,0.4)'
              : '0 0 0 0px rgba(99,102,241,0), 0 4px 16px rgba(99,102,241,0.3)',
            transition: 'all 200ms ease',
          }}
        >
          <span>Open palette</span>
          <kbd style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 5,
            padding: '2px 7px',
            fontSize: 12,
            fontFamily: 'monospace',
            fontWeight: 700,
          }}>{shortcut}</kbd>
        </button>

        {/* Install command */}
        <button
          onClick={copyInstall}
          onMouseEnter={() => setHoverInstall(true)}
          onMouseLeave={() => setHoverInstall(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 20px',
            background: hoverInstall ? 'var(--border)' : 'var(--bg-5)',
            border: '1px solid',
            borderColor: hoverInstall ? 'var(--border-3)' : 'var(--border-2)',
            borderRadius: 10,
            color: hoverInstall ? 'var(--text-2)' : 'var(--text-3)',
            fontSize: 14,
            fontFamily: 'JetBrains Mono, monospace',
            transition: 'all 150ms ease',
            letterSpacing: '-0.01em',
          }}
        >
          <span style={{ color: 'var(--text-5)', userSelect: 'none' }}>$</span>
          <span>npm install use-command-palette</span>
          {copied
            ? <CheckIcon />
            : <CopyIcon color={hoverInstall ? 'var(--text-4)' : 'var(--text-6)'} />
          }
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          ['0', 'runtime dependencies'],
          ['114', 'tests'],
          ['100%', 'TypeScript'],
          ['SSR', 'safe'],
        ].map(([n, label]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-2)', letterSpacing: '-0.02em' }}>{n}</div>
            <div style={{ fontSize: 12, color: 'var(--text-5)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 1,
        background: 'linear-gradient(90deg, transparent, var(--border-2) 30%, var(--border-2) 70%, transparent)',
      }} />
    </section>
  )
}

function CopyIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, transition: 'stroke 150ms' }}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="#4ade80" strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
