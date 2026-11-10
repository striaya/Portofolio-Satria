// Chatbot "Tanya Satria": asisten otomatis berbasis kata kunci (tanpa AI, tanpa API key).
// Untuk menambah atau mengubah jawaban, edit daftar KB di bawah.
(function () {
  const BOT_NAME = 'Tanya Satria';

  const WA_LINK =
    'https://wa.me/6285716700904?text=' +
    encodeURIComponent('Halo Satria, aku lihat portofolio kamu dan mau tanya sesuatu.');
  const EMAIL = 'shenggaryoselino@gmail.com';

  // ---------- isi pengetahuan ----------
  // kw   : kata kunci. Tambahkan ^angka untuk bobot (default 2). Frasa lebih dari satu kata dihitung lebih kuat.
  // a    : jawaban
  // acts : tombol aksi di bawah jawaban. { t: 'label', s: 'id-section' } atau { t: 'label', u: 'https://...' }
  // next : saran pertanyaan lanjutan
  const KB = [
    {
      id: 'greet',
      kw: ['halo', 'hai', 'hi', 'hello', 'hallo', 'hey', 'pagi', 'siang', 'sore', 'malam', 'assalamualaikum', 'permisi', 'p^1'],
      a: 'Halo! Senang kamu mampir. Mau tahu soal skill, project, pengalaman, atau cara menghubungi Satria? Tinggal tanya aja.',
    },
    {
      id: 'thanks',
      kw: ['makasih', 'terima kasih', 'thanks', 'thx', 'thank you', 'tengkyu', 'mantap', 'keren', 'oke makasih'],
      a: 'Sama-sama! Kalau masih ada yang mau ditanyakan, aku di sini.',
    },
    {
      id: 'bye',
      kw: ['bye', 'dadah', 'sampai jumpa', 'pamit', 'selesai', 'udah cukup', 'cukup'],
      a: 'Sampai jumpa! Terima kasih sudah mampir ke website Satria.',
    },
    {
      id: 'bot',
      kw: ['kamu bot', 'kamu ai', 'kamu robot', 'chatgpt', 'gemini', 'claude', 'manusia', 'asli', 'kamu siapa', 'siapa kamu', 'bot', 'ai^1.5'],
      a: 'Aku asisten otomatis di website Satria. Aku bukan AI sungguhan: aku mencocokkan kata kunci pertanyaanmu dengan jawaban yang sudah disiapkan Satria. Kalau pertanyaanmu belum ada jawabannya, kamu bisa kirim pesan langsung ke Satria.',
      acts: [{ t: 'Hubungi Satria', u: WA_LINK }],
    },
    {
      id: 'help',
      kw: ['bantuan', 'help', 'menu', 'bisa tanya apa', 'bisa nanya apa', 'tanya apa', 'fitur', 'topik', 'bisa apa kamu'],
      a: 'Kamu bisa tanya soal:\n• Siapa Satria dan sekolahnya\n• Skill dan teknologi\n• Project yang pernah dibuat\n• Pengalaman organisasi\n• Jasa pembuatan website\n• Cara menghubungi\n• Mini game dan musik di website ini',
    },
    {
      id: 'about',
      kw: ['siapa satria', 'tentang satria', 'perkenalan', 'kenalan', 'profil', 'nama', 'siapa dia', 'siapa pemilik', 'siapa ini', 'about', 'tentang', 'siapa^1.5'],
      a: 'Satria Henggar Yoselino adalah siswa kelas XII jurusan RPL di SMK Negeri 64 Jakarta. Ia fokus ke backend development: membuat sistem website, mengelola database, dan membangun API. Sudah sekitar 3 tahun belajar coding dan punya sekitar 30 project.',
      acts: [{ t: 'Lihat About', s: 'about' }],
      next: ['Skill apa saja?', 'Project apa saja?', 'Pengalaman organisasi'],
    },
    {
      id: 'school',
      kw: ['sekolah', 'smk', 'kelas', 'jurusan', 'rpl', 'pelajar', 'siswa', 'sma', 'kuliah', 'umur', 'angkatan'],
      a: 'Satria bersekolah di SMK Negeri 64 Jakarta, jurusan Rekayasa Perangkat Lunak (RPL), sekarang di kelas XII.',
    },
    {
      id: 'location',
      kw: ['tinggal', 'domisili', 'lokasi', 'dimana', 'di mana', 'alamat', 'jakarta', 'kota', 'asal', 'daerah'],
      a: 'Satria tinggal di Jakarta Timur, Indonesia.',
    },
    {
      id: 'skills',
      kw: ['skill', 'keahlian', 'kemampuan', 'teknologi', 'stack', 'tech', 'jago', 'bisa apa', 'bahasa pemrograman', 'programming', 'coding apa', 'ngoding apa',
        'javascript^1.5', 'typescript^1.5', 'php^1.5', 'golang^1.5', 'java^1.5', 'dart^1.5', 'flutter^1.5', 'godot^1.5', 'mysql^1.5', 'figma^1.5', 'git^1.5'],
      a: 'Teknologi yang dipakai Satria:\n• Bahasa: JavaScript, TypeScript, PHP, Golang, Java, Dart, C#\n• Framework dan library: React dan Laravel\n• Database: MySQL\n• Tools: Git/GitHub, Figma, Godot\n\nSekarang ia lagi fokus mendalami React dan Laravel.',
      acts: [{ t: 'Lihat skill di About', s: 'about' }],
      next: ['Project apa saja?', 'Bisa bikin website?'],
    },
    {
      id: 'backend',
      kw: ['backend', 'back end', 'api', 'database', 'server', 'rest api', 'laravel^2.5', 'react^2.5'],
      a: 'Satria tertarik ke sisi backend: membuat sistem website, mengelola database, dan mengembangkan API supaya aplikasi web berjalan stabil dan efisien. Ia memakai Laravel (PHP) dan MySQL, serta belajar Golang. Untuk sisi tampilan ia memakai React dan JavaScript.',
      next: ['Project apa saja?', 'Skill apa saja?'],
    },
    {
      id: 'learning',
      kw: ['lagi belajar', 'sedang belajar', 'belajar apa', 'lagi fokus', 'fokus', 'target', 'tujuan', 'cita cita', 'rencana'],
      a: 'Saat ini Satria lagi fokus belajar React dan Laravel secara lebih serius. Targetnya sebagai pelajar: terus belajar dengan konsisten untuk memperdalam Software Engineering.',
    },
    {
      id: 'start',
      kw: ['sejak kapan', 'mulai coding', 'mulai ngoding', 'awal mula', 'berapa lama', 'pengalaman coding', 'udah berapa lama', 'kapan mulai', 'tahun'],
      a: 'Satria mulai belajar coding sejak kelas X, jadi sekitar 3 tahun. Awalnya dari YouTube, FreeCodeCamp, SantriKoding, dan PetaniKode, lalu dilanjutkan lewat tugas sekolah dan project mandiri.',
    },
    {
      id: 'platforms',
      kw: ['belajar dari mana', 'belajar dimana', 'dicoding', 'freecodecamp', 'petanikode', 'santrikoding', 'youtube', 'kursus', 'otodidak', 'belajar mandiri', 'sumber belajar'],
      a: 'Satria belajar secara mandiri lewat berbagai platform: Dicoding, FreeCodeCamp, PetaniKode, SantriKoding, dan YouTube. Ia juga rajin membaca dokumentasi dan mempraktikkannya lewat project kecil.',
      acts: [{ t: 'Lihat pengalaman', s: 'experience' }],
    },
    {
      id: 'projects',
      kw: ['project', 'proyek', 'portofolio', 'portfolio', 'karya', 'hasil karya', 'pernah bikin', 'pernah buat', 'bikin apa', 'buat apa', 'website apa'],
      a: 'Beberapa project Satria:\n• Website e-commerce Ducati (Laravel)\n• Sistem parkir Warung Woenak (Laravel + React)\n• RFID Absensi System (PHP + IoT)\n• Desain UI aplikasi pemesanan makanan di Figma\n• Landing page UMKM Nasi Pecel (React)\n\nTotalnya sekitar 30 project. Mau tahu detail yang mana?',
      acts: [
        { t: 'Lihat Project', s: 'projects' },
        { t: 'GitHub', u: 'https://github.com/striaya' },
      ],
      next: ['Project Ducati', 'RFID Absensi', 'Sistem parkir'],
    },
    {
      id: 'ducati',
      kw: ['ducati^4', 'ecommerce^3', 'e commerce^3', 'motor^2', 'toko online^2'],
      a: 'Website e-commerce Ducati: tampilan elegan, modern, dan berkelas untuk memamerkan lini motor Ducati, responsif dan nyaman dibuka di berbagai perangkat. Dibangun dengan Laravel, Blade, JavaScript, PHP, dan MySQL.',
      acts: [{ t: 'Lihat Project', s: 'projects' }],
    },
    {
      id: 'parkir',
      kw: ['parkir^4', 'woenak^4', 'warung^3', 'kendaraan^2'],
      a: 'Parkir Warung Woenak adalah sistem manajemen parkir: mencatat kendaraan masuk dan keluar, mengelola data parkir, dan menampilkan laporan digital supaya pengelolaan parkir lebih rapi. Dibangun dengan Laravel, React, PHP, JavaScript, dan MySQL.',
      acts: [{ t: 'Lihat Project', s: 'projects' }],
    },
    {
      id: 'rfid',
      kw: ['rfid^4', 'absensi^4', 'absen^3', 'iot^3', 'kartu^2', 'kehadiran^3'],
      a: 'RFID Absensi System: aplikasi web yang mencatat kehadiran otomatis lewat kartu RFID. Data langsung masuk ke database dan bisa dilihat di dashboard admin lengkap dengan rekap dan laporan. Dibangun dengan PHP, MySQL, dan modul RFID.',
      acts: [{ t: 'Lihat Project', s: 'projects' }],
    },
    {
      id: 'figma',
      kw: ['figma^4', 'ui^3', 'ux^3', 'desain^3', 'design^3', 'mcd^4', 'mcdonald^4', 'mcdonalds^4', 'pemesanan makanan^4', 'food ordering^4'],
      a: 'Satria juga membuat desain UI di Figma, misalnya konsep aplikasi pemesanan makanan bertema McDonald\'s: halaman menu, detail produk, keranjang, dan checkout dengan tampilan modern dan mudah dipakai.',
      acts: [{ t: 'Lihat Project', s: 'projects' }],
    },
    {
      id: 'pecel',
      kw: ['pecel^4', 'nasi pecel^4', 'umkm^4', 'landing page^3', 'landing^3'],
      a: 'Landing page UMKM Nasi Pecel: website untuk usaha UMKM yang responsif, ramah SEO, dan dilengkapi katalog produk. Dibangun dengan React dan JavaScript.',
      acts: [{ t: 'Lihat Project', s: 'projects' }],
    },
    {
      id: 'experience',
      kw: ['pengalaman', 'organisasi', 'ekskul', 'ekstrakurikuler', 'ekstrakulikuler', 'jabatan', 'kegiatan', 'aktif', 'experience', 'workshop', 'event'],
      a: 'Pengalaman Satria:\n• Ketua Divisi Taekwondo (sejak Agustus 2025)\n• Wakil Ketua Divisi Robotik (sejak Maret 2025)\n• Event dan workshop Software Engineering di luar sekolah\n• Belajar mandiri lewat platform online',
      acts: [{ t: 'Lihat Pengalaman', s: 'experience' }],
      next: ['Taekwondo', 'Robotik'],
    },
    {
      id: 'taekwondo',
      kw: ['taekwondo^4', 'tkd^3', 'bela diri^3', 'olahraga^2', 'ketua divisi^2'],
      a: 'Di ekstrakurikuler Taekwondo, Satria menjabat Ketua Divisi sejak Agustus 2025. Tugasnya mengoordinasikan latihan rutin, membantu pelatih membimbing anggota baru, menjaga kedisiplinan dan kekompakan, serta mengorganisir tim untuk pertandingan atau demonstrasi di sekolah.',
      acts: [{ t: 'Lihat Pengalaman', s: 'experience' }],
    },
    {
      id: 'robotik',
      kw: ['robotik^4', 'robot^4', 'robotika^4', 'wakil ketua^3', 'elektronika^3', 'arduino^3'],
      a: 'Di ekstrakurikuler Robotik, Satria menjabat Wakil Ketua Divisi sejak Maret 2025. Ia membantu mengoordinasikan kegiatan, mendampingi anggota belajar dasar perakitan dan pemrograman robot, dan ikut membuat proyek robot sederhana bersama tim.',
      acts: [{ t: 'Lihat Pengalaman', s: 'experience' }],
    },
    {
      id: 'competition',
      kw: ['lomba', 'juara', 'prestasi', 'penghargaan', 'kompetisi', 'menang', 'sertifikat', 'award', 'web design'],
      a: 'Satria pernah mengikuti lomba web design tingkat kota, dan aktif di berbagai kegiatan sekolah.',
    },
    {
      id: 'service',
      kw: ['freelance', 'jasa', 'order', 'pesan website', 'bikin website', 'buat website', 'buatin', 'bayar', 'harga', 'tarif', 'biaya', 'hire', 'rekrut',
        'bisa bikin', 'bisa buat', 'pembuatan website', 'tersedia', 'kerja sama', 'kolaborasi', 'pkl', 'tugas'],
      a: 'Bisa! Satria menerima jasa pembuatan website, misalnya landing page, company profile, web app sederhana dengan database, dan desain UI di Figma. Harga menyesuaikan kebutuhan, jadi paling enak langsung diskusi dulu lewat WhatsApp atau form kontak.',
      acts: [
        { t: 'Chat WhatsApp', u: WA_LINK },
        { t: 'Form Kontak', s: 'contact' },
      ],
      next: ['Cara menghubungi', 'Project apa saja?'],
    },
    {
      id: 'contact',
      kw: ['kontak', 'hubungi', 'menghubungi', 'contact', 'email', 'wa', 'whatsapp', 'instagram', 'ig', 'sosmed', 'media sosial', 'nomor', 'telepon', 'hp', 'dm', 'chat'],
      a: 'Cara menghubungi Satria:\n• WhatsApp: +62 857-1670-0904\n• Email: ' + EMAIL + '\n• Instagram: @striayoselino\n• GitHub: striaya\n\nAtau kirim pesan lewat form kontak di bagian bawah website.',
      acts: [
        { t: 'WhatsApp', u: WA_LINK },
        { t: 'Email', u: 'mailto:' + EMAIL },
        { t: 'Instagram', u: 'https://instagram.com/striayoselino' },
        { t: 'Form Kontak', s: 'contact' },
      ],
    },
    {
      id: 'github',
      kw: ['github', 'repo', 'repository', 'source code', 'kode sumber', 'kontribusi', 'commit'],
      a: 'Akun GitHub Satria adalah striaya. Di bagian GitHub website ini ada profil, grafik kontribusi setahun terakhir, dan repository terbarunya, semuanya diambil otomatis dari GitHub.',
      acts: [
        { t: 'Lihat bagian GitHub', s: 'github' },
        { t: 'Buka GitHub', u: 'https://github.com/striaya' },
      ],
    },
    {
      id: 'game',
      kw: ['game', 'main', 'bermain', 'asteroid', 'skor', 'score', 'high score', 'tembak', 'pesawat'],
      a: 'Ada mini game Asteroid Shooter di bagian Home. Tekan Start, gerakkan pesawat dengan tombol panah (di HP pakai tombol di layar), dan tembak dengan Space atau tombol TEMBAK. Skor tertingginya tersimpan di browsermu, jadi coba pecahkan rekor sendiri!',
      acts: [{ t: 'Main sekarang', s: 'home' }],
    },
    {
      id: 'music',
      kw: ['musik', 'lagu', 'music', 'song', 'player', 'putar', 'volume', 'playlist'],
      a: 'Pemutar musik ada di bagian atas halaman, tepat di bawah navbar. Kamu bisa play atau pause dan ganti lagu dengan tombol sebelumnya atau berikutnya. Di sebelahnya ada visualizer kecil yang bergerak mengikuti lagu.',
    },
    {
      id: 'site',
      kw: ['website ini', 'web ini', 'dibuat pakai', 'dibikin pakai', 'dibuat dengan', 'dibikin pake', 'dibuat pake', 'pakai apa', 'pake apa', 'vercel', 'three js', 'threejs', 'framework', 'vanilla', 'html css'],
      a: 'Website ini dibuat dengan HTML, CSS, dan JavaScript murni tanpa framework. Latar 3D di bagian atas memakai Three.js, dan ada mini game, pemutar musik dengan visualizer, statistik GitHub otomatis, serta chatbot ini. Website di-deploy lewat Vercel.',
      acts: [{ t: 'Lihat GitHub', u: 'https://github.com/striaya' }],
    },
  ];

  const DEFAULT_CHIPS = ['Siapa Satria?', 'Skill apa saja?', 'Project apa saja?', 'Bisa bikin website?', 'Cara menghubungi'];

  const FALLBACK = {
    a: 'Hmm, aku belum paham pertanyaan itu. Aku cuma asisten otomatis, jadi baru bisa menjawab seputar Satria, skill, project, pengalaman, jasa website, dan cara menghubungi. Kalau mau tanya langsung ke Satria, kirim saja pesan lewat WhatsApp atau form kontak.',
    acts: [
      { t: 'Chat WhatsApp', u: WA_LINK },
      { t: 'Form Kontak', s: 'contact' },
    ],
  };

  // ---------- pencocokan kata kunci ----------
  function norm(s) {
    return String(s)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function lev(a, b) {
    if (a === b) return 0;
    const m = a.length;
    const n = b.length;
    if (Math.abs(m - n) > 1) return 2;
    let prev = [];
    for (let j = 0; j <= n; j++) prev[j] = j;
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[n];
  }

  // siapkan kata kunci sekali saja
  KB.forEach(function (it) {
    it._kw = it.kw
      .map(function (raw) {
        const parts = raw.split('^');
        return { k: norm(parts[0]), w: parts[1] ? parseFloat(parts[1]) : 2 };
      })
      .filter(function (x) { return x.k; });
  });

  function scoreOf(it, text, tokens) {
    let s = 0;
    it._kw.forEach(function (x) {
      if (x.k.indexOf(' ') > -1) {
        if ((' ' + text + ' ').indexOf(' ' + x.k + ' ') > -1) s += x.w + 1;
        return;
      }
      for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        if (t === x.k) { s += x.w; return; }
        if (x.k.length >= 5 && t.length >= 5 && lev(t, x.k) <= 1) { s += x.w * 0.75; return; }
        if (x.k.length >= 4 && t.length > x.k.length && t.indexOf(x.k) === 0) { s += x.w * 0.75; return; }
      }
    });
    return s;
  }

  function findAnswer(input) {
    const text = norm(input);
    if (!text) return null;
    const tokens = text.split(' ');
    let best = null;
    let bestScore = 0;
    KB.forEach(function (it) {
      const sc = scoreOf(it, text, tokens);
      if (sc > bestScore) {
        bestScore = sc;
        best = it;
      }
    });
    return bestScore >= 1.5 ? best : null;
  }

  // ---------- tampilan ----------
  const style = document.createElement('style');
  style.textContent = `
    #tsFab {
      position: fixed;
      right: 16px;
      bottom: 52px;
      z-index: 950;
      display: flex;
      align-items: center;
      gap: 8px;
      height: 46px;
      padding: 0 18px 0 16px;
      border: none;
      border-radius: 100px;
      background: var(--accent, #2d5be3);
      color: #fff;
      font-family: var(--ff, 'Plus Jakarta Sans', sans-serif);
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(45, 91, 227, 0.32);
      transition: transform 0.2s, opacity 0.2s, background 0.2s;
      -webkit-tap-highlight-color: transparent;
    }
    #tsFab:hover {
      background: #2248c4;
      transform: translateY(-2px);
    }
    #tsFab i {
      font-size: 1rem;
    }
    #tsFab .ts-ping {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--a2, #e85d3a);
      border: 2px solid var(--bg, #f7f6f3);
    }
    #tsFab .ts-ping::after {
      content: "";
      position: absolute;
      inset: -2px;
      border-radius: 50%;
      border: 2px solid var(--a2, #e85d3a);
      animation: tsPing 1.8s infinite;
    }
    @keyframes tsPing {
      from { transform: scale(1); opacity: 0.8; }
      to   { transform: scale(2.2); opacity: 0; }
    }
    #tsFab.ts-hide {
      opacity: 0;
      transform: scale(0.6);
      pointer-events: none;
    }

    #tsPanel {
      position: fixed;
      right: 16px;
      bottom: 108px;
      z-index: 951;
      width: 350px;
      max-width: calc(100vw - 20px);
      height: 500px;
      max-height: calc(100vh - 180px);
      max-height: calc(100dvh - 180px);
      display: none;
      flex-direction: column;
      background: var(--surface, #fff);
      border: 1.5px solid var(--border, #e8e4dc);
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
      font-family: var(--ff, 'Plus Jakarta Sans', sans-serif);
    }
    #tsPanel.open {
      display: flex;
      animation: tsUp 0.25s ease;
    }
    @keyframes tsUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: none; }
    }
    #tsPanel .ts-head {
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 13px 14px;
      background: var(--bg2, #f0ede8);
      border-bottom: 1px solid var(--border, #e8e4dc);
    }
    #tsPanel .ts-av {
      position: relative;
      width: 38px;
      height: 38px;
      flex-shrink: 0;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--al, #e8eeff);
      color: var(--accent, #2d5be3);
      border: 2px solid rgba(45, 91, 227, 0.18);
    }
    #tsPanel .ts-av img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    #tsPanel .ts-title {
      flex: 1;
      min-width: 0;
    }
    #tsPanel .ts-title b {
      display: block;
      font-family: var(--ffs, 'Lora', serif);
      font-size: 1rem;
      font-weight: 500;
      color: var(--text, #1a1814);
    }
    #tsPanel .ts-title small {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 0.66rem;
      color: var(--text3, #b0aa9f);
    }
    #tsPanel .ts-title small::before {
      content: "";
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #28c840;
    }
    #tsPanel .ts-x {
      width: 30px;
      height: 30px;
      flex-shrink: 0;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: var(--text2, #6b6560);
      font-size: 0.85rem;
      cursor: pointer;
    }
    #tsPanel .ts-x:hover {
      background: var(--border, #e8e4dc);
    }

    #tsMsgs {
      flex: 1;
      overflow-y: auto;
      padding: 16px 14px 8px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: var(--bg, #f7f6f3);
      scroll-behavior: smooth;
    }
    #tsMsgs::-webkit-scrollbar {
      width: 3px;
    }
    #tsMsgs::-webkit-scrollbar-thumb {
      background: var(--border2, #d4cfc5);
      border-radius: 2px;
    }
    #tsPanel .ts-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-width: 88%;
    }
    #tsPanel .ts-row.me {
      align-self: flex-end;
      align-items: flex-end;
    }
    #tsPanel .ts-row.bot {
      align-self: flex-start;
      align-items: flex-start;
    }
    #tsPanel .ts-m {
      padding: 10px 13px;
      border-radius: 14px;
      font-size: 0.84rem;
      line-height: 1.6;
      white-space: pre-line;
      word-wrap: break-word;
      overflow-wrap: anywhere;
    }
    #tsPanel .ts-row.bot .ts-m {
      background: var(--surface, #fff);
      color: var(--text, #1a1814);
      border: 1px solid var(--border, #e8e4dc);
      border-bottom-left-radius: 4px;
    }
    #tsPanel .ts-row.me .ts-m {
      background: var(--accent, #2d5be3);
      color: #fff;
      border-bottom-right-radius: 4px;
    }
    #tsPanel .ts-acts {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    #tsPanel .ts-act {
      padding: 6px 12px;
      border: 1.5px solid var(--accent, #2d5be3);
      border-radius: 100px;
      background: transparent;
      color: var(--accent, #2d5be3);
      font-family: inherit;
      font-size: 0.72rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: 0.2s;
    }
    #tsPanel .ts-act:hover {
      background: var(--accent, #2d5be3);
      color: #fff;
    }
    #tsPanel .ts-typing {
      display: inline-flex;
      gap: 4px;
      padding: 12px 14px;
    }
    #tsPanel .ts-typing i {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--text3, #b0aa9f);
      animation: tsDot 1s infinite;
    }
    #tsPanel .ts-typing i:nth-child(2) { animation-delay: 0.15s; }
    #tsPanel .ts-typing i:nth-child(3) { animation-delay: 0.3s; }
    @keyframes tsDot {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
      30% { transform: translateY(-4px); opacity: 1; }
    }

    #tsChips {
      display: flex;
      gap: 6px;
      padding: 8px 14px;
      overflow-x: auto;
      background: var(--bg, #f7f6f3);
      border-top: 1px solid var(--border, #e8e4dc);
      scrollbar-width: none;
    }
    #tsChips::-webkit-scrollbar {
      display: none;
    }
    #tsChips button {
      flex-shrink: 0;
      padding: 6px 12px;
      border: 1.5px solid var(--border, #e8e4dc);
      border-radius: 100px;
      background: var(--surface, #fff);
      color: var(--text2, #6b6560);
      font-family: inherit;
      font-size: 0.72rem;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      transition: 0.2s;
    }
    #tsChips button:hover {
      border-color: var(--accent, #2d5be3);
      color: var(--accent, #2d5be3);
      background: var(--al, #e8eeff);
    }

    #tsPanel .ts-form {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: var(--surface, #fff);
      border-top: 1px solid var(--border, #e8e4dc);
    }
    #tsPanel .ts-form input {
      flex: 1;
      min-width: 0;
      padding: 10px 13px;
      border: 1.5px solid var(--border, #e8e4dc);
      border-radius: 100px;
      background: var(--bg, #f7f6f3);
      color: var(--text, #1a1814);
      font-family: inherit;
      font-size: 16px; /* 16px supaya iPhone tidak zoom otomatis */
      outline: none;
      transition: 0.2s;
    }
    #tsPanel .ts-form input:focus {
      border-color: var(--accent, #2d5be3);
    }
    #tsPanel .ts-form button {
      width: 40px;
      height: 40px;
      flex-shrink: 0;
      border: none;
      border-radius: 50%;
      background: var(--accent, #2d5be3);
      color: #fff;
      font-size: 0.85rem;
      cursor: pointer;
      transition: 0.2s;
    }
    #tsPanel .ts-form button:hover {
      background: #2248c4;
    }

    @media (max-width: 480px) {
      #tsFab {
        right: 12px;
        bottom: 48px;
        padding: 0 16px 0 14px;
      }
      #tsPanel {
        left: 10px;
        right: 10px;
        width: auto;
        max-width: none;
        bottom: 104px;
        height: 460px;
        max-height: calc(100vh - 170px);
        max-height: calc(100dvh - 170px);
      }
    }
  `;
  document.head.appendChild(style);

  const root = document.createElement('div');
  root.id = 'tsBot';
  root.innerHTML =
    '<button id="tsFab" type="button" aria-label="Buka chat ' + BOT_NAME + '">' +
    '<span class="ts-ping" id="tsPing"></span>' +
    '<i class="fas fa-comment-dots" id="tsFabIcon"></i><span id="tsFabText">' + BOT_NAME + '</span>' +
    '</button>' +
    '<div id="tsPanel" role="dialog" aria-label="' + BOT_NAME + '">' +
    '<div class="ts-head">' +
    '<div class="ts-av"><i class="fas fa-user-astronaut"></i><img src="Me.jpeg" alt="" id="tsAvImg" /></div>' +
    '<div class="ts-title"><b>' + BOT_NAME + '</b><small>Asisten otomatis · bukan AI sungguhan</small></div>' +
    '<button class="ts-x" id="tsClose" type="button" aria-label="Tutup chat"><i class="fas fa-times"></i></button>' +
    '</div>' +
    '<div id="tsMsgs"></div>' +
    '<div id="tsChips"></div>' +
    '<form class="ts-form" id="tsForm" autocomplete="off">' +
    '<input id="tsInput" type="text" placeholder="Ketik pertanyaanmu..." maxlength="120" aria-label="Pertanyaan" />' +
    '<button type="submit" aria-label="Kirim"><i class="fas fa-paper-plane"></i></button>' +
    '</form>' +
    '</div>';
  document.body.appendChild(root);

  const fab = document.getElementById('tsFab');
  const fabIcon = document.getElementById('tsFabIcon');
  const fabText = document.getElementById('tsFabText');
  const ping = document.getElementById('tsPing');
  const panel = document.getElementById('tsPanel');
  const msgs = document.getElementById('tsMsgs');
  const chips = document.getElementById('tsChips');
  const form = document.getElementById('tsForm');
  const input = document.getElementById('tsInput');
  const avImg = document.getElementById('tsAvImg');

  avImg.addEventListener('error', function () {
    avImg.style.display = 'none';
  });

  // ---------- perilaku ----------
  let greeted = false;
  let busy = false;

  function scrollDown() {
    msgs.scrollTop = msgs.scrollHeight;
  }

  function goSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (window.innerWidth <= 600) closePanel();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function addUser(text) {
    const row = document.createElement('div');
    row.className = 'ts-row me';
    const m = document.createElement('div');
    m.className = 'ts-m';
    m.textContent = text;
    row.appendChild(m);
    msgs.appendChild(row);
    scrollDown();
  }

  function buildActs(acts) {
    const wrap = document.createElement('div');
    wrap.className = 'ts-acts';
    acts.forEach(function (a) {
      let el;
      if (a.u) {
        el = document.createElement('a');
        el.href = a.u;
        if (/^https?:/i.test(a.u)) {
          el.target = '_blank';
          el.rel = 'noopener';
        }
      } else {
        el = document.createElement('button');
        el.type = 'button';
        el.addEventListener('click', function () {
          goSection(a.s);
        });
      }
      el.className = 'ts-act';
      el.textContent = a.t;
      wrap.appendChild(el);
    });
    return wrap;
  }

  function addBot(item) {
    const row = document.createElement('div');
    row.className = 'ts-row bot';
    const m = document.createElement('div');
    m.className = 'ts-m';
    m.textContent = item.a;
    row.appendChild(m);
    if (item.acts && item.acts.length) row.appendChild(buildActs(item.acts));
    msgs.appendChild(row);
    scrollDown();
  }

  function setChips(list) {
    chips.innerHTML = '';
    list.forEach(function (q) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = q;
      b.addEventListener('click', function () {
        ask(q);
      });
      chips.appendChild(b);
    });
    chips.scrollLeft = 0;
  }

  function ask(text) {
    text = String(text || '').trim();
    if (!text || busy) return;
    busy = true;
    addUser(text);
    input.value = '';

    // titik-titik mengetik
    const row = document.createElement('div');
    row.className = 'ts-row bot';
    const t = document.createElement('div');
    t.className = 'ts-m ts-typing';
    t.innerHTML = '<i></i><i></i><i></i>';
    row.appendChild(t);
    msgs.appendChild(row);
    scrollDown();

    const found = findAnswer(text);
    const item = found || FALLBACK;
    const delay = Math.min(900, 350 + item.a.length * 3);

    setTimeout(function () {
      row.remove();
      addBot(item);
      setChips(found && found.next ? found.next : DEFAULT_CHIPS);
      busy = false;
    }, delay);
  }

  function openPanel() {
    panel.classList.add('open');
    fabIcon.className = 'fas fa-times';
    fabText.textContent = 'Tutup';
    fab.setAttribute('aria-label', 'Tutup chat ' + BOT_NAME);
    fab.classList.remove('ts-hide');
    if (ping) ping.style.display = 'none';

    if (!greeted) {
      greeted = true;
      addBot({
        a: 'Halo! Aku asisten otomatis Satria. Tanya aja soal skill, project, pengalaman, atau cara menghubungi Satria. Pilih pertanyaan di bawah atau ketik sendiri.',
      });
      setChips(DEFAULT_CHIPS);
    }
    scrollDown();
    // fokus otomatis hanya di perangkat dengan mouse, supaya keyboard HP tidak langsung muncul
    if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) input.focus();
  }

  function closePanel() {
    panel.classList.remove('open');
    fabIcon.className = 'fas fa-comment-dots';
    fabText.textContent = BOT_NAME;
    fab.setAttribute('aria-label', 'Buka chat ' + BOT_NAME);
    updateFabVisibility();
  }

  fab.addEventListener('click', function () {
    if (panel.classList.contains('open')) closePanel();
    else openPanel();
  });
  document.getElementById('tsClose').addEventListener('click', closePanel);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    ask(input.value);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
  });

  // di HP, sembunyikan tombol saat mini game terlihat supaya tidak menutup tombol kontrol game
  let gameVisible = false;
  function updateFabVisibility() {
    const hide = gameVisible && window.innerWidth <= 600 && !panel.classList.contains('open');
    fab.classList.toggle('ts-hide', hide);
  }
  const gameBox = document.querySelector('.gbox');
  if (gameBox && 'IntersectionObserver' in window) {
    new IntersectionObserver(
      function (entries) {
        gameVisible = entries[0].isIntersecting;
        updateFabVisibility();
      },
      { threshold: 0.05 }
    ).observe(gameBox);
  }
  window.addEventListener('resize', updateFabVisibility);
})();