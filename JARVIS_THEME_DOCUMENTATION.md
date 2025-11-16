# Jarvis Theme Documentation

## Overview
The Jarvis theme is a futuristic, cyberpunk-inspired design system featuring a dark color palette with cyan/blue accents, animated grid backgrounds, glowing effects, and a sophisticated typography system. This document provides comprehensive details for implementing the theme in other projects.

---

## Color Palette

### CSS Variables
All colors are defined as CSS custom properties for easy theming:

```css
:root {
  --jarvis-primary: #00d4ff;        /* Main cyan accent color */
  --jarvis-secondary: #0099cc;      /* Secondary blue */
  --jarvis-accent: #00ffff;         /* Bright cyan accent */
  --jarvis-dark: #0a0e27;           /* Dark blue background */
  --jarvis-darker: #050510;         /* Darkest background */
  --jarvis-border: rgba(0, 212, 255, 0.3);  /* Semi-transparent cyan borders */
  --jarvis-glow: rgba(0, 212, 255, 0.5);    /* Glow effect color */
  --jarvis-text: #e0f7ff;           /* Primary text color (light cyan) */
  --jarvis-text-dim: #8bb3c4;       /* Dimmed/secondary text */
}
```

### Color Usage
- **Primary (`--jarvis-primary`)**: Main interactive elements, buttons, highlights
- **Accent (`--jarvis-accent`)**: Status indicators, active states, emphasis
- **Dark backgrounds**: Layered dark blues for depth
- **Borders**: Semi-transparent cyan for glassmorphism effect
- **Text**: Light cyan tones for readability on dark backgrounds

### Status Colors
- **Connected/Ready**: `#00d4ff` (Jarvis cyan)
- **Connecting**: `#ffaa00` (Orange)
- **Disconnected/Error**: `#ff4444` (Red)
- **Inactive**: `#666` (Gray)

---

## Typography

### Font Families

#### Primary Font: Orbitron
- **Usage**: Headings, titles, status text, buttons
- **Weights**: 400, 500, 700, 900
- **Characteristics**: Futuristic, geometric, tech-inspired
- **Google Fonts URL**: `https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&display=swap`

#### Secondary Font: Rajdhani
- **Usage**: Body text, general content
- **Weights**: 300, 400, 500, 600, 700
- **Characteristics**: Clean, modern, readable
- **Google Fonts URL**: `https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap`

### Typography Scale

#### Headings
- **Main Title (`.jarvis-title`)**: 
  - Font: Orbitron
  - Size: 42px (desktop), 32px (tablet), 24px (mobile)
  - Weight: 900
  - Letter-spacing: 8px (desktop), 4px (tablet), 2px (mobile)
  - Color: `--jarvis-primary`
  - Text-shadow: Multi-layer glow effect

- **Section Titles (`.transcript-title`)**: 
  - Font: Orbitron
  - Size: 20px
  - Weight: 700
  - Letter-spacing: 3px
  - Color: `--jarvis-primary`

#### Body Text
- **Primary Text**: 
  - Font: Rajdhani
  - Size: 18px (message text), 14px (general)
  - Weight: 400
  - Color: `--jarvis-text`

- **Secondary Text**: 
  - Font: Rajdhani
  - Size: 12px, 14px
  - Weight: 300-400
  - Color: `--jarvis-text-dim`

#### UI Elements
- **Buttons**: 
  - Font: Orbitron
  - Size: 14px
  - Weight: 600
  - Letter-spacing: 2px
  - Text-transform: uppercase

- **Status Text**: 
  - Font: Orbitron
  - Size: 14px
  - Letter-spacing: 2-3px
  - Text-transform: uppercase

---

## Layout Structure

### Container Hierarchy
```
.jarvis-app (100vh, flex column)
  └── .jarvis-background (fixed, full screen)
      └── .grid-overlay (animated grid pattern)
  └── .jarvis-container (max-width: 1400px, centered)
      └── .jarvis-header
      └── .jarvis-main (flex: 1)
          └── .main-content-grid (2-column grid)
      └── .jarvis-footer (conditional, debug panel)
```

### Key Layout Properties
- **Full viewport height**: `height: 100vh` on body and app container
- **No scrolling**: `overflow: hidden` on body, app, and main containers
- **Centered container**: `max-width: 1400px`, `margin: 0 auto`
- **Flex-based**: Uses flexbox for vertical layout
- **Grid-based**: 2-column grid for main content (responsive to 1 column)

---

## Background Effects

### Base Background
```css
background: linear-gradient(135deg, var(--jarvis-darker) 0%, var(--jarvis-dark) 100%);
```

### Animated Grid Overlay
- **Pattern**: 50px × 50px grid
- **Color**: `rgba(0, 212, 255, 0.03)` (very subtle cyan)
- **Animation**: Continuous movement (`gridMove` keyframes)
- **Duration**: 20s linear infinite
- **Effect**: Creates a subtle moving grid pattern for depth

```css
.grid-overlay {
  background-image: 
    linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}
```

---

## Component Styles

### Header (`.jarvis-header`)
- **Background**: `rgba(10, 14, 39, 0.6)` with backdrop blur
- **Border**: 1px solid `--jarvis-border`
- **Border-radius**: 12px
- **Padding**: 30px 40px
- **Box-shadow**: Outer glow + inset glow
- **Backdrop-filter**: `blur(10px)` for glassmorphism

### Logo Section (`.jarvis-logo`)
- **Glow Effect**: Animated radial gradient behind logo
- **Animation**: `pulseGlow` (3s ease-in-out infinite)
- **Title**: Large Orbitron text with multi-layer text-shadow
- **Subtitle**: Small uppercase text in dim color

### Buttons

#### Connect Button (`.connect-btn`)
- **Base**: Transparent background
- **Border**: 2px solid `--jarvis-primary`
- **Color**: `--jarvis-primary`
- **Hover**: 
  - Background: `rgba(0, 212, 255, 0.1)`
  - Enhanced glow
  - Transform: `translateY(-2px)`
- **Shine Effect**: Animated gradient sweep on hover

#### Disconnect Button (`.disconnect-btn`)
- **Color**: `#ff4444` (red)
- **Border**: Red variant
- **Same hover effects as connect button**

### Cards/Containers
- **Background**: `rgba(10, 14, 39, 0.6)`
- **Border**: 1px solid `--jarvis-border`
- **Border-radius**: 12px (main), 8px (smaller)
- **Padding**: 30px (main), 20px (smaller)
- **Backdrop-filter**: `blur(10px)`
- **Box-shadow**: Dual-layer (outer glow + inset glow)

### Status Indicators

#### Status Dot (`.status-dot`)
- **Size**: 12px × 12px
- **Shape**: Circle
- **Inactive**: Gray (`#666`)
- **Active**: `--jarvis-accent` with glow
- **Animation**: `pulseDot` (2s ease-in-out infinite)

#### Status Text
- **Font**: Orbitron
- **Size**: 14px
- **Letter-spacing**: 2-3px
- **Text-transform**: uppercase
- **Color**: `--jarvis-text` with accent color for values

---

## Visual Effects

### Glow Effects

#### Text Glow
```css
text-shadow: 
  0 0 10px var(--jarvis-glow),
  0 0 20px var(--jarvis-glow),
  0 0 30px var(--jarvis-glow);
```

#### Box Glow
```css
box-shadow: 
  0 0 20px rgba(0, 212, 255, 0.1),      /* Outer glow */
  inset 0 0 20px rgba(0, 212, 255, 0.05); /* Inset glow */
```

#### Element Glow (Logo)
```css
background: radial-gradient(circle, var(--jarvis-glow) 0%, transparent 70%);
filter: blur(15px);
```

### Animations

#### Pulse Glow (`pulseGlow`)
- **Duration**: 3s
- **Easing**: ease-in-out
- **Effect**: Opacity and scale pulsing
- **Usage**: Logo glow effect

#### Pulse Dot (`pulseDot`)
- **Duration**: 2s
- **Easing**: ease-in-out
- **Effect**: Opacity and scale for status indicators

#### Fade In (`fadeIn`)
- **Duration**: 0.3s
- **Easing**: ease-in
- **Effect**: Fade + translateY for message appearance

#### Grid Move (`gridMove`)
- **Duration**: 20s
- **Easing**: linear
- **Effect**: Continuous grid pattern movement

### Glassmorphism
- **Backdrop-filter**: `blur(10px)`
- **Semi-transparent backgrounds**: `rgba(10, 14, 39, 0.6)`
- **Borders**: Semi-transparent cyan
- **Layered depth**: Multiple z-index levels

---

## Interactive Elements

### Button Hover States
- **Transform**: `translateY(-2px)` (subtle lift)
- **Background**: Slight color change
- **Glow**: Enhanced box-shadow
- **Shine**: Animated gradient sweep

### Scrollbars
- **Width**: 6px
- **Track**: `rgba(0, 212, 255, 0.1)`
- **Thumb**: `--jarvis-primary`
- **Hover**: `--jarvis-accent`

### Transitions
- **Duration**: 0.3s
- **Easing**: ease
- **Properties**: All interactive elements use smooth transitions

---

## Transcript Component

### Message Styling
- **Background**: 
  - User: `rgba(0, 212, 255, 0.1)`
  - Assistant: `rgba(0, 255, 255, 0.05)`
- **Border**: 1px solid `--jarvis-border`
- **Border-radius**: 8px
- **Padding**: 20px
- **Animation**: `fadeIn` on appearance

### Message Layout
- **Text**: 18px, primary color, top of message
- **Footer**: Role and timestamp, bottom of message
- **Role Badge**: Orbitron font, uppercase, accent color
- **Timestamp**: Small, dim color

### Empty State
- **Icon**: Large emoji (💬)
- **Text**: Orbitron font, uppercase
- **Subtext**: Dim color, smaller size

---

## Visualizer Component

### Canvas Container
- **Background**: `--jarvis-darker`
- **Border**: 1px solid `--jarvis-border`
- **Border-radius**: 8px
- **Box-shadow**: Inset glow effect
- **Min-height**: 500px (desktop), 400px (tablet), 300px (mobile)

### Disconnected Overlay
- **Background**: `rgba(5, 5, 16, 0.8)` with blur
- **Message**: Centered, large icon + text
- **Icon Animation**: `pulseIcon` (2s ease-in-out infinite)

### 3D Visualization
- **Central Dot**: 
  - Color: `#00ccff` (cyan)
  - Size: 0.7 radius
  - Pulsing based on audio
- **Orbiting Dots**: 
  - Color: `#00ffff` (bright cyan)
  - Count: 300 dots
  - Audio-reactive movement
- **Background**: Dark (`#050510`)

---

## Responsive Design

### Breakpoints

#### Desktop (default)
- **Container**: max-width 1400px
- **Grid**: 2 columns
- **Header**: Horizontal layout
- **Title**: 42px

#### Tablet (≤1024px)
- **Grid**: 1 column
- **Other**: Same as desktop

#### Mobile (≤768px)
- **Container padding**: 15px
- **Header**: Vertical layout (column)
- **Title**: 32px, letter-spacing 4px
- **Controls**: Full width, space-between
- **Visualizer**: min-height 400px
- **Container padding**: 20px

#### Small Mobile (≤480px)
- **Title**: 24px, letter-spacing 2px
- **Subtitle**: 10px
- **Visualizer**: min-height 300px

---

## Key Design Patterns

### 1. Layered Depth
- Fixed background layer
- Grid overlay layer
- Content layers with z-index
- Glassmorphism for depth perception

### 2. Glow Hierarchy
- Subtle glows for depth
- Medium glows for emphasis
- Strong glows for active states
- Multi-layer text shadows for titles

### 3. Color Contrast
- Dark backgrounds with bright accents
- High contrast for readability
- Dimmed colors for secondary information
- Status-based color coding

### 4. Typography Hierarchy
- Orbitron for headings/UI (futuristic)
- Rajdhani for content (readable)
- Letter-spacing for tech aesthetic
- Uppercase for status/buttons

### 5. Animation Philosophy
- Subtle, continuous animations (grid)
- Pulsing for active states
- Smooth transitions for interactions
- Fade-in for content appearance

### 6. Glassmorphism
- Semi-transparent backgrounds
- Backdrop blur
- Border highlights
- Layered shadows

---

## Implementation Checklist

### Required CSS
1. Import Google Fonts (Orbitron + Rajdhani)
2. Define CSS custom properties (color variables)
3. Base styles (reset, body, app container)
4. Background effects (gradient + grid overlay)
5. Component styles (header, buttons, cards)
6. Typography styles
7. Animation keyframes
8. Responsive breakpoints

### Required Fonts
- Orbitron: 400, 500, 700, 900
- Rajdhani: 300, 400, 500, 600, 700

### Key Classes to Implement
- `.jarvis-app` - Main app container
- `.jarvis-background` - Fixed background
- `.grid-overlay` - Animated grid
- `.jarvis-container` - Content container
- `.jarvis-header` - Header section
- `.jarvis-title` - Main title
- `.connect-btn` / `.disconnect-btn` - Buttons
- `.visualizer-container` - Card container
- `.transcript-container` - Card container
- `.status-dot` - Status indicator
- All component-specific classes

---

## Example Usage

### Basic Structure
```html
<div class="jarvis-app">
  <div class="jarvis-background">
    <div class="grid-overlay"></div>
  </div>
  <div class="jarvis-container">
    <header class="jarvis-header">
      <div class="jarvis-logo">
        <div class="logo-glow"></div>
        <h1 class="jarvis-title">JARVIS</h1>
        <div class="logo-subtitle">Subtitle Text</div>
      </div>
    </header>
    <main class="jarvis-main">
      <!-- Content -->
    </main>
  </div>
</div>
```

### Button Example
```html
<button class="connect-btn">Connect</button>
```

### Card Example
```html
<div class="visualizer-container">
  <div class="visualizer-header">
    <div class="status-indicator">
      <span class="status-dot active"></span>
      <span class="status-text">ONLINE</span>
    </div>
  </div>
  <!-- Content -->
</div>
```

---

## Additional Notes

### Performance Considerations
- Grid animation uses `transform` for GPU acceleration
- Backdrop-filter can be performance-intensive (use sparingly)
- Multiple box-shadows can impact performance
- Consider `will-change` for animated elements

### Accessibility
- Ensure sufficient color contrast (WCAG AA minimum)
- Provide focus states for keyboard navigation
- Use semantic HTML
- Consider reduced motion preferences

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Backdrop-filter requires modern browser
- CSS custom properties require modern browser
- Grid layout requires modern browser

---

## Theme Customization

### Changing Primary Color
Update the `--jarvis-primary` variable:
```css
:root {
  --jarvis-primary: #your-color;
  --jarvis-secondary: /* adjust accordingly */;
  --jarvis-accent: /* adjust accordingly */;
  --jarvis-border: /* adjust opacity as needed */;
  --jarvis-glow: /* adjust opacity as needed */;
}
```

### Adjusting Glow Intensity
Modify opacity values in:
- `--jarvis-glow` variable
- Box-shadow opacity values
- Text-shadow opacity values

### Changing Typography
Replace font imports and update:
- `font-family` declarations
- Font weight usage
- Letter-spacing values

---

## Summary

The Jarvis theme is characterized by:
- **Dark, futuristic aesthetic** with cyan/blue accents
- **Glassmorphism effects** with backdrop blur
- **Animated grid background** for depth
- **Glowing elements** with multi-layer shadows
- **Tech-inspired typography** (Orbitron + Rajdhani)
- **Smooth animations** and transitions
- **Responsive design** with mobile considerations
- **High contrast** for readability
- **Layered depth** through z-index and transparency

This theme creates a cohesive, immersive experience perfect for AI assistants, tech dashboards, or futuristic applications.

