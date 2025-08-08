/*
  Jarvis Icon Set (example)
  Usage:
  - Copy this file to your Home Assistant /config/www/ directory as /config/www/jarvis-icons.js
  - Add a Lovelace resource: URL: /local/jarvis-icons.js, Type: Module
  - Use icons as: jarvis:<name> (e.g., jarvis:home, jarvis:power)

  Notes:
  - These SVGs are deliberately simple and neutral. Replace the <g id="..."> content with icons you prefer
    (from the HA community thread or your own SVGs) keeping the same ids.
*/

(function registerJarvisIconSet() {
  const ensureOnceId = 'jarvis-iconset-registered';
  if (window[ensureOnceId]) return;
  window[ensureOnceId] = true;

  const iconset = document.createElement('ha-iconset-svg');
  iconset.setAttribute('name', 'jarvis');
  iconset.setAttribute('size', '24');
  iconset.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <defs>
        <!-- HOME -->
        <g id="home">
          <path d="M12 3l9 8-1.5 1.5L18 10.5V20h-5v-5H11v5H6v-9.5L4.5 12.5 3 11l9-8z"/>
        </g>
        <!-- POWER -->
        <g id="power">
          <path d="M11 3h2v8h-2V3zm-1.9 2.6a7 7 0 101.1 12.7l1 1.8a9 9 0 11-1.4-16.4l.3 1.9z"/>
        </g>
        <!-- LIGHTBULB -->
        <g id="lightbulb">
          <path d="M9 21h6v-1H9v1zm3-19a6 6 0 00-3.7 10.7c.5.4.7 1 .7 1.6V16h6v-1.6c0-.6.2-1.2.7-1.6A6 6 0 0012 2z"/>
        </g>
        <!-- SETTINGS -->
        <g id="settings">
          <path d="M12 8a4 4 0 110 8 4 4 0 010-8zm9.4 3l-1.1-.6.2-1.3-1.6-2.8-1.3.2-.8-1.1-3.2-.4-.6 1.1H8l-.6-1.1-3.2.4-.8 1.1-1.3-.2L.5 9.1l.2 1.3L-.4 11l1.1.6-.2 1.3 1.6 2.8 1.3-.2.8 1.1 3.2.4.6-1.1H16l.6 1.1 3.2-.4.8-1.1 1.3.2 1.6-2.8-.2-1.3 1.1-.6z"/>
        </g>
        <!-- CLIMATE -->
        <g id="climate">
          <path d="M11 2h2v8a4 4 0 01-2 7.5A4.5 4.5 0 0111 2z"/>
        </g>
        <!-- LOCK -->
        <g id="lock">
          <path d="M12 1a5 5 0 00-5 5v3H5v14h14V9h-2V6a5 5 0 00-5-5zm0 2a3 3 0 013 3v3H9V6a3 3 0 013-3z"/>
        </g>
        <!-- ALERT -->
        <g id="alert">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v2h2v-2zm0-8h-2v6h2V10z"/>
        </g>
        <!-- ERROR -->
        <g id="error">
          <path d="M12 2a10 10 0 110 20 10 10 0 010-20zm1 13h-2v2h2v-2zm0-8h-2v6h2V7z"/>
        </g>
        <!-- FAN -->
        <g id="fan">
          <path d="M12 12a2 2 0 110-4 2 2 0 010 4zm0-10a4 4 0 014 4c0 2-4 4-4 4s-4-2-4-4a4 4 0 014-4zm10 10a4 4 0 01-4 4c-2 0-4-4-4-4s2-4 4-4a4 4 0 014 4zM12 22a4 4 0 01-4-4c0-2 4-4 4-4s4 2 4 4a4 4 0 01-4 4z"/>
        </g>
        <!-- THERMOMETER -->
        <g id="thermometer">
          <path d="M11 3a2 2 0 114 0v8.1a4 4 0 11-4 0V3z"/>
        </g>
        <!-- SHIELD -->
        <g id="shield">
          <path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z"/>
        </g>
        <!-- AUTOMATION -->
        <g id="automation">
          <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"/>
        </g>
      </defs>
    </svg>
  `;

  document.body.appendChild(iconset);
})();