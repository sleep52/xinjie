const fs = require('fs');
const path = require('path');

const HEX = [
  ['#b48cff', '#F0A63C'],
  ['#cbb9f2', '#F5C97A'],
  ['#e2d7ff', '#F5C97A'],
  ['#d9c6ff', '#F5C97A'],
  ['#e6dcff', '#F5F3EF'],
  ['#eceaf7', '#F5F3EF'],
  ['#dcd8f0', '#E8E4DC'],
  ['#dcd6f0', '#E8E4DC'],
  ['#cfcbe6', '#D6D2C9'],
  ['#c8c9dd', '#A9A6A0'],
  ['#c9cbe0', '#A9A6A0'],
  ['#b9b7cc', '#A9A6A0'],
  ['#9a9cb8', '#A9A6A0'],
  ['#8b8da8', '#A9A6A0'],
  ['#cfd0e2', '#C9C6BE'],
  ['#cfcede', '#C9C6BE'],
  ['#b9b3d6', '#C9C6BE'],
  ['#cfc9e8', '#C9C6BE'],
  ['#8b8aa0', '#8A877F'],
  ['#5f6178', '#6E6B66'],
  ['#6b6a80', '#6E6B66'],
  ['#ffd0da', '#FFC9BE'],
  ['#ffb3c4', '#FFC2A8'],
  ['#ff6b81', '#FF7A5C'],
  ['#7ee787', '#6FE3B8'],
  ['#22c55e', '#3ECF8E'],
  ['#7fa8d8', '#7FD9BE'],
  ['#1a1830', '#1A1206'],
  ['#14122a', '#16181D'],
  ['#1c1a32', '#1C1F26'],
  ['#0d1830', '#121A1E'],
  ['#16233f', '#1B2A28'],
  ['#f6f7fb', '#F7F5F0'],
  ['#08071a', '#08090C'],
  ['#0b0a1a', '#0C0D10'],
  ['#2563eb', '#0F8F73'],
  ['#8b5cf6', '#EC8A2C'],
  ['#bfe0ff', '#FFE0A8'],
  ['#ffc0e0', '#A8E8D5'],
];

const RGB = [
  [[15, 13, 30], [12, 13, 16]],
  [[9, 8, 20], [8, 9, 12]],
  [[26, 24, 48], [26, 18, 6]],
  [[124, 92, 255], [240, 166, 60]],
];

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function sub(src) {
  let out = src;
  for (const [a, b] of HEX) {
    out = out.replace(new RegExp(esc(a), 'gi'), b);
    out = out.replace(new RegExp('%23' + esc(a.slice(1)), 'gi'), '%23' + b.slice(1));
  }
  for (const [[r, g, bl], [nr, ng, nb]] of RGB) {
    const re = new RegExp('rgba?\\(\\s*' + r + '\\s*,\\s*' + g + '\\s*,\\s*' + bl + '\\s*(,[^)]*)\\)', 'gi');
    out = out.replace(re, (m, tail) => `rgba(${nr}, ${ng}, ${nb}${tail})`);
  }
  return out;
}

const files = [];
for (const root of ['src/pages', 'src/components', 'src/common', 'src/static']) {
  if (!fs.existsSync(root)) continue;
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(vue|js|css|svg)$/.test(e.name)) files.push(p);
    }
  })(root);
}
files.push('src/pages.json', 'src/manifest.json');

let n = 0;
for (const p of files) {
  const s = fs.readFileSync(p, 'utf8');
  const t = sub(s);
  if (t !== s) { fs.writeFileSync(p, t); n++; console.log('rewrote', p); }
}
console.log('files changed:', n);
