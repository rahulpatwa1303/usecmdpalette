import React, { useState } from 'react'
import { SectionLabel, sectionH2, sectionSub } from './Features'

const TABS = ['Basic', 'Async filter', 'Nested pages', 'Animation'] as const
type Tab = typeof TABS[number]

const CODE: Record<Tab, { label: string; code: string }[]> = {
  'Basic': [
    {
      label: 'app.tsx',
      code: `import { useCommandPalette } from 'use-command-palette'

const commands = [
  { id: 'open',  label: 'Open File',   keywords: ['open'] },
  { id: 'save',  label: 'Save File',   keywords: ['save'] },
  { id: 'theme', label: 'Change Theme' },
]

export function App() {
  const {
    isOpen, isMounted, open, close,
    filteredItems, highlightedIndex,
    getContainerProps, getInputProps,
    getListProps, getItemProps,
    announcement, getAnnouncerProps,
  } = useCommandPalette({
    items: commands,
    onSelect: (item) => console.log(item.label),
  })

  return (
    <>
      <div {...getAnnouncerProps()}>{announcement}</div>
      <button onClick={open}>Open ⌘K</button>

      {isMounted && (
        <div onClick={close} className="backdrop">
          <div {...getContainerProps()} onClick={e => e.stopPropagation()}>
            <input {...getInputProps({ placeholder: 'Search…' })} />
            <ul {...getListProps()}>
              {filteredItems.map((item, index) => (
                <li key={item.id} {...getItemProps({ index, item })}>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}`,
    },
  ],
  'Async filter': [
    {
      label: 'app.tsx',
      code: `import { useCommandPalette } from 'use-command-palette'

export function App() {
  const { filteredItems, isLoading, getInputProps, getListProps, getItemProps } =
    useCommandPalette({
      items: [],
      onSelect: handleSelect,
      filterFn: async (_, query) => {
        if (!query) return staticCommands
        // Hit your API, Algolia, whatever
        const results = await searchAPI(query)
        return results
      },
    })

  return (
    <div>
      <input {...getInputProps({ placeholder: 'Search…' })} />

      {isLoading && <Spinner />}

      <ul {...getListProps()}>
        {filteredItems.map((item, index) => (
          <li key={item.id} {...getItemProps({ index, item })}>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  )
}`,
    },
  ],
  'Nested pages': [
    {
      label: 'app.tsx',
      code: `const commands = [
  {
    id: 'theme',
    label: 'Change Theme',
    children: [
      { id: 'dark',   label: 'Dark Mode' },
      { id: 'light',  label: 'Light Mode' },
      { id: 'system', label: 'Use System' },
    ],
  },
  { id: 'open', label: 'Open File' },
]

export function App() {
  const {
    filteredItems, currentPage, breadcrumb,
    canGoBack, goBack,
    getInputProps, getListProps, getItemProps,
  } = useCommandPalette({ items: commands, onSelect })

  return (
    <div>
      {/* Breadcrumb trail */}
      {canGoBack && (
        <div>
          <button onClick={goBack}>← back</button>
          {breadcrumb.map(crumb => (
            <span key={crumb.id}> / {crumb.label}</span>
          ))}
        </div>
      )}

      <input
        {...getInputProps({
          placeholder: currentPage
            ? \`Search in \${currentPage.label}…\`
            : 'Search commands…',
        })}
      />

      {/* Selecting a parent item navigates into children automatically */}
      <ul {...getListProps()}>
        {filteredItems.map((item, i) => (
          <li key={item.id} {...getItemProps({ index: i, item })}>
            {item.label}
            {item.children && <span>›</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}`,
    },
  ],
  'Animation': [
    {
      label: 'app.tsx',
      code: `// Set animationDuration (ms) to get a 4-state machine:
// entering → entered → exiting → exited
//
// isMounted  = true during entering + entered + exiting
// Use it to keep the element in the DOM during exit.
// Use animationState to drive your CSS class names.

export function App() {
  const { isMounted, animationState, ...rest } =
    useCommandPalette({
      items,
      onSelect,
      animationDuration: 200,
    })

  return (
    <>
      {isMounted && (
        <div className={\`backdrop backdrop--\${animationState}\`}>
          <div className={\`modal modal--\${animationState}\`}>
            {/* your palette UI */}
          </div>
        </div>
      )}
    </>
  )
}`,
    },
    {
      label: 'palette.css',
      code: `.backdrop {
  transition: opacity 200ms ease;
}
.backdrop--entering, .backdrop--exiting { opacity: 0; }
.backdrop--entered                       { opacity: 1; }

.modal {
  transition: opacity 200ms ease,
              transform 200ms cubic-bezier(0.16,1,0.3,1);
}
.modal--entering, .modal--exiting {
  opacity: 0;
  transform: scale(0.96) translateY(-8px);
}
.modal--entered {
  opacity: 1;
  transform: scale(1) translateY(0);
}`,
    },
  ],
}

// Very simple token-based syntax highlighter
function highlight(code: string): React.ReactNode[] {
  const lines = code.split('\n')
  return lines.map((line, li) => (
    <div key={li} style={{ minHeight: '1.6em' }}>
      {tokenize(line)}
    </div>
  ))
}

function tokenize(line: string): React.ReactNode {
  // Comments
  if (/^\s*\/\//.test(line) || /^\s*\/\*/.test(line) || /^\s*\*/.test(line)) {
    return <span style={{ color: '#3f3f46' }}>{line}</span>
  }

  // Strings
  const stringRe = /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = stringRe.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={lastIndex}>{colorNonString(line.slice(lastIndex, match.index))}</span>)
    }
    parts.push(<span key={match.index} style={{ color: '#86efac' }}>{match[0]}</span>)
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < line.length) {
    parts.push(<span key={lastIndex}>{colorNonString(line.slice(lastIndex))}</span>)
  }

  return <>{parts}</>
}

function colorNonString(text: string): React.ReactNode {
  // keywords
  const kw = /\b(import|export|from|const|let|var|function|return|if|else|await|async|new|true|false|null|undefined|default|type|interface|extends)\b/g
  // jsx/tags
  const tag = /(<\/?[A-Za-z][A-Za-z0-9.]*|>|\/?>)/g
  // functions
  const fn = /\b([a-z][a-zA-Z]+)(?=\()/g
  // types (PascalCase)
  const ty = /\b([A-Z][a-zA-Z]+)\b/g
  // numbers
  const num = /\b(\d+)\b/g
  // punctuation
  const punc = /([{}[\]().,;:?!=<>+\-*/%&|^~])/g

  // Split by all patterns, apply color
  type Tok = { text: string; color: string }
  const tokens: Tok[] = [{ text, color: '#a1a1aa' }]

  function applyPattern(pattern: RegExp, color: string) {
    const next: Tok[] = []
    for (const tok of tokens) {
      if (tok.color !== '#a1a1aa') { next.push(tok); continue }
      // split() with a capturing group interleaves non-matches (even indices)
      // and captured matches (odd indices) — no separate .match() needed
      const pieces = tok.text.split(pattern)
      pieces.forEach((piece, i) => {
        if (!piece) return
        next.push({ text: piece, color: i % 2 === 1 ? color : '#a1a1aa' })
      })
    }
    tokens.length = 0
    tokens.push(...next)
  }

  applyPattern(kw,   '#c084fc')
  applyPattern(ty,   '#7dd3fc')
  applyPattern(fn,   '#fbbf24')
  applyPattern(num,  '#fb923c')
  applyPattern(punc, '#52525b')

  return (
    <>
      {tokens.map((t, i) => (
        t.text ? <span key={i} style={{ color: t.color }}>{t.text}</span> : null
      ))}
    </>
  )
}

export function CodeSection() {
  const [activeTab, setActiveTab] = useState<Tab>('Basic')
  const [activeFile, setActiveFile] = useState(0)

  const files = CODE[activeTab]
  const file = files[Math.min(activeFile, files.length - 1)]

  function switchTab(tab: Tab) {
    setActiveTab(tab)
    setActiveFile(0)
  }

  return (
    <section id="code" style={{
      padding: '96px 24px',
      background: 'linear-gradient(180deg, transparent, var(--bg-2) 20%, var(--bg-2) 80%, transparent)',
    }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <SectionLabel>Code</SectionLabel>
        <h2 style={sectionH2}>Simple API, powerful results</h2>
        <p style={{ ...sectionSub, marginBottom: 40 }}>
          The hook returns exactly what you need. Spread the prop getters onto your own elements.
        </p>

        {/* Example tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 0, borderBottom: '1px solid var(--border)' }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => switchTab(tab)}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                border: 'none',
                borderBottom: `2px solid ${activeTab === tab ? '#6366f1' : 'transparent'}`,
                color: activeTab === tab ? 'var(--text-2)' : 'var(--text-5)',
                fontSize: 13,
                fontWeight: activeTab === tab ? 600 : 400,
                marginBottom: -1,
                transition: 'color 150ms',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Code block */}
        <div style={{
          background: 'var(--bg-3)',
          border: '1px solid var(--border)',
          borderTop: 'none',
          borderRadius: '0 0 12px 12px',
          overflow: 'hidden',
        }}>
          {/* File tabs (only shown when > 1 file) */}
          {files.length > 1 && (
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
              {files.map((f, i) => (
                <button
                  key={f.label}
                  onClick={() => setActiveFile(i)}
                  style={{
                    padding: '8px 16px',
                    background: i === activeFile ? 'var(--bg-4)' : 'transparent',
                    border: 'none',
                    borderRight: '1px solid var(--border)',
                    color: i === activeFile ? 'var(--text-3)' : 'var(--text-6)',
                    fontSize: 12,
                    fontFamily: 'JetBrains Mono, monospace',
                    transition: 'color 150ms, background 150ms',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}

          {/* Code */}
          <pre style={{
            padding: '24px',
            overflowX: 'auto',
            fontSize: 13,
            lineHeight: 1.65,
            fontFamily: 'JetBrains Mono, Fira Code, monospace',
            color: '#a1a1aa',
            margin: 0,
          }}>
            <code>{highlight(file.code)}</code>
          </pre>
        </div>
      </div>
    </section>
  )
}
