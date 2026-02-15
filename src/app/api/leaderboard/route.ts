import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getLeaderboard } from '@/lib/leaderboard';
import { getDevUser, isDev } from '@/lib/dev-auth';

export async function GET() {
  const session = await auth();
  const user = getDevUser(session);

  if (!user && !isDev) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const leaderboard = await getLeaderboard(10);

  return NextResponse.json(leaderboard);
}
