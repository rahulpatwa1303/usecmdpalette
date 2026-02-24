import React, { useState } from 'react'
import { useCommandPalette } from 'use-command-palette'
import type { CommandItem } from 'use-command-palette'

type AppCommand = CommandItem & {
  icon: string
  shortcut?: string
  description?: string
}

const commands: AppCommand[] = [
  { id: 'nav-home',     label: 'Home',               icon: '🏠', group: 'Navigation', shortcut: 'G H', keywords: ['home','dashboard'],          description: 'Go to the main dashboard' },
  { id: 'nav-inbox',    label: 'Inbox',              icon: '📥', group: 'Navigation', shortcut: 'G I', keywords: ['inbox','messages'],           description: 'View notifications & messages' },
  { id: 'nav-projects', label: 'Projects',           icon: '📁', group: 'Navigation', shortcut: 'G P', keywords: ['projects'],                   description: 'Browse all your projects' },
  { id: 'nav-team',     label: 'Team',               icon: '👥', group: 'Navigation', shortcut: 'G T', keywords: ['team','members'],             description: 'Manage your team' },
  { id: 'nav-settings', label: 'Settings',           icon: '⚙️', group: 'Navigation', shortcut: 'G S', keywords: ['settings','preferences'],     description: 'Configure your workspace' },
  { id: 'act-issue',    label: 'Create Issue',       icon: '➕', group: 'Actions',    shortcut: 'C',   keywords: ['new','create','issue','task'], description: 'Add a new task to a project' },
  { id: 'act-project',  label: 'New Project',        icon: '✨', group: 'Actions',    shortcut: '⌘⇧N', keywords: ['new','project','create'],      description: 'Start a fresh project' },
  { id: 'act-invite',   label: 'Invite Teammates',   icon: '📨', group: 'Actions',                     keywords: ['invite','team','member'],      description: 'Send an invite link' },
  { id: 'act-export',   label: 'Export as CSV',      icon: '📤', group: 'Actions',                     keywords: ['export','csv','download'],     description: 'Download your data' },
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
  { id: 'help-keys',    label: 'Keyboard Shortcuts', icon: '⌨️', group: 'Help',       shortcut: '?',   keywords: ['shortcuts','keys','hotkeys'] },
  { id: 'help-new',     label: "What's New",         icon: '🎉', group: 'Help',                        keywords: ['changelog','updates','new'] },
]

const NAV_ITEMS = [
  { icon: '🏠', label: 'Home' },
  { icon: '📥', label: 'Inbox', badge: 3 },
  { icon: '📁', label: 'Projects' },
  { icon: '👥', label: 'Team' },
]

function ShortcutBadge({ keys }: { keys: string }) {
  return (
    <span className="flex items-center gap-0.5 shrink-0">
      {keys.split(' ').map((k, i) => (
        <kbd
          key={i}
          className="inline-flex items-center justify-center min-w-[1.4rem] h-5 px-1 rounded text-[10px] font-mono bg-white/10 text-white/50 border border-white/10"
        >
          {k}
        </kbd>
      ))}
    </span>
  )
}

export default function App() {
  const [dark, setDark] = useState(true)
  const [activeNav, setActiveNav] = useState('Home')
  const [lastAction, setLastAction] = useState<string | null>(null)

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
    animationDuration: 160,
    onSelect: (item) => {
      const cmd = item as AppCommand
      if (cmd.id === 'app-dark') setDark(true)
      if (cmd.id === 'app-light' || cmd.id === 'app-system') setDark(false)
      if (cmd.id.startsWith('nav-')) setActiveNav(cmd.label)
      setLastAction(cmd.label)
    },
  })

  const isAtRootWithNoQuery = !canGoBack && !query

  const backdropVisible = animationState === 'entered' || animationState === 'entering'
  const modalVisible    = animationState === 'entered' || animationState === 'entering'

  return (
    <div className={dark ? 'dark' : ''}>
      {/* Aria announcer */}
      <div {...getAnnouncerProps()}>{announcement}</div>

      <div className="flex h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden">

        {/* ── Sidebar ── */}
        <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
          <div className="flex items-center gap-2.5 px-4 h-14 border-b border-gray-800">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow">L</div>
            <span className="text-sm font-semibold">Linear</span>
          </div>

          <nav className="flex-1 px-2 py-3 space-y-0.5">
            {NAV_ITEMS.map(({ icon, label, badge }) => (
              <button
                key={label}
                onClick={() => setActiveNav(label)}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeNav === label
                    ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
                }`}
              >
                <span className="text-base">{icon}</span>
                <span className="flex-1 text-left">{label}</span>
                {badge && (
                  <span className="text-[10px] font-semibold bg-indigo-500 text-white rounded-full px-1.5 leading-5">{badge}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="px-2 pb-3 border-t border-gray-800 pt-2">
            <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-gray-100 hover:bg-white/5 transition-colors">
              <span>⚙️</span><span>Settings</span>
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
            <h1 className="text-sm font-semibold">{activeNav}</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={open}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-400 hover:border-indigo-500/50 hover:text-gray-200 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search or jump to…</span>
                <kbd className="text-[10px] font-mono bg-gray-700 text-gray-500 px-1.5 py-0.5 rounded border border-gray-600 ml-1">⌘K</kbd>
              </button>
              <button
                onClick={() => setDark((d) => !d)}
                className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 text-base flex items-center justify-center transition-colors"
                title="Toggle theme"
              >
                {dark ? '☀️' : '🌙'}
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-2xl mx-auto space-y-5">
              {lastAction && (
                <div className="flex items-center gap-2 text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                  <span>✓</span>
                  <span>Executed: <strong>{lastAction}</strong></span>
                </div>
              )}

              <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
                <h2 className="text-base font-semibold mb-2 flex items-center gap-2">
                  <span>🎨</span> Tailwind Demo
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Press <kbd className="text-xs bg-gray-800 border border-gray-700 px-1.5 py-0.5 rounded font-mono">⌘K</kbd> or{' '}
                  <kbd className="text-xs bg-gray-800 border border-gray-700 px-1.5 py-0.5 rounded font-mono">⌘P</kbd> to open.
                  Try <strong className="text-gray-200">Change Theme</strong> for nested navigation, or use recently visited commands.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[['Issues', '24', '↑ 12%'], ['Cycles', '3', 'Active'], ['Roadmap', '8', 'Planned']].map(([label, n, sub]) => (
                  <div key={label} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                    <div className="text-2xl font-bold text-gray-100">{n}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                    <div className="text-[11px] text-indigo-400 mt-1">{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* ── Command Palette ── */}
      {isMounted && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] transition-opacity duration-150"
          style={{ opacity: backdropVisible ? 1 : 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div
            {...getContainerProps()}
            className="relative w-full max-w-[560px] rounded-2xl bg-gray-900 border border-gray-700/80 shadow-2xl shadow-black/70 overflow-hidden transition-[opacity,transform] duration-150"
            style={{
              opacity: modalVisible ? 1 : 0,
              transform: modalVisible ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.97)',
            }}
          >
            {/* Breadcrumb */}
            {canGoBack && (
              <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800 text-xs text-gray-500">
                <button
                  onClick={goBack}
                  className="px-2 py-1 rounded-lg hover:bg-white/5 transition-colors text-gray-400"
                >
                  ← back
                </button>
                {breadcrumb.map((crumb) => (
                  <span key={crumb.id} className="flex items-center gap-2">
                    <span className="text-gray-700">/</span>
                    <span className="text-gray-300 font-medium">{crumb.label}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Input row */}
            <div className="flex items-center gap-3 px-4 border-b border-gray-800">
              <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                {...getInputProps({
                  placeholder: currentPage
                    ? `Search in ${currentPage.label}…`
                    : 'Search commands, navigate…',
                })}
                className="flex-1 bg-transparent py-4 text-sm text-gray-100 placeholder-gray-600 outline-none"
              />
              <kbd className="shrink-0 text-[10px] font-mono text-gray-600 border border-gray-700 rounded-md px-1.5 py-0.5">esc</kbd>
            </div>

            {/* Recent items */}
            {isAtRootWithNoQuery && recentItems.length > 0 && (
              <div className="py-1 px-2 border-b border-gray-800/50">
                <div className="px-2 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-600 select-none">Recent</div>
                <ul>
                  {recentItems.map((item) => {
                    const cmd = item as AppCommand
                    return (
                      <li key={item.id} className="flex items-center gap-3 mx-0 px-2.5 py-2 rounded-xl text-gray-400 text-sm opacity-75">
                        <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 text-sm shrink-0">↺</span>
                        <span>{cmd.label}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {/* Results */}
            <div className="max-h-[380px] overflow-y-auto overscroll-contain">
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-gray-600 gap-2">
                  <span className="text-3xl opacity-40">🔍</span>
                  <p className="text-sm">
                    No results for <span className="text-gray-400">"{query}"</span>
                  </p>
                </div>
              ) : (
                <ul {...getListProps()} className="py-2">
                  {groupedItems.map(({ group, items }) => (
                    <li key={group ?? '__none__'}>
                      {group && (
                        <div className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-600 select-none">
                          {group}
                        </div>
                      )}
                      <ul>
                        {items.map((item) => {
                          const cmd = item as AppCommand
                          const index = filteredItems.indexOf(item)
                          const active = index === highlightedIndex
                          const hasChildren = Array.isArray(item.children) && item.children.length > 0
                          return (
                            <li
                              key={item.id}
                              {...getItemProps({ index, item })}
                              className={`flex items-center gap-3 mx-2 px-2.5 py-2.5 rounded-xl cursor-pointer transition-colors ${
                                active
                                  ? 'bg-indigo-500/20 text-white'
                                  : 'text-gray-300 hover:bg-white/5'
                              }`}
                            >
                              <span className={`text-lg w-8 h-8 flex items-center justify-center rounded-lg shrink-0 ${active ? 'bg-indigo-500/20' : 'bg-white/5'}`}>
                                {cmd.icon}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">{cmd.label}</div>
                                {cmd.description && (
                                  <div className="text-xs text-gray-500 truncate mt-0.5">{cmd.description}</div>
                                )}
                              </div>
                              {cmd.shortcut && !hasChildren && <ShortcutBadge keys={cmd.shortcut} />}
                              {hasChildren && <span className="text-gray-600 text-sm shrink-0">›</span>}
                              {active && !hasChildren && <span className="text-indigo-400/60 text-xs shrink-0">↵</span>}
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
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-gray-800 text-[11px] text-gray-600">
              {[['↑↓', 'navigate'], ['↵', 'select'], ['esc', canGoBack ? 'back' : 'close']].map(([k, l]) => (
                <span key={k} className="flex items-center gap-1">
                  <kbd className="font-mono border border-gray-700 rounded px-1 text-gray-500">{k}</kbd>
                  {l}
                </span>
              ))}
              <span className="ml-auto">{filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
