const songs = (window.SONGS || []).map((s) => ({ src: s.file, title: s.title }));

let currentSong = 0;
let playing = false;

const music = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');

function loadSong(index) {
  if (!songs.length) return; 
  music.src = songs[index].src;
  music.load();
  document.getElementById('songTitle').textContent = songs[index].title;
  if (playing) music.play();
}

function toggleMusic() {
  if (playing) {
    music.pause();
    musicIcon.className = 'fas fa-music';
    musicBtn.classList.add('muted');
    playing = false;
  } else {
    music.play();
    musicIcon.className = 'fas fa-pause';
    musicBtn.classList.remove('muted');
    playing = true;
  }
}

function nextSong() {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
}

function prevSong() {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
}

music.addEventListener('ended', () => nextSong());

document.addEventListener('click', function startMusic() {
  if (!playing) {
    music.volume = 90/100;
    loadSong(currentSong);
    music.play().then(() => {
      playing = true;
      musicIcon.className = 'fas fa-pause';
      musicBtn.classList.remove('muted');
    }).catch(() => {});
  }
  document.removeEventListener('click', startMusic);
}, { once: true });

loadSong(0);

function openTHR() {
  document.getElementById('thrModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeTHR(e) {
  if (!e || e.target === document.getElementById('thrModal')) {
    document.getElementById('thrModal').classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeTHR();
});