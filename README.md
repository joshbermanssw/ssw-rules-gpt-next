# SSW Rules GPT (Next.js)

A modern Next.js rewrite of the SSW Rules GPT application - an AI-powered chatbot that answers questions about SSW Rules using RAG (Retrieval-Augmented Generation).

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React + shadcn/ui + Tailwind CSS
- **AI**: Vercel AI SDK with OpenAI GPT-4
- **Database**: Supabase (PostgreSQL + pgvector)
- **Auth**: NextAuth with OIDC
- **Deployment**: Azure Static Web Apps

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Access to existing Supabase database
- OpenAI API key
- OIDC provider credentials

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.local` and fill in your values:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# OpenAI
OPENAI_API_KEY=your-openai-key

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
OIDC_ISSUER=https://your-identity-provider
OIDC_CLIENT_ID=rulesgpt
OIDC_CLIENT_SECRET=your-client-secret
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── chat/          # AI chat endpoint (streaming)
│   │   ├── conversations/ # Conversation history CRUD
│   │   ├── leaderboard/   # Leaderboard data
│   │   └── auth/          # NextAuth handlers
│   ├── leaderboard/       # Leaderboard page
│   └── page.tsx           # Main chat page
├── components/
│   ├── chat/              # Chat UI components
│   ├── layout/            # Header, sidebar
│   └── ui/                # shadcn components
├── lib/
│   ├── auth.ts            # NextAuth configuration
│   ├── supabase.ts        # Supabase client
│   ├── vector-search.ts   # RAG retrieval logic
│   └── leaderboard.ts     # Leaderboard functions
└── types/                 # TypeScript types
```

## Features

- **AI Chat**: Ask questions about SSW Rules and get AI-powered answers
- **RAG**: Uses vector similarity search to find relevant rules
- **Streaming**: Real-time response streaming
- **Conversation History**: Save and load previous conversations
- **Leaderboard**: Track top users by message count

## Deployment

The app is configured for Azure Static Web Apps. Push to `main` to trigger deployment via GitHub Actions.

### Required Secrets

Add these secrets to your GitHub repository:

- `AZURE_STATIC_WEB_APPS_API_TOKEN`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `OPENAI_API_KEY`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `OIDC_ISSUER`
- `OIDC_CLIENT_ID`
- `OIDC_CLIENT_SECRET`
