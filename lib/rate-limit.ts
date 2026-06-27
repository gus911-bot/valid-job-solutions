// Rate limiting : Upstash Redis si configuré (multi-instances), sinon en mémoire.
// Pour activer Redis : définir UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN.

type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

interface RateLimitOptions {
  limit?: number;
  windowMs?: number;
}

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

/** Limiteur en mémoire (par instance) — fallback. */
function memoryLimit(
  id: string,
  limit: number,
  windowMs: number,
): { success: boolean; remaining: number } {
  const now = Date.now();
  const bucket = store.get(id);
  if (!bucket || now > bucket.resetAt) {
    store.set(id, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }
  if (bucket.count >= limit) return { success: false, remaining: 0 };
  bucket.count += 1;
  return { success: true, remaining: limit - bucket.count };
}

/** Limiteur Redis partagé (INCR + EXPIRE via API REST Upstash). */
async function redisLimit(
  id: string,
  limit: number,
  windowMs: number,
): Promise<{ success: boolean; remaining: number }> {
  const key = `rl:${id}`;
  const res = await fetch(`${UPSTASH_URL}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      ['INCR', key],
      ['PEXPIRE', key, windowMs, 'NX'],
    ]),
    cache: 'no-store',
  });
  if (!res.ok) return { success: true, remaining: limit }; // fail-open si Redis indispo
  const data = (await res.json()) as { result: number }[];
  const count = data[0]?.result ?? 1;
  return { success: count <= limit, remaining: Math.max(0, limit - count) };
}

export async function rateLimit(
  identifier: string,
  { limit = 5, windowMs = 60_000 }: RateLimitOptions = {},
): Promise<{ success: boolean; remaining: number }> {
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      return await redisLimit(identifier, limit, windowMs);
    } catch {
      return memoryLimit(identifier, limit, windowMs);
    }
  }
  return memoryLimit(identifier, limit, windowMs);
}

/** Extrait l'IP cliente depuis les en-têtes de la requête. */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return headers.get('x-real-ip') ?? 'unknown';
}
