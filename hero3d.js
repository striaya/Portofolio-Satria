// Kartu miring mengikuti kursor atau jari (kartu Project dan kartu repo GitHub).
(function () {
  const reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (reduce) return;

  const SEL = '.pc, .gh-repo'; // kartu yang bisa miring
  const MAX = 7; // kemiringan maksimum (derajat) untuk kartu biasa
  const MAX_WIDE = 3.5; // untuk kartu lebar (kartu Project utama)

  const style = document.createElement('style');
  style.textContent = `
    .pc { position: relative; }
    .tilt-glare {
      position: absolute;
      inset: 0;
      z-index: 3;
      pointer-events: none;
      border-radius: inherit;
      opacity: 0;
      transition: opacity 0.3s;
      background: radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(45, 91, 227, 0.12), transparent 60%);
    }
    .tilt-on > .tilt-glare { opacity: 1; }
  `;
  document.head.appendChild(style);

  let active = null;
  let rect = null;

  function glareOf(card) {
    let g = null;
    for (let i = 0; i < card.children.length; i++) {
      if (card.children[i].classList.contains('tilt-glare')) {
        g = card.children[i];
        break;
      }
    }
    if (!g) {
      g = document.createElement('div');
      g.className = 'tilt-glare';
      card.appendChild(g);
    }
    return g;
  }

  function activate(card) {
    active = card;
    rect = card.getBoundingClientRect(); // diukur sebelum dimiringkan supaya stabil
    card.style.willChange = 'transform';
    card.style.transition = 'transform 0.14s ease-out, border-color 0.25s, box-shadow 0.25s';
    card.style.transitionDelay = '0s';
    card.classList.add('tilt-on');
    glareOf(card);
  }

  function tilt(card, e) {
    const x = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    const y = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1);
    const max = rect.width > 560 ? MAX_WIDE : MAX;
    const rx = (0.5 - y) * 2 * max;
    const ry = (x - 0.5) * 2 * max;
    card.style.transform =
      'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-3px) scale(1.012)';
    const g = glareOf(card);
    g.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
    g.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
  }

  function reset(card) {
    card.classList.remove('tilt-on');
    card.style.transition = 'transform 0.5s cubic-bezier(.2,.8,.2,1), border-color 0.25s, box-shadow 0.25s';
    card.style.transform = '';
    setTimeout(function () {
      if (card !== active) {
        card.style.transition = '';
        card.style.transitionDelay = '';
        card.style.willChange = '';
      }
    }, 520);
  }

  function release() {
    if (active) {
      reset(active);
      active = null;
    }
  }

  function onPoint(e) {
    const t = e.target;
    const card = t && t.closest ? t.closest(SEL) : null;
    // jangan miring kalau kartunya belum selesai muncul (animasi fade-in)
    if (card && card.classList.contains('r') && !card.classList.contains('v')) return;
    if (active && active !== card) release();
    if (!card) return;
    if (active !== card) activate(card);
    tilt(card, e);
  }

  document.addEventListener('pointermove', onPoint, { passive: true });
  document.addEventListener('pointerdown', onPoint, { passive: true });
  document.addEventListener(
    'pointerup',
    function (e) {
      if (e.pointerType !== 'mouse') release(); // di HP, kartu kembali tegak saat jari diangkat
    },
    { passive: true }
  );
  document.addEventListener('pointercancel', release, { passive: true });
  window.addEventListener('scroll', release, { passive: true });
  document.documentElement.addEventListener('mouseleave', release);
})();