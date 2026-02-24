import React, { useState } from 'react'
import { useCommandPalette } from 'use-command-palette'
import type { CommandItem } from 'use-command-palette'

const commands: CommandItem[] = [
  { id: 'open-file',    label: 'Open File',          group: 'File',       keywords: ['open', 'load'] },
  { id: 'save-file',    label: 'Save File',          group: 'File',       keywords: ['save', 'write'] },
  { id: 'new-file',     label: 'New File',           group: 'File',       keywords: ['create', 'new'] },
  { id: 'close-file',   label: 'Close File',         group: 'File',       keywords: ['close', 'exit'] },
  { id: 'new-window',   label: 'New Window',         group: 'Window' },
  { id: 'split-right',  label: 'Split Editor Right', group: 'Window',     keywords: ['split', 'side'] },
  { id: 'close-window', label: 'Close Window',       group: 'Window' },
  {
    id: 'theme',
    label: 'Change Theme',
    group: 'Appearance',
    keywords: ['theme', 'dark', 'light', 'color'],
    children: [
      { id: 'theme-dark',  label: 'Theme: Dark',  keywords: ['dark'] },
      { id: 'theme-light', label: 'Theme: Light', keywords: ['light'] },
      { id: 'theme-hc',    label: 'Theme: High Contrast', keywords: ['contrast'] },
    ],
  },
  { id: 'settings',    label: 'Open Settings',     keywords: ['settings', 'preferences', 'config'] },
  { id: 'keybindings', label: 'Open Keybindings',  keywords: ['shortcuts', 'keys'] },
  { id: 'help',        label: 'Help',              keywords: ['help', 'docs', 'documentation'] },
  { id: 'disabled-cmd', label: 'Unavailable Action', keywords: ['disabled'], disabled: true },
]

const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform)
const shortcutLabel = isMac ? '⌘K' : 'Ctrl+K'

export default function App() {
  const [lastSelected, setLastSelected] = useState<string | null>(null)

  const {
    isOpen,
    isMounted,
    animationState,
    open,
    close,
    filteredItems,
    groupedItems,
    highlightedIndex,
    isLoading,
    recentItems,
    currentPage,
    breadcrumb,
    canGoBack,
    goBack,
    announcement,
    getContainerProps,
    getInputProps,
    getListProps,
    getItemProps,
    getAnnouncerProps,
  } = useCommandPalette({
    items: commands,
    hotkey: ['mod+k', 'mod+p'],
    recent: { enabled: true },
    animationDuration: 150,
    onSelect: (item) => setLastSelected(item.label),
  })

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Aria announcer — visually hidden */}
      <div {...getAnnouncerProps()}>{announcement}</div>

      <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
        use-command-palette
      </h1>
      <p style={{ color: '#555', marginBottom: '8px' }}>
        Headless React hook for command palettes. You bring the UI, we bring the logic.
      </p>
      <p style={{ color: '#888', fontSize: '13px', marginBottom: '32px' }}>
        Hotkeys: <kbd style={kbdStyle}>{shortcutLabel}</kbd>{' '}
        or <kbd style={kbdStyle}>{isMac ? '⌘P' : 'Ctrl+P'}</kbd>
      </p>

      <button onClick={open} style={openBtnStyle}>
        <span>Open Command Palette</span>
        <kbd style={kbdStyle}>{shortcutLabel}</kbd>
      </button>

      {lastSelected && (
        <p style={{ marginTop: '20px', color: '#059669', fontSize: '14px' }}>
          ✓ Selected: <strong>{lastSelected}</strong>
        </p>
      )}

      {/* Backdrop + Modal — use isMounted so exit animations can play */}
      {isMounted && (
        <div
          onClick={close}
          style={{
            ...backdropStyle,
            opacity: animationState === 'entering' || animationState === 'exiting' ? 0 : 1,
            transition: 'opacity 150ms ease',
          }}
        >
          <div
            {...getContainerProps()}
            onClick={(e) => e.stopPropagation()}
            style={{
              ...modalStyle,
              opacity: animationState === 'entering' || animationState === 'exiting' ? 0 : 1,
              transform: animationState === 'entering' || animationState === 'exiting'
                ? 'translateY(-8px) scale(0.97)'
                : 'translateY(0) scale(1)',
              transition: 'opacity 150ms ease, transform 150ms ease',
            }}
          >
            {/* Breadcrumb */}
            {canGoBack && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px 0', fontSize: '12px', color: '#6b7280' }}>
                <button onClick={goBack} style={backBtnStyle}>← back</button>
                {breadcrumb.map((crumb) => (
                  <span key={crumb.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#d1d5db' }}>/</span>
                    <span style={{ color: '#374151', fontWeight: 500 }}>{crumb.label}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Search input */}
            <div style={{ borderBottom: '1px solid #e5e7eb', padding: '0' }}>
              <input
                {...getInputProps({
                  placeholder: currentPage ? `Search in ${currentPage.label}…` : 'Search commands…',
                })}
                style={inputStyle}
              />
            </div>

            {/* Loading indicator */}
            {isLoading && (
              <div style={{ padding: '8px 20px', fontSize: '12px', color: '#9ca3af' }}>Loading…</div>
            )}

            {/* Recent items (shown only at root with empty query) */}
            {!canGoBack && recentItems.length > 0 && filteredItems.length === commands.length && (
              <div style={{ padding: '8px 8px 0' }}>
                <div style={groupLabelStyle}>Recent</div>
                <ul style={listStyle}>
                  {recentItems.map((item) => (
                    <li key={item.id} style={recentItemStyle}>
                      <span style={{ color: '#9ca3af', fontSize: '12px', marginRight: '8px' }}>↺</span>
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Results */}
            <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '8px' }}>
              {!isLoading && filteredItems.length === 0 ? (
                <div style={emptyStyle}>No results found</div>
              ) : (
                <ul {...getListProps()} style={listStyle}>
                  {groupedItems.map(({ group, items: groupItemList }) => (
                    <li key={group ?? '__ungrouped__'}>
                      {group && <div style={groupLabelStyle}>{group}</div>}
                      <ul style={listStyle}>
                        {groupItemList.map((item) => {
                          const index = filteredItems.indexOf(item)
                          const isHighlighted = index === highlightedIndex
                          const hasChildren = Array.isArray(item.children) && item.children.length > 0

                          return (
                            <li
                              key={item.id}
                              {...getItemProps({ index, item })}
                              style={{
                                ...itemStyle,
                                background: isHighlighted && !item.disabled ? '#eff6ff' : 'transparent',
                                color: item.disabled ? '#d1d5db' : '#111827',
                              }}
                            >
                              <span style={{ flex: 1 }}>{item.label}</span>
                              {item.disabled && <span style={{ fontSize: '11px', color: '#d1d5db' }}>unavailable</span>}
                              {hasChildren && <span style={{ fontSize: '11px', color: '#6b7280' }}>›</span>}
                              {isHighlighted && !item.disabled && !hasChildren && (
                                <span style={{ fontSize: '11px', color: '#6b7280' }}>↵</span>
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
            <div style={footerStyle}>
              <span><kbd style={smallKbdStyle}>↑↓</kbd> navigate</span>
              {canGoBack && <span><kbd style={smallKbdStyle}>esc</kbd> back</span>}
              <span><kbd style={smallKbdStyle}>↵</kbd> select</span>
              {!canGoBack && <span><kbd style={smallKbdStyle}>esc</kbd> close</span>}
              <span style={{ marginLeft: 'auto', color: '#d1d5db' }}>
                {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Styles ──────────────────────────────────────────────────────────────────

const kbdStyle: React.CSSProperties = {
  background: '#f3f4f6',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  padding: '2px 6px',
  fontSize: '12px',
  fontFamily: 'monospace',
}

const openBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 16px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  background: '#fff',
  cursor: 'pointer',
  fontSize: '14px',
  color: '#374151',
}

const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  paddingTop: '80px',
  zIndex: 1000,
}

const modalStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  width: '100%',
  maxWidth: '560px',
  overflow: 'hidden',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '16px 20px',
  fontSize: '16px',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  boxSizing: 'border-box',
}

const listStyle: React.CSSProperties = { listStyle: 'none', margin: 0, padding: 0 }

const groupLabelStyle: React.CSSProperties = {
  padding: '6px 12px 2px',
  fontSize: '11px',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: '#9ca3af',
}

const itemStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  transition: 'background 80ms',
}

const recentItemStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: '6px',
  fontSize: '13px',
  color: '#374151',
  display: 'flex',
  alignItems: 'center',
}

const emptyStyle: React.CSSProperties = {
  padding: '32px',
  textAlign: 'center',
  color: '#9ca3af',
  fontSize: '14px',
}

const footerStyle: React.CSSProperties = {
  borderTop: '1px solid #e5e7eb',
  padding: '8px 16px',
  display: 'flex',
  gap: '16px',
  fontSize: '11px',
  color: '#9ca3af',
}

const smallKbdStyle: React.CSSProperties = { fontFamily: 'monospace' }

const backBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#6b7280',
  fontSize: '12px',
  padding: '2px 6px',
  borderRadius: '4px',
}
