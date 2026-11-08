(function () {
  const audio = document.getElementById("bgMusic");
  const titleEl = document.getElementById("songTitle");
  const icon = document.getElementById("musicIcon");
  const songs = window.SONGS || [];
  let idx = 0;

  audio.loop = false; // biar lanjut ke lagu berikutnya, bukan ngulang satu lagu

  function setIcon() {
    icon.className = audio.paused ? "fas fa-music" : "fas fa-pause";
  }

  function load(i) {
    if (!songs.length) return;
    idx = (i + songs.length) % songs.length;
    audio.src = songs[idx].file;
    titleEl.textContent = songs[idx].title;
  }

  function play() {
    audio.play().then(setIcon).catch(setIcon);
  }

  window.toggleMusic = function () {
    if (!songs.length) return;
    if (audio.paused) play();
    else audio.pause();
  };

  window.nextSong = function () {
    load(idx + 1);
    play();
  };

  window.prevSong = function () {
    load(idx - 1);
    play();
  };

  audio.addEventListener("play", setIcon);
  audio.addEventListener("pause", setIcon);
  audio.addEventListener("ended", window.nextSong);

  if (!songs.length) {
    titleEl.textContent = "Belum ada lagu (jalankan generate-playlist.js)";
  } else {
    load(Math.floor(Math.random() * songs.length)); // mulai dari lagu acak
  }
})();