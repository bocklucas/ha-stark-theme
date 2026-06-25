# JARVIS Theme Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the abandoned Iron Man / JARVIS Home Assistant theme as a single, polished, readable dark theme for HA 2026.x, fixing the transparent-popup bug that made the old one unusable.

**Architecture:** One `themes/jarvis.yaml` built on a strict two-layer CSS-variable system — private design tokens (the only place raw colors live) bound to official HA variables. Card-mod blocks (`card-mod-root`, `card-mod-card`, `card-mod-sidebar`, `card-mod-more-info`) apply the "Instrument" HUD look that stays calm at rest and lights up on active state. Stacked surfaces (dialogs) are solid; translucency is only ever used against the static page background.

**Tech Stack:** Home Assistant 2026.x theme YAML, card-mod (HACS), CSS, Google Fonts (Chakra Petch + JetBrains Mono). Verification via `yamllint` + a PyYAML structure assertion; visual checks are manual.

**Design reference:** `docs/superpowers/specs/2026-06-25-jarvis-theme-rebuild-design.md`

**Branch:** `jarvis-theme-rebuild` (local only — do NOT push).

---

## Verification setup (do once before Task 1)

`yamllint` is in `requirements.txt` but may not be installed. Install it:

```bash
pip install yamllint==1.35.1
```

If `pip` is unavailable, the PyYAML parse assertions in each task (using `python3 -c "import yaml..."`) are sufficient as the automated gate; note yamllint as skipped in that case.

---

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `themes/jarvis.yaml` | The entire theme: token layer, HA bindings, 4 card-mod blocks | Rewrite from scratch |
| `themes/stark.yaml` | Old variant | Delete |
| `icons/jarvis-icons.js` | Broken iconset (dead API) | Delete |
| `icons/jarvis-icon-alias.js` | Broken auto-alias | Delete |
| `.yamllint` | Lint config, currently scoped to stark.yaml | Repoint to jarvis.yaml |
| `README.md` | Install, dependency, state model, future icons | Rewrite |
| `JARVIS_THEME_DOCUMENTATION.md` | Theme reference | Refresh |
| `hacs.json` | HACS theme metadata | Verify |
| `assets/background.jpg` | Unused background image | Delete only if unreferenced |

Tasks 2–6 all edit the single file `themes/jarvis.yaml`, building it up section by section. They are sequential (not parallel) because they touch the same file.

---

## Task 1: Cleanup — remove old variant, broken icons, repoint lint

**Files:**
- Delete: `themes/stark.yaml`, `icons/jarvis-icons.js`, `icons/jarvis-icon-alias.js`
- Modify: `.yamllint`
- Check: `assets/background.jpg`, `hacs.json`

- [ ] **Step 1: Confirm the background image is unreferenced**

Run:
```bash
grep -rn "background.jpg" --include="*.yaml" --include="*.md" --include="*.json" . | grep -v docs/superpowers
```
Expected: no matches outside the spec/plan. If no matches, delete it in Step 2. If there are matches, leave `assets/background.jpg` in place and note it.

- [ ] **Step 2: Delete obsolete files**

```bash
git rm themes/stark.yaml icons/jarvis-icons.js icons/jarvis-icon-alias.js
# only if Step 1 found no references:
git rm assets/background.jpg
# remove icons dir if now empty:
rmdir icons 2>/dev/null || true
```

- [ ] **Step 3: Repoint `.yamllint` to the jarvis theme**

In `.yamllint`, change the `yaml-files` block from:
```yaml
yaml-files:
  - "themes/stark.yaml"
```
to:
```yaml
yaml-files:
  - "themes/jarvis.yaml"
```

- [ ] **Step 4: Verify `hacs.json` is valid theme metadata**

Read `hacs.json`. It must contain a `name`. The current content `{ "name": "Stark" }` should become:
```json
{
  "name": "JARVIS",
  "content_in_root": false,
  "filename": "jarvis.yaml",
  "render_readme": true
}
```
Write that to `hacs.json`.

- [ ] **Step 5: Verify removals and JSON validity**

Run:
```bash
test ! -f themes/stark.yaml && test ! -f icons/jarvis-icons.js && echo "removed ok"
python3 -c "import json; json.load(open('hacs.json')); print('hacs.json valid')"
```
Expected: `removed ok` and `hacs.json valid`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Remove stark variant and broken icon JS; repoint lint and hacs.json to jarvis"
```

---

## Task 2: Token layer + HA variable bindings

Create the new `themes/jarvis.yaml` with **only** the variable layers (no card-mod blocks yet). Layer 1 = private design tokens (the only place raw colors live). Layer 2 = official HA variables bound to those tokens, including the dialog-surface variables that fix the popup bug.

**Files:**
- Create: `themes/jarvis.yaml`

- [ ] **Step 1: Write the token + bindings layer**

Write this exact content to `themes/jarvis.yaml`:

```yaml
jarvis:
  # ============================================================
  # LAYER 1 — DESIGN TOKENS (the ONLY place raw colors live)
  # Retune the whole theme by editing these.
  # ============================================================
  # Cyan identity
  j-cyan: "#3FC7FF"          # primary arc-reactor cyan
  j-cyan-bright: "#8FE6FF"   # active/hover highlight
  j-cyan-deep: "#1B6E94"     # muted cyan for dim accents
  # Accent / status
  j-gold: "#FFC107"          # alerts / warnings only
  j-red: "#FF4B3E"           # errors / critical
  j-green: "#3DE08C"         # success / on-confirmed
  j-inactive: "#5C6B78"      # disabled / off
  # Surfaces (darkest -> raised)
  j-void: "#06090F"          # page + chrome background
  j-surface: "#0D1422"       # cards (SOLID)
  j-surface-raised: "#131D31" # dialogs/popups (SOLID, sits "above" cards)
  # Lines / glow
  j-line: "rgba(63, 199, 255, 0.28)"      # hairline borders
  j-line-strong: "rgba(63, 199, 255, 0.55)"
  j-glow: "rgba(63, 199, 255, 0.45)"
  j-scrim: "rgba(2, 6, 12, 0.72)"         # behind dialogs
  # Text
  j-text: "#EAF4FF"
  j-text-dim: "#9FB6C8"
  # Type
  j-font: "'Chakra Petch', 'Rajdhani', 'Helvetica Neue', Arial, sans-serif"
  j-font-mono: "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace"

  # ============================================================
  # LAYER 2 — HA VARIABLE BINDINGS (no raw colors below this line)
  # ============================================================
  # Core
  primary-color: "var(--j-cyan)"
  accent-color: "var(--j-cyan)"
  dark-primary-color: "var(--j-cyan-deep)"
  light-primary-color: "var(--j-cyan-bright)"
  primary-background-color: "var(--j-void)"
  secondary-background-color: "var(--j-surface)"
  divider-color: "var(--j-line)"
  disabled-color: "var(--j-inactive)"
  scrollbar-thumb-color: "var(--j-cyan-deep)"

  # Text
  primary-text-color: "var(--j-text)"
  secondary-text-color: "var(--j-text-dim)"
  text-primary-color: "var(--j-text)"
  disabled-text-color: "var(--j-inactive)"

  # Cards (SOLID surface)
  card-background-color: "var(--j-surface)"
  ha-card-background: "var(--j-surface)"
  ha-card-border-radius: "12px"
  ha-card-border-width: "1px"
  ha-card-border-color: "var(--j-line)"

  # Dialogs / popups — THE POPUP FIX (solid surface + dimmed scrim)
  ha-dialog-surface-background: "var(--j-surface-raised)"
  ha-dialog-scrim-color: "var(--j-scrim)"
  mdc-dialog-scrim-color: "var(--j-scrim)"
  ha-dialog-surface-position: "fixed"
  dialog-backdrop-filter: "blur(2px)"

  # Status / state
  state-icon-color: "var(--j-cyan)"
  state-icon-active-color: "var(--j-cyan-bright)"
  state-active-color: "var(--j-cyan-bright)"
  paper-item-icon-active-color: "var(--j-cyan-bright)"
  paper-item-icon-color: "var(--j-cyan)"
  success-color: "var(--j-green)"
  warning-color: "var(--j-gold)"
  error-color: "var(--j-red)"
  info-color: "var(--j-cyan)"

  # Sidebar
  sidebar-background-color: "var(--j-void)"
  sidebar-icon-color: "var(--j-text-dim)"
  sidebar-text-color: "var(--j-text-dim)"
  sidebar-selected-icon-color: "var(--j-cyan-bright)"
  sidebar-selected-text-color: "var(--j-text)"

  # Header
  app-header-background-color: "var(--j-void)"
  app-header-text-color: "var(--j-text)"
  app-header-selection-bar-color: "var(--j-cyan)"

  # Toggles / switches / sliders
  switch-checked-color: "var(--j-cyan)"
  switch-checked-button-color: "var(--j-cyan-bright)"
  switch-checked-track-color: "var(--j-cyan-deep)"
  switch-unchecked-button-color: "var(--j-inactive)"
  switch-unchecked-track-color: "var(--j-surface)"
  paper-slider-active-color: "var(--j-cyan)"
  paper-slider-knob-color: "var(--j-cyan-bright)"
  paper-slider-pin-color: "var(--j-cyan)"
  slider-color: "var(--j-cyan)"
  slider-track-color: "var(--j-surface)"

  # Inputs
  input-fill-color: "var(--j-surface)"
  input-ink-color: "var(--j-text)"
  input-label-ink-color: "var(--j-text-dim)"
  input-idle-line-color: "var(--j-line)"
  input-hover-line-color: "var(--j-cyan)"
  mdc-text-field-fill-color: "var(--j-surface)"
  mdc-text-field-ink-color: "var(--j-text)"
  mdc-select-fill-color: "var(--j-surface)"

  # Material theme glue
  mdc-theme-primary: "var(--j-cyan)"
  mdc-theme-secondary: "var(--j-gold)"
  mdc-theme-surface: "var(--j-surface)"
  mdc-theme-background: "var(--j-void)"
  mdc-theme-on-surface: "var(--j-text)"
  mdc-theme-on-primary: "var(--j-void)"

  # Typography binding
  paper-font-common-base_-_font-family: "var(--j-font)"
  paper-font-body1_-_font-family: "var(--j-font)"
  paper-font-headline_-_font-family: "var(--j-font)"
  paper-font-title_-_font-family: "var(--j-font)"
  ha-font-family-body: "var(--j-font)"
  ha-font-family-heading: "var(--j-font)"

  # card-mod activation
  card-mod-theme: jarvis
```

- [ ] **Step 2: Verify it parses and contains the popup-fix keys**

Run:
```bash
python3 -c "import yaml; t=yaml.safe_load(open('themes/jarvis.yaml')); j=t['jarvis']; assert j['ha-dialog-surface-background']=='var(--j-surface-raised)'; assert j['card-mod-theme']=='jarvis'; assert j['j-cyan']=='#3FC7FF'; print('structure ok:', len(j), 'keys')"
```
Expected: `structure ok: <N> keys` (N ≈ 80+), no AssertionError.

- [ ] **Step 3: Lint**

Run:
```bash
yamllint themes/jarvis.yaml || echo "yamllint unavailable — relying on PyYAML parse above"
```
Expected: no errors (or the fallback message).

- [ ] **Step 4: Commit**

```bash
git add themes/jarvis.yaml
git commit -m "Add JARVIS theme token layer and HA variable bindings (incl. popup-fix dialog vars)"
```

---

## Task 3: card-mod-root — fonts, ambient background, scrollbar, reduced-motion

Append the `card-mod-root` block (page-level styling) to `themes/jarvis.yaml`. This holds the Google Fonts import, the single faint ambient "arc-reactor" background glow, scrollbar styling, and the `prefers-reduced-motion` guard.

**Files:**
- Modify: `themes/jarvis.yaml`

- [ ] **Step 1: Append the `card-mod-root` block**

Add this at the end of the `jarvis:` map (note: 2-space indent under `jarvis:`, block scalar):

```yaml
  card-mod-root: |
    @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

    /* Page base */
    body {
      font-family: var(--j-font);
      color: var(--j-text);
      background: var(--j-void);
    }

    /* Single faint ambient arc-reactor glow — the only resting animation */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background: radial-gradient(circle at 50% 32%,
        rgba(63, 199, 255, 0.08) 0%,
        rgba(63, 199, 255, 0.03) 30%,
        transparent 62%);
      animation: jReactorBreath 8s ease-in-out infinite;
      will-change: opacity;
    }

    @keyframes jReactorBreath {
      0%, 100% { opacity: 0.55; }
      50%      { opacity: 1; }
    }

    /* Scrollbars */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: var(--j-void); }
    ::-webkit-scrollbar-thumb {
      background: var(--j-cyan-deep);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover { background: var(--j-cyan); }

    /* Accessibility: kill all motion when requested */
    @media (prefers-reduced-motion: reduce) {
      body::before { animation: none !important; }
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
```

- [ ] **Step 2: Verify the block parses as a string**

Run:
```bash
python3 -c "import yaml; j=yaml.safe_load(open('themes/jarvis.yaml'))['jarvis']; assert 'card-mod-root' in j; assert 'Chakra+Petch' in j['card-mod-root']; assert 'prefers-reduced-motion' in j['card-mod-root']; print('root block ok')"
```
Expected: `root block ok`.

- [ ] **Step 3: Lint**

Run: `yamllint themes/jarvis.yaml || echo "yamllint unavailable"`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add themes/jarvis.yaml
git commit -m "Add card-mod-root: fonts, ambient reactor glow, scrollbar, reduced-motion"
```

---

## Task 4: card-mod-card — surfaces, reticle corners, state model, controls

Append the `card-mod-card` block. This is the core "Instrument" look: solid card surface, hairline border, reticle corner brackets, and the rest → hover → active → alert state ladder. Also styles buttons, switches, and inputs that render inside cards.

**Files:**
- Modify: `themes/jarvis.yaml`

- [ ] **Step 1: Append the `card-mod-card` block**

```yaml
  card-mod-card: |
    /* Card base — SOLID surface, no backdrop-filter (popup-bug discipline) */
    ha-card {
      position: relative;
      border-radius: 12px;
      border: 1px solid var(--j-line);
      background: var(--j-surface);
      color: var(--j-text);
      font-family: var(--j-font);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
      transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
      overflow: hidden;
    }

    /* Reticle corner brackets (top-right + bottom-left) */
    ha-card::before,
    ha-card::after {
      content: '';
      position: absolute;
      width: 14px;
      height: 14px;
      pointer-events: none;
      opacity: 0.6;
      transition: opacity 0.25s ease, border-color 0.25s ease;
    }
    ha-card::before {
      top: 8px; right: 8px;
      border-top: 1.5px solid var(--j-line-strong);
      border-right: 1.5px solid var(--j-line-strong);
    }
    ha-card::after {
      bottom: 8px; left: 8px;
      border-bottom: 1.5px solid var(--j-line-strong);
      border-left: 1.5px solid var(--j-line-strong);
    }

    /* Hover — contained glow + lift */
    ha-card:hover {
      border-color: var(--j-cyan);
      box-shadow: 0 8px 22px rgba(0, 0, 0, 0.5), 0 0 18px var(--j-glow);
      transform: translateY(-1px);
    }
    ha-card:hover::before,
    ha-card:hover::after { opacity: 1; border-color: var(--j-cyan); }

    /* Active state — when an entity is on, its icon ramps to bright cyan + glow */
    ha-card .state-on ha-icon,
    ha-card [data-domain] ha-state-icon[data-state="on"],
    ha-card ha-icon[data-state="on"] {
      color: var(--j-cyan-bright);
      filter: drop-shadow(0 0 5px var(--j-glow));
    }

    /* Numeric readouts in monospace (sensor/climate values) */
    ha-card .value,
    ha-card .state,
    ha-card .secondary .value {
      font-family: var(--j-font-mono);
      letter-spacing: 0.5px;
    }

    /* Buttons */
    mwc-button, ha-button {
      --mdc-typography-button-font-family: var(--j-font);
      --mdc-theme-primary: var(--j-cyan);
      border-radius: 6px;
    }

    /* Switches inside cards */
    ha-switch {
      --switch-checked-color: var(--j-cyan);
      --switch-checked-button-color: var(--j-cyan-bright);
    }

    /* Inputs inside cards */
    ha-textfield, ha-select {
      --mdc-text-field-fill-color: var(--j-surface);
      --mdc-text-field-ink-color: var(--j-text);
      --mdc-text-field-label-ink-color: var(--j-text-dim);
    }
```

- [ ] **Step 2: Verify the block parses**

Run:
```bash
python3 -c "import yaml; j=yaml.safe_load(open('themes/jarvis.yaml'))['jarvis']; c=j['card-mod-card']; assert 'ha-card::before' in c; assert 'j-font-mono' in c; assert 'backdrop-filter' not in c, 'cards must NOT use backdrop-filter'; print('card block ok')"
```
Expected: `card block ok` (the assertion also guards the popup-bug discipline: no backdrop-filter on cards).

- [ ] **Step 3: Lint**

Run: `yamllint themes/jarvis.yaml || echo "yamllint unavailable"`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add themes/jarvis.yaml
git commit -m "Add card-mod-card: instrument surfaces, reticle corners, state model, controls"
```

---

## Task 5: card-mod-sidebar — chrome, selected accent, icon glow

Append the `card-mod-sidebar` block: solid void background, hairline cyan right edge, a cyan left-accent on the selected item (replacing the old red gradient), and selected-icon glow.

**Files:**
- Modify: `themes/jarvis.yaml`

- [ ] **Step 1: Append the `card-mod-sidebar` block**

```yaml
  card-mod-sidebar: |
    /* Sidebar shell */
    :host {
      --sidebar-background-color: var(--j-void);
      border-right: 1px solid var(--j-line);
    }

    /* Brand title */
    .menu .title {
      color: var(--j-cyan);
      font-family: var(--j-font);
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    /* Nav items — calm at rest */
    paper-icon-item {
      border-radius: 8px;
      margin: 3px 8px;
      color: var(--j-text-dim);
      transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
    }

    /* Hover */
    paper-icon-item:hover {
      background: rgba(63, 199, 255, 0.08);
      color: var(--j-text);
    }

    /* Selected — cyan left accent + subtle fill (NO red gradient) */
    a[aria-selected="true"] paper-icon-item {
      background: rgba(63, 199, 255, 0.12);
      color: var(--j-text);
      box-shadow: inset 3px 0 0 0 var(--j-cyan);
    }
    a[aria-selected="true"] paper-icon-item ha-icon {
      color: var(--j-cyan-bright);
      filter: drop-shadow(0 0 5px var(--j-glow));
    }

    /* Header icons */
    .menu ha-icon-button { color: var(--j-text-dim); }
    .menu ha-icon-button:hover { color: var(--j-cyan); }
```

- [ ] **Step 2: Verify the block parses and the red gradient is gone**

Run:
```bash
python3 -c "import yaml; j=yaml.safe_load(open('themes/jarvis.yaml'))['jarvis']; s=j['card-mod-sidebar']; assert 'aria-selected' in s; assert '244, 67, 54' not in s and 'red' not in s.lower(), 'no red sidebar'; print('sidebar block ok')"
```
Expected: `sidebar block ok`.

- [ ] **Step 3: Lint**

Run: `yamllint themes/jarvis.yaml || echo "yamllint unavailable"`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add themes/jarvis.yaml
git commit -m "Add card-mod-sidebar: solid chrome, cyan selected accent, icon glow"
```

---

## Task 6: card-mod-more-info — the popup framing on solid surface

Append the `card-mod-more-info` block. The dialog *surface* is already solid via the Task 2 bindings; this adds the JARVIS framing (hairline border, reticle corners) on top of that solid surface, and explicitly re-asserts the solid background as a belt-and-suspenders guard.

**Files:**
- Modify: `themes/jarvis.yaml`

- [ ] **Step 1: Append the `card-mod-more-info` block**

```yaml
  card-mod-more-info: |
    /* Dialog surface — SOLID and framed (re-asserts the popup fix) */
    ha-dialog {
      --dialog-surface-background: var(--j-surface-raised);
      --mdc-dialog-scrim-color: var(--j-scrim);
    }
    .mdc-dialog__surface,
    ha-dialog .content {
      background: var(--j-surface-raised) !important;
      border: 1px solid var(--j-line);
      border-radius: 14px;
      color: var(--j-text);
      position: relative;
    }

    /* Reticle corner on the dialog */
    .mdc-dialog__surface::before {
      content: '';
      position: absolute;
      top: 10px; right: 10px;
      width: 16px; height: 16px;
      border-top: 1.5px solid var(--j-line-strong);
      border-right: 1.5px solid var(--j-line-strong);
      opacity: 0.7;
      pointer-events: none;
    }

    /* Dialog title */
    .mdc-dialog__title, .dialog-header {
      font-family: var(--j-font);
      color: var(--j-cyan);
      letter-spacing: 1px;
    }
```

- [ ] **Step 2: Verify the block parses and asserts a solid surface**

Run:
```bash
python3 -c "import yaml; j=yaml.safe_load(open('themes/jarvis.yaml'))['jarvis']; m=j['card-mod-more-info']; assert 'surface-raised' in m; assert 'background: var(--j-surface-raised) !important' in m; print('more-info block ok')"
```
Expected: `more-info block ok`.

- [ ] **Step 3: Full-file lint + parse**

Run:
```bash
yamllint themes/jarvis.yaml || echo "yamllint unavailable"
python3 -c "import yaml; j=yaml.safe_load(open('themes/jarvis.yaml'))['jarvis']; need=['card-mod-root','card-mod-card','card-mod-sidebar','card-mod-more-info','ha-dialog-surface-background']; [j[k] for k in need]; print('all blocks present')"
```
Expected: no lint errors and `all blocks present`.

- [ ] **Step 4: Commit**

```bash
git add themes/jarvis.yaml
git commit -m "Add card-mod-more-info: solid framed popups (completes the layering fix)"
```

---

## Task 7: README + docs rewrite

Rewrite the user-facing docs to match the rebuilt theme: install steps, the card-mod dependency, the state model, and the future icon phase. Refresh `JARVIS_THEME_DOCUMENTATION.md`.

**Files:**
- Modify: `README.md`, `JARVIS_THEME_DOCUMENTATION.md`

- [ ] **Step 1: Rewrite `README.md`**

Write a `README.md` containing these sections (use real prose, not placeholders):
- **Title + one-line description**: "JARVIS — an Iron Man HUD-inspired dark theme for Home Assistant."
- **Requirements**: HA 2026.x; [card-mod](https://github.com/thomasloven/lovelace-card-mod) installed via HACS (required — the theme uses card-mod blocks).
- **Install (HACS)**: add as a custom theme repository, download, then set `frontend:` themes dir and select **JARVIS** in profile.
- **Install (manual)**: copy `themes/jarvis.yaml` to `<config>/themes/`, ensure `frontend: themes: !include_dir_merge_named themes` in `configuration.yaml`, restart, select JARVIS.
- **Design notes**: the "Instrument" philosophy — calm at rest, lights up on active state; cyan primary, gold for alerts; popups are solid and readable.
- **Customizing**: edit the Layer-1 `j-*` tokens at the top of `jarvis.yaml` to retune the whole theme.
- **Roadmap**: optional JARVIS `jarvis:` icon set (future) — will use the `window.customIconsets` API, opt-in usage, shipped as a separate optional resource.

- [ ] **Step 2: Refresh `JARVIS_THEME_DOCUMENTATION.md`**

Replace stale content so it documents: the two-layer token system, the full token list (mirror the `j-*` names from Task 2), the four card-mod blocks and what each does, the state model, and the popup-fix variables. Remove any references to `stark.yaml`, the old icon JS, Orbitron, or the removed background image.

- [ ] **Step 3: Verify no stale references remain**

Run:
```bash
grep -rniE "stark\.yaml|jarvis-icons\.js|orbitron|ha-iconset-svg" README.md JARVIS_THEME_DOCUMENTATION.md && echo "STALE REFS FOUND — fix them" || echo "docs clean"
```
Expected: `docs clean`.

- [ ] **Step 4: Commit**

```bash
git add README.md JARVIS_THEME_DOCUMENTATION.md
git commit -m "Rewrite README and theme docs for the rebuilt JARVIS theme"
```

---

## Task 8: Final verification pass

A whole-repo sanity sweep: lint, parse, no orphaned references, and a manual visual checklist for the human.

**Files:** none modified (verification only)

- [ ] **Step 1: Repo-wide orphan check**

Run:
```bash
grep -rniE "stark|jarvis-icons|jarvis-icon-alias|orbitron|rajdhani" --include="*.yaml" --include="*.json" --include="*.md" . | grep -v docs/superpowers
```
Expected: no matches (Rajdhani is allowed only as a font *fallback* inside `j-font` in `jarvis.yaml` — if that line appears, it's fine; anything else is an orphan to fix).

- [ ] **Step 2: Final lint + structure assertion**

Run:
```bash
yamllint themes/jarvis.yaml || echo "yamllint unavailable"
python3 -c "import yaml; j=yaml.safe_load(open('themes/jarvis.yaml'))['jarvis']; assert j['card-mod-theme']=='jarvis'; assert 'backdrop-filter' not in j['card-mod-card']; assert j['ha-dialog-surface-background']=='var(--j-surface-raised)'; print('final structure ok')"
```
Expected: `final structure ok`.

- [ ] **Step 3: Manual visual verification (human, in a live HA 2026.x instance)**

This cannot be automated. Load the theme and confirm:
- [ ] Dashboard at rest: dark, calm, readable; faint reactor glow visible but subtle.
- [ ] Hover a card: border brightens, reticle corners light, gentle glow, slight lift.
- [ ] Turn on a light: that card's icon ramps to bright cyan.
- [ ] Trigger an alert/unavailable entity: gold/red accent appears.
- [ ] **Open an entity more-info popup: it is fully OPAQUE, framed, and the dashboard behind is dimmed — no see-through layering.** (This is the bug being fixed.)
- [ ] Sidebar selected item shows a cyan left-accent (no red).
- [ ] OS-level "reduce motion" on: ambient glow and pulses stop.

- [ ] **Step 4: No commit needed** (verification only). If Step 3 surfaces visual issues, file them as follow-up tweaks to the relevant card-mod block and re-verify.

---

## Self-Review Notes

- **Spec coverage:** token system (T2), popup fix (T2 bindings + T6 framing), instrument cards + state model (T4), subtle ambient motion + reduced-motion (T3), sidebar/header chrome incl. red-gradient removal (T5), typography (T2 bindings + T3 import + T4 mono), compatibility/card-mod dependency (T2 + T7), file removals incl. stark/icons/background (T1), docs + future-icons framing (T7). All spec sections map to tasks.
- **No placeholders:** all CSS and YAML content is concrete.
- **Naming consistency:** `j-*` token names are defined in T2 and reused verbatim in T3–T6; `card-mod-*` block keys consistent throughout.
