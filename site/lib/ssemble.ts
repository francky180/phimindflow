const BASE = 'https://aiclipping.ssemble.com/api/v1';

function authHeaders(): HeadersInit {
  const key = process.env.SSEMBLE_API_KEY;
  if (!key) throw new Error('SSEMBLE_API_KEY missing in env');
  return { 'Content-Type': 'application/json', 'X-API-Key': key };
}

export type CreateClipParams = {
  url: string;
  start?: number;
  end?: number;
  preferredLength?: 'under30sec' | 'under60sec' | 'under90sec';
  language?: string;
  templateId?: string;
};

export type ShortStatus = {
  status: 'queued' | 'processing' | 'completed' | 'failed' | string;
  progress?: number;
  message?: string;
};

export type ShortResult = {
  requestId: string;
  status: string;
  shorts?: Array<{
    id: string;
    title?: string;
    description?: string;
    video_url?: string;
    thumbnail_url?: string;
    duration?: number;
    transcript?: string;
    viralityScore?: number;
  }>;
  raw?: unknown;
};

async function ssembleFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...init, headers: { ...authHeaders(), ...(init?.headers || {}) } });
  const text = await res.text();
  let json: unknown;
  try { json = JSON.parse(text); } catch { json = text; }
  if (!res.ok) {
    throw new Error(`Ssemble ${path} ${res.status}: ${typeof json === 'string' ? json : JSON.stringify(json)}`);
  }
  return json as T;
}

export async function createClip(params: CreateClipParams): Promise<{ requestId: string; raw: unknown }> {
  const body: Record<string, unknown> = {
    url: params.url,
    preferredLength: params.preferredLength ?? 'under60sec',
    language: params.language ?? 'en',
  };
  if (params.start !== undefined) body.start = params.start;
  if (params.end !== undefined) body.end = params.end;
  if (params.templateId) body.templateId = params.templateId;

  const res = await ssembleFetch<{ data?: { requestId?: string; id?: string }; requestId?: string; id?: string }>(
    '/shorts/create',
    { method: 'POST', body: JSON.stringify(body) }
  );
  const requestId =
    (res as { data?: { requestId?: string; id?: string } }).data?.requestId ??
    (res as { data?: { id?: string } }).data?.id ??
    (res as { requestId?: string }).requestId ??
    (res as { id?: string }).id;
  if (!requestId) throw new Error(`No requestId in response: ${JSON.stringify(res)}`);
  return { requestId, raw: res };
}

export async function getStatus(requestId: string): Promise<ShortStatus & { raw: unknown }> {
  const res = await ssembleFetch<{ data?: ShortStatus } & ShortStatus>(`/shorts/${requestId}/status`);
  const data = (res as { data?: ShortStatus }).data ?? (res as ShortStatus);
  return { ...data, raw: res };
}

export async function getResult(requestId: string): Promise<ShortResult> {
  const res = await ssembleFetch<{ data?: unknown }>(`/shorts/${requestId}`);
  const data = (res as { data?: Record<string, unknown> }).data ?? (res as Record<string, unknown>);
  return { requestId, status: 'completed', shorts: (data as { shorts?: ShortResult['shorts'] }).shorts, raw: data };
}

export async function pollUntilDone(requestId: string, opts: { intervalMs?: number; timeoutMs?: number; onTick?: (s: ShortStatus) => void } = {}): Promise<ShortResult> {
  const interval = opts.intervalMs ?? 10000;
  const timeout = opts.timeoutMs ?? 20 * 60 * 1000;
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const s = await getStatus(requestId);
    opts.onTick?.(s);
    if (s.status === 'completed') return getResult(requestId);
    if (s.status === 'failed') throw new Error(`Ssemble job ${requestId} failed: ${s.message ?? 'unknown'}`);
    await new Promise((r) => setTimeout(r, interval));
  }
  throw new Error(`Ssemble job ${requestId} timed out after ${timeout}ms`);
}
