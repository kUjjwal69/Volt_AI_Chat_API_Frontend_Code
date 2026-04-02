export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatSession {
  sessionId: string;
  title: string;
  createdAt: Date;
  messages: Message[];
}

export interface ChatRequest {
  sessionId?: string;
  userMessage: string;
}

export interface ChatResponse {
  sessionId: string;
  reply: string;
}
