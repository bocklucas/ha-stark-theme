# JARVIS Theme — Technical Documentation

This document covers the internals of `themes/jarvis.yaml` for contributors and advanced users who want to understand or extend the theme.

---

## Architecture: Two-Layer Token System

The theme is structured in two layers, both inside the single `jarvis:` key in `themes/jarvis.yaml`.

### Layer 1 — Design Tokens

All raw color and typography values live here, and **only** here. Every token uses the `j-` prefix. Editing a token in Layer 1 retunes the entire theme without touching anything else.

```yaml
j-cyan: "#3FC7FF"
j-cyan-bright: "#8FE6FF"
j-cyan-deep: "#1B6E94"
j-gold: "#FFC107"
j-red: "#FF4B3E"
j-green: "#3DE08C"
j-inactive: "#5C6B78"
j-void: "#06090F"
j-surface: "#0D1422"
j-surface-raised: "#131D31"
j-line: "rgba(63, 199, 255, 0.28)"
j-line-strong: "rgba(63, 199, 255, 0.55)"
j-glow: "rgba(63, 199, 255, 0.45)"
j-glow-soft: "rgba(63, 199, 255, 0.05)"
j-fill-weak: "rgba(63, 199, 255, 0.08)"
j-fill: "rgba(63, 199, 255, 0.12)"
j-scrim: "rgba(2, 6, 12, 0.72)"
j-text: "#EAF4FF"
j-text-dim: "#9FB6C8"
j-font: "'Chakra Petch', 'Rajdhani', 'Helvetica Neue', Arial, sans-serif"
j-font-mono: "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace"
```

### Layer 2 — HA Variable Bindings

No raw colors appear in Layer 2. Every HA CSS variable is mapped to a `var(--j-*)` reference. This enforces a single source of truth: change the token, and every binding updates automatically.

Examples:
```yaml
primary-color: "var(--j-cyan)"
card-background-color: "var(--j-surface)"
warning-color: "var(--j-gold)"
error-color: "var(--j-red)"
```

---

## Full `j-*` Token Reference

| Token | Value | Role |
|---|---|---|
| `j-cyan` | `#3FC7FF` | Primary arc-reactor cyan; used for borders, icons, links |
| `j-cyan-bright` | `#8FE6FF` | Active/hover highlight; entity-on icon color |
| `j-cyan-deep` | `#1B6E94` | Muted cyan; scrollbar thumb, dark-primary binding |
| `j-gold` | `#FFC107` | Warnings and alerts only |
| `j-red` | `#FF4B3E` | Errors and critical states |
| `j-green` | `#3DE08C` | Success / on-confirmed |
| `j-inactive` | `#5C6B78` | Disabled, off, and dimmed controls |
| `j-void` | `#06090F` | Page background, sidebar background, header background |
| `j-surface` | `#0D1422` | Card surfaces — solid, no transparency |
| `j-surface-raised` | `#131D31` | Dialog/popup surfaces — solid, sits visually above cards |
| `j-line` | `rgba(63,199,255,0.28)` | Hairline card and sidebar borders |
| `j-line-strong` | `rgba(63,199,255,0.55)` | Reticle corner brackets on hover/active |
| `j-glow` | `rgba(63,199,255,0.45)` | Drop-shadow glow on icons and active cards |
| `j-glow-soft` | `rgba(63,199,255,0.05)` | Ambient arc-reactor glow mid stop |
| `j-fill-weak` | `rgba(63,199,255,0.08)` | Sidebar hover fill |
| `j-fill` | `rgba(63,199,255,0.12)` | Sidebar selected fill |
| `j-scrim` | `rgba(2,6,12,0.72)` | Backdrop behind dialogs |
| `j-text` | `#EAF4FF` | Primary text |
| `j-text-dim` | `#9FB6C8` | Secondary/dim text, sidebar inactive items |
| `j-font` | Chakra Petch stack | UI typeface for all labels and headings |
| `j-font-mono` | JetBrains Mono stack | Monospace typeface for numbers and readouts |

---

## State Model

The theme expresses a four-state interaction model through color and glow:

1. **Calm (at rest)** — Icons render in `j-cyan`. Cards have a `j-line` border and no glow. The sidebar nav items are `j-text-dim`.
2. **Hover** — Cards gain a full `j-cyan` border and a `j-glow` box-shadow. The card lifts 1px. Reticle corners brighten to `j-line-strong`.
3. **Active (entity on)** — Icons with `data-state="on"` or inside `.state-on` render in `j-cyan-bright` with a `j-glow` drop-shadow. The selected sidebar item receives a solid `j-cyan` left-accent bar and a glowing icon.
4. **Alert** — `warning-color` maps to `j-gold`; `error-color` maps to `j-red`. These colors are reserved strictly for system alerts so they carry meaning when they appear.

---

## The Four card-mod Blocks

card-mod is required. The theme activates it with `card-mod-theme: jarvis` and then provides four CSS blocks.

### `card-mod-root`

Applied to the document root. Responsible for:

- **Font loading** — Imports Chakra Petch and JetBrains Mono from Google Fonts.
- **Body base** — Sets `font-family: var(--j-font)`, `color: var(--j-text)`, `background: var(--j-void)`.
- **Ambient glow** — A single `body::before` pseudo-element renders a radial-gradient arc-reactor glow, animated by `jReactorBreath` (8s, opacity 0.55→1→0.55). This is the only resting animation in the theme.
- **Scrollbars** — Custom webkit scrollbar styling using `j-void` track and `j-cyan-deep` thumb (brightens to `j-cyan` on hover).
- **Reduced motion** — `@media (prefers-reduced-motion: reduce)` kills the ambient animation and caps all animation durations to 0.01ms.

### `card-mod-card`

Applied to every `ha-card`. Responsible for:

- **Card chrome** — Solid `j-surface` background, `j-line` border, 12px radius, layered box-shadow.
- **Reticle corners** — `ha-card::before` (top-right) and `ha-card::after` (bottom-left) render L-shaped corner brackets using `j-line-strong` borders at 60% opacity at rest.
- **Hover state** — Border shifts to `j-cyan`, box-shadow adds `j-glow`, card lifts 1px, reticle corners reach full opacity.
- **Active icon state** — Icons in `.state-on` or `ha-state-icon[data-state="on"]` render `j-cyan-bright` with a `j-glow` drop-shadow.
- **Monospace readouts** — `.value` and `.state` elements inside cards use `j-font-mono` so sensor values and climate readings are numerically legible.
- **Buttons and switches** — `mwc-button`, `ha-button`, and `ha-switch` are rebound to the `j-*` palette.

### `card-mod-sidebar`

Applied to the HA sidebar component. Responsible for:

- **Shell** — `:host` sets `sidebar-background-color: var(--j-void)` and adds a `j-line` right border.
- **Brand title** — `.menu .title` is uppercased, letter-spaced, and rendered in `j-cyan`.
- **Nav items at rest** — `paper-icon-item` uses `j-text-dim`, no background.
- **Hover** — 8% cyan fill, text shifts to `j-text`.
- **Selected item** — `a[aria-selected="true"]` gets a 12% cyan fill and a `inset 3px 0 0 0 var(--j-cyan)` left-accent bar. The icon brightens to `j-cyan-bright` with a `j-glow` drop-shadow. No gold or red is used in the sidebar.

### `card-mod-more-info`

Applied to `ha-dialog` (the "more-info" popup). Responsible for:

- **Popup surface fix** — Re-asserts `--dialog-surface-background: var(--j-surface-raised)` and `--mdc-dialog-scrim-color: var(--j-scrim)` at the dialog level. `.mdc-dialog__surface` and `ha-dialog .content` are forced to `j-surface-raised` with `!important` so the surface is fully opaque regardless of browser-level compositing.
- **Frame** — `j-line` border and 14px radius on the dialog surface.
- **Reticle corner** — `.mdc-dialog__surface::before` renders a top-right corner bracket using `j-line-strong`.
- **Dialog title** — `.mdc-dialog__title` and `.dialog-header` use `j-font`, `j-cyan` color, and 1px letter-spacing.

---

## Popup Fix — Variable Reference

The transparency bug in HA dialogs is addressed by setting these variables both in Layer 2 (global) and re-asserting them in `card-mod-more-info` (element-level):

| Variable | Value | Effect |
|---|---|---|
| `ha-dialog-surface-background` | `var(--j-surface-raised)` | Solid popup surface color |
| `ha-dialog-scrim-color` | `var(--j-scrim)` | Dimmed backdrop behind the dialog |
| `mdc-dialog-scrim-color` | `var(--j-scrim)` | MDC-level scrim binding |
| `ha-dialog-surface-position` | `fixed` | Prevents compositing bleed |
| `ha-dialog-scrim-backdrop-filter` | `blur(2px)` | Subtle blur on the scrim (corrected from `dialog-backdrop-filter`) |
| `md-dialog-container-color` | `var(--j-surface-raised)` | MD3 dialog surface color (HA 2026.x `md-dialog`) |
| `md-sys-color-surface` | `var(--j-surface-raised)` | MD3 system surface token |
| `md-sys-color-surface-container-high` | `var(--j-surface-raised)` | MD3 elevated surface container token |

The fix covers both legacy mwc/MDC dialogs (`.mdc-dialog__surface`) and HA 2026.x Material Web 3 `md-dialog`/`ha-md-dialog` components. The MD3 path uses both global CSS custom properties (`md-dialog-container-color`, `md-sys-color-surface*`) and a `::part(surface)` rule in `card-mod-more-info`.

---

## Typography

Two typefaces are loaded at runtime from Google Fonts in `card-mod-root`:

- **Chakra Petch** (weights 400, 500, 600, 700) — all UI labels, headings, sidebar text, dialog titles.
- **JetBrains Mono** (weights 400, 500) — numeric readouts in cards (`.value`, `.state`).

The font stacks (`j-font` and `j-font-mono`) include broad fallbacks so the interface remains legible if the Google Fonts request fails.

---

## Dependency

**card-mod** (HACS → Frontend) is the only required dependency. The theme sets `card-mod-theme: jarvis` to activate scoped card-mod CSS. Without card-mod installed and loaded, the `card-mod-root`, `card-mod-card`, `card-mod-sidebar`, and `card-mod-more-info` blocks are silently ignored, leaving fonts unloaded, cards without corner chrome, and popups using the default HA surface rendering.

---

## Future: `jarvis:` Icon Set

A `jarvis:` icon prefix is planned as a future optional phase. It will use the `window.customIconsets` API and be shipped as a separate Lovelace resource — not bundled in `jarvis.yaml`. Users who prefer MDI icons will not be affected. The icon set does not exist yet.
