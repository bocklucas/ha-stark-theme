# Stark Home Assistant Theme

[![Build Status](https://github.com/CashWilliams/ha-stark-theme/workflows/.github/workflows/workflow.yml/badge.svg)](https://github.com/CashWilliams/ha-stark-theme/actions)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/custom-components/hacs)

> Stark theme by @CashWilliams (based on The Cyberpunk 2077 Theme by @flejz)

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