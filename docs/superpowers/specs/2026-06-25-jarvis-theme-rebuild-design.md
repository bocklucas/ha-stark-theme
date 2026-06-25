# JARVIS Home Assistant Theme — Rebuild Design

**Date:** 2026-06-25
**Branch:** `jarvis-theme-rebuild` (local only — do not push)
**Scope:** Theme-only. Single dark theme. Built for Home Assistant 2026.x.

## Goal

Rebuild the abandoned Iron Man / JARVIS theme as one focused, polished, *readable*
dark theme that evokes the film HUD without sacrificing day-to-day usability. The
previous attempt looked striking in screenshots but failed in real use — most
notably, pop-up panels were transparent and bled through to the layers beneath,
making them hard to read. Fixing that layering problem is the centerpiece of this
rebuild.

## Design decisions (settled during brainstorming)

| Decision | Choice |
|---|---|
| Target | Home Assistant 2026.x (modern variable system + new dialog component) |
| Scope | Theme only |
| Aesthetic | "Instrument" — disciplined baseline that lights up on active state |
| Primary color identity | JARVIS Classic Cyan (arc-reactor cyan, gold for alerts only) |
| Typography | Chakra Petch throughout; JetBrains Mono for numeric readouts |
| Variants | JARVIS only (no Stark/FRIDAY variants) |
| Motion | Subtle ambient — calm at rest, active-state lighting, one faint background layer |
| Modes | Dark only |
| Icons | Out of scope now; documented as a future phase (see Future Work) |

## Core principle: spectacle follows state

The theme is **calm and legible at rest**, and only "lights up" toward the cinematic
HUD look when something is *actually* happening — a light is on, an alarm is armed, a
sensor is alerting. This mirrors how the real HUD stays dark and empty until JARVIS
surfaces something relevant, and it directly solves the "too busy to read" problem.

States, in order of visual intensity:
- **Rest** — solid dark surface, hairline cyan accents, no glow.
- **Hover/focus** — border brightens, contained outer glow fades in, 1px lift.
- **Active** (entity on) — accent line + icon ramp to full cyan with gentle glow.
- **Alert** (unavailable / alarm / error) — gold or red takes over the accent.

## Architecture: two-layer token system

A theme is a layered set of CSS-variable overrides plus four card-mod CSS blocks. The
discipline that keeps it maintainable — and was missing before — is a strict
two-layer separation:

**Layer 1 — Design tokens (private).** The *only* place raw hex/rgba values live:
- Color: `--j-cyan`, `--j-cyan-dim`, `--j-cyan-bright`, `--j-gold`, `--j-red`
- Surfaces: `--j-void` (page/chrome), `--j-surface` (cards), `--j-surface-raised`
  (dialogs), `--j-line` (hairline borders), `--j-glow`
- Type: `--j-font` (Chakra Petch stack), `--j-font-mono` (JetBrains Mono stack)
- Text: `--j-text`, `--j-text-dim`

**Layer 2 — HA bindings.** Every official HA variable is set to a `var(--j-…)`
token. No raw colors in this layer. Retuning the whole theme = editing ~12 tokens.

Why it matters: the old theme sprinkled `rgba(...)` literals across ~700 lines, so
surfaces drifted out of sync and nothing was tunable.

## The popup / layering fix (centerpiece)

**Root cause:** the old theme applied glassmorphism (`backdrop-filter: blur` +
translucent `rgba` backgrounds) to *everything*, including stacked dialogs, and never
set the dialog surface variables. Stacked translucent layers let you see through to
whatever is beneath.

**Rule:** translucency is allowed *only* against the static page background. Anything
that stacks (dialogs, popups, menus) gets a **solid** surface.

Concretely:
- Cards: solid `--j-surface`, **no** `backdrop-filter`.
- Dialogs / more-info popups — explicitly set the modern 2026 variables the old theme
  never touched:
  - `--ha-dialog-surface-background: var(--j-surface-raised)` (solid; slightly
    lighter than cards so a popup clearly reads as "above")
  - `--ha-card-background` / `--card-background-color` kept consistent inside dialogs
  - `--mdc-dialog-scrim-color: rgba(2,6,12,0.72)` + a slight
    `--ha-dialog-scrim-backdrop-filter: blur(2px)` so the dashboard dims and recedes
    behind a popup instead of bleeding through
- A `card-mod-more-info` block applies the JARVIS framing (hairline cyan border,
  reticle corners) on the *solid* surface.

Expected result: popups are opaque, clearly layered above a dimmed dashboard, and
fully readable.

## Component treatments

**Cards (`card-mod-card`).** Solid `--j-surface`; 1px `--j-line` border; reticle
corner brackets (top-right + bottom-left via `::before`/`::after`); soft drop shadow;
no rest glow. Hover/active/alert per the state model above. Numeric values render in
`--j-font-mono`.

**Chrome (`card-mod-sidebar` + header).** Header and sidebar use solid `--j-void`
with a hairline cyan edge. Selected sidebar item: cyan left-accent + subtle fill +
glowing cyan icon. **The old red sidebar gradient is removed** — it was a bug, not a
look.

**Controls.** Toggles/switches/sliders: cyan track when on, gold knob accent,
clearly readable off-states. Buttons: hairline cyan outline, fill + contained glow on
hover. Inputs: solid fill, cyan focus.

**Motion (`card-mod-root`).** Three tiers, all gated behind
`prefers-reduced-motion: reduce`:
- *Ambient:* a single, very slow, very faint radial "arc-reactor" breathing glow
  behind everything (low opacity). Replaces the old stacked drifting-grid + 240s
  rotating-conic layers — one quiet layer, not three.
- *Active:* soft pulse only on genuinely-active status dots/icons.
- *Interaction:* 0.2–0.3s ease on hover/focus. No per-card scanlines.

**Typography.** Chakra Petch (headings + body) and JetBrains Mono (numbers) via Google
Fonts `@import` in `card-mod-root`. Body text avoids all-caps; small labels may use
restrained letter-spacing.

## Compatibility

- Built against modern HA 2026.x variable names first.
- A *small* compatibility shim only for the handful of still-read legacy variables —
  not the large `paper-*` wall the old theme carried.
- **card-mod** (HACS) is the one required dependency; documented in README.
- Fonts loaded via Google Fonts `@import`.

## Files

**Rewritten / added:**
- `themes/jarvis.yaml` — rewritten from scratch on the token system above.
- `README.md` — install (HACS + manual), card-mod dependency, screenshots, the
  state model, future icon phase.
- `hacs.json` — verified for a theme repo.
- `docs/` — refreshed theme documentation (replacing the stale
  `JARVIS_THEME_DOCUMENTATION.md` content as needed).

**Removed:**
- `themes/stark.yaml` — variant dropped.
- `icons/jarvis-icons.js`, `icons/jarvis-icon-alias.js` — broken (dead iconset API +
  shadow-DOM-blind auto-alias). Removed so nothing misleads the future icon phase.
- `assets/background.jpg` — only if unused by the new gradient-based background
  (confirm before deleting).

## Out of scope / future work

**JARVIS icon set (future phase).** Technically straightforward but real *drawing*
work. When done, it should:
- Register via the supported `window.customIconsets["jarvis"] = async (name) => ({ path, viewBox })`
  API — **not** the dead `ha-iconset-svg` element approach.
- Ship a curated, hand-drawn thin-line HUD set (~15–20 icons) used opt-in as
  `jarvis:<name>` where HUD flair is wanted (room headers, nav, key controls).
- **No** global `mdi:` → `jarvis:` auto-alias — it's shadow-DOM-blind, fights HA's
  rendering, and is a performance/breakage risk.
- Ship as a separate optional Lovelace resource so it physically cannot break the
  theme.

Also out of scope: example dashboards, custom cards, light mode, additional color
variants (Stark blue/gold, FRIDAY amber).

## Testing / verification

Theme correctness is visual and can't be unit-tested. Verification plan:
- YAML lint passes (`.yamllint` already in repo).
- Manual load in a live HA 2026.x instance: dashboard at rest, hover, an active
  light, an alert/unavailable entity, and — critically — an entity **more-info popup**
  to confirm it is opaque and readable over a dimmed dashboard.
- Spot-check `prefers-reduced-motion` disables ambient/active motion.
- Confirm no orphaned references to removed `stark`/icon assets.
