export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  sessionId: string;
}

export interface ApiResponse {
  response?: string;
  error?: string;
}

export interface CreateSessionResponse {
  session_id: string;
}

export interface QueryRequest {
  query: string;
  thinking: boolean;
  codeact_enable: boolean;
  session_id: string;
}