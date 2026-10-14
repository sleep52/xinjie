const fs = require('fs');
const path = require('path');

const HEX = [
  ['#4b2e9b', '#3A2C14'],
  ['#7c5cff', '#F7BE52'],
  ['#7c5cf7', '#F7BE52'],
  ['#a855f7', '#EC8A2C'],
  ['#c86bf0', '#DE6C1E'],
  ['#d05ce8', '#EC8A2C'],
  ['#a97cff', '#F0A63C'],
  ['#b9a3ff', '#F5C97A'],
  ['#cbb9ff', '#F5C97A'],
  ['#f472b6', '#E2603A'],
  ['#ff7ab6', '#E2603A'],
  ['#ff9ed8', '#F5C97A'],
  ['#ff5f8d', '#E0662B'],
  ['#f43f8e', '#E0662B'],
  ['#fb7185', '#FF8A3D'],
  ['#3b82f6', '#4FC3A1'],
  ['#22d3ee', '#4FC3A1'],
  ['#8fd0ff', '#7FD9BE'],
  ['#4fa3f7', '#4FC3A1'],
  ['#ffd166', '#F5C97A'],
  ['#ff3b5c', '#FF5A48'],
  ['#241a45', '#1D1A15'],
  ['#1a1430', '#1A1206'],
  ['#17152b', '#16181D'],
  ['#1e1b36', '#1C1F26'],
  ['#100e22', '#101216'],
  ['#0b0a1a', '#0C0D10'],
  ['#05040c', '#08090C'],
  ['#a7a9c0', '#A9A6A0'],
  ['#8f92ad', '#8A877F'],
  ['#9a9cb4', '#A9A6A0'],
  ['#70728c', '#6E6B66'],
  ['#6f718c', '#6E6B66'],
];

const RGB = [
  [[124, 92, 255], [240, 166, 60]],
  [[169, 124, 255], [240, 166, 60]],
  [[168, 85, 247], [236, 138, 44]],
  [[124, 92, 247], [240, 166, 60]],
  [[255, 209, 102], [245, 201, 122]],
  [[244, 114, 182], [226, 96, 58]],
  [[79, 163, 247], [79, 195, 161]],
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

const roots = ['src/pages', 'src/components', 'src/common', 'src/static'];
let n = 0;
for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(vue|js|css|svg|json)$/.test(e.name)) {
        const s = fs.readFileSync(p, 'utf8');
        const t = sub(s);
        if (t !== s) { fs.writeFileSync(p, t); n++; console.log('rewrote', p); }
      }
    }
  })(root);
}
console.log('files changed:', n);
