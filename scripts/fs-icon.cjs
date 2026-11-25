#!/usr/bin/env node
"use strict";

/**
 * FS Icon Synthesizer — Convert professional Lucide SVGs into FS duotone-line / line-mono SVGs.
 *
 * Usage:
 *   node scripts/fs-icon.cjs --search <keyword>
 *   node scripts/fs-icon.cjs --inspect <lucide-name>
 *   node scripts/fs-icon.cjs <lucide-name> <output.svg> [--accent=last|1,2|none] [--mono] [--size=48] [--stroke=1.45]
 *
 * Style alignment:
 *   - 48x48 viewBox, 24x24 Lucide icon scaled 1.5x at translate(6, 6) -> 36x36 optical box (6px safe margin)
 *   - stroke-width 1.45 * 1.5 = 2.175px (matches FS official 48px duotone-line stroke weight)
 *   - Primary stroke: #19191A; Accent stroke (duotone-line): #C00000; Zero translucent surface fills.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const PICTOGRAM_DIR = path.join(ROOT, "node_modules", "@carbon", "pictograms", "svg");
const CARBON_DIR = path.join(ROOT, "node_modules", "@carbon", "icons", "svg", "32");
const ICONS_DIR = path.join(ROOT, "node_modules", "lucide-static", "icons");
const PRIMARY = "#19191A";
const ACCENT = "#C00000";

function ensureInstalled() {
  if (!fs.existsSync(PICTOGRAM_DIR) && !fs.existsSync(CARBON_DIR) && !fs.existsSync(ICONS_DIR)) {
    console.error("Neither @carbon/pictograms, @carbon/icons, nor lucide-static is installed.");
    process.exit(1);
  }
}

function listIcons(source = "auto") {
  const out = [];
  if ((source === "auto" || source === "pictogram") && fs.existsSync(PICTOGRAM_DIR)) {
    for (const f of fs.readdirSync(PICTOGRAM_DIR)) {
      if (f.endsWith(".svg")) out.push("pictogram:" + f.replace(/\.svg$/, ""));
    }
  }
  if ((source === "auto" || source === "carbon") && fs.existsSync(CARBON_DIR)) {
    for (const f of fs.readdirSync(CARBON_DIR)) {
      if (f.endsWith(".svg")) out.push("carbon:" + f.replace(/\.svg$/, ""));
    }
  }
  if ((source === "auto" || source === "lucide") && fs.existsSync(ICONS_DIR)) {
    for (const f of fs.readdirSync(ICONS_DIR)) {
      if (f.endsWith(".svg")) out.push("lucide:" + f.replace(/\.svg$/, ""));
    }
  }
  return out;
}

function resolveIconSource(name, source = "auto", size = 48) {
  const order =
    source === "pictogram" ? ["pictogram"] :
    source === "carbon" ? ["carbon"] :
    source === "lucide" ? ["lucide"] :
    size >= 40 ? ["pictogram", "carbon", "lucide"] : ["carbon", "pictogram", "lucide"];

  const dirs = { pictogram: PICTOGRAM_DIR, carbon: CARBON_DIR, lucide: ICONS_DIR };
  for (const kind of order) {
    const dir = dirs[kind];
    if (fs.existsSync(dir)) {
      const p = path.join(dir, `${name}.svg`);
      if (fs.existsSync(p)) return { kind, path: p };
    }
  }
  return null;
}

function splitPathSubpaths(d) {
  const cleaned = d.replace(/[\t\r\n]+/g, " ").trim();
  return cleaned.split(/(?=[M])/).map((s) => s.trim()).filter(Boolean);
}

function subpathBBox(sub) {
  const tokens = sub.match(/[A-Za-z]|[-+]?(?:\d+\.?\d*|\.\d+)/g) || [];
  let cx = 0, cy = 0, sx = 0, sy = 0;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const mark = (x, y) => {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  };
  let cmd = "";
  let i = 0;
  const num = () => Number(tokens[i++]);
  while (i < tokens.length) {
    if (/^[A-Za-z]$/.test(tokens[i])) cmd = tokens[i++];
    switch (cmd) {
      case "M": cx = num(); cy = num(); sx = cx; sy = cy; mark(cx, cy); cmd = "L"; break;
      case "m": cx += num(); cy += num(); sx = cx; sy = cy; mark(cx, cy); cmd = "l"; break;
      case "L": cx = num(); cy = num(); mark(cx, cy); break;
      case "l": cx += num(); cy += num(); mark(cx, cy); break;
      case "H": cx = num(); mark(cx, cy); break;
      case "h": cx += num(); mark(cx, cy); break;
      case "V": cy = num(); mark(cx, cy); break;
      case "v": cy += num(); mark(cx, cy); break;
      case "C": num(); num(); num(); num(); cx = num(); cy = num(); mark(cx, cy); break;
      case "c": { const dx1 = num(), dy1 = num(), dx2 = num(), dy2 = num(), dx = num(), dy = num(); mark(cx + dx1, cy + dy1); mark(cx + dx2, cy + dy2); cx += dx; cy += dy; mark(cx, cy); break; }
      case "S": case "Q": num(); num(); cx = num(); cy = num(); mark(cx, cy); break;
      case "s": case "q": { const dx1 = num(), dy1 = num(), dx = num(), dy = num(); mark(cx + dx1, cy + dy1); cx += dx; cy += dy; mark(cx, cy); break; }
      case "T": cx = num(); cy = num(); mark(cx, cy); break;
      case "t": cx += num(); cy += num(); mark(cx, cy); break;
      case "A": num(); num(); num(); num(); num(); cx = num(); cy = num(); mark(cx, cy); break;
      case "a": { num(); num(); num(); num(); num(); const dx = num(), dy = num(); cx += dx; cy += dy; mark(cx, cy); break; }
      case "Z": case "z": cx = sx; cy = sy; break;
      default: i++; break;
    }
  }
  const w = Math.max(0, maxX - minX);
  const h = Math.max(0, maxY - minY);
  return { minX, minY, maxX, maxY, w, h, area: w * h, diag: Math.hypot(w, h) };
}

function chooseDefaultPictogramAccents(subs) {
  if (subs.length <= 1) return { indices: [], fallbackRect: null };
  const boxes = subs.map(subpathBBox);
  const maxArea = Math.max(...boxes.map((b) => b.area), 1);
  const contains = (a, b) =>
    a.area > b.area * 1.15 &&
    b.minX >= a.minX - 0.4 &&
    b.maxX <= a.maxX + 0.4 &&
    b.minY >= a.minY - 0.4 &&
    b.maxY <= a.maxY + 0.4;
  const depths = boxes.map((b, i) => {
    let d = 0;
    for (let j = 0; j < boxes.length; j++) {
      if (i !== j && contains(boxes[j], b)) d++;
    }
    return d;
  });
  // Even nesting depth (0, 2, 4) = positive filled shapes; odd depth (1, 3) = cutout holes.
  // Pick small positive detail subpaths (depth 2+, or small disjoint depth 0 details).
  const candidates = [];
  for (let i = 0; i < subs.length; i++) {
    if (depths[i] % 2 === 0 && boxes[i].area < maxArea * 0.35) {
      // If depth 2 subpath encloses a depth 3 hole (like a tag hole ring), include its depth 3 hole too
      const holes = [];
      for (let j = 0; j < subs.length; j++) {
        if (depths[j] === depths[i] + 1 && contains(boxes[i], boxes[j])) holes.push(j);
      }
      candidates.push({ idx: i, holes, depth: depths[i], area: boxes[i].area, diag: boxes[i].diag });
    }
  }
  if (candidates.length > 0) {
    // Prefer inner details (depth >= 2) if available; otherwise pick the most prominent small depth-0 detail (e.g. speedometer needle)
    const inner = candidates.filter((c) => c.depth >= 2);
    if (inner.length > 0) {
      const picked = new Set();
      inner.slice(0, 6).forEach((c) => {
        picked.add(c.idx);
        c.holes.forEach((h) => picked.add(h));
      });
      return { indices: [...picked], fallbackRect: null };
    }
    candidates.sort((a, b) => b.diag - a.diag);
    const best = candidates[0];
    return { indices: [best.idx, ...best.holes], fallbackRect: null };
  }
  // Fallback when all subpaths are outer shell + depth-1 cutouts (e.g. desktop / briefcase):
  // place a subtle 6x0.72 centered red accent bar inside the icon bounds
  const main = boxes[0];
  const rw = Math.min(8, Math.max(4, Math.round(main.w * 0.25)));
  const rx = Number(((main.minX + main.maxX - rw) / 2).toFixed(2));
  const ry = Number((main.minY + main.h * 0.52).toFixed(2));
  return { indices: [], fallbackRect: { x: rx, y: ry, width: rw, height: 0.72 } };
}

function extractElements(svgText) {
  const inner = svgText
    .replace(/^[\s\S]*?<svg[^>]*>/i, "")
    .replace(/<\/svg>\s*$/i, "")
    .trim();
  const els = inner.match(/<(?:path|circle|rect|line|polyline|polygon|ellipse)\b[^>]*\/?>/gi) || [];
  return els;
}

function chooseDefaultAccents(els) {
  if (els.length <= 1) return [];
  // Prefer inner detail elements (circle/line/polyline or last path) rather than main outer frame
  const details = [];
  for (let i = 0; i < els.length; i++) {
    if (/^<(?:line|circle|polyline)\b/i.test(els[i])) details.push(i);
  }
  if (details.length > 0 && details.length <= Math.ceil(els.length * 0.5)) {
    return details;
  }
  return [els.length - 1];
}

function parseAccentSpec(spec, els) {
  if (!spec || spec === "auto") return chooseDefaultAccents(els);
  if (spec === "none") return [];
  if (spec === "last") return els.length > 1 ? [els.length - 1] : [];
  return spec
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isInteger(n) && n >= 0 && n < els.length);
}

function applyStrokeColor(el, color) {
  let out = el
    .replace(/\s+stroke="[^"]*"/gi, "")
    .replace(/\s+fill="[^"]*"/gi, "");
  return out.replace(/\s*\/?>$/, (end) => ` stroke="${color}"${end}`);
}

function applyFillColor(el, color) {
  let out = el
    .replace(/\s+fill="[^"]*"/gi, "")
    .replace(/\s+stroke="[^"]*"/gi, "");
  return out.replace(/\s*\/?>$/, (end) => ` fill="${color}"${end}`);
}

function buildFsIcon(name, options = {}) {
  ensureInstalled();
  const size = Number(options.size || 48);
  const resolved = resolveIconSource(name, options.source || "auto", size);
  if (!resolved) {
    throw new Error(`Icon not found in Carbon Pictograms, Carbon Icons, or Lucide: ${name}`);
  }
  const raw = fs.readFileSync(resolved.path, "utf8");
  const els = extractElements(raw);
  const stroke = Number(options.stroke || 1.45);
  const mono = Boolean(options.mono);
  const accentIdx = mono ? new Set() : new Set(parseAccentSpec(options.accent, els));

  if (resolved.kind === "pictogram") {
    const scale = (size * 0.78) / 32;
    const offset = (size - 32 * scale) / 2;
    // Carbon pictograms have 0.72/32 stroke (~0.84px at 48px); adding 0.56 same-color miter stroke
    // brings rendered weight to ~1.50px at 48px, matching FS official 48px icon optical weight.
    const bolster = Number(options.bolster ?? 0.56);
    const strokeAttr = (color) =>
      bolster > 0 ? ` stroke="${color}" stroke-width="${bolster}" stroke-linejoin="miter"` : "";
    const subAccent = new Set(
      !mono && options.subpathAccent
        ? String(options.subpathAccent).split(",").map((s) => Number(s.trim())).filter(Number.isInteger)
        : []
    );
    const outEls = [];
    if (els.length === 1 && !mono && /^<path\b/i.test(els[0])) {
      const m = els[0].match(/\bd="([^"]+)"/i);
      if (m) {
        const subs = splitPathSubpaths(m[1]);
        const auto = subAccent.size > 0 ? { indices: [...subAccent], fallbackRect: null } : chooseDefaultPictogramAccents(subs);
        const picked = new Set(auto.indices);
        const primarySubs = [];
        const accentSubs = [];
        subs.forEach((s, idx) => {
          if (picked.has(idx)) accentSubs.push(s);
          else primarySubs.push(s);
        });
        if (primarySubs.length) outEls.push(`    <path d="${primarySubs.join(" ")}" fill="${PRIMARY}"${strokeAttr(PRIMARY)}/>`);
        if (accentSubs.length) outEls.push(`    <path d="${accentSubs.join(" ")}" fill="${ACCENT}"${strokeAttr(ACCENT)}/>`);
        if (auto.fallbackRect) {
          const r = auto.fallbackRect;
          outEls.push(`    <rect x="${r.x}" y="${r.y}" width="${r.width}" height="${r.height}" fill="${ACCENT}"${strokeAttr(ACCENT)}/>`);
        }
      }
    }
    if (outEls.length === 0) {
      els.forEach((el, i) => {
        const color = accentIdx.has(i) ? ACCENT : PRIMARY;
        outEls.push("    " + applyFillColor(el, color).replace(/\s*\/?>$/, (end) => `${strokeAttr(color)}${end}`));
      });
    }
    return [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none">`,
      `  <g transform="translate(${offset} ${offset}) scale(${scale})">`,
      ...outEls,
      `  </g>`,
      `</svg>`,
      "",
    ].join("\n");
  }

  if (resolved.kind === "carbon") {
    const scale = (size * 0.72) / 32;
    const offset = (size - 32 * scale) / 2;
    const styled = els.map((el, i) => {
      const color = accentIdx.has(i) ? ACCENT : PRIMARY;
      return "    " + applyFillColor(el, color);
    });
    return [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none">`,
      `  <g transform="translate(${offset} ${offset}) scale(${scale})">`,
      ...styled,
      `  </g>`,
      `</svg>`,
      "",
    ].join("\n");
  }

  const scale = (size * 0.75) / 24; // 36px inside 48px -> 6px safe margin each side
  const offset = (size - 24 * scale) / 2;

  const styled = els.map((el, i) => {
    const color = accentIdx.has(i) ? ACCENT : PRIMARY;
    const tightened = el.replace(/\b(rx|ry)="([0-9.]+)"/g, (_, attr, num) => {
      const v = parseFloat(num);
      return v >= 1.2 && v <= 4 ? `${attr}="0.5"` : `${attr}="${num}"`;
    });
    return "    " + applyStrokeColor(tightened, color);
  });

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none">`,
    `  <g transform="translate(${offset} ${offset}) scale(${scale})" stroke-width="${stroke}" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="3" fill="none">`,
    ...styled,
    `  </g>`,
    `</svg>`,
    "",
  ].join("\n");
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("--help")) {
    console.log("Usage:");
    console.log("  node scripts/fs-icon.cjs --search <keyword>");
    console.log("  node scripts/fs-icon.cjs --inspect <lucide-name>");
    console.log("  node scripts/fs-icon.cjs <lucide-name> <output.svg> [--accent=auto|last|0,2|none] [--mono] [--size=48] [--stroke=1.45]");
    process.exit(0);
  }

  ensureInstalled();

  if (args[0] === "--search") {
    const kw = (args[1] || "").toLowerCase();
    const hits = listIcons().filter((n) => n.includes(kw));
    console.log(hits.slice(0, 40).join("\n") || "(no match)");
    return;
  }

  if (args[0] === "--inspect") {
    const name = args[1];
    const srcArg = args.find((a) => a.startsWith("--source="));
    const src = srcArg ? srcArg.slice("--source=".length) : "auto";
    const resolved = resolveIconSource(name, src, 48);
    if (!resolved) {
      console.error(`Icon not found: ${name}`);
      process.exit(1);
    }
    const els = extractElements(fs.readFileSync(resolved.path, "utf8"));
    console.log(`${resolved.kind}:${name} (${els.length} elements):`);
    els.forEach((el, i) => {
      console.log(`  [${i}] ${el.slice(0, 140)}${el.length > 140 ? "..." : ""}`);
      if (resolved.kind === "pictogram" && /^<path\b/i.test(el)) {
        const m = el.match(/\bd="([^"]+)"/i);
        if (m) {
          const subs = splitPathSubpaths(m[1]);
          subs.forEach((s, si) => console.log(`    sub[${si}] ${s.slice(0, 90)}${s.length > 90 ? "..." : ""}`));
        }
      }
    });
    return;
  }

  const name = args[0];
  const outPath = args[1];
  if (!outPath) {
    console.error("Missing output path.");
    process.exit(1);
  }
  const opts = {};
  for (const a of args.slice(2)) {
    if (a === "--mono") opts.mono = true;
    else if (a.startsWith("--accent=")) opts.accent = a.slice("--accent=".length);
    else if (a.startsWith("--subpath-accent=")) opts.subpathAccent = a.slice("--subpath-accent=".length);
    else if (a.startsWith("--size=")) opts.size = a.slice("--size=".length);
    else if (a.startsWith("--stroke=")) opts.stroke = a.slice("--stroke=".length);
    else if (a.startsWith("--source=")) opts.source = a.slice("--source=".length);
  }

  const resolved = resolveIconSource(name, opts.source || "auto", Number(opts.size || 48));
  const svg = buildFsIcon(name, opts);
  const absOut = path.resolve(ROOT, outPath);
  fs.mkdirSync(path.dirname(absOut), { recursive: true });
  fs.writeFileSync(absOut, svg, "utf8");
  const modeLabel =
    opts.mono ? "line-mono" :
    resolved.kind === "pictogram" && !opts.subpathAccent ? "line-mono (pass --subpath-accent=... after --inspect for duotone-line)" :
    "duotone-line";
  console.log(`Generated ${path.relative(ROOT, absOut)} from ${resolved.kind}/${name} (${modeLabel})`);
}

if (require.main === module) {
  main();
} else {
  module.exports = { buildFsIcon };
}
