(() => {
  'use strict';
  const button = document.getElementById('install-app');
  const dialog = document.getElementById('install-dialog');
  const instructions = document.getElementById('install-instructions');
  const status = document.getElementById('offline-status');
  const standalone = window.matchMedia('(display-mode: standalone)');
  let pendingInstall = null;
  let offlineReady = false;
  function syncInstall() {
    button.hidden = standalone.matches || window.navigator.standalone === true;
  }
  function syncStatus() {
    status.textContent = offlineReady
      ? (navigator.onLine ? 'Offline ready' : 'Offline mode · progress saved on this device')
      : (navigator.onLine ? '' : 'No connection · offline files may not be ready');
  }
  syncInstall();
  standalone.addEventListener?.('change', syncInstall);
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    pendingInstall = event;
    syncInstall();
  });
  window.addEventListener('appinstalled', () => {
    pendingInstall = null;
    button.hidden = true;
  });
  button.addEventListener('click', async () => {
    if (pendingInstall) {
      const prompt = pendingInstall;
      pendingInstall = null;
      try { await prompt.prompt(); await prompt.userChoice; } catch (_) { /* Browser dismissed prompt. */ }
      return;
    }
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    instructions.textContent = ios
      ? 'On iPhone or iPad, open this game in Safari, tap Share, then Add to Home Screen. Keep Open as Web App enabled if shown, and tap Add.'
      : 'Use your browser’s menu and choose Install app or Add to Home screen. On desktop, look for the install icon in the address bar. If you are inside another app’s browser, open this page in your regular browser first.';
    dialog.showModal();
  });
  window.addEventListener('online', syncStatus);
  window.addEventListener('offline', syncStatus);
  if ('serviceWorker' in navigator && window.isSecureContext) {
    navigator.serviceWorker.register('./sw.js', { scope: './', updateViaCache: 'none' })
      .then(() => navigator.serviceWorker.ready)
      .then(() => { offlineReady = true; syncStatus(); })
      .catch(() => { status.textContent = 'Online play available · offline setup unavailable'; });
  }
})();
