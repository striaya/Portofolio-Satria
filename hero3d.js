// Efek 3D interaktif di hero: partikel dan cincin Three.js bereaksi pada kursor, sentuhan, drag, dan tap.
// Menggantikan skrip Three.js lama yang ada di dalam index.html.
(function () {
  if (!window.THREE) return;
  const cv = document.getElementById('three-canvas');
  const home = document.getElementById('home');
  if (!cv || !home) return;

  const reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const coarse = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

  // ---------- pengaturan (silakan diubah) ----------
  const N = coarse ? 380 : 650; // jumlah partikel
  const PUSH_R = coarse ? 1.9 : 1.6; // jangkauan pengaruh kursor atau jari
  const RIPPLE_DUR = 1.1; // lama gelombang kejut (detik)

  let ren;
  try {
    ren = new THREE.WebGLRenderer({ canvas: cv, antialias: !coarse, alpha: true });
  } catch (e) {
    return; // perangkat tidak mendukung WebGL: hero tampil polos
  }
  ren.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2));
  ren.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  cam.position.z = 6;

  function resize() {
    const w = home.clientWidth;
    const h = home.clientHeight;
    if (!w || !h) return;
    ren.setSize(w, h);
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
  }
  resize();
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(home);
  else window.addEventListener('resize', resize);

  // ---------- partikel ----------
  const homePos = new Float32Array(N * 3);
  const pos = new Float32Array(N * 3);
  const vel = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const k = i * 3;
    homePos[k] = (Math.random() - 0.5) * 28;
    homePos[k + 1] = (Math.random() - 0.5) * 18;
    homePos[k + 2] = (Math.random() - 0.5) * 8 - 2;
    pos[k] = homePos[k];
    pos[k + 1] = homePos[k + 1];
    pos[k + 2] = homePos[k + 2];
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0x2d5be3,
    size: 0.055,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending,
  });
  scene.add(new THREE.Points(geo, pMat));

  // ---------- cincin ----------
  const group = new THREE.Group();
  scene.add(group);
  const rdata = [
    [0, 0, -3, 1.3],
    [-2, 1, -4, 0.7],
    [2.5, -1, -3.5, 0.5],
    [-1, -1.5, -5, 1.8],
    [1, 2, -4.5, 0.55],
  ];
  const rings = rdata.map(function (d) {
    const m = new THREE.Mesh(
      new THREE.TorusGeometry(d[3], 0.007, 4, 60),
      new THREE.MeshBasicMaterial({ color: 0x2d5be3, transparent: true, opacity: 0.1 })
    );
    m.position.set(d[0], d[1], d[2]);
    m.rotation.x = Math.random() * Math.PI;
    m.rotation.y = Math.random() * Math.PI;
    m.userData.rs = [(Math.random() - 0.5) * 0.007, (Math.random() - 0.5) * 0.007];
    m.userData.sv = 0; // kecepatan denyut ukuran
    group.add(m);
    return m;
  });

  // ---------- keadaan interaksi ----------
  const ptr = { cx: 0, cy: 0, nx: 0, ny: 0, inside: false, down: false, wasDown: false, lx: null, ly: null, t0: 0, x0: 0, y0: 0 };
  const av = { x: 0, y: 0 }; // kecepatan putar cincin dari drag
  const ripples = [];
  let spin = 0; // dorongan putar cincin dari gerakan pointer
  let glow = 0; // nyala sesaat saat tap
  const tmp = new THREE.Vector3();
  const dir = new THREE.Vector3();

  function interactive(t) {
    return !!(t && t.closest && t.closest('a, button, input, select, textarea, label, .gbox, #musicPlayer'));
  }

  function onMove(e) {
    ptr.cx = e.clientX;
    ptr.cy = e.clientY;
    ptr.inside = true;
    if (ptr.lx !== null) {
      const dx = e.clientX - ptr.lx;
      const dy = e.clientY - ptr.ly;
      spin = Math.min(3, spin + (Math.abs(dx) + Math.abs(dy)) * 0.004);
      if (ptr.down) {
        av.y += dx * 0.00018;
        av.x += dy * 0.00018;
      }
    }
    ptr.lx = e.clientX;
    ptr.ly = e.clientY;
  }

  function onDown(e) {
    onMove(e);
    if (interactive(e.target)) {
      ptr.down = false;
      ptr.wasDown = false;
      return;
    }
    ptr.down = true;
    ptr.wasDown = true;
    ptr.t0 = performance.now();
    ptr.x0 = e.clientX;
    ptr.y0 = e.clientY;
  }

  function onUp(e) {
    const wasTap =
      e.type === 'pointerup' &&
      ptr.wasDown &&
      performance.now() - ptr.t0 < 300 &&
      Math.abs(e.clientX - ptr.x0) + Math.abs(e.clientY - ptr.y0) < 12;
    if (wasTap) shock(e.clientX, e.clientY);
    ptr.down = false;
    ptr.wasDown = false;
    if (e.pointerType && e.pointerType !== 'mouse') {
      ptr.inside = false; // sentuhan selesai, tidak ada hover
      ptr.lx = null;
    }
  }

  function onLeave() {
    ptr.inside = false;
    ptr.down = false;
    ptr.lx = null;
  }

  function shock(clientX, clientY) {
    if (reduce) return;
    const r = home.getBoundingClientRect();
    const nx = ((clientX - r.left) / r.width) * 2 - 1;
    const ny = -(((clientY - r.top) / r.height) * 2 - 1);
    cam.updateMatrixWorld(true);
    tmp.set(nx, ny, 0.5).unproject(cam);
    tmp.sub(cam.position).normalize();
    ripples.push({ ox: cam.position.x, oy: cam.position.y, oz: cam.position.z, dx: tmp.x, dy: tmp.y, dz: tmp.z, age: 0 });
    if (ripples.length > 4) ripples.shift();
    glow = 1;
    spin = Math.min(3, spin + 1.5);
    rings.forEach(function (rg, i) {
      rg.userData.sv += 0.05 + i * 0.012;
    });
  }

  home.addEventListener('pointermove', onMove, { passive: true });
  home.addEventListener('pointerdown', onDown, { passive: true });
  home.addEventListener('pointerleave', onLeave, { passive: true });
  window.addEventListener('pointerup', onUp, { passive: true });
  window.addEventListener('pointercancel', onUp, { passive: true });

  // ---------- animasi ----------
  let raf = 0;
  let running = false;
  let visible = true;
  let last = 0;

  function frame(now) {
    if (!running) return;
    raf = requestAnimationFrame(frame);

    const dt = Math.min((now - last) / 16.667, 2.5);
    last = now;
    const damp = Math.pow(0.88, dt);

    // posisi pointer dalam koordinat layar-canvas
    let inside = ptr.inside && !reduce;
    if (inside) {
      const r = home.getBoundingClientRect();
      ptr.nx = ((ptr.cx - r.left) / r.width) * 2 - 1;
      ptr.ny = -(((ptr.cy - r.top) / r.height) * 2 - 1);
      if (Math.abs(ptr.nx) > 1.05 || Math.abs(ptr.ny) > 1.05) inside = false;
    }

    // kamera mengikuti pointer
    const tx = inside ? ptr.nx * 0.5 : 0;
    const ty = inside ? ptr.ny * 0.35 : 0;
    cam.position.x += (tx - cam.position.x) * 0.04 * dt;
    cam.position.y += (ty - cam.position.y) * 0.04 * dt;
    cam.lookAt(scene.position);
    cam.updateMatrixWorld(true);

    // arah sinar dari kamera menembus titik pointer
    if (inside) {
      tmp.set(ptr.nx, ptr.ny, 0.5).unproject(cam);
      dir.copy(tmp).sub(cam.position).normalize();
    }

    // gelombang kejut
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.age += dt * 0.016667;
      if (rp.age > RIPPLE_DUR) {
        ripples.splice(i, 1);
        continue;
      }
      rp.front = rp.age * 7;
      rp.fade = 1 - rp.age / RIPPLE_DUR;
    }

    // partikel
    const cx = cam.position.x;
    const cy = cam.position.y;
    const cz = cam.position.z;
    const tm = now * 0.0005;
    for (let i = 0; i < N; i++) {
      const k = i * 3;
      const x = pos[k];
      const y = pos[k + 1];
      const z = pos[k + 2];
      const sc = (cz - z) / 6; // partikel yang lebih jauh dianggap berukuran lebih besar di dunia
      let ax = 0;
      let ay = 0;

      if (inside) {
        const t = (z - cz) / dir.z;
        const R = PUSH_R * sc;
        const dx = x - (cx + dir.x * t);
        const dy = y - (cy + dir.y * t);
        const d2 = dx * dx + dy * dy;
        if (d2 < R * R && d2 > 0.000001) {
          const d = Math.sqrt(d2);
          const u = d / R;
          if (ptr.down) {
            const f = u * (1 - u) * 4; // tarik ke titik sentuh
            ax -= (dx / d) * f * 0.05 * sc;
            ay -= (dy / d) * f * 0.05 * sc;
          } else {
            const f = (1 - u) * (1 - u); // dorong menjauh
            ax += (dx / d) * f * 0.11 * sc;
            ay += (dy / d) * f * 0.11 * sc;
          }
        }
      }

      for (let j = 0; j < ripples.length; j++) {
        const rp = ripples[j];
        const t2 = (z - rp.oz) / rp.dz;
        const dx = x - (rp.ox + rp.dx * t2);
        const dy = y - (rp.oy + rp.dy * t2);
        const d = Math.sqrt(dx * dx + dy * dy);
        const diff = Math.abs(d - rp.front * sc);
        const w = 1.0 * sc;
        if (diff < w && d > 0.0001) {
          const f = (1 - diff / w) * rp.fade * 0.22;
          ax += (dx / d) * f;
          ay += (dy / d) * f;
        }
      }

      // pegas kembali ke posisi asal, plus melayang tipis
      const fy = Math.sin(tm + i * 0.7) * 0.06;
      ax += (homePos[k] - x) * 0.02;
      ay += (homePos[k + 1] + fy - y) * 0.02;
      const az = (homePos[k + 2] - z) * 0.02;

      vel[k] = (vel[k] + ax * dt) * damp;
      vel[k + 1] = (vel[k + 1] + ay * dt) * damp;
      vel[k + 2] = (vel[k + 2] + az * dt) * damp;
      pos[k] = x + vel[k] * dt;
      pos[k + 1] = y + vel[k + 1] * dt;
      pos[k + 2] = z + vel[k + 2] * dt;
    }
    geo.attributes.position.needsUpdate = true;

    // cincin
    spin *= Math.pow(0.94, dt);
    glow *= Math.pow(0.95, dt);
    const boost = reduce ? 0.3 : 1 + spin * 6;
    const op = 0.1 + glow * 0.25;
    rings.forEach(function (rg) {
      rg.rotation.x += rg.userData.rs[0] * boost * dt;
      rg.rotation.y += rg.userData.rs[1] * boost * dt;
      // denyut ukuran dengan pegas
      let sv = rg.userData.sv;
      sv += (1 - rg.scale.x) * 0.08 * dt;
      sv *= Math.pow(0.82, dt);
      rg.userData.sv = sv;
      rg.scale.setScalar(Math.max(0.5, rg.scale.x + sv * dt));
      rg.material.opacity = op;
    });
    pMat.opacity = 0.25 + glow * 0.25;

    // putaran grup cincin dari drag, lalu pelan-pelan kembali
    group.rotation.x += av.x * dt;
    group.rotation.y += av.y * dt;
    av.x *= Math.pow(0.93, dt);
    av.y *= Math.pow(0.93, dt);
    group.rotation.x += (0 - group.rotation.x) * 0.012 * dt;
    group.rotation.y += (0 - group.rotation.y) * 0.012 * dt;
    group.rotation.x = Math.max(-1.3, Math.min(1.3, group.rotation.x));
    group.rotation.y = Math.max(-1.3, Math.min(1.3, group.rotation.y));

    // cincin ikut bergeser saat scroll
    const sr = Math.max(0, Math.min(1, window.scrollY / (home.offsetHeight || 1)));
    group.position.y += (sr * 1.5 - group.position.y) * 0.06 * dt;

    ren.render(scene, cam);
  }

  function start() {
    if (running || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  // hemat baterai: berhenti menggambar saat hero tidak terlihat atau tab disembunyikan
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 }
    ).observe(home);
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else start();
  });

  start();
})();