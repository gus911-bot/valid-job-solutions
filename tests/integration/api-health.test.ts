import { describe, expect, it } from 'vitest';
import { GET } from '@/app/api/health/route';

describe('GET /api/health', () => {
  it('renvoie 200 avec status ok et no-store', async () => {
    const res = GET();
    expect(res.status).toBe(200);
    expect(res.headers.get('Cache-Control')).toBe('no-store');
    const body = (await res.json()) as { status: string; time: string };
    expect(body.status).toBe('ok');
    expect(new Date(body.time).getTime()).not.toBeNaN();
  });
});
