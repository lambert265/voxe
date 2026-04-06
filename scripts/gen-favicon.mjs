// Run: node scripts/gen-favicon.mjs
import { createCanvas } from "canvas";
import fs from "fs";
import path from "path";

function drawVoxe(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Black rounded background
  ctx.fillStyle = "#0A0A0A";
  const r = size * 0.18;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(size - r, 0);
  ctx.quadraticCurveTo(size, 0, size, r);
  ctx.lineTo(size, size - r);
  ctx.quadraticCurveTo(size, size, size - r, size);
  ctx.lineTo(r, size);
  ctx.quadraticCurveTo(0, size, 0, size - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fill();

  // Gold V lettermark
  ctx.fillStyle = "#C9A84C";
  const pad = size * 0.2;
  const top = size * 0.22;
  const bottom = size * 0.82;
  const mid = size / 2;
  const thick = size * 0.14;

  ctx.beginPath();
  ctx.moveTo(pad, top);
  ctx.lineTo(pad + thick, top);
  ctx.lineTo(mid, bottom - thick * 0.5);
  ctx.lineTo(size - pad - thick, top);
  ctx.lineTo(size - pad, top);
  ctx.lineTo(mid, bottom);
  ctx.closePath();
  ctx.fill();

  return canvas;
}

const canvas = drawVoxe(32);
const pngData = canvas.toBuffer("image/png");

const headerSize = 6;
const dirEntrySize = 16;
const dataOffset = headerSize + dirEntrySize;
const ico = Buffer.alloc(dataOffset + pngData.length);

ico.writeUInt16LE(0, 0);
ico.writeUInt16LE(1, 2);
ico.writeUInt16LE(1, 4);
ico.writeUInt8(32, 6);
ico.writeUInt8(32, 7);
ico.writeUInt8(0, 8);
ico.writeUInt8(0, 9);
ico.writeUInt16LE(1, 10);
ico.writeUInt16LE(32, 12);
ico.writeUInt32LE(pngData.length, 14);
ico.writeUInt32LE(dataOffset, 18);
pngData.copy(ico, dataOffset);

fs.writeFileSync(path.join("app", "favicon.ico"), ico);
console.log("✓ favicon.ico written");
