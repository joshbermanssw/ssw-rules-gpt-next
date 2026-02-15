'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect } from 'react';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ChatContainer() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="space-y-4 p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h2 className="text-2xl font-bold mb-2">Welcome to SSW Rules GPT!</h2>
              <p className="text-muted-foreground max-w-md">
                Ask me anything about SSW Rules. I can help you find the right rule,
                explain best practices, or guide you through processes.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-lg">
                {[
                  'How do I book annual leave?',
                  'What are the rules for code reviews?',
                  'How should I write a good email?',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      const fakeEvent = {
                        target: { value: suggestion },
                      } as React.ChangeEvent<HTMLInputElement>;
                      handleInputChange(fakeEvent);
                    }}
                    className="px-3 py-2 text-sm bg-muted rounded-full hover:bg-muted/80 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
          {isLoading && messages.length > 0 && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex gap-3 p-4 rounded-lg bg-background">
              <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm shrink-0">
                S
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <ChatInput
        input={input}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
