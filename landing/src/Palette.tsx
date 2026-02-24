import React from 'react'
import type { UseCommandPaletteReturn } from 'use-command-palette'
import type { PaletteCommand } from './App'

interface Props {
  palette: UseCommandPaletteReturn
  commands: PaletteCommand[]
}

export function Palette({ palette }: Props) {
  const {
    isMounted,
    animationState,
    query,
    filteredItems,
    groupedItems,
    highlightedIndex,
    recentItems,
    announcement,
    getContainerProps,
    getInputProps,
    getListProps,
    getItemProps,
    getAnnouncerProps,
  } = palette

  const visible = animationState === 'entering' || animationState === 'entered'
  const isAtRootWithNoQuery = !query && recentItems.length > 0 && filteredItems.length === (palette as unknown as { filteredItems: unknown[] }).filteredItems.length

  return (
    <>
      <div {...getAnnouncerProps()}>{announcement}</div>

      {isMounted && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '14vh',
            background: 'var(--overlay)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            transition: 'opacity 180ms ease',
            opacity: visible ? 1 : 0,
          }}
          onClick={palette.close}
        >
          <div
            {...getContainerProps()}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 580,
              margin: '0 16px',
              background: 'var(--bg-4)',
              border: '1px solid var(--border-2)',
              borderRadius: 16,
              boxShadow: 'var(--shadow-pal)',
              overflow: 'hidden',
              transition: 'opacity 180ms ease, transform 180ms cubic-bezier(0.16,1,0.3,1)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0) scale(1)' : 'translateY(-12px) scale(0.97)',
            }}
          >
            {/* Search row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', borderBottom: '1px solid var(--border-2)' }}>
              <svg width="16" height="16" fill="none" stroke="var(--text-5)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                {...getInputProps({ placeholder: 'Search commands…' })}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: 15,
                  color: 'var(--text)',
                  padding: '17px 0',
                  fontFamily: 'inherit',
                  caretColor: '#818cf8',
                }}
              />
              <kbd style={{
                fontSize: 11,
                fontFamily: 'inherit',
                color: 'var(--text-5)',
                background: 'var(--border)',
                border: '1px solid var(--border-2)',
                borderRadius: 6,
                padding: '2px 7px',
                flexShrink: 0,
              }}>esc</kbd>
            </div>

            {/* Recent items shown when palette opens fresh */}
            {isAtRootWithNoQuery && (
              <div style={{ borderBottom: '1px solid var(--border)' }}>
                <div style={groupLabelStyle}>Recent</div>
                <ul style={listReset}>
                  {recentItems.slice(0, 3).map((item) => {
                    const cmd = item as PaletteCommand
                    return (
                      <li key={item.id} style={{ ...itemBase, opacity: 0.6 }}>
                        <span style={iconStyle}>↺</span>
                        <span style={{ fontSize: 13.5, color: 'var(--text-3)' }}>{cmd.label}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {/* Results */}
            <div style={{ maxHeight: 380, overflowY: 'auto', overscrollBehavior: 'contain' }}>
              {filteredItems.length === 0 ? (
                <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-5)', fontSize: 14 }}>
                  No results for "{query}"
                </div>
              ) : (
                <ul {...getListProps()} style={{ ...listReset, padding: '6px' }}>
                  {groupedItems.map(({ group, items }) => (
                    <li key={group ?? '__none__'}>
                      {group && <div style={groupLabelStyle}>{group}</div>}
                      <ul style={listReset}>
                        {items.map((item) => {
                          const cmd = item as PaletteCommand
                          const index = filteredItems.indexOf(item)
                          const active = index === highlightedIndex
                          return (
                            <li
                              key={item.id}
                              {...getItemProps({ index, item })}
                              style={{
                                ...itemBase,
                                background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                                borderRadius: 8,
                              }}
                            >
                              <span style={{
                                ...iconStyle,
                                color: active ? '#818cf8' : 'var(--text-5)',
                                background: active ? 'rgba(99,102,241,0.15)' : 'var(--bg-5)',
                              }}>{cmd.icon}</span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13.5, fontWeight: 500, color: active ? 'var(--text)' : 'var(--text-2)' }}>
                                  {cmd.label}
                                </div>
                                {cmd.description && (
                                  <div style={{ fontSize: 11.5, color: active ? 'var(--text-3)' : 'var(--text-5)', marginTop: 1 }}>
                                    {cmd.description}
                                  </div>
                                )}
                              </div>
                              {active && (
                                <span style={{ fontSize: 11, color: '#6366f1', flexShrink: 0 }}>↵</span>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '8px 14px',
              borderTop: '1px solid var(--border)',
              fontSize: 11,
              color: 'var(--text-6)',
            }}>
              {[['↑↓', 'navigate'], ['↵', 'select'], ['esc', 'close']].map(([key, label]) => (
                <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <kbd style={{ fontFamily: 'monospace', background: 'var(--bg-5)', border: '1px solid var(--border-2)', borderRadius: 4, padding: '1px 5px', color: 'var(--text-4)' }}>
                    {key}
                  </kbd>
                  {label}
                </span>
              ))}
              <span style={{ marginLeft: 'auto', color: 'var(--text-7)' }}>
                {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const listReset: React.CSSProperties = { listStyle: 'none', margin: 0, padding: 0 }

const groupLabelStyle: React.CSSProperties = {
  padding: '10px 12px 4px',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: 'var(--text-6)' as string,
  userSelect: 'none',
}

const itemBase: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '8px 10px',
  cursor: 'pointer',
  transition: 'background 80ms',
}

const iconStyle: React.CSSProperties = {
  width: 30,
  height: 30,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 13,
  borderRadius: 7,
  flexShrink: 0,
  transition: 'background 80ms, color 80ms',
}
