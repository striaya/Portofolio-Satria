// Visualizer musik: batang kecil di player yang bergerak mengikuti lagu.
// Di laptop membaca audio asli. Di HP memakai animasi simulasi (tidak menyentuh audio sama sekali).
(function () {
  const audio = document.getElementById('bgMusic');
  const player = document.getElementById('musicPlayer');
  const titleEl = document.getElementById('songTitle');
  if (!audio || !player) return;

  const SMALL = window.innerWidth <= 480;
  const BARS = SMALL ? 10 : 14; // jumlah batang
  const GAP = 2; // jarak antar batang (px)
  const W = SMALL ? 40 : 64; // lebar visualizer (px)
  const H = SMALL ? 20 : 24; // tinggi visualizer (px)
  const MIN_H = 2; // tinggi batang saat diam (px)

  // ---------- tampilan ----------
  const style = document.createElement('style');
  style.textContent =
    '#musicViz { display: block; width: ' + W + 'px; height: ' + H + 'px; flex-shrink: 0; }' +
    '#songTitle { min-width: 0; }' +
    '@media (max-width: 480px) {' +
    '  #musicPlayer { gap: 8px; padding-left: 12px; padding-right: 12px; }' +
    '}';
  document.head.appendChild(style);

  const canvas = document.createElement('canvas');
  canvas.id = 'musicViz';
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const g = canvas.getContext('2d');
  g.scale(dpr, dpr);

  // taruh di dalam player, sebelum judul lagu
  if (titleEl) player.insertBefore(canvas, titleEl);
  else player.appendChild(canvas);

  const accent =
    (getComputedStyle(document.documentElement).getPropertyValue('--accent') || '').trim() || '#2d5be3';

  const levels = new Array(BARS).fill(0);

  function draw() {
    g.clearRect(0, 0, W, H);
    const barW = (W - GAP * (BARS - 1)) / BARS;
    g.fillStyle = accent;
    for (let i = 0; i < BARS; i++) {
      const h = Math.max(MIN_H, levels[i] * H);
      const x = i * (barW + GAP);
      const y = H - h;
      g.globalAlpha = 0.35 + 0.65 * levels[i];
      g.beginPath();
      if (g.roundRect) g.roundRect(x, y, barW, h, 1.2);
      else g.rect(x, y, barW, h);
      g.fill();
    }
    g.globalAlpha = 1;
  }

  // ---------- sumber data ----------
  let ctx = null;
  let analyser = null;
  let data = null;
  let simulate = false;

  // HP dan layar sentuh: jangan sentuh audio, pakai simulasi saja
  const isMobile =
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '') ||
    (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

  function setupAudio() {
    if (ctx || simulate) return;

    // Di HP, atau saat dibuka lewat klik dua kali (file://), pakai animasi simulasi.
    // Jalur Web Audio bisa bikin suara pelan atau tertahan di kondisi itu.
    if (isMobile || location.protocol === 'file:') {
      simulate = true;
      return;
    }

    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) {
        simulate = true;
        return;
      }
      ctx = new AC();
      const src = ctx.createMediaElementSource(audio);
      analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.75;
      src.connect(analyser);
      analyser.connect(ctx.destination);
      data = new Uint8Array(analyser.frequencyBinCount);
    } catch (e) {
      simulate = true;
      ctx = null;
      analyser = null;
    }
  }

  // target tinggi tiap batang dari audio asli (0 sampai 1)
  function realTargets() {
    analyser.getByteFrequencyData(data);
    const top = Math.min(40, data.length - 1);
    const out = [];
    for (let i = 0; i < BARS; i++) {
      const start = Math.floor(1 + Math.pow(i / BARS, 1.6) * top);
      let end = Math.floor(1 + Math.pow((i + 1) / BARS, 1.6) * top);
      if (end <= start) end = start + 1;
      let sum = 0;
      for (let k = start; k < end; k++) sum += data[k];
      let v = sum / (end - start) / 255;
      v *= 1 + (i / BARS) * 0.8; // nada tinggi biasanya lebih lemah, jadi sedikit diangkat
      out.push(Math.min(1, v * 1.15));
    }
    return out;
  }

  // target tinggi batang untuk animasi simulasi
  function simTargets(t) {
    const out = [];
    for (let i = 0; i < BARS; i++) {
      const a = Math.sin(t / 260 + i * 0.9);
      const b = Math.sin(t / 410 + i * 1.7 + 2);
      const c = Math.sin(t / 130 + i * 0.5);
      let v = 0.5 + 0.3 * a + 0.2 * b + 0.1 * c;
      v *= 1 - (i / BARS) * 0.35;
      out.push(Math.max(0.08, Math.min(1, v)));
    }
    return out;
  }

  // ---------- animasi ----------
  let raf = null;

  function frame(t) {
    raf = null;
    const active = !audio.paused && !audio.ended;

    let target = null;
    if (active) target = analyser ? realTargets() : simTargets(t);

    let peak = 0;
    for (let i = 0; i < BARS; i++) {
      const tv = target ? target[i] : 0;
      const k = tv > levels[i] ? 0.45 : 0.12; // naik cepat, turun pelan
      levels[i] += (tv - levels[i]) * k;
      if (levels[i] > peak) peak = levels[i];
    }
    draw();

    if (active || peak > 0.02) {
      raf = requestAnimationFrame(frame);
    } else {
      levels.fill(0);
      draw();
    }
  }

  function start() {
    if (!raf) raf = requestAnimationFrame(frame);
  }

  audio.addEventListener('play', function () {
    setupAudio();
    if (ctx && ctx.state === 'suspended') ctx.resume();
    start();
  });
  audio.addEventListener('playing', start);
  audio.addEventListener('pause', start); // supaya batang turun pelan
  audio.addEventListener('ended', start);

  draw(); // gambar kondisi awal (batang diam)
  if (!audio.paused) {
    setupAudio();
    start();
  }
})();