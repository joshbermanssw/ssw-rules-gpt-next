'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Conversation {
  id: string;
  conversation_title: string;
  created_at: string;
}

interface SidebarProps {
  onSelectConversation?: (id: string) => void;
  onNewChat?: () => void;
}

export function Sidebar({ onSelectConversation, onNewChat }: SidebarProps) {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchConversations();
    }
  }, [session]);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session?.user) {
    return (
      <aside className="w-64 border-r bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">Sign in to see your chat history</p>
      </aside>
    );
  }

  return (
    <aside className="w-64 border-r bg-muted/30 flex flex-col">
      <div className="p-4">
        <Button onClick={onNewChat} className="w-full">
          + New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2 pb-4">
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
              ))}
            </>
          ) : conversations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No conversations yet
            </p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation?.(conv.id)}
                className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <p className="text-sm font-medium truncate">
                  {conv.conversation_title || 'Untitled'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(conv.created_at).toLocaleDateString()}
                </p>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
