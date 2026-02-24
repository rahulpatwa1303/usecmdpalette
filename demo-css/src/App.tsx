import React, { useState, useEffect } from 'react'
import { useCommandPalette } from 'use-command-palette'
import type { CommandItem } from 'use-command-palette'

type AppCommand = CommandItem & {
  icon: string
  shortcut?: string
  description?: string
}

const commands: AppCommand[] = [
  { id: 'nav-home',     label: 'Home',               icon: '🏠', group: 'Navigation', shortcut: 'G H', keywords: ['home','dashboard'],          description: 'Go to the main dashboard' },
  { id: 'nav-inbox',    label: 'Inbox',              icon: '📥', group: 'Navigation', shortcut: 'G I', keywords: ['inbox','messages'],           description: 'View messages & notifications' },
  { id: 'nav-projects', label: 'Projects',           icon: '📁', group: 'Navigation', shortcut: 'G P', keywords: ['projects'],                   description: 'Browse all your projects' },
  { id: 'nav-team',     label: 'Team',               icon: '👥', group: 'Navigation', shortcut: 'G T', keywords: ['team','members'],             description: 'Manage your team' },
  { id: 'nav-settings', label: 'Settings',           icon: '⚙️', group: 'Navigation', shortcut: 'G S', keywords: ['settings','preferences'],     description: 'Configure your workspace' },
  { id: 'act-create',   label: 'Create Issue',       icon: '➕', group: 'Actions',    shortcut: 'C',   keywords: ['new','create','issue','task'], description: 'Add a new task to a project' },
  { id: 'act-project',  label: 'New Project',        icon: '✨', group: 'Actions',    shortcut: '⌘⇧N', keywords: ['new','project','create'],      description: 'Start a fresh project' },
  { id: 'act-invite',   label: 'Invite Teammates',   icon: '📨', group: 'Actions',                     keywords: ['invite','team','member'],      description: 'Send an invite to colleagues' },
  { id: 'act-export',   label: 'Export Data',        icon: '📤', group: 'Actions',                     keywords: ['export','csv','download'],     description: 'Download your data as CSV' },
  {
    id: 'app-theme',
    label: 'Change Theme',
    icon: '🎨',
    group: 'Appearance',
    keywords: ['theme', 'dark', 'light', 'color'],
    description: 'Switch color scheme',
    children: [
      { id: 'app-dark',   label: 'Dark Mode',        icon: '🌙', keywords: ['dark','night'] } as AppCommand,
      { id: 'app-light',  label: 'Light Mode',       icon: '☀️', keywords: ['light'] } as AppCommand,
      { id: 'app-system', label: 'Use System Theme', icon: '💻', keywords: ['system','auto'] } as AppCommand,
    ],
  },
  { id: 'help-docs',    label: 'Documentation',      icon: '📖', group: 'Help',       shortcut: '?',   keywords: ['docs','help','guide'] },
  { id: 'help-support', label: 'Contact Support',    icon: '💬', group: 'Help',                        keywords: ['support','help','contact'] },
  { id: 'help-keys',    label: 'Keyboard Shortcuts', icon: '⌨️', group: 'Help',       shortcut: '?',   keywords: ['shortcuts','keys'] },
  { id: 'help-new',     label: "What's New",         icon: '🎉', group: 'Help',                        keywords: ['changelog','updates','new'] },
]

function ShortcutBadge({ keys }: { keys: string }) {
  return (
    <span className="palette-shortcut">
      {keys.split(' ').map((k, i) => (
        <kbd key={i} className="palette-kbd">{k}</kbd>
      ))}
    </span>
  )
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [activeNav, setActiveNav] = useState('Home')
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const {
    isOpen,
    isMounted,
    animationState,
    open,
    query,
    filteredItems,
    groupedItems,
    highlightedIndex,
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
    animationDuration: 180,
    onSelect: (item) => {
      const cmd = item as AppCommand
      if (cmd.id === 'app-dark')   setTheme('dark')
      if (cmd.id === 'app-light' || cmd.id === 'app-system') setTheme('light')
      if (cmd.id.startsWith('nav-')) setActiveNav(cmd.label)
      setToast(`Executed: ${cmd.label}`)
    },
  })

  const navItems = [
    { icon: '🏠', label: 'Home' },
    { icon: '📥', label: 'Inbox', badge: 3 },
    { icon: '📁', label: 'Projects' },
    { icon: '👥', label: 'Team' },
  ]

  const isAtRootWithNoQuery = !canGoBack && !query

  return (
    <>
      {/* Aria announcer */}
      <div {...getAnnouncerProps()}>{announcement}</div>

      <div className="app">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-mark">V</div>
            Vercel
          </div>
          <nav className="sidebar-nav">
            {navItems.map(({ icon, label, badge }) => (
              <button
                key={label}
                className={`sidebar-btn${activeNav === label ? ' active' : ''}`}
                onClick={() => setActiveNav(label)}
              >
                <span>{icon}</span>
                <span style={{ flex: 1 }}>{label}</span>
                {badge && <span className="sidebar-badge">{badge}</span>}
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <button className="sidebar-btn">
              <span>⚙️</span>
              <span>Settings</span>
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="main">
          <header className="main-header">
            <h1>{activeNav}</h1>
            <div className="header-actions">
              <button className="search-trigger" onClick={open}>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search or jump to…
                <span className="search-trigger-shortcut">⌘K</span>
              </button>
              <button
                className="theme-btn"
                onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                title="Toggle theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </header>

          <main className="main-content">
            <div className="content">
              <div className="card">
                <h2>🎨 Plain CSS Demo</h2>
                <p>
                  This command palette uses only CSS custom properties and two plain stylesheets.
                  Press <kbd>⌘K</kbd> or <kbd>⌘P</kbd> to open it.
                  Try <strong>Change Theme → Dark Mode</strong> to see nested commands.
                  Recently used commands appear at the top.
                </p>
              </div>

              <div className="stats">
                {[['📦', 'Projects', '12', '3 active'], ['✅', 'Issues', '38', '↑ 12%'], ['🔄', 'In Progress', '7', 'Due this week']].map(([icon, label, n, sub]) => (
                  <div key={String(label)} className="stat">
                    <div className="stat-n">{icon} {n}</div>
                    <div className="stat-label">{label}</div>
                    <div className="stat-sub">{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Command Palette — rendered while mounted (for exit animation) */}
      {isMounted && (
        <div
          className={`palette-backdrop palette-backdrop--${animationState}`}
          onClick={() => { if (isOpen) return; }} // backdrop handled by close via keyboard
        >
          <div
            {...getContainerProps()}
            className={`palette-modal palette-modal--${animationState}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Breadcrumb / back navigation */}
            {canGoBack && (
              <div className="palette-breadcrumb">
                <button className="palette-back-btn" onClick={goBack}>← back</button>
                {breadcrumb.map((crumb) => (
                  <span key={crumb.id} className="palette-breadcrumb-item">
                    <span className="palette-breadcrumb-sep">/</span>
                    <span className="palette-breadcrumb-label">{crumb.label}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="palette-input-row">
              <svg className="palette-search-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                {...getInputProps({
                  placeholder: currentPage
                    ? `Search in ${currentPage.label}…`
                    : 'Search commands, navigate…',
                })}
                className="palette-input"
              />
              <span className="palette-esc">esc</span>
            </div>

            {/* Recent items */}
            {isAtRootWithNoQuery && recentItems.length > 0 && (
              <div className="palette-results">
                <ul className="palette-list">
                  <li className="palette-group">
                    <div className="palette-group-label">Recent</div>
                    <ul className="palette-group-items">
                      {recentItems.map((item) => {
                        const cmd = item as AppCommand
                        return (
                          <li key={item.id} className="palette-item palette-item--recent">
                            <span className="palette-item-icon">↺</span>
                            <div className="palette-item-body">
                              <div className="palette-item-label">{cmd.label}</div>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                </ul>
              </div>
            )}

            {/* Results */}
            <div className="palette-results">
              {filteredItems.length === 0 ? (
                <div className="palette-empty">
                  <span className="palette-empty-icon">🔍</span>
                  <p className="palette-empty-text">
                    No results for <span className="palette-empty-query">"{query}"</span>
                  </p>
                </div>
              ) : (
                <ul {...getListProps()} className="palette-list">
                  {groupedItems.map(({ group, items }) => (
                    <li key={group ?? '__none__'} className="palette-group">
                      {group && <div className="palette-group-label">{group}</div>}
                      <ul className="palette-group-items">
                        {items.map((item) => {
                          const cmd = item as AppCommand
                          const index = filteredItems.indexOf(item)
                          const active = index === highlightedIndex
                          const hasChildren = Array.isArray(item.children) && item.children.length > 0

                          return (
                            <li
                              key={item.id}
                              {...getItemProps({ index, item })}
                              className={`palette-item${active ? ' palette-item--active' : ''}`}
                            >
                              <span className="palette-item-icon">{cmd.icon}</span>
                              <div className="palette-item-body">
                                <div className="palette-item-label">{cmd.label}</div>
                                {cmd.description && (
                                  <div className="palette-item-desc">{cmd.description}</div>
                                )}
                              </div>
                              {cmd.shortcut && <ShortcutBadge keys={cmd.shortcut} />}
                              {hasChildren && <span className="palette-item-chevron">›</span>}
                              {active && !hasChildren && <span className="palette-item-enter">↵</span>}
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
            <div className="palette-footer">
              {[['↑↓', 'navigate'], ['↵', 'select'], ['esc', canGoBack ? 'back' : 'close']].map(([key, label]) => (
                <span key={key} className="palette-footer-hint">
                  <kbd className="palette-kbd">{key}</kbd>
                  {label}
                </span>
              ))}
              <span className="palette-footer-count">
                {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">✓ {toast}</div>}
    </>
  )
}
