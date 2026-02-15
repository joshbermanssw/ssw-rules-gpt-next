'use client';

import { useSession } from 'next-auth/react';
import { ChatContainer } from '@/components/chat';
import { Sidebar } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

const isDev = process.env.NODE_ENV === 'development';

export default function Home() {
  const { data: session, status } = useSession();

  // In dev mode, skip auth loading state and show chat immediately
  if (status === 'loading' && !isDev) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // In dev mode, skip sign-in requirement
  if (!session && !isDev) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h1 className="text-3xl font-bold mb-2">SSW Rules GPT</h1>
          <p className="text-muted-foreground max-w-md">
            Sign in to start chatting with SSWBot and get AI-powered answers
            about SSW Rules.
          </p>
        </div>
        <Button size="lg" onClick={() => signIn('oidc')}>
          Sign in to continue
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <Sidebar
        onNewChat={() => window.location.reload()}
      />
      <div className="flex-1">
        <ChatContainer />
      </div>
    </div>
  );
}
