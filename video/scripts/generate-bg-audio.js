// Generates a cinematic ambient pad WAV for the WhatYouGet video.
// 90 seconds, 44.1kHz, 16-bit mono. No deps.
const fs = require("fs");
const path = require("path");

const SAMPLE_RATE = 44100;
const DURATION = parseInt(process.argv[2] || "90", 10);
const OUT_NAME = process.argv[3] || "bg.wav";
const TOTAL_SAMPLES = SAMPLE_RATE * DURATION;

// Chord: A minor 9 (A2, E3, A3, C4, E4) — warm, introspective, premium
const FREQS = [110, 164.81, 220, 261.63, 329.63];
const WEIGHTS = [0.28, 0.22, 0.20, 0.16, 0.14];

function sampleAt(t) {
  // Layered sines with slow detune
  let s = 0;
  for (let i = 0; i < FREQS.length; i++) {
    const f = FREQS[i] * (1 + 0.0015 * Math.sin(0.07 * t + i));
    s += WEIGHTS[i] * Math.sin(2 * Math.PI * f * t + i * 0.5);
  }
  // Sub bass rumble
  s += 0.18 * Math.sin(2 * Math.PI * 55 * t) * (0.6 + 0.4 * Math.sin(0.3 * t));

  // Slow breathing amplitude (swell every ~6s)
  const breath = 0.72 + 0.28 * (0.5 + 0.5 * Math.sin((2 * Math.PI * t) / 6));
  s *= breath;

  // Global fade in (2s) and fade out (3s)
  const fadeIn = Math.min(1, t / 2);
  const fadeOut = Math.min(1, (DURATION - t) / 3);
  const env = Math.max(0, Math.min(fadeIn, fadeOut));
  s *= env;

  // Scene ticks — very subtle high shimmer at scene starts
  const sceneStarts = [0, 4, 10, 16, 24, 34, 44, 54, 62, 72, 80];
  for (const start of sceneStarts) {
    const dt = t - start;
    if (dt >= 0 && dt < 0.6) {
      const tickEnv = Math.exp(-dt * 8);
      s += 0.08 * tickEnv * Math.sin(2 * Math.PI * 1760 * dt);
      s += 0.04 * tickEnv * Math.sin(2 * Math.PI * 2637 * dt);
    }
  }

  // Soft saturation to glue
  s = Math.tanh(s * 1.1) * 0.55;
  return s;
}

const header = Buffer.alloc(44);
const dataSize = TOTAL_SAMPLES * 2;
header.write("RIFF", 0);
header.writeUInt32LE(36 + dataSize, 4);
header.write("WAVE", 8);
header.write("fmt ", 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20); // PCM
header.writeUInt16LE(1, 22); // mono
header.writeUInt32LE(SAMPLE_RATE, 24);
header.writeUInt32LE(SAMPLE_RATE * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(dataSize, 40);

const data = Buffer.alloc(dataSize);
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const t = i / SAMPLE_RATE;
  const v = sampleAt(t);
  const int16 = Math.max(-32767, Math.min(32767, Math.round(v * 32767)));
  data.writeInt16LE(int16, i * 2);
}

const outDir = path.join(__dirname, "..", "public");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, OUT_NAME);
fs.writeFileSync(outPath, Buffer.concat([header, data]));
console.log("Wrote", outPath, "(", (data.length / 1024 / 1024).toFixed(2), "MB )");
