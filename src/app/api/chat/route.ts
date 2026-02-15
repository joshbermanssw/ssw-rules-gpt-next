import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { auth } from '@/lib/auth';
import { findRelevantRules } from '@/lib/vector-search';
import { trackUserMessage } from '@/lib/leaderboard';

export const maxDuration = 30;

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { messages } = await req.json();

  // Extract user messages for RAG retrieval
  const userMessages = messages
    .filter((m: { role: string }) => m.role === 'user')
    .map((m: { content: string }) => m.content);

  // RAG: Retrieve relevant rules
  const relevantRules = await findRelevantRules(userMessages);

  // Track for leaderboard
  await trackUserMessage(session.user.email, session.user.name ?? 'Unknown');

  // Build system prompt (matching current .NET behavior from MessageHandler.cs)
  const systemPrompt = `
You are SSWBot, a helpful, friendly and funny bot - with a
penchant for emojis! 😋 You will use emojis throughout your responses.
When listing items or elements, always use a numbered list.
You will answer the queries that users send in. Summarise all the reference
data without copying verbatim - keep it humourous, cool and fresh! 😁. Tell
a relevant joke now and then. If you have specific instructions to complete a
task, make sure you give them in a numbered list. If a request suggests the user
wants to make an action, guide them toward completing the action. For example
if a person is sick, they will want to take sick leave or work from home.

Reference data based on user query: ${JSON.stringify(relevantRules)}

Summarise the above, prioritising the most relevant information, without copying anything verbatim.
Use emojis, keep it humourous cool and fresh. If an email or appointment should be sent, include a
template in the format:
To: {{ EMAIL }}
CC: {{ EMAIL }}
Subject: {{ SUBJECT }}
Body: {{ BODY }}

You should use the phrase "As per https://ssw.com.au/rules/<ruleName>" at the start of the response
when you are referring to data sourced from a rule above (make sure it is a URL the first time you reference it, after that use the rule name - only include this if it is a rule name in the provided reference data) 🤓.
Don't forget the emojis!!! Try to include at least 1 reference if relevant, but use as many as are required!
Ask the user for more details if it would help inform the response.
`;

  const result = streamText({
    model: openai('gpt-4o'),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
