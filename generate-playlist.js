const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "music");
const exts = [".mp3", ".ogg", ".wav", ".m4a"];

if (!fs.existsSync(dir)) {
  console.error('Folder "music" belum ada. Buat dulu dan masukin lagunya.');
  process.exit(1);
}

const songs = fs
  .readdirSync(dir)
  .filter((f) => exts.includes(path.extname(f).toLowerCase()))
  .sort()
  .map((f) => ({
    file: "music/" + encodeURIComponent(f),
    title: path
      .basename(f, path.extname(f))
      .replace(/[_-]+/g, " ")
      .trim(),
  }));

fs.writeFileSync(
  path.join(__dirname, "songs.js"),
  "window.SONGS = " + JSON.stringify(songs, null, 2) + ";\n",
);

console.log("Selesai: " + songs.length + " lagu masuk playlist");