const fs = require('fs');
const path = require('path');

const HEX = [
  ['#F0A63C', '#E8CE9F'],
  ['#F5C97A', '#E8CE9F'],
  ['#F7BE52', '#E8CE9F'],
  ['#EC8A2C', '#C29A62'],
  ['#DE6C1E', '#B9905A'],
  ['#DE7A28', '#B9905A'],
  ['#E2603A', '#A9784B'],
  ['#E0662B', '#C29A62'],
  ['#FF8A3D', '#D8B98C'],
  ['#ff8a3d', '#D8B98C'],
  ['#ffb020', '#E8CE9F'],
  ['#FF5A48', '#D9564B'],
  ['#FF7A5C', '#C98070'],
  ['#4FC3A1', '#6FA898'],
  ['#7FD9BE', '#8FBFAF'],
  ['#6FE3B8', '#8FBFAF'],
  ['#3ECF8E', '#6FA898'],
  ['#0F8F73', '#3F7A68'],
  ['#FFE0A8', '#E8CE9F'],
  ['#A8E8D5', '#8FBFAF'],
  ['#F5F3EF', '#F2F1EE'],
  ['#F7F5F0', '#F2F0EB'],
  ['#F0C88A', '#E8CE9F'],
  ['#F7D9A0', '#F0E4CC'],
  ['#A9A6A0', '#9E9C98'],
  ['#6E6B66', '#63625F'],
  ['#1A1206', '#17120B'],
  ['#0C0D10', '#0A0A0B'],
  ['#08090B', '#0A0A0B'],
  ['#08090C', '#0A0A0B'],
  ['#16181D', '#141416'],
  ['#1C1F26', '#1A1A1D'],
  ['#1D1A15', '#14120E'],
  ['#101216', '#101011'],
  ['#3A2C14', '#1C1A16'],
  ['#2A2620', '#221F1A'],
  ['#211D16', '#1B1814'],
  ['#121A1E', '#121514'],
  ['#1B2A28', '#18211F'],
  ['#24201A', '#1A1814'],
];

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function sub(src) {
  let out = src;
  for (const [a, b] of HEX) {
    out = out.replace(new RegExp(esc(a), 'gi'), b);
    out = out.replace(new RegExp('%23' + esc(a.slice(1)), 'gi'), '%23' + b.slice(1));
  }
  out = out.replace(/rgba\(\s*240\s*,\s*166\s*,\s*60\s*,/gi, 'rgba(232, 206, 159,');
  out = out.replace(/rgba\(\s*226\s*,\s*130\s*,\s*44\s*,/gi, 'rgba(201, 162, 104,');
  out = out.replace(/rgba\(\s*79\s*,\s*195\s*,\s*161\s*,/gi, 'rgba(111, 168, 152,');
  out = out.replace(/rgba\(\s*245\s*,\s*201\s*,\s*122\s*,/gi, 'rgba(232, 206, 159,');
  out = out.replace(/rgba\(\s*255\s*,\s*90\s*,\s*72\s*,/gi, 'rgba(217, 86, 75,');
  return out;
}

const files = [];
for (const root of ['src/pages', 'src/components', 'src/common', 'src/static']) {
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
