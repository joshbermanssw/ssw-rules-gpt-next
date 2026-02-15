'use client';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Markdown } from './markdown';
import type { Message } from 'ai';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-lg',
        isUser ? 'bg-muted/50' : 'bg-background'
      )}
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={cn(isUser ? 'bg-primary text-primary-foreground' : 'bg-orange-500 text-white')}>
          {isUser ? 'U' : 'S'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2 overflow-hidden">
        <p className="text-sm font-medium">
          {isUser ? 'You' : 'SSWBot'}
        </p>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <Markdown content={message.content} />
        </div>
      </div>
    </div>
  );
}
