// Shared utilities for Meta / Instagram Graph API scripts.
// Loads .env.local with cleanEnvValue (matches Zernio pattern, dodges the \n" suffix bug).

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const ENV_PATH = '.env.local';
export const META_BASE = 'https://graph.instagram.com';

export function cleanEnvValue(v) {
  let s = v.trim();
  let prev;
  do {
    prev = s;
    if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1);
    else if (s.startsWith('"')) s = s.slice(1);
    else if (s.endsWith('"')) s = s.slice(0, -1);
    if (s.endsWith('\\n')) s = s.slice(0, -2);
    s = s.trim();
  } while (s !== prev);
  return s;
}

export function loadEnv() {
  if (!existsSync(ENV_PATH)) {
    console.error(`Missing ${ENV_PATH}. Run from phimindflow-site/site/ directory.`);
    process.exit(1);
  }
  return Object.fromEntries(
    readFileSync(ENV_PATH, 'utf8')
      .split('\n')
      .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
      .map((l) => {
        const idx = l.indexOf('=');
        return [l.slice(0, idx).trim(), cleanEnvValue(l.slice(idx + 1))];
      })
  );
}

export function upsertEnv(updates) {
  let raw = readFileSync(ENV_PATH, 'utf8');
  for (const [key, value] of Object.entries(updates)) {
    const re = new RegExp(`^${key}=.*$`, 'm');
    const line = `${key}=${value}`;
    if (re.test(raw)) raw = raw.replace(re, line);
    else raw = raw.trimEnd() + `\n${line}\n`;
  }
  writeFileSync(ENV_PATH, raw);
}

export function envOrProcess(env, key) {
  return env[key] || process.env[key];
}

export function requireEnv(env, keys) {
  const missing = keys.filter((k) => !envOrProcess(env, k));
  if (missing.length) {
    console.error(`Missing env: ${missing.join(', ')}`);
    process.exit(1);
  }
}

export async function metaGet(path, params = {}) {
  const url = new URL(`${META_BASE}${path}`);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString());
  const body = await res.json();
  if (!res.ok) {
    const msg = body?.error?.message || JSON.stringify(body);
    const code = body?.error?.code || res.status;
    throw new Error(`Meta API ${code}: ${msg}`);
  }
  return body;
}
