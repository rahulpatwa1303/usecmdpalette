import React from 'react'
import { SectionLabel, sectionH2, sectionSub } from './Features'

const steps = [
  {
    n: '01',
    title: 'Define your commands',
    body: 'Any object with id and label. Add keywords for extra search terms, group for section headers, children for nested pages.',
    code: `const commands = [
  {
    id: 'save',
    label: 'Save File',
    keywords: ['save', 'write'],
    group: 'File',
  },
  {
    id: 'theme',
    label: 'Change Theme',
    children: [
      { id: 'dark',  label: 'Dark Mode' },
      { id: 'light', label: 'Light Mode' },
    ],
  },
]`,
  },
  {
    n: '02',
    title: 'Call the hook',
    body: 'One hook call. Returns everything you need — state, actions, and prop getters. No Provider, no context, no setup.',
    code: `const {
  isOpen, isMounted, animationState,
  filteredItems, groupedItems, isLoading,
  recentItems, currentPage, canGoBack,
  announcement,
  open, close, toggle, goBack,
  getContainerProps, getInputProps,
  getListProps, getItemProps,
  getAnnouncerProps,
} = useCommandPalette({
  items: commands,
  onSelect: handleSelect,
  hotkey: ['mod+k', 'mod+p'],
  recent: { enabled: true },
  animationDuration: 200,
})`,
  },
  {
    n: '03',
    title: 'Spread prop getters onto your elements',
    body: 'Prop getters return ARIA attributes and event handlers. Spread them onto your own markup — any HTML, any CSS framework.',
    code: `{isMounted && (
  <div {...getAnnouncerProps()}>{announcement}</div>
  <div className="backdrop" onClick={close}>
    <div {...getContainerProps()}>

      {canGoBack && (
        <button onClick={goBack}>← back</button>
      )}

      <input
        {...getInputProps({ placeholder: 'Search…' })}
        className="palette-input"
      />

      <ul {...getListProps()}>
        {filteredItems.map((item, index) => (
          <li
            key={item.id}
            {...getItemProps({ index, item })}
            className="palette-item"
          >
            {item.label}
          </li>
        ))}
      </ul>

    </div>
  </div>
)}`,
  },
]

function MiniCode({ code }: { code: string }) {
  return (
    <pre style={{
      background: 'var(--bg-3)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '16px 18px',
      fontSize: 12,
      lineHeight: 1.65,
      fontFamily: 'JetBrains Mono, monospace',
      color: 'var(--text-5)',
      overflowX: 'auto',
      margin: 0,
      flexShrink: 0,
    }}>
      <code style={{ whiteSpace: 'pre' }}>{code}</code>
    </pre>
  )
}

export function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: '96px 24px', maxWidth: 1000, margin: '0 auto' }}>
      <SectionLabel>How it works</SectionLabel>
      <h2 style={sectionH2}>The prop getters pattern</h2>
      <p style={{ ...sectionSub, marginBottom: 72 }}>
        Inspired by{' '}
        <a href="https://react-dropzone.js.org" target="_blank" rel="noreferrer" style={{ color: '#818cf8', textDecoration: 'none' }}>
          react-dropzone
        </a>{' '}
        and{' '}
        <a href="https://github.com/downshift-js/downshift" target="_blank" rel="noreferrer" style={{ color: '#818cf8', textDecoration: 'none' }}>
          downshift
        </a>
        . We give you the logic; you decide where it lives in your DOM.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
        {steps.map((step, i) => (
          <div
            key={step.n}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 48,
              alignItems: 'start',
            }}
          >
            {/* Left: text (alternate side on even steps) */}
            <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
              <div style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#6366f1',
                marginBottom: 12,
                fontFamily: 'JetBrains Mono, monospace',
              }}>
                {step.n}
              </div>
              <h3 style={{
                fontSize: 22,
                fontWeight: 700,
                color: 'var(--text-2)',
                letterSpacing: '-0.02em',
                marginBottom: 12,
                lineHeight: 1.3,
              }}>
                {step.title}
              </h3>
              <p style={{ fontSize: 15, color: 'var(--text-5)', lineHeight: 1.7 }}>
                {step.body}
              </p>
            </div>

            {/* Right: code */}
            <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
              <MiniCode code={step.code} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
