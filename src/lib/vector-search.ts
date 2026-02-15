import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';
import { supabase } from './supabase';
import type { Rule } from '@/types';

/**
 * Find relevant rules using vector similarity search.
 * Mirrors the behavior of RelevantRulesService.cs from the .NET app.
 */
export async function findRelevantRules(userMessages: string[]): Promise<Rule[]> {
  // Take last 3 user messages (matching current .NET behavior)
  const lastThreeMessages = userMessages.slice(-3);

  // Replicate NextJS behaviour from original: duplicate single message
  if (lastThreeMessages.length === 1) {
    lastThreeMessages.push(lastThreeMessages[0]);
  }

  const query = lastThreeMessages.join('\n');

  // Generate embedding using same model as original app
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-ada-002'),
    value: query,
  });

  // Query existing rules table with pgvector
  // Uses the match_rules function that should exist in Supabase
  const { data: rules, error } = await supabase.rpc('match_rules', {
    query_embedding: embedding,
    match_count: 10,
  });

  if (error) {
    console.error('Error fetching relevant rules:', error);
    return [];
  }

  return rules ?? [];
}
