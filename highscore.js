// High score Asteroid Shooter.
// Tidak mengubah kode game: cuma memantau angka Score (#sc) dan Lives (#lv).
(function () {
  const KEY = 'ksatriyau_asteroid_best';
  const scEl = document.getElementById('sc');
  const lvEl = document.getElementById('lv');
  const scoreBox = document.querySelector('.gscore');
  if (!scEl || !lvEl || !scoreBox) return;

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

  // tambah tulisan "Best" di panel skor
  scoreBox.insertAdjacentHTML(
    'beforeend',
    '&nbsp;|&nbsp; Best: <b id="hsBest">' +
      best +
      '</b> <span id="hsNew" style="display:none;color:#e85d3a;font-weight:600">Rekor baru!</span>'
  );
  const bestEl = document.getElementById('hsBest');
  const newEl = document.getElementById('hsNew');

  // pantau perubahan Score
  new MutationObserver(function () {
    const score = parseInt(scEl.textContent, 10) || 0;

    if (score === 0) {
      // game baru dimulai
      bestAtStart = best;
      newEl.style.display = 'none';
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
      newEl.style.display = 'inline';
    } else if (lives > 0) {
      newEl.style.display = 'none';
    }
  }).observe(lvEl, { childList: true, characterData: true, subtree: true });
})();