'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b bg-background">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-2xl">🤖</span>
            <span>SSW Rules GPT</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Chat
            </Link>
            <Link href="/leaderboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Leaderboard
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {status === 'loading' ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : session?.user ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {session.user.name?.[0]?.toUpperCase() ?? 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm hidden md:inline">{session.user.name}</span>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Sign out
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => signIn('oidc')}>
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
