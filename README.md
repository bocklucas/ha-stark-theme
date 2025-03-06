# Stark Home Assistant Theme

[![Build Status](https://github.com/CashWilliams/ha-stark-theme/workflows/.github/workflows/workflow.yml/badge.svg)](https://github.com/CashWilliams/ha-stark-theme/actions)

> [!WARNING]
> This theme is meant to be used on a wall display and hasn't been fully
> tested or optimized to work in all screens of Home Assistant.

Stark theme by @CashWilliams (based on The Cyberpunk 2077 Theme by @flejz)

## Installation

Add the following code to your `configuration.yaml` file (reboot required).

```yaml
frontend:
  ... # your configuration.
  themes: !include_dir_merge_named themes
  ... # your configuration.
```

### Manual

Clone this repository in your existing (or create it) `themes/` folder.

```bash
cd themes/
git clone https://github.com/CashWilliams/ha-stark-theme.git
```