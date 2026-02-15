'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormEvent, ChangeEvent } from 'react';

interface ChatInputProps {
  input: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function ChatInput({ input, onChange, onSubmit, isLoading }: ChatInputProps) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2 p-4 border-t bg-background">
      <Input
        value={input}
        onChange={onChange}
        placeholder="Ask about SSW Rules..."
        disabled={isLoading}
        className="flex-1"
      />
      <Button type="submit" disabled={isLoading || input?.trim()}>
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Thinking...
          </span>
        ) : (
          'Send'
        )}
      </Button>
    </form>
  );
}
