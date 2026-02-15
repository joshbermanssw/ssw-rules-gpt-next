import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { getDevUser, isDev } from '@/lib/dev-auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/conversations/[id] - Get a single conversation
export async function GET(req: Request, { params }: RouteParams) {
  const session = await auth();
  const user = getDevUser(session);
  const { id } = await params;

  if (!user?.email && !isDev) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // In dev mode without DB, return mock
  if (isDev && !user?.email) {
    return NextResponse.json({ id, conversation: [], conversation_title: 'Dev Chat' });
  }

  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .eq('id', id)
    .eq('user', user!.email)
    .single();

  if (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}

// PUT /api/conversations/[id] - Update a conversation
export async function PUT(req: Request, { params }: RouteParams) {
  const session = await auth();
  const user = getDevUser(session);
  const { id } = await params;

  if (!user?.email && !isDev) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, conversation } = await req.json();

  // In dev mode without DB, return success
  if (isDev && !user?.email) {
    return NextResponse.json({ id, conversation_title: title, success: true });
  }

  const updateData: Record<string, unknown> = {};
  if (title !== undefined) updateData.conversation_title = title;
  if (conversation !== undefined) updateData.conversation = JSON.stringify(conversation);

  const { data, error } = await supabase
    .from('chat_history')
    .update(updateData)
    .eq('id', id)
    .eq('user', user!.email)
    .select()
    .single();

  if (error) {
    console.error('Error updating conversation:', error);
    return NextResponse.json({ error: 'Failed to update conversation' }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE /api/conversations/[id] - Delete a single conversation
export async function DELETE(req: Request, { params }: RouteParams) {
  const session = await auth();
  const user = getDevUser(session);
  const { id } = await params;

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
    .eq('id', id)
    .eq('user', user!.email);

  if (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
