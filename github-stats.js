// Section GitHub otomatis, gayanya mengikuti style.css portofolio.
// Ganti GH_USER kalau username GitHub-mu berubah.
const GH_USER = 'striaya';
const GH_SHOW = 4; // jumlah repo terbaru yang ditampilkan
const GH_CACHE_MIN = 30; // simpan hasil di browser selama 30 menit (hemat limit API)

(function initGithubSection() {
  const CACHE_KEY = 'gh_stats_' + GH_USER;
  const CONTRIB_KEY = 'gh_contrib_' + GH_USER;
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  const LANG_COLORS = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    PHP: '#4f5d95',
    Blade: '#f7523f',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Go: '#00add8',
    Java: '#b07219',
    Dart: '#00b4ab',
    'C#': '#178600',
    Python: '#3572a5',
    Vue: '#41b883',
    GDScript: '#355570',
    Kotlin: '#a97bff',
    C: '#555555',
    'C++': '#f34b7d',
  };

  // ---------- CSS: hanya nambah yang belum ada di style.css ----------
  const style = document.createElement('style');
  style.textContent = `
    #github {
      background: var(--bg);
      min-height: auto;
    }
    #github .gh-grid {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 56px;
      align-items: start;
    }
    /* kartu profil (sama seperti .acard, tapi warna dasar surface karena section-nya bg) */
    #github .gh-card {
      background: var(--surface);
      border: 1.5px solid var(--border);
      border-radius: 10px;
      padding: 24px 18px;
      text-align: center;
    }
    #github .avt {
      overflow: hidden;
    }
    #github .avt img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      display: block;
    }
    #github .astat {
      background: var(--surface);
    }
    #github .gh-ltitle {
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.13em;
      text-transform: uppercase;
      color: var(--text3);
      margin: 28px 0 10px;
    }
    #github .gh-lbar {
      display: flex;
      height: 6px;
      border-radius: 100px;
      overflow: hidden;
      background: var(--border);
    }
    #github .gh-lbar span {
      display: block;
      height: 100%;
    }
    #github .gh-langs .chips {
      margin-top: 14px;
    }
    #github .gh-langs .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    #github .gh-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      display: inline-block;
      flex-shrink: 0;
    }
    #github .gh-btn {
      margin-top: 26px;
    }
    #github .gh-btn i {
      margin-right: 6px;
    }
    #github .gh-sub {
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.13em;
      text-transform: uppercase;
      color: var(--text3);
      margin: 56px 0 14px;
    }

    /* ---------- grafik kontribusi ---------- */
    #github .gh-contrib {
      background: var(--surface);
      border: 1.5px solid var(--border);
      border-radius: 10px;
      padding: 22px 22px 18px;
    }
    #github .gh-chead {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px 20px;
      flex-wrap: wrap;
      margin-bottom: 18px;
    }
    #github .gh-ctotal {
      font-size: 0.85rem;
      color: var(--text2);
    }
    #github .gh-ctotal b {
      font-family: var(--ffs);
      font-size: 1.5rem;
      font-weight: 500;
      color: var(--accent);
      margin-right: 4px;
    }
    #github .gh-legend {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.67rem;
      color: var(--text3);
    }
    #github .gh-legend span:first-child {
      margin-right: 3px;
    }
    #github .gh-legend span:last-child {
      margin-left: 3px;
    }
    #github .gh-cscroll {
      overflow-x: auto;
      padding-bottom: 6px;
      scrollbar-width: thin;
      scrollbar-color: var(--border2) transparent;
    }
    #github .gh-cscroll::-webkit-scrollbar {
      height: 3px;
    }
    #github .gh-cinner {
      width: max-content;
      min-width: 100%;
    }
    #github .gh-months {
      display: grid;
      grid-template-columns: repeat(var(--w, 53), 11px);
      column-gap: 3px;
      height: 15px;
      margin-bottom: 4px;
    }
    #github .gh-months span {
      grid-row: 1;
      font-size: 0.62rem;
      font-weight: 500;
      color: var(--text3);
      white-space: nowrap;
      overflow: visible;
    }
    #github .gh-cal {
      display: grid;
      grid-template-rows: repeat(7, 11px);
      grid-auto-flow: column;
      grid-auto-columns: 11px;
      gap: 3px;
    }
    #github .gh-day {
      display: block;
      width: 11px;
      height: 11px;
      border-radius: 2px;
      background: var(--border);
    }
    #github .gh-legend .gh-day {
      width: 10px;
      height: 10px;
    }
    #github .gh-day.lv1 { background: rgba(45, 91, 227, 0.28); }
    #github .gh-day.lv2 { background: rgba(45, 91, 227, 0.5); }
    #github .gh-day.lv3 { background: rgba(45, 91, 227, 0.75); }
    #github .gh-day.lv4 { background: var(--accent); }
    #github .gh-day.gh-pad { background: transparent; }
    #github .gh-cal .gh-day:not(.gh-pad):hover {
      outline: 1.5px solid var(--text2);
      outline-offset: 1px;
    }
    #github .gh-cmsg {
      font-size: 0.82rem;
      color: var(--text2);
      text-align: center;
      padding: 26px 0;
    }
    #github .gh-cmsg a {
      color: var(--accent);
    }
    #github .gh-cstats {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 28px;
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px solid var(--border);
    }
    #github .gh-cstats:empty {
      display: none;
    }
    #github .gh-cs {
      font-size: 0.78rem;
      color: var(--text2);
    }
    #github .gh-cs b {
      color: var(--accent);
      font-weight: 600;
    }

    /* kartu repo: bentuk kartu Services, isi seperti kartu Project */
    #github .gh-cell {
      display: flex;
    }
    #github .gh-repo {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      background: var(--surface);
      border: 1.5px solid var(--border);
      border-radius: 10px;
      padding: 22px 20px;
      text-decoration: none;
      color: inherit;
      position: relative;
      overflow: hidden;
      transition: 0.25s;
    }
    #github .gh-repo::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--accent);
      transform: scaleX(0);
      transform-origin: left;
      transition: 0.3s;
      border-radius: 0 0 2px 2px;
    }
    #github .gh-repo:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.07);
    }
    #github .gh-repo:hover::after {
      transform: scaleX(1);
    }
    #github .gh-repo .pname {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    #github .gh-repo .pdesc {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    #github .gh-repo .pstack {
      margin-top: auto;
    }
    #github .gh-repo .sb i {
      margin-right: 4px;
    }
    #github .gh-msg {
      grid-column: 1 / -1;
      text-align: center;
      font-size: 0.85rem;
      color: var(--text2);
      padding: 28px 0;
    }
    #github .gh-msg a {
      color: var(--accent);
    }

    @media (max-width: 820px) {
      #github .gh-grid {
        grid-template-columns: 1fr;
        gap: 32px;
      }
      #github .gh-sub {
        margin-top: 40px;
      }
      #github .gh-contrib {
        padding: 18px 16px 14px;
      }
    }
  `;
  document.head.appendChild(style);

  // ---------- kerangka section ----------
  const sec = document.createElement('section');
  sec.id = 'github';
  sec.innerHTML =
    '<div class="inner">' +
    '<div class="lbl r">GitHub</div>' +
    '<h2 class="st r d1">GitHub <em>Saya</em></h2>' +
    '<div class="sep r d2"></div>' +
    '<div class="gh-grid">' +
    '<div class="r d1">' +
    '<div class="gh-card">' +
    '<div class="avt"><img id="ghAvatar" src="https://github.com/' + GH_USER + '.png" alt="Foto profil GitHub" /></div>' +
    '<div class="aname" id="ghName"></div>' +
    '<div class="arole" id="ghUser"></div>' +
    '<div class="adiv"></div>' +
    '<div class="ameta" id="ghMeta"></div>' +
    '</div>' +
    '</div>' +
    '<div class="atext r d2">' +
    '<p id="ghBio"></p>' +
    '<div class="astats">' +
    '<div class="astat"><div class="astn" id="ghRepos" data-count="0">0</div><div class="astl">Repository</div></div>' +
    '<div class="astat"><div class="astn" id="ghStars" data-count="0">0</div><div class="astl">Bintang</div></div>' +
    '<div class="astat"><div class="astn" id="ghFollowers" data-count="0">0</div><div class="astl">Follower</div></div>' +
    '</div>' +
    '<div class="gh-langs" id="ghLangsBox" style="display:none">' +
    '<div class="gh-ltitle">Bahasa yang sering dipakai</div>' +
    '<div class="gh-lbar" id="ghLbar"></div>' +
    '<div class="chips" id="ghLchips"></div>' +
    '</div>' +
    '<a class="btn bb gh-btn" target="_blank" rel="noopener" href="https://github.com/' + GH_USER + '">' +
    '<i class="fab fa-github"></i>Lihat Profil</a>' +
    '</div>' +
    '</div>' +

    '<div class="gh-sub r">Kontribusi setahun terakhir</div>' +
    '<div class="gh-contrib r d1">' +
    '<div class="gh-chead">' +
    '<div class="gh-ctotal"><b id="ghCTotal">-</b>kontribusi dalam setahun terakhir</div>' +
    '<div class="gh-legend"><span>Sedikit</span>' +
    '<i class="gh-day"></i><i class="gh-day lv1"></i><i class="gh-day lv2"></i><i class="gh-day lv3"></i><i class="gh-day lv4"></i>' +
    '<span>Banyak</span></div>' +
    '</div>' +
    '<div class="gh-cscroll" id="ghCScroll">' +
    '<div class="gh-cinner">' +
    '<div class="gh-months" id="ghMonths"></div>' +
    '<div class="gh-cal" id="ghCal"></div>' +
    '</div>' +
    '</div>' +
    '<div class="gh-cmsg" id="ghCMsg">Memuat kontribusi...</div>' +
    '<div class="gh-cstats" id="ghCStats"></div>' +
    '</div>' +

    '<div class="gh-sub r">Repository terbaru</div>' +
    '<div class="pgrid" id="ghList"><div class="gh-msg">Memuat repo terbaru...</div></div>' +
    '</div>';

  // taruh sebagai section sendiri, tepat sebelum Contact
  const contact = document.getElementById('contact');
  if (contact) contact.parentNode.insertBefore(sec, contact);
  else {
    const footer = document.querySelector('footer');
    if (footer) footer.parentNode.insertBefore(sec, footer);
    else document.body.appendChild(sec);
  }

  const elAvatar = document.getElementById('ghAvatar');
  const elName = document.getElementById('ghName');
  const elUser = document.getElementById('ghUser');
  const elMeta = document.getElementById('ghMeta');
  const elBio = document.getElementById('ghBio');
  const elList = document.getElementById('ghList');
  const elLangsBox = document.getElementById('ghLangsBox');
  const elLbar = document.getElementById('ghLbar');
  const elLchips = document.getElementById('ghLchips');
  const elCTotal = document.getElementById('ghCTotal');
  const elCScroll = document.getElementById('ghCScroll');
  const elMonths = document.getElementById('ghMonths');
  const elCal = document.getElementById('ghCal');
  const elCMsg = document.getElementById('ghCMsg');
  const elCStats = document.getElementById('ghCStats');

  elName.textContent = GH_USER;
  elUser.textContent = '@' + GH_USER;

  // ---------- animasi muncul (pakai class .r / .v bawaan style.css) ----------
  let obs = null;
  if ('IntersectionObserver' in window) {
    obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add('v');
          obs.unobserve(en.target);
          en.target.querySelectorAll('[data-count]').forEach(function (n) {
            countUp(n, parseInt(n.dataset.count, 10) || 0);
          });
        });
      },
      { threshold: 0.1 }
    );
  }
  function watch(el) {
    if (obs) obs.observe(el);
    else {
      el.classList.add('v');
      el.querySelectorAll('[data-count]').forEach(function (n) {
        n.textContent = n.dataset.count;
      });
    }
  }
  sec.querySelectorAll('.r').forEach(watch);

  function countUp(el, target) {
    if (!target) {
      el.textContent = '0';
      return;
    }
    const dur = 900;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ---------- helper ----------
  function mk(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function fmtDate(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function fmtMonth(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  }

  function langColor(l) {
    return LANG_COLORS[l] || '#8892b0';
  }

  function addMeta(iconClass, text) {
    const row = mk('div', 'amr');
    row.appendChild(mk('i', iconClass));
    row.appendChild(mk('span', '', text));
    elMeta.appendChild(row);
  }

  function setCount(id, value) {
    const n = document.getElementById(id);
    n.dataset.count = value;
    // kalau sudah terlihat di layar, langsung animasikan
    if (n.closest('.r') && n.closest('.r').classList.contains('v')) countUp(n, value);
  }

  function readCache(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (Date.now() - obj.time > GH_CACHE_MIN * 60 * 1000) return null;
      return obj.data;
    } catch (e) {
      return null;
    }
  }

  function writeCache(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify({ time: Date.now(), data: data }));
    } catch (e) {}
  }

  // ---------- isi data profil + repo ----------
  function render(data) {
    const user = data.user;
    const own = data.repos.filter(function (r) { return !r.fork; });
    const stars = own.reduce(function (s, r) { return s + (r.stargazers_count || 0); }, 0);

    elName.textContent = user.name || user.login || GH_USER;
    elUser.textContent = '@' + (user.login || GH_USER);
    elBio.textContent =
      user.bio || 'Pelajar yang suka ngoding dan membangun aplikasi web. Semua project terbaru saya diunggah ke GitHub.';

    elMeta.innerHTML = '';
    addMeta('fas fa-code-branch', (user.public_repos || 0) + ' repository publik');
    if (user.created_at) addMeta('fas fa-calendar', 'Bergabung ' + fmtMonth(user.created_at));
    if (user.location) addMeta('fas fa-map-marker-alt', user.location);
    addMeta('fas fa-link', 'github.com/' + (user.login || GH_USER));

    setCount('ghRepos', user.public_repos || 0);
    setCount('ghStars', stars);
    setCount('ghFollowers', user.followers || 0);

    // bahasa
    // const counts = {};
    // own.forEach(function (r) {
    //   if (r.language) counts[r.language] = (counts[r.language] || 0) + 1;
    // });
    // const langs = Object.keys(counts)
    //   .map(function (k) { return { name: k, n: counts[k] }; })
    //   .sort(function (a, b) { return b.n - a.n; })
    //   .slice(0, 6);
    // const total = langs.reduce(function (s, l) { return s + l.n; }, 0);

    // if (total) {
    //   elLangsBox.style.display = '';
    //   elLbar.innerHTML = '';
    //   elLchips.innerHTML = '';
    //   langs.forEach(function (l) {
    //     const pct = Math.round((l.n / total) * 100);

    //     const seg = document.createElement('span');
    //     seg.style.width = (l.n / total) * 100 + '%';
    //     seg.style.background = langColor(l.name);
    //     seg.title = l.name + ' ' + pct + '%';
    //     elLbar.appendChild(seg);

    //     const chip = mk('span', 'chip');
    //     const dot = mk('i', 'gh-dot');
    //     dot.style.background = langColor(l.name);
    //     chip.appendChild(dot);
    //     chip.appendChild(document.createTextNode(l.name + ' ' + pct + '%'));
    //     elLchips.appendChild(chip);
    //   });
    // }

    // repo terbaru
    elList.innerHTML = '';
    const latest = own.slice(0, GH_SHOW);

    if (!latest.length) {
      elList.appendChild(mk('div', 'gh-msg', 'Belum ada repository publik.'));
      return;
    }

    latest.forEach(function (r, i) {
      const cell = mk('div', 'gh-cell r' + (i % 2 ? ' d1' : ''));

      const a = mk('a', 'gh-repo');
      a.href = r.html_url;
      a.target = '_blank';
      a.rel = 'noopener';

      a.appendChild(mk('div', 'pcat', r.language || 'Repository'));
      a.appendChild(mk('div', 'pname', r.name));
      a.appendChild(mk('p', 'pdesc', r.description || 'Belum ada deskripsi untuk repository ini.'));

      const stack = mk('div', 'pstack');

      const sStar = mk('span', 'sb');
      sStar.appendChild(mk('i', 'fas fa-star'));
      sStar.appendChild(document.createTextNode(String(r.stargazers_count || 0)));
      stack.appendChild(sStar);

      const sDate = mk('span', 'sb');
      sDate.appendChild(mk('i', 'far fa-clock'));
      sDate.appendChild(document.createTextNode(fmtDate(r.pushed_at || r.updated_at)));
      stack.appendChild(sDate);

      (r.topics || []).slice(0, 3).forEach(function (t) {
        stack.appendChild(mk('span', 'sb', t));
      });

      a.appendChild(stack);
      cell.appendChild(a);
      elList.appendChild(cell);
      watch(cell);
    });
  }

  function showError() {
    elList.innerHTML = '';
    const m = mk('div', 'gh-msg', 'Data GitHub belum bisa dimuat. Lihat langsung di ');
    const link = mk('a', '', 'github.com/' + GH_USER);
    link.href = 'https://github.com/' + GH_USER;
    link.target = '_blank';
    link.rel = 'noopener';
    m.appendChild(link);
    m.appendChild(document.createTextNode('.'));
    elList.appendChild(m);
  }

  // ---------- grafik kontribusi ----------
  function showContribError() {
    elCTotal.textContent = '-';
    elCMsg.textContent = 'Grafik kontribusi belum bisa dimuat. Lihat langsung di ';
    const link = mk('a', '', 'github.com/' + GH_USER);
    link.href = 'https://github.com/' + GH_USER;
    link.target = '_blank';
    link.rel = 'noopener';
    elCMsg.appendChild(link);
    elCMsg.appendChild(document.createTextNode('.'));
  }

  function renderContrib(data) {
    const list = (data && data.contributions) || [];
    if (!list.length) {
      showContribError();
      return;
    }

    elCMsg.style.display = 'none';
    elCal.innerHTML = '';
    elMonths.innerHTML = '';

    // kolom pertama dimulai dari hari Minggu, jadi isi kotak kosong sesuai hari pertama data
    const offset = new Date(list[0].date + 'T00:00:00').getDay();
    for (let p = 0; p < offset; p++) elCal.appendChild(mk('i', 'gh-day gh-pad'));

    let total = 0;
    let run = 0;
    let longest = 0;
    let best = null;
    let lastMonth = -1;
    const labels = [];

    list.forEach(function (c, i) {
      const cell = mk('i', 'gh-day lv' + (c.level || 0));
      cell.title = c.count + ' kontribusi pada ' + fmtDate(c.date);
      elCal.appendChild(cell);

      total += c.count;
      if (c.count > 0) {
        run++;
        if (run > longest) longest = run;
      } else {
        run = 0;
      }
      if (!best || c.count > best.count) best = c;

      const week = Math.floor((offset + i) / 7);
      const m = new Date(c.date + 'T00:00:00').getMonth();
      if (m !== lastMonth) {
        labels.push({ week: week, m: m });
        lastMonth = m;
      }
    });

    // label bulan di atas grafik (lewati yang terlalu dekat dengan label berikutnya)
    const weeks = Math.ceil((offset + list.length) / 7);
    elMonths.style.setProperty('--w', weeks);
    labels.forEach(function (l, idx) {
      const next = labels[idx + 1];
      if (next && next.week - l.week < 3) return;
      const s = mk('span', '', MONTHS[l.m]);
      s.style.gridColumn = l.week + 1 + ' / span 3';
      elMonths.appendChild(s);
    });

    elCTotal.textContent = total.toLocaleString('id-ID');

    // statistik tambahan
    elCStats.innerHTML = '';
    function addStat(boldText, rest) {
      const s = mk('span', 'gh-cs');
      s.appendChild(mk('b', '', boldText));
      s.appendChild(document.createTextNode(' ' + rest));
      elCStats.appendChild(s);
    }
    addStat(longest + ' hari', 'beruntun terpanjang');
    if (best && best.count > 0) {
      addStat(best.count + ' kontribusi', 'di hari paling aktif (' + fmtDate(best.date) + ')');
    }

    // geser ke kanan supaya bagian terbaru kelihatan (penting di HP)
    requestAnimationFrame(function () {
      elCScroll.scrollLeft = elCScroll.scrollWidth;
    });
  }

  // ---------- ambil data ----------
  // profil + repo
  const cached = readCache(CACHE_KEY);
  if (cached) {
    render(cached);
  } else {
    Promise.all([
      fetch('https://api.github.com/users/' + GH_USER).then(function (r) {
        if (!r.ok) throw new Error('user ' + r.status);
        return r.json();
      }),
      fetch('https://api.github.com/users/' + GH_USER + '/repos?per_page=100&sort=pushed&direction=desc').then(function (r) {
        if (!r.ok) throw new Error('repos ' + r.status);
        return r.json();
      }),
    ])
      .then(function (res) {
        const data = { user: res[0], repos: res[1] };
        writeCache(CACHE_KEY, data);
        render(data);
      })
      .catch(function () {
        showError();
      });
  }

  // kontribusi (dari API publik pihak ketiga, terpisah supaya kalau gagal bagian lain tetap jalan)
  const cachedContrib = readCache(CONTRIB_KEY);
  if (cachedContrib) {
    renderContrib(cachedContrib);
  } else {
    fetch('https://github-contributions-api.jogruber.de/v4/' + GH_USER + '?y=last')
      .then(function (r) {
        if (!r.ok) throw new Error('contrib ' + r.status);
        return r.json();
      })
      .then(function (data) {
        writeCache(CONTRIB_KEY, data);
        renderContrib(data);
      })
      .catch(function () {
        showContribError();
      });
  }
})();