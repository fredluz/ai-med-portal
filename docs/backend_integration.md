```markdown
# Frontend-to-Backend Integration Guide: HealthPortal System

**Target Framework:** React with TypeScript and Tailwind CSS  
**Architecture:** Client-side direct API integration (no traditional backend server)

## Table of Contents
1. [System Architecture Overview](#system-architecture-overview)
2. [Environment Setup](#environment-setup)
3. [Supabase Database Integration](#supabase-database-integration)
4. [OpenAI API Integration](#openai-api-integration)
5. [RAG Pipeline Implementation](#rag-pipeline-implementation)
6. [Real-time Features & Streaming](#real-time-features--streaming)
7. [API Tracking & Analytics](#api-tracking--analytics)
8. [Error Handling Patterns](#error-handling-patterns)
9. [React + Tailwind Implementation Patterns](#react--tailwind-implementation-patterns)
10. [Security Considerations](#security-considerations)
11. [Testing & Debugging](#testing--debugging)

---

## System Architecture Overview

The HealthPortal system uses a **client-side architecture** where frontend applications connect directly to external services without a traditional backend server. This approach provides:

- **Direct API Integration**: Frontend connects directly to Supabase and OpenAI
- **Real-time Capabilities**: Immediate data updates and streaming responses
- **Scalable Architecture**: Each frontend can scale independently
- **Simplified Deployment**: No backend server maintenance required

### High-Level Architecture Diagram
```

┌─────────────────────────────────────────────────────────────┐ │ Frontend Application │ │ (React, Vue, Angular, or any JavaScript framework) │ ├─────────────────────────────────────────────────────────────┤ │ Service Layer │ │ ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐ │ │ │ Supabase Client │ │ OpenAI Client │ │ API Tracking │ │ │ │ - Database ops │ │ - LLM calls │ │ - Usage stats │ │ │ │ - Vector search │ │ - Embeddings │ │ - Cost calc │ │ │ │ - Real-time │ │ - Streaming │ │ - Analytics │ │ │ └─────────────────┘ └─────────────────┘ └───────────────┘ │ └─────────────────────────────────────────────────────────────┘ │ ▼ ┌─────────────────────────────────────────────────────────────┐ │ External Services │ │ ┌─────────────────────────┐ ┌─────────────────────────┐ │ │ │ Supabase Database │ │ OpenAI APIs │ │ │ │ - PostgreSQL + Vector │ │ - GPT-4o Model │ │ │ │ - Real-time subscript. │ │ - Embedding Models │ │ │ │ - RPC Functions │ │ - Streaming Responses │ │ │ └─────────────────────────┘ └─────────────────────────┘ │ └─────────────────────────────────────────────────────────────┘

````javascript

### Key Components

1. **Database Layer**: Supabase for PostgreSQL operations, vector search, and real-time updates
2. **AI Layer**: OpenAI APIs for LLM processing, embeddings, and streaming responses
3. **Service Layer**: Abstraction layer providing reusable backend integration patterns
4. **Tracking Layer**: Comprehensive API usage monitoring and cost analysis

---

## Environment Setup & Configuration

### Required Environment Variables

Create a `.env` file in your project root with the following configuration:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI Configuration  
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Optional: Backend API (if using hybrid architecture)
VITE_BACKEND_API_URL=https://your-backend-api.com

# Optional: N8n Webhook Configuration
VITE_N8N_PUBLISH_WEBHOOK_URL=https://your-n8n-instance.com/webhook/id
VITE_N8N_WEBHOOK_SECRET=your_webhook_secret

# Application Configuration
VITE_APP_ARTICLE_BASE_URL=https://your-frontend.com/blog/article
````

### Package Dependencies

Install the required packages for your frontend framework:

```bash
# Core dependencies
npm install @supabase/supabase-js

# TypeScript support (recommended)
npm install -D typescript @types/node

# Framework-specific packages
# For React:
npm install react react-dom @types/react @types/react-dom

```

### Framework-Agnostic Configuration

The integration patterns work with any JavaScript framework. Here's the basic setup:

```typescript
// config/environment.ts
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  },
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY
  }
}

// Validation
if (!config.supabase.url || !config.supabase.anonKey) {
  throw new Error('Missing Supabase environment variables')
}

if (!config.openai.apiKey) {
  console.warn('OpenAI API key not found - AI features will be disabled')
}
```

---

## Supabase Database Integration

### Database Schema Overview

The HealthPortal system uses several key tables:

```sql
-- Core content tables
staged_raw_articles (
  id UUID PRIMARY KEY,
  source_url TEXT,
  raw_json_content JSONB,
  status TEXT,
  created_at TIMESTAMPTZ
)

processed_articles (
  id UUID PRIMARY KEY,
  staged_article_id UUID REFERENCES staged_raw_articles(id),
  content_en_rewritten TEXT,
  content_es_translated TEXT,
  content_pt_translated TEXT,
  curation_status TEXT,
  is_rag_indexed BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Vector search table
article_professional_chunks (
  id BIGSERIAL PRIMARY KEY,
  chunk_text TEXT,
  embedding VECTOR(1536),
  post_slug TEXT,
  retrieved_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ
)

-- API usage tracking
API_tracking (
  id BIGSERIAL PRIMARY KEY,
  call_type TEXT,
  token_type TEXT CHECK (token_type IN ('input', 'output')),
  token_count INTEGER,
  model TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

### Supabase Client Setup

```typescript
// utils/supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { config } from '../config/environment'

export const supabase: SupabaseClient = createClient(
  config.supabase.url,
  config.supabase.anonKey
)

// Type definitions for your data
export interface Article {
  id: string
  source_url: string
  raw_json_content: {
    url: string
    title: string
    source: string
    mainContentHtml: {
      sections: Record<string, Array<{
        text: string
        type: string
        items?: Array<string | { text: string; href?: string; type?: string }>
        ordered?: boolean
      }>>
      articleTitle?: string
    }
  }
  content_en_rewritten: string
  content_es_translated?: string
  content_pt_translated?: string
  created_at: string
  curation_status?: string | null
  processed_id: string
}

export interface ChatContext {
  id: string
  content: string
  post_slug: string
  relevanceScore?: number
}
```

### Database Operations

#### 1. Fetching Articles for Curation

```typescript
// services/articleService.ts
export async function fetchPendingArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('staged_raw_articles')
    .select(`
      id,
      source_url,
      raw_json_content,
      processed_articles!inner (
        id,
        content_en_rewritten,
        content_es_translated,
        content_pt_translated,
        created_at,
        curation_status
      )
    `)
    .eq('status', 'pending_curation')
    .in('processed_articles.curation_status', ['pending_review', 'needs_revision'])
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch articles: ${error.message}`)
  }

  // Transform nested data structure
  return data.map(item => ({
    id: item.id,
    source_url: item.source_url,
    raw_json_content: item.raw_json_content,
    content_en_rewritten: item.processed_articles[0]?.content_en_rewritten || '',
    content_es_translated: item.processed_articles[0]?.content_es_translated || '',
    content_pt_translated: item.processed_articles[0]?.content_pt_translated || '',
    created_at: item.processed_articles[0]?.created_at || '',
    curation_status: item.processed_articles[0]?.curation_status || 'pending_review',
    processed_id: item.processed_articles[0]?.id || ''
  }))
}
```

#### 2. Updating Article Status and Content

```typescript
export async function updateArticleStatus(
  articleId: string, 
  status: 'approved' | 'rejected' | 'needs_revision'
): Promise<void> {
  // First, find the processed article ID
  const { data: processedEntry, error: fetchError } = await supabase
    .from('processed_articles')
    .select('id')
    .eq('staged_article_id', articleId)
    .single()

  if (fetchError || !processedEntry) {
    throw new Error(`Failed to find processed article: ${fetchError?.message}`)
  }

  // Update the status
  const { error } = await supabase
    .from('processed_articles')
    .update({ 
      curation_status: status, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', processedEntry.id)

  if (error) {
    throw new Error(`Failed to update article status: ${error.message}`)
  }
}

export async function updateArticleContent(
  articleId: string, 
  language: 'en' | 'es' | 'pt', 
  content: string
): Promise<void> {
  // Find processed article
  const { data: processedEntry, error: fetchError } = await supabase
    .from('processed_articles')
    .select('id')
    .eq('staged_article_id', articleId)
    .single()

  if (fetchError || !processedEntry) {
    throw new Error(`Failed to find processed article: ${fetchError?.message}`)
  }

  // Determine update field
  const updateField = language === 'en' ? 'content_en_rewritten' :
                      language === 'es' ? 'content_es_translated' :
                      'content_pt_translated'

  // Update content
  const { error } = await supabase
    .from('processed_articles')
    .update({ 
      [updateField]: content, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', processedEntry.id)

  if (error) {
    throw new Error(`Failed to update article content: ${error.message}`)
  }
}
```

#### 3. Vector Search Operations

```typescript
// Vector search for RAG system
export async function matchArticleChunks(
  queryEmbedding: number[], 
  topK: number
): Promise<{ data: ChatContext[]; error?: any }> {
  try {
    const params = {
      query_embedding: queryEmbedding,
      similarity_threshold: 0.0,
      match_count: topK
    }

    const { data, error } = await supabase.rpc('match_article_chunks', params)
    
    if (error) return { data: [], error }

    // Transform to ChatContext format
    const chatContexts = (data || []).map((chunk: any) => ({
      id: chunk.id,
      content: chunk.chunk_text,
      post_slug: chunk.post_slug,
      relevanceScore: chunk.similarity_score
    }))

    return { data: chatContexts, error: undefined }
  } catch (err) {
    console.error('Error in matchArticleChunks:', err)
    return { data: [], error: err }
  }
}

// Analytics: increment chunk retrieval count
export async function incrementChunkRetrievedCount(chunkId: string): Promise<void> {
  try {
    await supabase.rpc('increment_chunk_retrieved_count', { 
      target_chunk_id: chunkId 
    })
  } catch (err) {
    // Silent failure - analytics shouldn't break core functionality
    console.warn('Failed to increment chunk count:', err)
  }
}
```

#### 4. API Tracking Operations

```typescript
export interface ApiTrackingRecord {
  call_type: string
  token_type: 'input' | 'output'
  token_count: number
  model: string
  message?: string
}

export async function insertApiTrackingRecord(
  record: ApiTrackingRecord
): Promise<{ success: boolean; error?: any }> {
  try {
    const { error } = await supabase
      .from('API_tracking')
      .insert(record)
    
    if (error) return { success: false, error }
    return { success: true }
  } catch (err) {
    return { success: false, error: err }
  }
}

export async function getApiTrackingStats(
  timeRange?: string
): Promise<{ data: any[] | null; error?: any }> {
  try {
    let query = supabase.from('API_tracking').select('*')
    
    if (timeRange) {
      const startDate = new Date()
      switch (timeRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          startDate.setDate(startDate.getDate() - 7)
          break
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1)
          break
      }
      query = query.gte('created_at', startDate.toISOString())
    }
    
    const { data, error } = await query
    return { data, error }
  } catch (err) {
    return { data: null, error: err }
  }
}
```

---

## OpenAI API Integration

### OpenAI Service Setup

The system uses the OpenAI Responses API with direct browser connections:

```typescript
// utils/openaiClient.ts
export interface ResponseOptions {
  temperature?: number
  maxTokens?: number
  stream?: boolean
  previousResponseId?: string
  callbacks?: StreamingCallbacks
  instructions?: string
  callType?: string
}

export interface StreamingCallbacks {
  onStart?: () => void
  onToken?: (token: string) => void
  onComplete?: (fullResponse: string, meta?: any) => void
  onError?: (error: Error) => void
}

export class OpenAIService {
  private apiKey: string
  private baseUrl = 'https://api.openai.com/v1'
  private model = 'gpt-4o-mini'

  constructor() {
    this.apiKey = config.openai.apiKey
    if (!this.apiKey) {
      throw new Error('OpenAI API key is required')
    }
  }

  async getChatResponse(
    messages: ChatMessage[], 
    options: ResponseOptions = {}
  ): Promise<{ response: string; responseId: string }> {
    const {
      temperature = 0.7,
      maxTokens = 500,
      stream = false,
      previousResponseId,
      callbacks,
      instructions,
      callType = 'unknown'
    } = options

    const input = this.formatMessagesForInput(messages)

    const requestBody = {
      model: this.model,
      input,
      ...(instructions && { instructions }),
      temperature,
      max_output_tokens: maxTokens,
      stream,
      ...(previousResponseId && { previous_response_id: previousResponseId })
    }

    try {
      if (stream) {
        return await this.handleStreamingResponse(requestBody, callbacks, callType)
      } else {
        return await this.handleNonStreamingResponse(requestBody, callType)
      }
    } catch (error) {
      console.error('OpenAI API Error:', error)
      if (callbacks?.onError) {
        callbacks.onError(error as Error)
      }
      throw new Error(`OpenAI API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private async handleNonStreamingResponse(
    requestBody: any,
    callType: string
  ): Promise<{ response: string; responseId: string }> {
    const response = await fetch(`${this.baseUrl}/responses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`HTTP ${response.status}: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()

    if (data.status === 'failed') {
      throw new Error(`Response failed: ${data.error?.message || 'Unknown error'}`)
    }

    const responseText = this.extractTextFromOutput(data.output)

    // Track API usage if tracking service is available
    const inputText = requestBody.input + (requestBody.instructions ? `\nINSTRUCTIONS:\n${requestBody.instructions}` : '')
    if (data.usage && apiTrackingService?.isAvailable?.()) {
      await this.trackApiUsage(callType, data.usage.input_tokens, data.usage.output_tokens, inputText, responseText)
    }

    return {
      response: responseText,
      responseId: data.id
    }
  }

  // Embedding generation for vector search
  async getEmbedding(
    inputText: string,
    callType: string = 'embedding_chunk',
    modelId: string = 'text-embedding-3-small'
  ): Promise<number[]> {
    if (!inputText?.trim()) {
      throw new Error('Input text for embedding cannot be empty')
    }

    const requestBody = {
      input: inputText,
      model: modelId,
    }

    const response = await fetch(`${this.baseUrl}/embeddings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`OpenAI Embeddings API HTTP ${response.status}: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()

    if (!data.data?.[0]?.embedding) {
      throw new Error('No valid embedding vector found in response')
    }

    // Track embedding usage
    if (data.usage?.prompt_tokens && apiTrackingService?.isAvailable?.()) {
      apiTrackingService.trackApiCall({
        call_type: callType,
        token_type: 'input',
        token_count: data.usage.prompt_tokens,
        model: data.model,
        message: `Embedding for: "${inputText.substring(0, 100)}..."`
      })
    }

    return data.data[0].embedding
  }

  private formatMessagesForInput(messages: ChatMessage[]): string {
    const userMessages = messages.filter(msg => msg.role !== 'system')
    return userMessages.map(msg => {
      const rolePrefix = msg.role === 'user' ? 'User: ' : 'Assistant: '
      return rolePrefix + msg.content
    }).join('\n\n')
  }

  private extractTextFromOutput(output: any[]): string {
    if (!output?.[0]?.content) {
      throw new Error('No content in OpenAI response')
    }
    
    const textContent = output[0].content.find((c: any) => c.type === 'output_text')
    if (!textContent) {
      throw new Error('No text content found in OpenAI response')
    }
    
    return textContent.text || ''
  }
}

// Export singleton instance
export const openaiService = new OpenAIService()
```

### Streaming Response Handling

```typescript
private async handleStreamingResponse(
  requestBody: any, 
  callbacks?: StreamingCallbacks,
  callType: string = 'unknown'
): Promise<{ response: string; responseId: string }> {
  const response = await fetch(`${this.baseUrl}/responses`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`HTTP ${response.status}: ${errorData.error?.message || response.statusText}`)
  }

  return new Promise((resolve, reject) => {
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let fullResponse = ''
    let responseId = ''
    let buffer = ''

    callbacks?.onStart?.()

    const processStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader!.read()
          if (done) break
          
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const eventData = line.slice(6).trim()
              if (eventData === '[DONE]') continue
              
              try {
                const event = JSON.parse(eventData)
                
                switch (event.type) {
                  case 'response.created':
                    responseId = event.response.id
                    break
                    
                  case 'response.output_text.delta':
                    const delta = event.delta
                    fullResponse += delta
                    callbacks?.onToken?.(delta)
                    break
                    
                  case 'response.completed':
                    // Track usage for completed streaming response
                    if (event.response.usage && apiTrackingService?.isAvailable?.()) {
                      const inputText = requestBody.input + (requestBody.instructions ? `\nINSTRUCTIONS:\n${requestBody.instructions}` : '')
                      await this.trackApiUsage(
                        callType,
                        event.response.usage.input_tokens,
                        event.response.usage.output_tokens,
                        inputText,
                        fullResponse
                      )
                    }
                    callbacks?.onComplete?.(fullResponse)
                    resolve({ response: fullResponse, responseId })
                    return
                    
                  case 'response.failed':
                    const error = new Error(`Response failed: ${event.response.error?.message}`)
                    callbacks?.onError?.(error)
                    reject(error)
                    return
                    
                  case 'response.incomplete':
                    const incompleteError = new Error(`Response incomplete: ${event.response.incomplete_details?.reason}`)
                    callbacks?.onError?.(incompleteError)
                    reject(incompleteError)
                    return
                }
              } catch (parseError) {
                // Ignore parse errors for non-JSON lines
              }
            }
          }
        }
      } catch (streamError) {
        callbacks?.onError?.(streamError as Error)
        reject(streamError)
      }
    }

    processStream()
  })
}
```

---

## Service Layer Architecture

### API Tracking Service

```typescript
// services/apiTrackingService.ts
interface ModelCostConfig {
  [modelName: string]: { input: number; output: number }
}

const modelCosts: ModelCostConfig = {
  'gpt-4o': { input: 0.025, output: 0.10 },
  'gpt-4o-mini': { input: 0.0015, output: 0.006 },
  'text-embedding-3-small': { input: 0.0002, output: 0.0002 }
}

export class ApiTrackingService {
  isAvailable(): boolean {
    return true // Always available in this implementation
  }

  async trackApiCall(record: ApiTrackingRecord): Promise<void> {
    try {
      await insertApiTrackingRecord(record)
    } catch (error) {
      // Silent failure - tracking shouldn't break core functionality
      console.warn('API tracking failed:', error)
    }
  }

  async getUsageStats(timeRange?: string): Promise<UsageStats | null> {
    const { data: records, error } = await getApiTrackingStats(timeRange)
    if (error || !records) return null

    const usageSummary: Record<string, ModelUsage> = {}
    let grandTotalCost = 0

    for (const record of records) {
      const modelName = record.model
      const costConfig = modelCosts[modelName]
      if (!costConfig) continue

      if (!usageSummary[modelName]) {
        usageSummary[modelName] = {
          inputTokens: 0,
          outputTokens: 0,
          otherTokens: 0,
          totalTokens: 0,
          cost: 0
        }
      }

      let recordCost = 0
      const tokensIn10kBlocks = record.token_count / 10000

      if (record.token_type === 'input') {
        usageSummary[modelName].inputTokens += record.token_count
        recordCost = tokensIn10kBlocks * costConfig.input
      } else if (record.token_type === 'output') {
        usageSummary[modelName].outputTokens += record.token_count
        recordCost = tokensIn10kBlocks * costConfig.output
      } else {
        usageSummary[modelName].otherTokens += record.token_count
        recordCost = tokensIn10kBlocks * costConfig.input
      }

      usageSummary[modelName].totalTokens += record.token_count
      usageSummary[modelName].cost += recordCost
      grandTotalCost += recordCost
    }

    return {
      summary: usageSummary,
      grandTotalCost: parseFloat(grandTotalCost.toFixed(4)),
      details: records
    }
  }
}

export const apiTrackingService = new ApiTrackingService()
```

---

## RAG Pipeline Implementation

The HealthPortal system implements a sophisticated __3-step RAG (Retrieval-Augmented Generation) pipeline__:

### RAG Service Architecture

```typescript
// services/ragChatbotService.ts
export interface RagChatRequest {
  message: string
  conversationHistory: ChatMessage[]
  streaming?: boolean
  streamingCallbacks?: StreamingCallbacks
}

export interface RagChatResponse {
  response: string
  contextUsed: ChatContext[]
  conversationId?: string
  optimizedQuery?: string
  technicalResponse?: string
  citations?: Array<{ text: string; link: string }>
}

class RagChatbotService {
  // Step 1: Query Optimization Prompt
  private queryOptimizerPrompt = `You are a medical translation specialist. Your job is to translate simple questions from everyday people into comprehensive medical queries that an educated doctor would need answered to provide complete information.

Think of yourself as bridging the gap between:
- A person with basic English and limited medical knowledge asking simple questions
- The detailed, technical medical information a doctor would want to explain

Guidelines:
- Translate simple questions into comprehensive medical information requests
- Use medical terminology that will match professional health content

Examples:
User: "whats asthma"
Optimized: "Please explain asthma, including it's symptoms, causes and triggers."

Transform the following query:`

  // Step 2: Technical Response Prompt
  private technicalResponsePrompt = `You are a medical information specialist providing detailed, technical health information based on retrieved medical content. Your responses should be comprehensive and medically accurate.

Guidelines:
- Use the provided medical context to create detailed, technical responses
- Include relevant medical terminology and concepts
- Provide comprehensive information about conditions, treatments, and recommendations
- Maintain medical accuracy and detail
- Reference symptoms, causes, diagnostic criteria, and treatment options when relevant

This response will be simplified in a subsequent step, so prioritize accuracy and completeness over simplicity.`

  // Step 3: Simplification Prompt Template
  private simplificationPromptTemplate = `You are a health communication specialist who simplifies complex medical information for ESL (English as Second Language) readers with basic education levels.

Your job is to act as a translator, converting detailed medical responses into simple, easy-to-understand language.

Context:
- Conversation: {{conversationHistory}}
- Original question: {{unoptimized_query}}
- Medical query: {{optimizedQuery}}
- Technical response: {{technicalresponse}}

Guidelines:
- Convert complex medical terms to simple, everyday words
- Use short, clear sentences (max 15 words per sentence)
- Explain medical concepts using analogies and simple comparisons
- Use active voice instead of passive voice
- Ensure reading level is appropriate for someone with basic English skills
- Maintain all important health information while making it accessible
- Always include advice to see a doctor for serious concerns`

  async getChatResponse(request: RagChatRequest): Promise<RagChatResponse> {
    // Step 1: Optimize the user query
    const optimizedQuery = await this.optimizeUserQuery(request.message)
    
    // Step 2: Retrieve relevant context
    const relevantContext = await this.retrieveRelevantContext(optimizedQuery)
    
    // Step 3: Generate technical response
    const technicalResponse = await this.generateTechnicalResponse(
      request.message,
      optimizedQuery,
      request.conversationHistory,
      relevantContext
    )
    
    // Step 4: Simplify technical response for ESL readers
    const simplifiedResponse = await this.simplifyResponse(
      technicalResponse,
      request.message,
      optimizedQuery,
      request.conversationHistory,
      request.streamingCallbacks
    )

    // Generate citations
    const citations = this.dedupeCitations(relevantContext)

    return {
      response: simplifiedResponse,
      contextUsed: relevantContext,
      conversationId: this.generateConversationId(),
      optimizedQuery,
      technicalResponse,
      citations
    }
  }

  private async optimizeUserQuery(userMessage: string): Promise<string> {
    const result = await openaiService.getChatResponse([
      { role: 'user', content: userMessage }
    ], {
      instructions: this.queryOptimizerPrompt,
      callType: 'query_optimization',
      temperature: 0.3,
      maxTokens: 500
    })
    return result.response.trim()
  }

  private async retrieveRelevantContext(
    optimizedQuery: string, 
    topK: number = 3
  ): Promise<ChatContext[]> {
    try {
      // Generate embedding for the optimized query
      const queryEmbedding = await openaiService.getEmbedding(
        optimizedQuery, 
        'rag_query_embedding'
      )

      if (!queryEmbedding?.length) {
        console.warn('No embedding generated for optimized query')
        return []
      }

      // Perform vector search
      const { data: retrievedChunks, error } = await matchArticleChunks(
        queryEmbedding, 
        topK
      )

      if (error || !retrievedChunks?.length) {
        console.warn('No relevant chunks found:', error)
        return []
      }

      // Track chunk retrieval for analytics (fire-and-forget)
      retrievedChunks.forEach(chunk => {
        this.fireAndForgetIncrementChunkCount(chunk.id)
      })

      return retrievedChunks
    } catch (err) {
      console.error('Error in retrieveRelevantContext:', err)
      return []
    }
  }

  private async generateTechnicalResponse(
    originalMessage: string,
    optimizedQuery: string,
    conversationHistory: ChatMessage[],
    context: ChatContext[]
  ): Promise<string> {
    const contextText = context.length > 0
      ? context.map(ctx => ctx.content).join('\n\n')
      : 'No specific medical content found for this query.'

    const enhancedPrompt = `${this.technicalResponsePrompt}

RETRIEVED MEDICAL CONTEXT:
${contextText}

ORIGINAL USER QUESTION: ${originalMessage}
OPTIMIZED SEARCH TERMS: ${optimizedQuery}

Please provide a comprehensive, technical response based on the above context and medical knowledge.`

    const result = await openaiService.getChatResponse([
      ...conversationHistory,
      { role: 'user', content: originalMessage }
    ], {
      instructions: enhancedPrompt,
      callType: 'technical_response',
      stream: false
    })

    return result.response
  }

  private async simplifyResponse(
    technicalResponse: string,
    originalMessage: string,
    optimizedQuery: string,
    conversationHistory: ChatMessage[],
    streamingCallbacks?: StreamingCallbacks
  ): Promise<string> {
    const formattedConversationHistory = conversationHistory
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n')

    const populatedInstructions = this.simplificationPromptTemplate
      .replace('{{conversationHistory}}', formattedConversationHistory)
      .replace('{{unoptimized_query}}', originalMessage)
      .replace('{{optimizedQuery}}', optimizedQuery)
      .replace('{{technicalresponse}}', technicalResponse)

    const options = {
      instructions: populatedInstructions,
      callType: 'response_simplification',
      temperature: 0.3,
      maxTokens: 600,
      stream: !!streamingCallbacks,
      ...(streamingCallbacks ? { callbacks: streamingCallbacks } : {})
    }

    const result = await openaiService.getChatResponse(
      conversationHistory,
      options
    )

    return result.response
  }

  private dedupeCitations(context: ChatContext[]): Array<{ text: string; link: string }> {
    const seen = new Set<string>()
    const citations = []
    
    for (const ctx of context) {
      const link = `/blog/article/${ctx.post_slug}`
      if (!seen.has(link)) {
        seen.add(link)
        citations.push({ text: `[${citations.length + 1}]`, link })
      }
    }
    
    return citations
  }

  private fireAndForgetIncrementChunkCount(chunkId: string): void {
    // Analytics tracking that doesn't block the main flow
    incrementChunkRetrievedCount(chunkId).catch(() => {
      // Silent failure
    })
  }

  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

export const ragChatbotService = new RagChatbotService()
```

### RAG Pipeline Flow Diagram

```javascript
User Query: "I have headaches lately"
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Query Optimization                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Input: "I have headaches lately"                        │ │
│ │ LLM Call: query_optimization                            │ │
│ │ Output: "headache causes migraine tension symptoms"     │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Context Retrieval                                   │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Generate embedding for optimized query                  │ │
│ │ Vector search in article_professional_chunks            │ │
│ │ Return top 3 relevant medical document chunks           │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Technical Response                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Input: Original query + Optimized terms + Context      │ │
│ │ LLM Call: technical_response                            │ │
│ │ Output: Comprehensive medical response                  │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: ESL Simplification                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Input: Technical response + Conversation context       │ │
│ │ LLM Call: response_simplification (with streaming)     │ │
│ │ Output: Simple, accessible response for ESL readers    │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
       │
       ▼
Final Response + Citations + Context Used
```

---

## Real-time Features

### Streaming Implementation in Frontend Components

```typescript
// Example: React component with streaming
import React, { useState } from 'react'
import { ragChatbotService } from '../services/ragChatbotService'
import type { ChatMessage, StreamingCallbacks } from '../types/ragTypes'

export const StreamingChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentResponse, setCurrentResponse] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [citations, setCitations] = useState<Array<{ text: string; link: string }>>([])

  const sendMessage = async (userMessage: string) => {
    const newUserMessage: ChatMessage = { role: 'user', content: userMessage }
    setMessages(prev => [...prev, newUserMessage])
    setCurrentResponse('')
    setIsStreaming(true)
    setCitations([])

    const streamingCallbacks: StreamingCallbacks = {
      onStart: () => {
        console.log('Streaming started')
      },
      onToken: (token: string) => {
        setCurrentResponse(prev => prev + token)
      },
      onComplete: (fullResponse: string, meta?: any) => {
        const assistantMessage: ChatMessage = { role: 'assistant', content: fullResponse }
        setMessages(prev => [...prev, assistantMessage])
        setCurrentResponse('')
        setIsStreaming(false)
        
        if (meta?.citations) {
          setCitations(meta.citations)
        }
      },
      onError: (error: Error) => {
        console.error('Streaming error:', error)
        setIsStreaming(false)
        setCurrentResponse('Sorry, there was an error processing your request.')
      }
    }

    try {
      await ragChatbotService.getChatResponse({
        message: userMessage,
        conversationHistory: messages,
        streaming: true,
        streamingCallbacks
      })
    } catch (error) {
      console.error('Chat error:', error)
      setIsStreaming(false)
    }
  }

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.content}
          </div>
        ))}
        
        {isStreaming && currentResponse && (
          <div className="message assistant streaming">
            {currentResponse}
            <span className="cursor">|</span>
          </div>
        )}
      </div>
      
      {citations.length > 0 && (
        <div className="citations">
          <h4>Sources:</h4>
          {citations.map((citation, index) => (
            <a key={index} href={citation.link} target="_blank" rel="noopener noreferrer">
              {citation.text}
            </a>
          ))}
        </div>
      )}
      
      <div className="input-area">
        <input
          type="text"
          placeholder="Ask a health question..."
          onKeyPress={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              sendMessage(e.currentTarget.value)
              e.currentTarget.value = ''
            }
          }}
          disabled={isStreaming}
        />
      </div>
    </div>
  )
}
```

### Vue.js Streaming Example

```vue
<template>
  <div class="chat-container">
    <div class="messages">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="`message ${message.role}`"
      >
        {{ message.content }}
      </div>
      
      <div v-if="isStreaming && currentResponse" class="message assistant streaming">
        {{ currentResponse }}
        <span class="cursor">|</span>
      </div>
    </div>
    
    <div v-if="citations.length > 0" class="citations">
      <h4>Sources:</h4>
      <a
        v-for="(citation, index) in citations"
        :key="index"
        :href="citation.link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ citation.text }}
      </a>
    </div>
    
    <div class="input-area">
      <input
        v-model="inputMessage"
        type="text"
        placeholder="Ask a health question..."
        @keypress.enter="sendMessage"
        :disabled="isStreaming"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ragChatbotService } from '../services/ragChatbotService'
import type { ChatMessage, StreamingCallbacks } from '../types/ragTypes'

const messages = ref<ChatMessage[]>([])
const currentResponse = ref('')
const isStreaming = ref(false)
const citations = ref<Array<{ text: string; link: string }>>([])
const inputMessage = ref('')

const sendMessage = async () => {
  if (!inputMessage.value.trim()) return
  
  const userMessage = inputMessage.value
  inputMessage.value = ''
  
  const newUserMessage: ChatMessage = { role: 'user', content: userMessage }
  messages.value.push(newUserMessage)
  currentResponse.value = ''
  isStreaming.value = true
  citations.value = []

  const streamingCallbacks: StreamingCallbacks = {
    onStart: () => console.log('Streaming started'),
    onToken: (token: string) => {
      currentResponse.value += token
    },
    onComplete: (fullResponse: string, meta?: any) => {
      const assistantMessage: ChatMessage = { role: 'assistant', content: fullResponse }
      messages.value.push(assistantMessage)
      currentResponse.value = ''
      isStreaming.value = false
      
      if (meta?.citations) {
        citations.value = meta.citations
      }
    },
    onError: (error: Error) => {
      console.error('Streaming error:', error)
      isStreaming.value = false
      currentResponse.value = 'Sorry, there was an error processing your request.'
    }
  }

  try {
    await ragChatbotService.getChatResponse({
      message: userMessage,
      conversationHistory: messages.value,
      streaming: true,
      streamingCallbacks
    })
  } catch (error) {
    console.error('Chat error:', error)
    isStreaming.value = false
  }
}
</script>
```

---

## API Tracking & Analytics

### Usage Dashboard Implementation

```typescript
// components/ApiUsageDashboard.tsx
import React, { useState, useEffect } from 'react'
import { apiTrackingService } from '../services/apiTrackingService'
import type { UsageStats } from '../types/ragTypes'

export const ApiUsageDashboard: React.FC = () => {
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [timeRange, setTimeRange] = useState<string>('today')
  const [loading, setLoading] = useState(false)

  const loadUsageStats = async () => {
    setLoading(true)
    try {
      const stats = await apiTrackingService.getUsageStats(timeRange)
      setUsageStats(stats)
    } catch (error) {
      console.error('Failed to load usage stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsageStats()
  }, [timeRange])

  const formatCost = (cost: number) => `$${cost.toFixed(4)}`

  return (
    <div className="api-usage-dashboard">
      <h2>API Usage Analytics</h2>
      
      <div className="controls">
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="today">Today</option>
          <option value="week">Past Week</option>
          <option value="month">Past Month</option>
        </select>
        <button onClick={loadUsageStats} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {usageStats && (
        <div className="stats-grid">
          <div className="total-cost card">
            <h3>Total Cost</h3>
            <div className="value">{formatCost(usageStats.grandTotalCost)}</div>
          </div>

          {Object.entries(usageStats.summary).map(([modelName, usage]) => (
            <div key={modelName} className="model-usage card">
              <h3>{modelName}</h3>
              <div className="usage-details">
                <div>Input Tokens: {usage.inputTokens.toLocaleString()}</div>
                <div>Output Tokens: {usage.outputTokens.toLocaleString()}</div>
                <div>Total Tokens: {usage.totalTokens.toLocaleString()}</div>
                <div>Cost: {formatCost(usage.cost)}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {usageStats?.details && (
        <div className="usage-details-table">
          <h3>Recent API Calls</h3>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Call Type</th>
                <th>Model</th>
                <th>Token Type</th>
                <th>Token Count</th>
              </tr>
            </thead>
            <tbody>
              {usageStats.details.slice(0, 50).map((record, index) => (
                <tr key={index}>
                  <td>{new Date(record.created_at).toLocaleString()}</td>
                  <td>{record.call_type}</td>
                  <td>{record.model}</td>
                  <td>{record.token_type}</td>
                  <td>{record.token_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
```

---

## Error Handling & Resilience

### Comprehensive Error Handling Pattern

```typescript
// utils/errorHandler.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errorCode?: string,
    public retryable: boolean = false
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NetworkError'
  }
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      // Don't retry on certain error types
      if (error instanceof ApiError && !error.retryable) {
        throw error
      }
      
      if (attempt === maxRetries) {
        break
      }
      
      // Exponential backoff
      const delay = delayMs * Math.pow(2, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError!
}

// Enhanced service wrapper with error handling
export function createResilientService<T extends object>(service: T): T {
  return new Proxy(service, {
    get(target, prop) {
      const original = target[prop as keyof T]
      
      if (typeof original === 'function') {
        return async function(...args: any[]) {
          try {
            return await withRetry(() => original.apply(target, args))
          } catch (error) {
            console.error(`Service error in ${String(prop)}:`, error)
            
            // Transform common errors
            if (error.message?.includes('fetch')) {
              throw new NetworkError('Network connection failed')
            }
            
            if (error.message?.includes('401') || error.message?.includes('403')) {
              throw new ApiError('Authentication failed', 401, 'AUTH_ERROR')
            }
            
            if (error.message?.includes('429')) {
              throw new ApiError('Rate limit exceeded', 429, 'RATE_LIMIT', true)
            }
            
            throw error
          }
        }
      }
      
      return original
    }
  })
}

// Usage example
export const resilientRagService = createResilientService(ragChatbotService)
```

### Frontend Error Boundaries

```typescript
// React Error Boundary
import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ApiErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('API Error Boundary caught an error:', error, errorInfo)
    
    // Log to monitoring service
    // logErrorToService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

---

## Security Considerations

### Environment Variable Security

```typescript
// security/envValidator.ts
export function validateEnvironment(): void {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ]

  const optionalVars = [
    'VITE_OPENAI_API_KEY'
  ]

  const missing = requiredVars.filter(varName => !process.env[varName] && !import.meta.env[varName])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  const warnings = optionalVars.filter(varName => !process.env[varName] && !import.meta.env[varName])
  
  if (warnings.length > 0) {
    console.warn(`Optional environment variables not set: ${warnings.join(', ')}`)
  }
}

// Rate limiting for API calls
export class RateLimiter {
  private callCounts = new Map<string, { count: number; resetTime: number }>()
  
  constructor(
    private maxCalls: number = 60,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  canMakeCall(identifier: string): boolean {
    const now = Date.now()
    const record = this.callCounts.get(identifier)
    
    if (!record || now > record.resetTime) {
      this.callCounts.set(identifier, { count: 1, resetTime: now + this.windowMs })
      return true
    }
    
    if (record.count >= this.maxCalls) {
      return false
    }
    
    record.count++
    return true
  }
}

// API key rotation helper
export class ApiKeyManager {
  constructor(private keys: string[]) {}
  
  getKey(): string {
    if (this.keys.length === 0) {
      throw new Error('No API keys available')
    }
    
    // Simple round-robin (implement more sophisticated logic as needed)
    const key = this.keys[Math.floor(Math.random() * this.keys.length)]
    return key
  }
  
  markKeyAsInvalid(key: string): void {
    this.keys = this.keys.filter(k => k !== key)
  }
}
```

### Supabase Row Level Security

```sql
-- Example RLS policies for the HealthPortal tables

-- API_tracking table - only allow inserts, selects for analytics
CREATE POLICY "Allow API tracking inserts" ON API_tracking
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow API tracking selects" ON API_tracking
  FOR SELECT USING (true);

-- processed_articles - allow reads and updates for curation
CREATE POLICY "Allow processed article reads" ON processed_articles
  FOR SELECT USING (true);

CREATE POLICY "Allow processed article updates" ON processed_articles
  FOR UPDATE USING (curation_status IN ('pending_review', 'needs_revision'));

-- article_professional_chunks - read-only for vector search
CREATE POLICY "Allow chunk reads for search" ON article_professional_chunks
  FOR SELECT USING (true);
```

---

## Step-by-Step Implementation Guide

### Phase 1: Basic Setup (1-2 hours)

1. __Initialize Project__

   ```bash
   # Create new frontend project
   npx create-react-app my-healthportal-dashboard --template typescript
   # or
   npm create vue@latest my-healthportal-dashboard -- --typescript
   # or
   ng new my-healthportal-dashboard

   cd my-healthportal-dashboard
   npm install @supabase/supabase-js
   ```

2. __Environment Configuration__

   ```bash
   # Copy .env.example to .env and fill in values
   cp .env.example .env
   ```

3. __Basic Type Definitions__

   ```typescript
   // types/index.ts - Start with core types
   export interface ChatMessage {
     role: 'user' | 'assistant' | 'system'
     content: string
   }

   export interface Article {
     id: string
     title: string
     content: string
     status: string
   }
   ```

### Phase 2: Database Integration (2-3 hours)

1. __Supabase Client Setup__

   ```typescript
   // utils/supabase.ts
   import { createClient } from '@supabase/supabase-js'

   export const supabase = createClient(
     process.env.VITE_SUPABASE_URL!,
     process.env.VITE_SUPABASE_ANON_KEY!
   )
   ```

2. __Basic Data Fetching__

   ```typescript
   // services/articleService.ts
   export async function fetchArticles() {
     const { data, error } = await supabase
       .from('processed_articles')
       .select('*')
       .limit(10)
     
     if (error) throw error
     return data
   }
   ```

3. __Test Database Connection__

   ```typescript
   // components/TestConnection.tsx
   useEffect(() => {
     fetchArticles()
       .then(articles => console.log('Articles:', articles))
       .catch(error => console.error('Error:', error))
   }, [])
   ```

### Phase 3: OpenAI Integration (3-4 hours)

1. __OpenAI Client Setup__

   ```typescript
   // Copy the OpenAI service implementation from this guide
   // Start with basic chat completion
   ```

2. __Simple Chat Interface__

   ```typescript
   // Create basic chat component with non-streaming first
   // Add streaming capabilities once basic flow works
   ```

3. __Test AI Integration__

   ```typescript
   // Test with simple health questions
   // Verify API tracking is working
   ```

### Phase 4: RAG Implementation (4-6 hours)

1. __Vector Search Setup__

   ```typescript
   // Implement matchArticleChunks function
   // Test with sample embeddings
   ```

2. __RAG Service Implementation__

   ```typescript
   // Copy RAG service from this guide
   // Test each step individually
   ```

3. __End-to-End RAG Testing__

   ```typescript
   // Test complete pipeline with real health questions
   ```

### Phase 5: Advanced Features (2-4 hours)

1. __Streaming Interface__

   ```typescript
   // Add real-time streaming to chat interface
   // Implement proper error handling
   ```

2. __Analytics Dashboard__

   ```typescript
   // Create API usage tracking dashboard
   // Add cost monitoring
   ```

3. __Error Handling__

   ```typescript
   // Implement comprehensive error boundaries
   // Add retry logic and fallbacks
   ```

### Phase 6: Testing & Deployment (2-3 hours)

1. __Testing__

   ```bash
   # Test all integrations thoroughly
   # Verify environment variable handling
   ```

2. __Performance Optimization__

   ```typescript
   // Add loading states
   // Implement caching where appropriate
   ```

3. __Deployment__

   ```bash
   # Build and deploy to your platform
   npm run build
   ```

---

## React + Tailwind Implementation Patterns

### Project Setup for React + Tailwind

```bash
# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Configure tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'health-primary': '#10b981',
        'health-secondary': '#3b82f6',
      }
    },
  },
  plugins: [],
}
```

### Component Architecture Patterns

#### 1. Service Integration Hook Pattern

```typescript
// hooks/useHealthPortalServices.ts
import { useState, useCallback } from 'react'
import { ragChatbotService } from '../services/ragChatbotService'
import { apiTrackingService } from '../services/apiTrackingService'
import type { RagChatRequest, RagChatResponse, UsageStats } from '../types/ragTypes'

export const useHealthPortalServices = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const executeRagQuery = useCallback(async (request: RagChatRequest): Promise<RagChatResponse | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await ragChatbotService.getChatResponse(request)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getUsageStats = useCallback(async (timeRange?: string): Promise<UsageStats | null> => {
    try {
      return await apiTrackingService.getUsageStats(timeRange)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load usage stats')
      return null
    }
  }, [])

  return {
    executeRagQuery,
    getUsageStats,
    loading,
    error,
    clearError: () => setError(null)
  }
}
```

#### 2. Tailwind UI Components for Health Data

```typescript
// components/HealthMetricsCard.tsx
interface HealthMetricsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'stable'
  className?: string
}

export const HealthMetricsCard: React.FC<HealthMetricsCardProps> = ({
  title,
  value,
  icon,
  trend,
  className = ''
}) => {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    stable: 'text-gray-600'
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-health-primary">{icon}</div>
          {trend && (
            <span className={`text-xs ${trendColors[trend]} mt-1`}>
              {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
```

#### 3. Streaming Chat Component with Tailwind

```typescript
// components/StreamingHealthChat.tsx
import React, { useState, useRef, useEffect } from 'react'
import { useHealthPortalServices } from '../hooks/useHealthPortalServices'
import type { ChatMessage, StreamingCallbacks } from '../types/ragTypes'

export const StreamingHealthChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [currentResponse, setCurrentResponse] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { executeRagQuery, loading, error } = useHealthPortalServices()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, currentResponse])

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return

    const userMessage: ChatMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsStreaming(true)
    setCurrentResponse('')

    const streamingCallbacks: StreamingCallbacks = {
      onStart: () => setIsStreaming(true),
      onToken: (token: string) => setCurrentResponse(prev => prev + token),
      onComplete: (fullResponse: string) => {
        const assistantMessage: ChatMessage = { role: 'assistant', content: fullResponse }
        setMessages(prev => [...prev, assistantMessage])
        setCurrentResponse('')
        setIsStreaming(false)
      },
      onError: (error: Error) => {
        console.error('Streaming error:', error)
        setIsStreaming(false)
        setCurrentResponse('')
      }
    }

    await executeRagQuery({
      message: input,
      conversationHistory: messages,
      streaming: true,
      streamingCallbacks
    })
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-health-primary text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-semibold">Health Assistant</h2>
        <p className="text-green-100 text-sm">Ask questions about your health</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-health-secondary text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}

        {/* Streaming response */}
        {isStreaming && currentResponse && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-100 text-gray-900">
              <p className="text-sm">{currentResponse}</p>
              <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1">|</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask a health question..."
            disabled={isStreaming}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-health-primary focus:border-transparent disabled:bg-gray-100"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isStreaming}
            className="bg-health-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-health-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStreaming ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}
```

#### 4. Analytics Dashboard with Tailwind

```typescript
// components/AnalyticsDashboard.tsx
import React, { useState, useEffect } from 'react'
import { useHealthPortalServices } from '../hooks/useHealthPortalServices'
import { HealthMetricsCard } from './HealthMetricsCard'
import type { UsageStats } from '../types/ragTypes'

export const AnalyticsDashboard: React.FC = () => {
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [timeRange, setTimeRange] = useState('today')
  const { getUsageStats, loading } = useHealthPortalServices()

  useEffect(() => {
    loadStats()
  }, [timeRange])

  const loadStats = async () => {
    const result = await getUsageStats(timeRange)
    setStats(result)
  }

  const formatCost = (cost: number) => `$${cost.toFixed(4)}`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">API Usage Analytics</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-health-primary"
        >
          <option value="today">Today</option>
          <option value="week">Past Week</option>
          <option value="month">Past Month</option>
        </select>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-health-primary mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading analytics...</p>
        </div>
      )}

      {stats && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <HealthMetricsCard
              title="Total Cost"
              value={formatCost(stats.grandTotalCost)}
              icon={<span className="text-2xl">💰</span>}
            />
            
            {Object.entries(stats.summary).map(([model, usage]) => (
              <HealthMetricsCard
                key={model}
                title={model}
                value={usage.totalTokens.toLocaleString()}
                icon={<span className="text-2xl">🤖</span>}
              />
            ))}
          </div>

          {/* Detailed Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent API Calls</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Call Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Model
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tokens
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.details.slice(0, 20).map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {record.call_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {record.model}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.token_count} ({record.token_type})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
```

#### 5. Article Curation Interface

```typescript
// components/ArticleCuration.tsx
import React, { useState, useEffect } from 'react'
import { fetchPendingArticles, updateArticleStatus } from '../services/articleService'
import type { Article } from '../types/ragTypes'

export const ArticleCuration: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    setLoading(true)
    try {
      const data = await fetchPendingArticles()
      setArticles(data)
    } catch (error) {
      console.error('Failed to load articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (articleId: string, status: 'approved' | 'rejected') => {
    try {
      await updateArticleStatus(articleId, status)
      await loadArticles()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Article List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Pending Articles</h2>
        </div>
        
        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-health-primary mx-auto"></div>
            </div>
          ) : (
            articles.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedArticle?.id === article.id ? 'bg-blue-50' : ''
                }`}
              >
                <h3 className="font-medium text-gray-900 truncate">
                  {article.raw_json_content.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Status: {article.curation_status}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Article Content */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
        {selectedArticle ? (
          <div className="h-full flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                {selectedArticle.raw_json_content.title}
              </h2>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => handleStatusUpdate(selectedArticle.id, 'approved')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedArticle.id, 'rejected')}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                >
                  Reject
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Original Content</h3>
                  <div className="prose prose-sm max-w-none text-gray-700">
                    {/* Render original JSON content */}
                    {Object.entries(selectedArticle.raw_json_content.mainContentHtml.sections).map(([section, content]) => (
                      <div key={section} className="mb-4">
                        <h4 className="font-medium text-gray-900">{section}</h4>
                        {content.map((item, idx) => (
                          <p key={idx} className="text-sm">{item.text}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Simplified Content</h3>
                  <div className="prose prose-sm max-w-none text-gray-700">
                    {selectedArticle.content_en_rewritten}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">Select an article to review</p>
          </div>
        )}
      </div>
    </div>
  )
}
```

---

## Testing & Debugging

### Testing Patterns

#### 1. Service Layer Testing

```typescript
// __tests__/services/ragChatbotService.test.ts
import { ragChatbotService } from '../../services/ragChatbotService'
import { openaiService } from '../../utils/openaiClient'

// Mock the dependencies
jest.mock('../../utils/openaiClient')
jest.mock('../../utils/supabaseClient')

describe('RagChatbotService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should optimize user query', async () => {
    const mockResponse = { response: 'optimized query', responseId: 'test-id' }
    ;(openaiService.getChatResponse as jest.Mock).mockResolvedValue(mockResponse)

    const result = await ragChatbotService.optimizeUserQuery('test query')
    
    expect(result).toBe('optimized query')
    expect(openaiService.getChatResponse).toHaveBeenCalledWith(
      [{ role: 'user', content: 'test query' }],
      expect.objectContaining({
        callType: 'query_optimization',
        temperature: 0.3,
        maxTokens: 500
      })
    )
  })

  test('should handle empty context gracefully', async () => {
    const result = await ragChatbotService.retrieveRelevantContext('test query')
    expect(Array.isArray(result)).toBe(true)
  })
})
```

#### 2. Component Testing with React Testing Library

```typescript
// __tests__/components/StreamingHealthChat.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { StreamingHealthChat } from '../../components/StreamingHealthChat'
import { useHealthPortalServices } from '../../hooks/useHealthPortalServices'

jest.mock('../../hooks/useHealthPortalServices')

describe('StreamingHealthChat', () => {
  const mockExecuteRagQuery = jest.fn()
  
  beforeEach(() => {
    ;(useHealthPortalServices as jest.Mock).mockReturnValue({
      executeRagQuery: mockExecuteRagQuery,
      loading: false,
      error: null
    })
  })

  test('should send message when Enter is pressed', async () => {
    render(<StreamingHealthChat />)
    
    const input = screen.getByPlaceholderText('Ask a health question...')
    const sendButton = screen.getByRole('button', { name: 'Send' })
    
    fireEvent.change(input, { target: { value: 'test message' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(mockExecuteRagQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'test message',
          streaming: true
        })
      )
    })
  })
})
```

### Debugging Common Issues

#### 1. Environment Variables Not Loading

```typescript
// utils/debugConfig.ts
export const debugEnvironment = () => {
  console.log('Environment check:')
  console.log('- VITE_SUPABASE_URL:', !!import.meta.env.VITE_SUPABASE_URL)
  console.log('- VITE_SUPABASE_ANON_KEY:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
  console.log('- VITE_OPENAI_API_KEY:', !!import.meta.env.VITE_OPENAI_API_KEY)
  
  if (!import.meta.env.VITE_SUPABASE_URL) {
    console.error('Missing VITE_SUPABASE_URL')
  }
}

// Call in main.tsx for debugging
// debugEnvironment()
```

#### 2. API Connection Testing

```typescript
// utils/connectionTest.ts
export const testConnections = async () => {
  console.log('Testing connections...')
  
  try {
    // Test Supabase
    const { data, error } = await supabase.from('API_tracking').select('count').limit(1)
    console.log('Supabase:', error ? 'Failed' : 'Connected')
    
    // Test OpenAI
    const response = await openaiService.getChatResponse([
      { role: 'user', content: 'test' }
    ], { maxTokens: 10 })
    console.log('OpenAI:', response ? 'Connected' : 'Failed')
    
  } catch (error) {
    console.error('Connection test failed:', error)
  }
}
```

#### 3. Streaming Debug Helper

```typescript
// utils/streamingDebug.ts
export const createDebugStreamingCallbacks = (label: string) => ({
  onStart: () => console.log(`[${label}] Streaming started`),
  onToken: (token: string) => console.log(`[${label}] Token:`, token),
  onComplete: (response: string) => console.log(`[${label}] Complete:`, response.length, 'chars'),
  onError: (error: Error) => console.error(`[${label}] Error:`, error)
})
```

### Performance Optimization

#### 1. React Optimizations

```typescript
// Use React.memo for expensive components
export const ExpensiveComponent = React.memo<Props>(({ data }) => {
  // Component logic
}, (prevProps, nextProps) => {
  // Custom comparison function
  return prevProps.data.id === nextProps.data.id
})

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return someExpensiveCalculation(data)
}, [data])

// Use useCallback for stable function references
const handleClick = useCallback((id: string) => {
  onItemClick(id)
}, [onItemClick])
```

#### 2. API Optimization

```typescript
// Implement request deduplication
const requestCache = new Map()

export const cachedApiCall = async (key: string, apiCall: () => Promise<any>) => {
  if (requestCache.has(key)) {
    return requestCache.get(key)
  }
  
  const promise = apiCall()
  requestCache.set(key, promise)
  
  try {
    const result = await promise
    return result
  } finally {
    // Clear cache after 5 minutes
    setTimeout(() => requestCache.delete(key), 5 * 60 * 1000)
  }
}
```

---

## Security Considerations

### Production Security Checklist

1. **Environment Variables**
   - Never commit API keys to version control
   - Use different keys for development/staging/production
   - Implement key rotation strategy

2. **Supabase Security**
   - Configure Row Level Security (RLS) policies
   - Use service role keys only on the backend
   - Implement proper user authentication

3. **Rate Limiting**
   - Implement client-side rate limiting for API calls
   - Monitor API usage patterns
   - Set up alerts for unusual activity

4. **Error Handling**
   - Don't expose sensitive information in error messages
   - Log errors securely for debugging
   - Implement proper fallback states

5. **Content Security**
   - Sanitize user inputs before processing
   - Validate API responses
   - Implement proper CORS policies

This documentation provides a comprehensive guide for integrating React + Tailwind CSS applications with the HealthPortal backend systems. It focuses on practical implementation patterns while maintaining security and performance best practices.
```
