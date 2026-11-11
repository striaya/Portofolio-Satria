// Mendaftarkan service worker dan menampilkan tombol "Install App".
(function () {
  // ---------- service worker (hanya jalan di https atau localhost, bukan file://) ----------
  const secure =
    location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  if ('serviceWorker' in navigator && secure) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function (e) {
        console.warn('[pwa] service worker gagal didaftarkan:', e);
      });
    });
  }

  // ---------- tombol install ----------
  const DISMISS_KEY = 'pwa_dismissed';
  const DISMISS_DAYS = 7;

  const standalone =
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
  if (standalone) return; // sudah dibuka sebagai aplikasi, tidak perlu tombol

  function dismissedRecently() {
    try {
      const t = parseInt(localStorage.getItem(DISMISS_KEY), 10);
      return t && Date.now() - t < DISMISS_DAYS * 86400000;
    } catch (e) {
      return false;
    }
  }
  function rememberDismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch (e) {}
  }
  if (dismissedRecently()) return;

  const ua = navigator.userAgent || '';
  const isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const style = document.createElement('style');
  style.textContent = `
    #pwaBar {
      position: fixed;
      left: 16px;
      bottom: 52px;
      z-index: 940;
      display: none;
      align-items: center;
      background: var(--surface, #fff);
      border: 1.5px solid var(--border, #e8e4dc);
      border-radius: 100px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      font-family: var(--ff, 'Plus Jakarta Sans', sans-serif);
      overflow: hidden;
      transition: opacity 0.2s, transform 0.2s;
    }
    #pwaBar.show {
      display: flex;
      animation: pwaUp 0.3s ease;
    }
    #pwaBar.pwa-hide {
      opacity: 0;
      transform: scale(0.7);
      pointer-events: none;
    }
    @keyframes pwaUp {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: none; }
    }
    #pwaInstall {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 6px 10px 16px;
      border: none;
      background: transparent;
      color: var(--accent, #2d5be3);
      font-family: inherit;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
    }
    #pwaX {
      width: 34px;
      align-self: stretch;
      border: none;
      background: transparent;
      color: var(--text3, #b0aa9f);
      font-size: 0.7rem;
      cursor: pointer;
    }
    #pwaX:hover {
      color: var(--text, #1a1814);
    }
    #pwaTip {
      position: fixed;
      left: 16px;
      bottom: 100px;
      z-index: 941;
      max-width: 270px;
      display: none;
      padding: 14px 16px;
      background: var(--surface, #fff);
      border: 1.5px solid var(--border, #e8e4dc);
      border-radius: 12px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
      font-family: var(--ff, 'Plus Jakarta Sans', sans-serif);
      font-size: 0.78rem;
      line-height: 1.65;
      color: var(--text2, #6b6560);
    }
    #pwaTip.show {
      display: block;
    }
    #pwaTip b {
      color: var(--text, #1a1814);
    }
  `;
  document.head.appendChild(style);

  const bar = document.createElement('div');
  bar.id = 'pwaBar';
  bar.innerHTML =
    '<button id="pwaInstall" type="button"><i class="fas fa-download"></i>Install App</button>' +
    '<button id="pwaX" type="button" aria-label="Tutup"><i class="fas fa-times"></i></button>';
  document.body.appendChild(bar);

  const tip = document.createElement('div');
  tip.id = 'pwaTip';
  tip.innerHTML =
    '<b>Cara pasang di iPhone:</b><br>1. Ketuk tombol <b>Bagikan</b> (kotak dengan panah ke atas) di Safari.<br>' +
    '2. Pilih <b>Tambah ke Layar Utama</b>.<br>3. Ketuk <b>Tambah</b>.';
  document.body.appendChild(tip);

  let deferred = null;

  function show() {
    bar.classList.add('show');
  }
  function hide() {
    bar.classList.remove('show');
    tip.classList.remove('show');
  }

  document.getElementById('pwaInstall').addEventListener('click', function () {
    if (deferred) {
      deferred.prompt();
      deferred.userChoice.then(function (choice) {
        deferred = null;
        hide();
        if (choice && choice.outcome !== 'accepted') rememberDismiss();
      });
    } else if (isIOS) {
      tip.classList.toggle('show');
    }
  });

  document.getElementById('pwaX').addEventListener('click', function () {
    rememberDismiss();
    hide();
  });

  // Android/Chrome: tombol muncul hanya kalau website memang bisa di-install
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
    show();
  });

  window.addEventListener('appinstalled', function () {
    deferred = null;
    hide();
    rememberDismiss();
  });

  // iPhone tidak punya beforeinstallprompt, jadi tampilkan petunjuk setelah beberapa detik
  if (isIOS) setTimeout(show, 4000);

  // di HP, sembunyikan tombol saat mini game terlihat supaya tidak menutup tombol kontrol game
  const gameBox = document.querySelector('.gbox');
  if (gameBox && 'IntersectionObserver' in window) {
    new IntersectionObserver(
      function (entries) {
        const hideIt = entries[0].isIntersecting && window.innerWidth <= 600;
        bar.classList.toggle('pwa-hide', hideIt);
        if (hideIt) tip.classList.remove('show');
      },
      { threshold: 0.05 }
    ).observe(gameBox);
  }
})();