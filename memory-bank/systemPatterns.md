# System Patterns - AI Medical Portal

## Architecture Overview

### Current Architecture (Demo State)
```
Frontend Application (React + TypeScript + Tailwind)
├── Component Layer (shadcn/ui)
├── Page Routing (React Router)
├── State Management (React useState/useEffect)
├── Mock Data Services
└── UI/UX Demonstrations
```

### Target Architecture (Production State)
```
Frontend Application
├── Service Layer
│   ├── Supabase Client (Database + Real-time)
│   ├── OpenAI Client (LLM + Embeddings)
│   ├── RAG Pipeline Service
│   └── API Tracking Service
├── Component Architecture
│   ├── Layout Components (Header, Sidebar)
│   ├── Dashboard Components (Analytics, Overview)
│   ├── Content Management (Review, Creation)
│   └── AI Chat Interface
└── External Integrations
    ├── Supabase PostgreSQL + Vector DB
    ├── OpenAI API (GPT-4o + Embeddings)
    └── Real-time Subscriptions
```

## Core Design Patterns

### 1. Service Layer Pattern
**Purpose**: Abstraction layer for external API integrations

```typescript
// Pattern: Service abstraction with error handling
export class ApiService {
  async operation(): Promise<Result> {
    try {
      return await externalApiCall()
    } catch (error) {
      return handleError(error)
    }
  }
}
```

**Implementation Examples**:
- `articleService.ts` - Database CRUD operations
- `ragChatbotService.ts` - AI pipeline orchestration
- `apiTrackingService.ts` - Usage monitoring and analytics

### 2. Component Composition Pattern
**Purpose**: Reusable, composable UI components using shadcn/ui

```typescript
// Pattern: Compound components with variants
<Card className="medical-shadow">
  <CardHeader>
    <CardTitle>Analytics Overview</CardTitle>
  </CardHeader>
  <CardContent>
    {children}
  </CardContent>
</Card>
```

**Key Components**:
- `Layout/Header.tsx` - Application header with navigation
- `Layout/Sidebar.tsx` - Navigation sidebar with active states
- `Dashboard/Overview.tsx` - Analytics dashboard with metrics
- `ContentReview/ReviewDashboard.tsx` - Content curation interface

### 3. State Management Pattern
**Purpose**: Local state with hooks for real-time updates

```typescript
// Pattern: Custom hooks for service integration
const useHealthPortalServices = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  return { data, loading, error, refresh }
}
```

**Current Implementation**:
- Local component state with `useState`
- Effect hooks for data fetching simulation
- Mock data integration for demonstrations

### 4. RAG Pipeline Pattern
**Purpose**: 3-step AI processing pipeline for medical queries

```
Step 1: Query Optimization
User Query → Medical Context Enhancement → Optimized Search Terms

Step 2: Vector Retrieval
Optimized Query → Embedding Generation → Vector Search → Relevant Chunks

Step 3: Response Generation
Context + Query → Technical Response → ESL Simplification → Final Answer
```

**Implementation Architecture**:
```typescript
class RagChatbotService {
  async getChatResponse(request: RagChatRequest): Promise<RagChatResponse> {
    // Step 1: Optimize query for medical context
    const optimizedQuery = await this.optimizeUserQuery(request.message)
    
    // Step 2: Retrieve relevant medical content
    const relevantContext = await this.retrieveRelevantContext(optimizedQuery)
    
    // Step 3: Generate and simplify response
    const technicalResponse = await this.generateTechnicalResponse(...)
    const simplifiedResponse = await this.simplifyResponse(...)
    
    return { response: simplifiedResponse, contextUsed: relevantContext }
  }
}
```

## Database Schema Patterns

### Content Management Tables
```sql
-- Raw article intake
staged_raw_articles (
  id UUID PRIMARY KEY,
  source_url TEXT,
  raw_json_content JSONB,  -- Flexible content structure
  status TEXT,
  created_at TIMESTAMPTZ
)

-- Processed content with multi-language support
processed_articles (
  id UUID PRIMARY KEY,
  staged_article_id UUID REFERENCES staged_raw_articles(id),
  content_en_rewritten TEXT,
  content_es_translated TEXT,
  content_pt_translated TEXT,
  curation_status TEXT,    -- pending_review, approved, rejected
  is_rag_indexed BOOLEAN,  -- Vector search ready
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

### Vector Search Pattern
```sql
-- Chunked content for RAG retrieval
article_professional_chunks (
  id BIGSERIAL PRIMARY KEY,
  chunk_text TEXT,
  embedding VECTOR(1536),    -- OpenAI embedding dimensions
  post_slug TEXT,
  retrieved_count INTEGER DEFAULT 0,  -- Analytics tracking
  created_at TIMESTAMPTZ
)

-- Vector similarity search function
CREATE OR REPLACE FUNCTION match_article_chunks(
  query_embedding vector(1536),
  similarity_threshold float,
  match_count int
) RETURNS TABLE (
  id bigint,
  chunk_text text,
  post_slug text,
  similarity_score float
)
```

### API Usage Tracking Pattern
```sql
-- Comprehensive API monitoring
API_tracking (
  id BIGSERIAL PRIMARY KEY,
  call_type TEXT,              -- query_optimization, technical_response, etc.
  token_type TEXT,             -- input, output
  token_count INTEGER,
  model TEXT,                  -- gpt-4o-mini, text-embedding-3-small
  message TEXT,                -- Context for debugging
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

## Integration Patterns

### 1. Supabase Integration Pattern
**Connection Setup**:
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
)
```

**CRUD Operations Pattern**:
```typescript
// Read with joins
const { data, error } = await supabase
  .from('staged_raw_articles')
  .select(`
    id,
    source_url,
    raw_json_content,
    processed_articles!inner (
      content_en_rewritten,
      curation_status
    )
  `)
  .eq('status', 'pending_curation')

// Update with optimistic UI
const { error } = await supabase
  .from('processed_articles')
  .update({ curation_status: 'approved' })
  .eq('id', articleId)
```

### 2. OpenAI Integration Pattern
**Streaming Response Pattern**:
```typescript
const response = await fetch('https://api.openai.com/v1/responses', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ 
    model: 'gpt-4o-mini',
    input: formattedInput,
    stream: true 
  })
})

// Handle streaming chunks
const reader = response.body?.getReader()
const decoder = new TextDecoder()

while (true) {
  const { done, value } = await reader!.read()
  if (done) break
  
  const chunk = decoder.decode(value)
  // Process streaming tokens...
}
```

**Embedding Generation Pattern**:
```typescript
const embedding = await openaiService.getEmbedding(
  text,
  'embedding_chunk',
  'text-embedding-3-small'
)

// Store for vector search
await supabase
  .from('article_professional_chunks')
  .insert({
    chunk_text: text,
    embedding: embedding,
    post_slug: slug
  })
```

### 3. Error Handling Pattern
**Resilient Service Pattern**:
```typescript
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
      
      if (attempt === maxRetries) break
      
      // Exponential backoff
      const delay = delayMs * Math.pow(2, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError!
}
```

## Component Architecture Patterns

### 1. Layout Component Pattern
**Sidebar Navigation with Active State**:
```typescript
const menuItems = [
  { id: 'dashboard', label: 'Content Performance', icon: BarChart3 },
  { id: 'review', label: 'Review Queue', icon: CheckCircle, badge: '5' }
]

// Dynamic styling based on active state
className={`w-full justify-start h-10 ${
  isActive 
    ? 'bg-primary text-primary-foreground shadow-sm' 
    : 'text-muted-foreground hover:text-foreground'
}`}
```

### 2. Dashboard Component Pattern
**Metrics Card with Trend Indicators**:
```typescript
const HealthMetricsCard = ({ title, value, icon, trend }) => (
  <Card className="medical-shadow">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
          <div className="flex items-center mt-2">
            {trend === 'up' ? (
              <ArrowUpRight className="w-4 h-4 mr-1 text-green-600" />
            ) : (
              <ArrowDownRight className="w-4 h-4 mr-1 text-red-600" />
            )}
          </div>
        </div>
        <div className="text-health-primary">{icon}</div>
      </div>
    </CardContent>
  </Card>
)
```

### 3. Streaming Chat Pattern
**Real-time Token Display**:
```typescript
const StreamingCallbacks = {
  onStart: () => setIsStreaming(true),
  onToken: (token: string) => setCurrentResponse(prev => prev + token),
  onComplete: (fullResponse: string) => {
    setMessages(prev => [...prev, { role: 'assistant', content: fullResponse }])
    setIsStreaming(false)
  }
}
```

## Styling Patterns

### 1. Tailwind Utility Classes
**Healthcare-Specific Styling**:
```css
/* Custom utility classes */
.medical-shadow {
  @apply shadow-sm border border-gray-200;
}

.health-primary {
  @apply text-emerald-600;
}

.health-secondary {
  @apply text-blue-600;
}
```

### 2. Component Variant Patterns
**Conditional Styling with Variants**:
```typescript
const variants = {
  default: "bg-white text-gray-900",
  primary: "bg-emerald-600 text-white",
  secondary: "bg-blue-600 text-white",
  success: "bg-green-600 text-white",
  destructive: "bg-red-600 text-white"
}
```

### 3. Responsive Design Pattern
**Mobile-First Responsive Grid**:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {metrics.map(metric => (
    <HealthMetricsCard key={metric.id} {...metric} />
  ))}
</div>
```

## Security Patterns

### 1. Environment Variable Validation
```typescript
export function validateEnvironment(): void {
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']
  const missing = required.filter(v => !process.env[v])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}
```

### 2. Rate Limiting Pattern
```typescript
class RateLimiter {
  private callCounts = new Map<string, { count: number; resetTime: number }>()
  
  canMakeCall(identifier: string): boolean {
    const now = Date.now()
    const record = this.callCounts.get(identifier)
    
    if (!record || now > record.resetTime) {
      this.callCounts.set(identifier, { count: 1, resetTime: now + this.windowMs })
      return true
    }
    
    return record.count < this.maxCalls
  }
}
```

## Testing Patterns

### 1. Service Layer Testing
```typescript
describe('RagChatbotService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should optimize user query', async () => {
    const mockResponse = { response: 'optimized query' }
    ;(openaiService.getChatResponse as jest.Mock).mockResolvedValue(mockResponse)

    const result = await ragChatbotService.optimizeUserQuery('test query')
    expect(result).toBe('optimized query')
  })
})
```

### 2. Component Testing
```typescript
test('should send message when Enter is pressed', async () => {
  render(<StreamingHealthChat />)
  
  const input = screen.getByPlaceholderText('Ask a health question...')
  fireEvent.change(input, { target: { value: 'test message' } })
  fireEvent.keyPress(input, { key: 'Enter' })
  
  await waitFor(() => {
    expect(mockExecuteRagQuery).toHaveBeenCalled()
  })
})
```

These patterns form the foundation of a robust, scalable medical AI platform that prioritizes user experience, data accuracy, and system reliability while maintaining healthcare-grade security standards.
