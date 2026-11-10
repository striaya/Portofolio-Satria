const tickerMessages = [
  'Tersedia untuk membuat proyek web, aplikasi web, dan mobile',
  'Terbuka untuk kolaborasi proyek web',
  'Hubungi saya lewat form Contact atau WhatsApp',
  'Satria Henggar Yoselino — Software Engineering',
];
const tickerSpeed = 60; // px per detik, makin besar makin cepat

(function initTicker() {
  const style = document.createElement('style');
  style.textContent = `
    #adTicker {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 36px;
      overflow: hidden;
      display: flex;
      align-items: center;
      background: #2d5be3;
      color: #fff;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.82rem;
      font-weight: 500;
      z-index: 900;
    }
    #adTicker .ad-track {
      display: flex;
      width: max-content;
      animation: adMove 30s linear infinite;
    }
    #adTicker:hover .ad-track {
      animation-play-state: paused;
    }
    #adTicker .ad-group {
      display: flex;
      flex-shrink: 0;
      align-items: center;
    }
    #adTicker .ad-item {
      white-space: nowrap;
      padding: 0 1.2rem;
    }
    #adTicker .ad-dot {
      opacity: 0.6;
    }
    @keyframes adMove {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
  `;
  document.head.appendChild(style);

  const bar = document.createElement('div');
  bar.id = 'adTicker';

  const track = document.createElement('div');
  track.className = 'ad-track';

  function buildGroup() {
    const g = document.createElement('div');
    g.className = 'ad-group';
    for (let r = 0; r < 4; r++) {
      tickerMessages.forEach((msg) => {
        const t = document.createElement('span');
        t.className = 'ad-item';
        t.textContent = msg;
        g.appendChild(t);
        const d = document.createElement('span');
        d.className = 'ad-dot';
        d.textContent = '•';
        g.appendChild(d);
      });
    }
    return g;
  }

  const g1 = buildGroup();
  const g2 = buildGroup(); // kembaran, supaya putarannya nyambung tanpa jeda
  track.appendChild(g1);
  track.appendChild(g2);
  bar.appendChild(track);
  document.body.appendChild(bar);

  // supaya footer nggak ketutup bar
  document.body.style.paddingBottom = '36px';

  function setSpeed() {
    const w = g1.offsetWidth;
    if (w > 0) track.style.animationDuration = w / tickerSpeed + 's';
  }
  setSpeed();
  window.addEventListener('load', setSpeed);
})();