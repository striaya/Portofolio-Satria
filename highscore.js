// High score Asteroid Shooter.
// Tidak mengubah kode game: cuma memantau angka Score (#sc) dan Lives (#lv).
(function () {
  const KEY = 'ksatriyau_asteroid_best';
  const scEl = document.getElementById('sc');
  const lvEl = document.getElementById('lv');
  const canvas = document.getElementById('gameCanvas');
  if (!scEl || !lvEl || !canvas) return;

  function readBest() {
    try {
      return parseInt(localStorage.getItem(KEY), 10) || 0;
    } catch (e) {
      return 0;
    }
  }

  function writeBest(v) {
    try {
      localStorage.setItem(KEY, String(v));
    } catch (e) {}
  }

  let best = readBest();
  let bestAtStart = best;

  // style untuk baris Best (responsif, tidak pernah turun baris)
  const style = document.createElement('style');
  style.textContent = `
    #hsBar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 5px 12px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.72rem;
      color: #6b6560;
      white-space: nowrap;
      overflow: hidden;
      min-height: 26px;
      box-sizing: border-box;
    }
    #hsBar b {
      color: #2d5be3;
      font-weight: 600;
    }
    #hsNew {
      color: #e85d3a;
      font-weight: 600;
      visibility: hidden; /* pakai visibility supaya tinggi baris tidak berubah */
    }
    #hsNew.show {
      visibility: visible;
    }
    @media (max-width: 480px) {
      #hsBar {
        font-size: 0.66rem;
        padding: 4px 10px;
      }
    }
  `;
  document.head.appendChild(style);

  // baris Best, ditaruh tepat di atas kanvas game
  const bar = document.createElement('div');
  bar.id = 'hsBar';
  bar.innerHTML =
    '<span>Best: <b id="hsBest">' + best + '</b></span>' +
    '<span id="hsNew">Rekor baru!</span>';
  canvas.parentNode.insertBefore(bar, canvas);

  const bestEl = document.getElementById('hsBest');
  const newEl = document.getElementById('hsNew');

  // pantau perubahan Score
  new MutationObserver(function () {
    const score = parseInt(scEl.textContent, 10) || 0;

    if (score === 0) {
      // game baru dimulai
      bestAtStart = best;
      newEl.classList.remove('show');
      return;
    }

    if (score > best) {
      best = score;
      writeBest(best);
      bestEl.textContent = best;
    }
  }).observe(scEl, { childList: true, characterData: true, subtree: true });

  // pantau Lives: kalau habis berarti game over
  new MutationObserver(function () {
    const lives = parseInt(lvEl.textContent, 10);
    if (lives <= 0 && best > bestAtStart) {
      newEl.classList.add('show');
    } else if (lives > 0) {
      newEl.classList.remove('show');
    }
  }).observe(lvEl, { childList: true, characterData: true, subtree: true });
})();