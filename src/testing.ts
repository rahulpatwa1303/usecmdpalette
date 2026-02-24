/**
 * Testing utilities for use-command-palette.
 * Import from 'use-command-palette/testing'.
 *
 * These helpers wrap @testing-library/react primitives and assume the
 * palette renders a combobox input, a listbox, and option items.
 */
import { fireEvent, screen, waitFor } from '@testing-library/react'

/** Fire the default Mod+K hotkey on document to open/close the palette. */
export function openPaletteWithHotkey(): void {
  fireEvent.keyDown(document, { key: 'k', ctrlKey: true })
}

/** Type text into the palette search input (replaces current value). */
export function typeInPalette(text: string): void {
  const input = getPaletteInput()
  fireEvent.change(input, { target: { value: text } })
}

/** Press ArrowDown on the palette input. */
export function pressArrowDown(): void {
  fireEvent.keyDown(getPaletteInput(), { key: 'ArrowDown' })
}

/** Press ArrowUp on the palette input. */
export function pressArrowUp(): void {
  fireEvent.keyDown(getPaletteInput(), { key: 'ArrowUp' })
}

/** Press Enter on the palette input. */
export function pressEnter(): void {
  fireEvent.keyDown(getPaletteInput(), { key: 'Enter' })
}

/** Press Escape on the palette input. */
export function pressEscape(): void {
  fireEvent.keyDown(getPaletteInput(), { key: 'Escape' })
}

/** Return all rendered palette option elements. */
export function getAllPaletteItems(): HTMLElement[] {
  return screen.queryAllByRole('option') as HTMLElement[]
}

/** Return the currently highlighted (aria-selected) palette option, or null. */
export function getHighlightedItem(): HTMLElement | null {
  return (screen.queryByRole('option', { selected: true }) as HTMLElement | null)
}

/** Return the palette combobox input element. */
export function getPaletteInput(): HTMLElement {
  return screen.getByRole('combobox')
}

/** Wait until at least one palette option is rendered. */
export async function waitForPaletteResults(): Promise<void> {
  await waitFor(() => {
    const items = getAllPaletteItems()
    if (items.length === 0) throw new Error('No palette items found')
  })
}
