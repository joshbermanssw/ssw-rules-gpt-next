import { supabase } from './supabase';
import type { LeaderboardEntry } from '@/types';

/**
 * Track a user message for leaderboard statistics.
 * Mirrors the behavior of tracking in RulesHub.cs
 */
export async function trackUserMessage(email: string, name: string): Promise<void> {
  const { error } = await supabase.from('user_stats').insert({
    user_email: email,
    user_name: name,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Error tracking user message:', error);
  }
}

/**
 * Get leaderboard data - top users by message count.
 */
export async function getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('user_stats')
    .select('user_name, user_email')
    .limit(1000); // Get all to count

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  // Count messages per user
  const counts = new Map<string, { name: string; email: string; count: number }>();

  for (const entry of data ?? []) {
    const key = entry.user_email;
    const existing = counts.get(key);
    if (existing) {
      existing.count++;
    } else {
      counts.set(key, {
        name: entry.user_name,
        email: entry.user_email,
        count: 1,
      });
    }
  }

  // Sort by count and return top N
  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((entry) => ({
      user_name: entry.name,
      user_email: entry.email,
      message_count: entry.count,
    }));
}
