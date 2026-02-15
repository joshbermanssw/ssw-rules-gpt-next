import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { getDevUser, isDev } from '@/lib/dev-auth';

// GET /api/conversations - List all conversations for the user
export async function GET() {
  const session = await auth();
  const user = getDevUser(session);

  if (!user?.email && !isDev) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // In dev mode without DB, return empty array
  if (isDev && !user?.email) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabase
    .from('chat_history')
    .select('id, conversation_title, created_at')
    .eq('user', user!.email)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/conversations - Create a new conversation
export async function POST(req: Request) {
  const session = await auth();
  const user = getDevUser(session);

  if (!user?.email && !isDev) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // In dev mode without DB, return mock response
  if (isDev && !user?.email) {
    return NextResponse.json({ id: 'dev-' + Date.now(), success: true }, { status: 201 });
  }

  const { title, conversation } = await req.json();

  const { data, error } = await supabase
    .from('chat_history')
    .insert({
      user: user!.email,
      conversation_title: title,
      conversation: JSON.stringify(conversation),
      schema_ver: 1,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// DELETE /api/conversations - Delete all conversations for the user
export async function DELETE() {
  const session = await auth();
  const user = getDevUser(session);

  if (!user?.email && !isDev) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // In dev mode without DB, return success
  if (isDev && !user?.email) {
    return NextResponse.json({ success: true });
  }

  const { error } = await supabase
    .from('chat_history')
    .delete()
    .eq('user', user!.email);

  if (error) {
    console.error('Error deleting conversations:', error);
    return NextResponse.json({ error: 'Failed to delete conversations' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
