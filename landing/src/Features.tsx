import React from 'react'

interface Feature {
  icon: string
  title: string
  body: string
  tag?: string
  accent?: string
}

const features: Feature[] = [
  {
    icon: '◎',
    title: 'Zero dependencies',
    body: 'React is the only peer dependency. No hidden bundle cost, no transitive CVEs to chase.',
    tag: '0 deps',
    accent: '#4ade80',
  },
  {
    icon: '⌁',
    title: 'No Provider required',
    body: 'Drop the hook anywhere in your tree. No context wrapper needed at the app root. Works in Next.js App Router.',
    tag: 'no setup',
    accent: '#818cf8',
  },
  {
    icon: '◱',
    title: 'No UI shipped',
    body: 'Prop getters return ARIA attributes and event handlers. You spread them onto your own elements — any CSS approach works.',
    tag: 'headless',
    accent: '#a78bfa',
  },
  {
    icon: '⟳',
    title: 'Async filterFn',
    body: 'Return a Promise from filterFn. The hook sets isLoading, cancels stale results when the query changes, and resolves cleanly.',
    tag: 'new',
    accent: '#fb923c',
  },
  {
    icon: '⌥',
    title: 'Nested commands',
    body: 'Add a children array to any item. The hook manages the page stack, breadcrumb trail, and back navigation automatically.',
    tag: 'new',
    accent: '#f472b6',
  },
  {
    icon: '◷',
    title: 'Recent items',
    body: 'Pass recent: { enabled: true } to persist recently selected commands in localStorage, surfaced in recentItems.',
    tag: 'new',
    accent: '#34d399',
  },
  {
    icon: '⬡',
    title: 'Animation state machine',
    body: 'Four states — entering / entered / exiting / exited — let you CSS-transition the palette in and out without managing timers.',
    tag: 'new',
    accent: '#60a5fa',
  },
  {
    icon: '⌾',
    title: 'useRegisterCommands',
    body: 'Register commands from any component without a Provider. A module-level singleton registry re-renders all subscribers on change.',
    tag: 'new',
    accent: '#c084fc',
  },
  {
    icon: '♿',
    title: 'Accessible by default',
    body: 'Correct ARIA roles, aria-selected, aria-disabled, aria-activedescendant, aria-live announcements — all wired automatically.',
    accent: '#71717a',
  },
]

export function Features() {
  return (
    <section id="features" style={{ padding: '96px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <SectionLabel>Features</SectionLabel>
      <h2 style={sectionH2}>Everything you need, nothing you don't</h2>
      <p style={sectionSub}>
        Built specifically for headless command palettes — not a generic list component retrofitted.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 16,
        marginTop: 56,
      }}>
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, body, tag, accent = '#818cf8' }: Feature) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '24px',
        background: hovered ? 'var(--bg-4)' : 'var(--bg-2)',
        border: `1px solid ${hovered ? 'var(--border-2)' : 'var(--border)'}`,
        borderRadius: 14,
        transition: 'background 200ms, border-color 200ms',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle top glow on hover */}
      {hovered && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${accent}55, transparent)`,
        }} />
      )}

      {/* Icon + tag row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: `${accent}18`,
          border: `1px solid ${accent}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          color: accent,
        }}>
          {icon}
        </div>
        {tag && (
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: accent,
            background: `${accent}15`,
            border: `1px solid ${accent}25`,
            borderRadius: 100,
            padding: '2px 8px',
          }}>{tag}</span>
        )}
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 650, color: 'var(--text-2)', marginBottom: 8, letterSpacing: '-0.01em' }}>
        {title}
      </h3>
      <p style={{ fontSize: 13.5, color: 'var(--text-5)', lineHeight: 1.65 }}>
        {body}
      </p>
    </div>
  )
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: '#818cf8',
      marginBottom: 16,
    }}>
      <div style={{ width: 16, height: 1, background: '#6366f1' }} />
      {children}
      <div style={{ width: 16, height: 1, background: '#6366f1' }} />
    </div>
  )
}

export const sectionH2: React.CSSProperties = {
  fontSize: 'clamp(24px, 3.5vw, 40px)',
  fontWeight: 800,
  letterSpacing: '-0.03em',
  color: 'var(--text)' as string,
  lineHeight: 1.2,
  marginBottom: 14,
}

export const sectionSub: React.CSSProperties = {
  fontSize: 16,
  color: 'var(--text-5)' as string,
  maxWidth: 520,
  lineHeight: 1.65,
}
