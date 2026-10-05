/**
 * app.js
 * Ponto de Entrada Principal (Bootstrap)
 * AnimValue: O Preço do Sucesso
 */

import { GameState } from './gameState.js';
import { UIController } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa Estado Central
  const gameState = new GameState();

  // Inicializa Controlador de Interface
  const ui = new UIController(gameState);
  ui.init();

  // Registro de Service Worker (PWA Offline)
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .then((reg) => {
          console.log('[AnimValue PWA] Service Worker registrado com sucesso:', reg.scope);
        })
        .catch((err) => {
          console.warn('[AnimValue PWA] Falha ao registrar Service Worker:', err);
        });
    });
  }

  // Tratamento do Prompt de Instalação PWA (A2HS)
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBanner = document.getElementById('pwa-install-banner');
    if (installBanner) {
      installBanner.classList.remove('hidden');
      const installBtn = document.getElementById('pwa-install-btn');
      if (installBtn) {
        installBtn.addEventListener('click', () => {
          installBanner.classList.add('hidden');
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('[AnimValue PWA] Usuário aceitou a instalação.');
            }
            deferredPrompt = null;
          });
        });
      }
    }
  });
});
