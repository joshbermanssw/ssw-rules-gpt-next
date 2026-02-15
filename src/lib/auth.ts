import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';

const config: NextAuthConfig = {
  providers: [
    {
      id: 'oidc',
      name: 'SSW Identity',
      type: 'oidc',
      issuer: process.env.OIDC_ISSUER,
      clientId: process.env.OIDC_CLIENT_ID,
      clientSecret: process.env.OIDC_CLIENT_SECRET,
    },
  ],
  callbacks: {
    session({ session, token }) {
      // Include user email and name in session for leaderboard tracking
      if (token.email) session.user.email = token.email;
      if (token.name) session.user.name = token.name;
      return session;
    },
    jwt({ token, profile }) {
      if (profile) {
        token.email = profile.email;
        token.name = profile.name;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
