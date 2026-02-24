import React, { useState } from 'react'
import {
  AppBar, Box, CssBaseline, Drawer, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, ListSubheader,
  Paper, Snackbar, Alert, Toolbar, Typography, Chip, Divider,
  Avatar, Fade, ThemeProvider, createTheme, InputBase,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import HomeIcon from '@mui/icons-material/Home'
import InboxIcon from '@mui/icons-material/Inbox'
import FolderIcon from '@mui/icons-material/Folder'
import GroupIcon from '@mui/icons-material/Group'
import SettingsIcon from '@mui/icons-material/Settings'
import KeyboardIcon from '@mui/icons-material/Keyboard'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useCommandPalette } from 'use-command-palette'
import type { CommandItem } from 'use-command-palette'

type AppCommand = CommandItem & {
  icon: string
  shortcut?: string
  description?: string
}

const commands: AppCommand[] = [
  { id: 'nav-home',     label: 'Home',               icon: '🏠', group: 'Navigate',   shortcut: 'G H', keywords: ['home','dashboard'],          description: 'Go to the main dashboard' },
  { id: 'nav-inbox',    label: 'Inbox',              icon: '📥', group: 'Navigate',   shortcut: 'G I', keywords: ['inbox','messages'],           description: 'View messages & notifications' },
  { id: 'nav-projects', label: 'Projects',           icon: '📁', group: 'Navigate',   shortcut: 'G P', keywords: ['projects'],                   description: 'Browse all your projects' },
  { id: 'nav-team',     label: 'Team',               icon: '👥', group: 'Navigate',   shortcut: 'G T', keywords: ['team','members'],             description: 'Manage team members' },
  { id: 'nav-settings', label: 'Settings',           icon: '⚙️', group: 'Navigate',   shortcut: 'G S', keywords: ['settings','preferences'],     description: 'Configure your workspace' },
  { id: 'act-create',   label: 'Create Issue',       icon: '➕', group: 'Actions',    shortcut: 'C',   keywords: ['new','create','issue','task'], description: 'Add a new task to a project' },
  { id: 'act-project',  label: 'New Project',        icon: '✨', group: 'Actions',                     keywords: ['new','project','create'],      description: 'Start a fresh project' },
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
      { id: 'app-dark',  label: 'Dark Theme',  icon: '🌙', keywords: ['dark','mode'] } as AppCommand,
      { id: 'app-light', label: 'Light Theme', icon: '☀️', keywords: ['light','mode'] } as AppCommand,
    ],
  },
  { id: 'help-docs',    label: 'Documentation',      icon: '📖', group: 'Help',       shortcut: '?',   keywords: ['docs','help','guide'] },
  { id: 'help-support', label: 'Contact Support',    icon: '💬', group: 'Help',                        keywords: ['support','help','contact'] },
  { id: 'help-keys',    label: 'Keyboard Shortcuts', icon: '⌨️', group: 'Help',       shortcut: '?',   keywords: ['shortcuts','keys'] },
]

const DRAWER_WIDTH = 220

export default function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const [snack, setSnack] = useState<string | null>(null)
  const [activeNav, setActiveNav] = useState('Home')

  const theme = createTheme({
    palette: { mode },
    shape: { borderRadius: 10 },
    typography: { fontFamily: 'Roboto, sans-serif' },
    components: {
      MuiListItemButton: {
        styleOverrides: {
          root: { borderRadius: 8 },
        },
      },
    },
  })

  const {
    isOpen,
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
    onSelect: (item) => {
      const cmd = item as AppCommand
      if (cmd.id === 'app-dark') setMode('dark')
      if (cmd.id === 'app-light') setMode('light')
      if (cmd.id.startsWith('nav-')) setActiveNav(cmd.label)
      setSnack(`Executed: ${cmd.label}`)
    },
  })

  const navItems: { icon: React.ReactNode; label: string; badge?: number }[] = [
    { icon: <HomeIcon fontSize="small" />,   label: 'Home' },
    { icon: <InboxIcon fontSize="small" />,  label: 'Inbox', badge: 3 },
    { icon: <FolderIcon fontSize="small" />, label: 'Projects' },
    { icon: <GroupIcon fontSize="small" />,  label: 'Team' },
  ]

  const isAtRootWithNoQuery = !canGoBack && !query

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Aria announcer */}
      <div {...getAnnouncerProps()}>{announcement}</div>

      <Box sx={{ display: 'flex', height: '100vh' }}>

        {/* ── Drawer ── */}
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH, flexShrink: 0,
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
        >
          <Toolbar sx={{ gap: 1.5 }}>
            <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.main', fontSize: 13, fontWeight: 700 }}>M</Avatar>
            <Typography variant="subtitle2" fontWeight={600}>MyApp</Typography>
          </Toolbar>
          <Divider />
          <List dense sx={{ px: 1, pt: 1 }}>
            {navItems.map(({ icon, label, badge }) => (
              <ListItem key={label} disablePadding sx={{ mb: 0.25 }}>
                <ListItemButton
                  selected={activeNav === label}
                  onClick={() => setActiveNav(label)}
                  sx={{ py: 0.75 }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>{icon}</ListItemIcon>
                  <ListItemText primary={label} primaryTypographyProps={{ fontSize: 13 }} />
                  {badge && <Chip label={badge} size="small" color="primary" sx={{ height: 18, fontSize: 10, ml: 0.5 }} />}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ mt: 'auto', p: 1, pb: 2 }}>
            <ListItemButton sx={{ borderRadius: 2, py: 0.75 }}>
              <ListItemIcon sx={{ minWidth: 32 }}><SettingsIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Settings" primaryTypographyProps={{ fontSize: 13 }} />
            </ListItemButton>
          </Box>
        </Drawer>

        {/* ── Main ── */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
            <Toolbar sx={{ gap: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ flexGrow: 1 }}>{activeNav}</Typography>
              <Paper
                onClick={open}
                elevation={0}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                  px: 2, py: 0.75, cursor: 'pointer',
                  border: '1px solid', borderColor: 'divider',
                  borderRadius: 3, bgcolor: 'action.hover', minWidth: 220,
                  '&:hover': { borderColor: 'primary.main' },
                  transition: 'border-color 0.15s',
                }}
              >
                <SearchIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                  Search or jump to…
                </Typography>
                <Chip label="⌘K" size="small" sx={{ height: 20, fontSize: 11, fontFamily: 'monospace' }} />
              </Paper>
            </Toolbar>
          </AppBar>

          <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
            <Box sx={{ maxWidth: 620, mx: 'auto' }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>MUI Demo</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Press <strong>⌘K</strong> or <strong>⌘P</strong> to open. Try{' '}
                <strong>Change Theme</strong> for nested navigation, or revisit recently used commands.
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                {[['Issues', 24, '↑ 12%'], ['Cycles', 3, 'Active'], ['Roadmap', 8, 'Planned']].map(([label, n, sub]) => (
                  <Paper key={String(label)} elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                    <Typography variant="h4" fontWeight={700}>{n}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
                    <Typography variant="caption" color="primary">{sub}</Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Command Palette ── */}
      <Fade in={isOpen}>
        <Box
          sx={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            pt: '15vh', bgcolor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          }}
        >
          <Paper
            {...getContainerProps()}
            elevation={24}
            sx={{ width: '100%', maxWidth: 560, borderRadius: 3, overflow: 'hidden' }}
          >
            {/* Breadcrumb */}
            {canGoBack && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
                <ListItemButton
                  onClick={goBack}
                  sx={{ py: 0.25, px: 1, borderRadius: 1, minWidth: 0, width: 'auto' }}
                >
                  <ArrowBackIcon sx={{ fontSize: 14, mr: 0.5 }} />
                  <Typography variant="caption">back</Typography>
                </ListItemButton>
                {breadcrumb.map((crumb) => (
                  <React.Fragment key={crumb.id}>
                    <Typography variant="caption" color="text.disabled">/</Typography>
                    <Typography variant="caption" fontWeight={600}>{crumb.label}</Typography>
                  </React.Fragment>
                ))}
              </Box>
            )}

            {/* Input */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <SearchIcon sx={{ color: 'text.secondary', fontSize: 20, flexShrink: 0 }} />
              <InputBase
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                {...(({ color: _c, size: _s, ...rest }) => rest)(getInputProps({
                  placeholder: currentPage ? `Search in ${currentPage.label}…` : 'Search commands…',
                }))}
                fullWidth
                sx={{ fontSize: 15 }}
                inputProps={{ style: { padding: 0 } }}
              />
              <Chip
                icon={<KeyboardIcon sx={{ fontSize: '14px !important' }} />}
                label="ESC"
                size="small"
                variant="outlined"
                sx={{ fontSize: 10, height: 22, flexShrink: 0 }}
              />
            </Box>

            {/* Recent items */}
            {isAtRootWithNoQuery && recentItems.length > 0 && (
              <>
                <List {...getListProps()} dense disablePadding sx={{ py: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <ListSubheader sx={{ lineHeight: '28px', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', bgcolor: 'background.paper' }}>
                    Recent
                  </ListSubheader>
                  {recentItems.map((item) => {
                    const cmd = item as AppCommand
                    return (
                      <ListItem key={item.id} disablePadding sx={{ px: 1, opacity: 0.7 }}>
                        <ListItemButton sx={{ py: 0.75, borderRadius: 2 }}>
                          <ListItemIcon sx={{ minWidth: 36, fontSize: '1rem' }}>↺</ListItemIcon>
                          <ListItemText primary={cmd.label} primaryTypographyProps={{ fontSize: 13 }} />
                        </ListItemButton>
                      </ListItem>
                    )
                  })}
                </List>
              </>
            )}

            {/* Results */}
            <Box sx={{ maxHeight: 380, overflowY: 'auto' }}>
              {filteredItems.length === 0 ? (
                <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'text.disabled', gap: 1 }}>
                  <Typography fontSize={36}>🔍</Typography>
                  <Typography variant="body2" color="text.secondary">
                    No results for "{query}"
                  </Typography>
                </Box>
              ) : (
                <List {...getListProps()} dense disablePadding sx={{ py: 0.5 }}>
                  {groupedItems.map(({ group, items }, gi) => (
                    <React.Fragment key={group ?? '__none__'}>
                      {gi > 0 && <Divider sx={{ my: 0.5 }} />}
                      {group && (
                        <ListSubheader sx={{ lineHeight: '28px', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', bgcolor: 'background.paper' }}>
                          {group}
                        </ListSubheader>
                      )}
                      {items.map((item) => {
                        const cmd = item as AppCommand
                        const index = filteredItems.indexOf(item)
                        const active = index === highlightedIndex
                        const hasChildren = Array.isArray(item.children) && item.children.length > 0

                        return (
                          <ListItem
                            key={item.id}
                            disablePadding
                            sx={{ px: 1 }}
                            secondaryAction={
                              cmd.shortcut && !hasChildren
                                ? <Chip label={cmd.shortcut} size="small" variant="outlined" sx={{ fontSize: 10, height: 20, fontFamily: 'monospace', mr: 0.5 }} />
                                : hasChildren
                                  ? <ChevronRightIcon sx={{ fontSize: 18, color: 'text.disabled', mr: 0.5 }} />
                                  : undefined
                            }
                          >
                            <ListItemButton
                              {...getItemProps({ index, item })}
                              selected={active}
                              sx={{ py: 1, borderRadius: 2, pr: (cmd.shortcut || hasChildren) ? 8 : 2 }}
                            >
                              <ListItemIcon sx={{ minWidth: 42 }}>
                                <Avatar sx={{ width: 30, height: 30, bgcolor: active ? 'primary.main' : 'action.selected', fontSize: 15, transition: 'background 150ms' }}>
                                  {cmd.icon}
                                </Avatar>
                              </ListItemIcon>
                              <ListItemText
                                primary={cmd.label}
                                secondary={cmd.description}
                                primaryTypographyProps={{ fontSize: 13.5, fontWeight: active ? 600 : 400 }}
                                secondaryTypographyProps={{ fontSize: 11.5 }}
                              />
                            </ListItemButton>
                          </ListItem>
                        )
                      })}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>

            {/* Footer */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2, py: 1, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
              {[['↑↓', 'navigate'], ['↵', 'select'], ['esc', canGoBack ? 'back' : 'close']].map(([key, label]) => (
                <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Chip label={key} size="small" sx={{ height: 18, fontSize: 10, fontFamily: 'monospace' }} />
                  <Typography variant="caption" color="text.secondary">{label}</Typography>
                </Box>
              ))}
              <Typography variant="caption" color="text.disabled" sx={{ ml: 'auto' }}>
                {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Fade>

      <Snackbar
        open={!!snack}
        autoHideDuration={2500}
        onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSnack(null)} sx={{ borderRadius: 2 }}>
          {snack}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  )
}
