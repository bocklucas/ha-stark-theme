# JARVIS

JARVIS — an Iron Man HUD-inspired dark theme for Home Assistant.

---

## Requirements

- Home Assistant 2026.x or later
- [card-mod](https://github.com/thomasloven/lovelace-card-mod) installed via HACS — **required**. The theme uses card-mod blocks to inject fonts, card chrome, sidebar chrome, and dialog styling. The theme will not render correctly without it.

---

## Install via HACS

1. Open HACS in Home Assistant and go to **Frontend**.
2. Click the three-dot menu in the top right and choose **Custom repositories**.
3. Add this repository URL and set the category to **Theme**.
4. Find "JARVIS" in the list and click **Download**.
5. Add the following to your `configuration.yaml` if it is not already there:
   ```yaml
   frontend:
     themes: !include_dir_merge_named themes
   ```
6. Restart Home Assistant.
7. Go to your profile (bottom-left avatar) and select **JARVIS** from the theme dropdown.

---

## Install Manually

1. Copy `themes/jarvis.yaml` to `<config>/themes/jarvis.yaml` (create the `themes/` directory if it does not exist).
2. Add the following to your `configuration.yaml` if it is not already there:
   ```yaml
   frontend:
     themes: !include_dir_merge_named themes
   ```
3. Restart Home Assistant.
4. Go to your profile (bottom-left avatar) and select **JARVIS** from the theme dropdown.

---

## Design Notes

JARVIS follows an "Instrument" philosophy: the interface is calm and dark at rest, activating precisely when something demands attention.

- **Calm at rest.** Cards sit on a solid `#0D1422` surface with faint cyan hairline borders. A single slow arc-reactor glow breathes in the background — no scan lines, no animated grids, nothing that competes with your data.
- **Hover.** Cards lift slightly and their border intensifies to the full cyan (`#3FC7FF`). Reticle corner brackets (top-right and bottom-left) brighten.
- **Active (entity on).** Entity icons light up to bright cyan (`#8FE6FF`) with a contained drop-shadow glow, making it instantly clear what is on vs. off.
- **Alert.** Warnings use gold (`#FFC107`); errors and criticals use red (`#FF4B3E`). These colors appear only when they mean something.
- **Sidebar.** The selected nav item gets a solid cyan left-accent bar and an icon glow. Nothing else in the sidebar competes.
- **Popups are solid and readable.** Dialogs render on a raised solid surface (`#131D31`) rather than a semi-transparent one, eliminating the bleed-through transparency bug present in many HA themes. A dimmed scrim sits behind them.

Fonts: **Chakra Petch** for all UI text; **JetBrains Mono** for numeric readouts (sensor values, climate temperatures). Both are loaded from Google Fonts at runtime.

---

## Customizing with `j-*` Tokens

The theme is built on a two-layer token system. **Layer 1** is a set of `j-*` design tokens at the top of `themes/jarvis.yaml` — these are the only place raw color values live. **Layer 2** maps those tokens to every Home Assistant CSS variable.

To retune the whole theme, edit the `j-*` values in Layer 1 and restart. Nothing else needs to change.

Key tokens:

| Token | Default | Purpose |
|---|---|---|
| `j-cyan` | `#3FC7FF` | Primary arc-reactor cyan |
| `j-cyan-bright` | `#8FE6FF` | Active/hover highlights |
| `j-cyan-deep` | `#1B6E94` | Muted cyan, scrollbar thumb |
| `j-gold` | `#FFC107` | Warnings and alerts |
| `j-red` | `#FF4B3E` | Errors and critical states |
| `j-green` | `#3DE08C` | Success / on-confirmed |
| `j-inactive` | `#5C6B78` | Disabled / off states |
| `j-void` | `#06090F` | Page and chrome background |
| `j-surface` | `#0D1422` | Card surfaces (solid) |
| `j-surface-raised` | `#131D31` | Dialog/popup surfaces (solid) |
| `j-text` | `#EAF4FF` | Primary text |
| `j-text-dim` | `#9FB6C8` | Secondary / dim text |
| `j-font` | Chakra Petch stack | UI typeface |
| `j-font-mono` | JetBrains Mono stack | Numbers / readouts |

---

## Roadmap

**Optional `jarvis:` icon set (future phase).** A separate opt-in resource will provide a `jarvis:` icon prefix using the `window.customIconsets` API. It will be shipped as an optional Lovelace resource — not bundled with the theme file — so it does not affect users who prefer MDI icons. This is not available yet.

---

*"Sometimes you gotta run before you can walk."* — Tony Stark
