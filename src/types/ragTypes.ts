// Types for Client-Side RAG Pipeline (adapted from backend/types.ts)

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatContext {
  id: string;           // Chunk ID
  content: string;      // Chunk text
  post_slug: string;    // Article slug for citation (used for citation links)
  relevanceScore?: number;
}

export interface StreamingCallbacks {
  onStart?: () => void;
  onToken?: (token: string) => void;
  onComplete?: (fullResponse: string, meta?: { citations?: Array<{ text: string; link: string }>; contextUsed?: ChatContext[] }) => void;
  onError?: (error: Error) => void;
}

export interface RagChatRequest {
  message: string;
  conversationHistory: ChatMessage[];
  streaming?: boolean;
  streamingCallbacks?: StreamingCallbacks;
}

export interface RagChatOptimizedQueryResponse {
  optimizedQuery: string;
}

export interface RagChatTechnicalResponse {
  technicalResponse: string;
  contextUsed: ChatContext[];
  optimizedQuery: string;
}

export interface RagChatSimplifiedResponse {
  response: string;
  citations: Array<{ post_slug: string; source: string }>;
}

export interface RagChatResponse {
  response: string;
  contextUsed: ChatContext[];
  conversationId?: string;
  optimizedQuery?: string;
  technicalResponse?: string;
  citations?: Array<{ text: string; link: string }>;
}

// API Cost Tracking Types (for optional tracking service)
export interface ApiTrackingRecord {
  call_type: string;
  token_type: 'input' | 'output';
  token_count: number;
  model: string;
  message?: string;
}

export interface ModelCost {
  input: number;
  output: number;
}

export interface ModelCostConfig {
  [modelName: string]: ModelCost;
}

export interface ModelUsage {
  inputTokens: number;
  outputTokens: number;
  otherTokens: number;
  totalTokens: number;
  cost: number;
}

export interface UsageStats {
  summary: Record<string, ModelUsage>;
  grandTotalCost: number;
  details: ApiTrackingRecord[];
}
