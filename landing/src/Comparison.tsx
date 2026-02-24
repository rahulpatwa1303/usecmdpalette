import React from 'react'
import { SectionLabel, sectionH2, sectionSub } from './Features'

type Val = boolean | 'partial'

const rows: { feature: string; ucp: Val; cmdk: Val; kbar: Val }[] = [
  { feature: 'Zero runtime dependencies',  ucp: true,  cmdk: false, kbar: false },
  { feature: 'No Provider required',        ucp: true,  cmdk: false, kbar: false },
  { feature: 'No UI shipped',              ucp: true,  cmdk: false, kbar: false },
  { feature: 'Async filter support',       ucp: true,  cmdk: false, kbar: false },
  { feature: 'Nested commands (pages)',    ucp: true,  cmdk: false, kbar: false },
  { feature: 'Recent items built-in',      ucp: true,  cmdk: false, kbar: false },
  { feature: 'Animation state machine',    ucp: true,  cmdk: false, kbar: false },
  { feature: 'useRegisterCommands',        ucp: true,  cmdk: false, kbar: true  },
  { feature: 'Testing utilities subpath',  ucp: true,  cmdk: false, kbar: false },
  { feature: 'Multiple hotkeys',           ucp: true,  cmdk: false, kbar: false },
  { feature: 'aria-live announcements',    ucp: true,  cmdk: false, kbar: false },
  { feature: 'Controlled isOpen',          ucp: true,  cmdk: true,  kbar: true  },
  { feature: 'Fuzzy search built-in',      ucp: true,  cmdk: true,  kbar: false },
  { feature: 'Grouping',                   ucp: true,  cmdk: true,  kbar: true  },
  { feature: 'SSR safe',                   ucp: true,  cmdk: 'partial', kbar: 'partial' },
  { feature: 'TypeScript strict',          ucp: true,  cmdk: true,  kbar: false },
]

function Cell({ val, highlight }: { val: Val; highlight?: boolean }) {
  if (val === true) {
    return (
      <td style={{ ...td, textAlign: 'center', background: highlight ? 'rgba(99,102,241,0.06)' : undefined }}>
        <svg width="16" height="16" fill="none" stroke="#4ade80" strokeWidth="2.5" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </td>
    )
  }
  if (val === 'partial') {
    return (
      <td style={{ ...td, textAlign: 'center', color: '#a16207', background: highlight ? 'rgba(99,102,241,0.06)' : undefined }}>
        ◐
      </td>
    )
  }
  return (
    <td style={{ ...td, textAlign: 'center', background: highlight ? 'rgba(99,102,241,0.06)' : undefined }}>
      <svg width="14" height="14" fill="none" stroke="var(--border-3)" strokeWidth="2.5" viewBox="0 0 24 24">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </td>
  )
}

const td: React.CSSProperties = {
  padding: '11px 16px',
  borderBottom: '1px solid var(--bg-5)' as string,
  fontSize: 13.5,
}

export function Comparison() {
  return (
    <section id="comparison" style={{ padding: '96px 24px', maxWidth: 860, margin: '0 auto' }}>
      <SectionLabel>Comparison</SectionLabel>
      <h2 style={sectionH2}>How it stacks up</h2>
      <p style={{ ...sectionSub, marginBottom: 48 }}>
        Every existing library either ships styled components or requires a Provider. We do neither.
      </p>

      <div style={{
        border: '1px solid var(--border)',
        borderRadius: 14,
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-2)' }}>
              <th style={{ ...td, textAlign: 'left', color: 'var(--text-5)' as string, fontWeight: 500, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Feature
              </th>
              <th style={{ ...td, textAlign: 'center', width: 140, background: 'rgba(99,102,241,0.08)', borderBottom: '1px solid var(--border)' as string }}>
                <div style={{ color: '#818cf8', fontWeight: 700, fontSize: 13 }}>use-command-palette</div>
                <div style={{ color: 'var(--text-6)' as string, fontSize: 11, fontWeight: 400, marginTop: 2 }}>this library</div>
              </th>
              <th style={{ ...td, textAlign: 'center', width: 120, color: 'var(--text-5)' as string, fontWeight: 500, fontSize: 13 }}>
                cmdk
              </th>
              <th style={{ ...td, textAlign: 'center', width: 120, color: 'var(--text-5)' as string, fontWeight: 500, fontSize: 13 }}>
                kbar
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.feature}
                style={{ background: i % 2 === 0 ? 'var(--bg-2)' : 'var(--bg)' }}
              >
                <td style={{ ...td, color: 'var(--text-3)' as string }}>{row.feature}</td>
                <Cell val={row.ucp}  highlight />
                <Cell val={row.cmdk} />
                <Cell val={row.kbar} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-7)' as string, marginTop: 16, textAlign: 'right' }}>
        ◐ = partial/workaround required
      </p>
    </section>
  )
}
