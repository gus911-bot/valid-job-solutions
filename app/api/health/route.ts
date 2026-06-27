import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Health check léger pour conteneur / load-balancer.
export function GET() {
  return NextResponse.json(
    { status: 'ok', time: new Date().toISOString() },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
