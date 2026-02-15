import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getLeaderboard } from '@/lib/leaderboard';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const leaderboard = await getLeaderboard(10);

  return NextResponse.json(leaderboard);
}
