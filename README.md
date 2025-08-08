# Iron Man MCU HUD Theme for Home Assistant

[![Build Status](https://github.com/CashWilliams/ha-stark-theme/workflows/.github/workflows/workflow.yml/badge.svg)](https://github.com/CashWilliams/ha-stark-theme/actions)

> [!WARNING]
> This theme is meant to be used on a wall display and hasn't been fully
> tested or optimized to work in all screens of Home Assistant.

**Enhanced Iron Man MCU HUD Theme** - Transform your Home Assistant into Tony Stark's workshop with authentic Marvel Cinematic Universe colors and effects inspired by the actual film designs.

## ✨ New Features & Enhancements

### 🎨 Authentic MCU Color Palette
- **Arc Reactor Blue** (`#67C7EB`) - Primary HUD elements matching the films
- **Targeting Orange** (`#FF6600`) - Warning and targeting indicators
- **Stark Gold** (`#FBCA03`) - Accent colors and highlights
- **Alert Red** (`#F44336`) - Critical alerts and status indicators
- **Deep Space Dark** (`#0A0E1A`) - Background matching the suit's interior

### 🔋 Visual Effects
- **Arc Reactor Indicators** - Pulsing blue corner elements on cards
- **HUD Scan Lines** - Animated scanning effects across interface elements
- **Targeting Reticles** - Corner brackets on menu items inspired by Iron Man's targeting system
- **Subtle Grid Overlay** - Faint HUD grid pattern across the interface
- **Enhanced Glow Effects** - Multi-layered glow and shadow effects
- **Smooth Animations** - Cubic-bezier transitions for a premium feel

### ⚡ JARVIS-Style Iconography
- **Navigation Icons** - Gold-glowing header icons with enhanced readability on dark background
- **Sidebar Targeting** - Active menu items get animated targeting brackets with pulse effect
- **State-Aware Icons** - Smart coloring: lights=gold, power=blue, alerts=orange, errors=red
- **HUD Glow Effects** - All icons have contextual drop-shadow glows matching their function
- **Interactive Feedback** - Hover animations with subtle scale transforms and color shifts
- **Notification Pulse** - Alert icons have gentle pulsing animations for attention
- **Enhanced Switches** - Arc reactor styled toggles with appropriate glow effects

### 💎 Enhanced Components
- **Gradient Backgrounds** - Multi-layer gradients with transparency effects
- **Enhanced Typography** - Technical font stack with improved spacing
- **Interactive Feedback** - Hover effects with transform and glow enhancements
- **Backdrop Blur** - Modern glass-morphism effects on cards

## 🎯 Design Philosophy

This theme is based on the authentic Iron Man HUD design from the Marvel Cinematic Universe, specifically inspired by the work of **Jayse Hansen** who designed the actual HUD interfaces for the Iron Man films. The color palette and visual effects aim to recreate the immersive experience of Tony Stark's workshop and suit interface.

## 📦 Installation

Add the following code to your `configuration.yaml` file (reboot required).

```yaml
frontend:
  ... # your configuration.
  themes: !include_dir_merge_named themes
  ... # your configuration.
```

### Manual Installation

Clone this repository in your existing (or create it) `themes/` folder.

```bash
cd themes/
git clone https://github.com/CashWilliams/ha-stark-theme.git
```

### HACS Installation

1. Open HACS in your Home Assistant
2. Go to Frontend
3. Search for "Stark Theme"
4. Install and restart Home Assistant

## 🎮 Activation

You can choose between two variants:
- Stark (original MCU palette): select `stark`
- Jarvis Blue HUD (no reds, blue-spectrum only): select `jarvis`

1. Go to your profile in Home Assistant
2. Choose your desired theme from the theme dropdown
3. Enjoy your new Stark Industries interface!

## 🖼️ Background Customization

The theme includes multiple background options to suit your preference:

### **Option 1: Custom Arc Reactor Effect (Default)**
A CSS-generated arc reactor glow effect that's lightweight and perfectly matched to the theme.

### **Option 2-7: High-Quality Iron Man Backgrounds**
Several pre-configured high-quality Iron Man backgrounds are available. To use one:

1. Open `themes/stark.yaml`
2. Comment out the current background line by adding `#` at the beginning
3. Uncomment your preferred option by removing the `#`

### **Using Your Own Background**
To use your own Iron Man background image:

1. **Upload your image** to `/config/www/images/` (create the folder if it doesn't exist)
2. **Edit the theme** by changing the background line to:
   ```yaml
   background-image: "center / cover no-repeat fixed url('/local/images/your-image-name.jpg')"
   ```

### **Recommended Background Sources**
- **WallpaperCave** - High-quality Iron Man wallpapers
- **DeviantArt** - Arc reactor blueprints and technical designs
- **Unsplash** - Professional tech and industrial photos
- **Marvel Official** - Official movie stills and promotional images

### **Background Tips**
- Use **dark backgrounds** for best contrast with the HUD elements
- **4K resolution** (3840x2160) works best for large displays
- **Arc reactor themes** complement the blue color scheme perfectly
- **Workshop/lab settings** create an immersive Stark Industries feel

## 🛠️ Technical Details

### Color Variables
- **Primary HUD Colors**: Arc reactor blue spectrum for main interface elements
- **Warning System**: Orange/amber colors for system alerts and targeting
- **Status Indicators**: Red spectrum for critical alerts and errors
- **Background System**: Deep space colors creating the perfect contrast
- **Metallic Accents**: Grey tones representing the suit's metal construction

### Animation System
- **Arc Reactor Pulse**: 2-second breathing animation on card indicators
- **Scan Lines**: 3-second continuous scanning effect
- **Glow Pulse**: 3-second breathing glow on sidebar title
- **Hover Transforms**: Smooth scale and translation effects

## 🎨 Customization

The theme uses CSS custom properties, making it easy to customize colors:

```yaml
# Example: Customize the arc reactor color
stark:
  arc-reactor-blue: "#YOUR_COLOR_HERE"
```

## 📱 Compatibility

- ✅ Desktop browsers
- ✅ Mobile devices
- ✅ Tablet displays
- ⚠️ Wall displays (primary target - may need adjustments for other screens)

## 🤖 Credits

- **Original Theme**: Based on The Cyberpunk 2077 Theme by @flejz
- **Enhanced by**: @CashWilliams
- **MCU HUD Design Inspiration**: Jayse Hansen (Original Iron Man HUD Designer)
- **Color Research**: Based on authentic Marvel Cinematic Universe color palettes

## 🚀 Future Enhancements

- [x] **JARVIS-Style Iconography** - ✅ COMPLETED: Enhanced icon styling with glow effects and animations
- [x] **Enhanced Navigation Readability** - ✅ COMPLETED: Improved navigation bar with better contrast
- [ ] Additional suit Mark variations (Mark 42, Mark 50, etc.)
- [ ] FRIDAY voice assistant integration styling
- [ ] Holographic projection effects
- [ ] Enhanced mobile responsiveness
- [ ] Custom Iron Man sound effects integration

---

*"Sometimes you gotta run before you can walk."* - Tony Stark

Transform your smart home into Stark Industries today! 🔧⚡