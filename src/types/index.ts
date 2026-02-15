export interface Rule {
  name: string;
  content: string;
  similarity?: number;
}

export interface ConversationHistory {
  id: string;
  user: string;
  conversation_title: string;
  conversation: string;
  schema_ver: number;
  created_at: string;
}

export interface LeaderboardEntry {
  user_name: string;
  user_email: string;
  message_count: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}
