/*
  Jarvis Icon Alias (Optional)
  Purpose: Automatically rewrite common mdi:<name> icons to jarvis:<name>
  Usage:
   - Copy to /config/www/jarvis-icon-alias.js
   - Add as Lovelace resource after jarvis-icons.js:
     URL: /local/jarvis-icon-alias.js, Type: Module
   - Extend the set below with any icon names you want auto-mapped
*/

(function enableJarvisIconAliasing() {
  const ENSURE_ONCE = 'jarvis-icon-alias-enabled';
  if (window[ENSURE_ONCE]) return;
  window[ENSURE_ONCE] = true;

  const mappedNames = new Set([
    'home',
    'power',
    'lightbulb',
    'settings',
    'lock',
    'alert',
    'error',
    'fan',
    'thermometer',
    'automation',
    'shield',
    'climate'
  ]);

  const rewriteIcon = (node) => {
    try {
      const iconAttr = node.getAttribute('icon');
      const iconProp = node.icon;
      const iconVal = typeof iconAttr === 'string' ? iconAttr : (typeof iconProp === 'string' ? iconProp : null);
      if (!iconVal || !iconVal.startsWith('mdi:')) return;
      const name = iconVal.slice(4);
      if (!mappedNames.has(name)) return;
      const newIcon = `jarvis:${name}`;
      if (node.getAttribute('icon') !== newIcon) node.setAttribute('icon', newIcon);
      if (node.icon !== newIcon) node.icon = newIcon;
    } catch (e) {
      // ignore
    }
  };

  const processTree = (root) => {
    if (!root) return;
    if (root.tagName === 'HA-ICON') rewriteIcon(root);
    const icons = root.querySelectorAll ? root.querySelectorAll('ha-icon') : [];
    for (const el of icons) rewriteIcon(el);
  };

  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'childList') {
        m.addedNodes && m.addedNodes.forEach((n) => processTree(n));
      } else if (m.type === 'attributes' && m.target && m.target.tagName === 'HA-ICON' && m.attributeName === 'icon') {
        rewriteIcon(m.target);
      }
    }
  });

  // Start after first paint
  const start = () => {
    processTree(document.body);
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['icon'] });
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    start();
  } else {
    window.addEventListener('DOMContentLoaded', start, { once: true });
  }
})();