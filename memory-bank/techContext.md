# Technical Context - AI Medical Portal

## Current Technology Stack

### Frontend Framework
- **React 18.3.1**: Modern React with hooks and concurrent features
- **TypeScript 5.5.3**: Full type safety and modern JavaScript features
- **Vite 5.4.1**: Fast build tool and development server
- **React Router DOM 6.26.2**: Client-side routing

### UI Framework & Styling
- **Tailwind CSS 3.4.11**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components built on Radix UI primitives
- **Radix UI**: Comprehensive collection of accessible UI components
- **Lucide React**: Beautiful, customizable icon library
- **next-themes**: Theme switching support

### State Management & Data Fetching
- **React Query (TanStack) 5.56.2**: Server state management and caching
- **React Hook Form 7.53.0**: Performant form handling
- **Zod 3.23.8**: TypeScript-first schema validation

### Development Tools
- **ESLint 9.9.0**: JavaScript/TypeScript linting
- **TypeScript ESLint**: TypeScript-specific linting rules
- **PostCSS**: CSS post-processing
- **Autoprefixer**: CSS vendor prefixing

### Package Manager
- **npm**: Package management with lock file
- **Bun**: Alternative package manager (lockfile present)

## Planned Backend Integration Stack

### Database & Real-time
- **Supabase**: PostgreSQL database with real-time subscriptions
  - Row Level Security (RLS) policies
  - Vector search with pgvector extension
  - Real-time subscriptions for live updates
  - Edge functions for complex operations

### AI & Machine Learning
- **OpenAI API**: Large language model integration
  - GPT-4o-mini for cost-effective responses
  - Text-embedding-3-small for vector embeddings
  - Streaming responses for real-time chat
  - Responses API for structured conversations

### API Integration Libraries
- **@supabase/supabase-js**: Official Supabase client
- **OpenAI SDK**: Direct API integration (custom implementation)
- **Fetch API**: Native browser API for HTTP requests

## Project Structure

### Directory Organization
```
ai-med-portal/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── Layout/          # Header, Sidebar
│   │   ├── Dashboard/       # Analytics components
│   │   ├── ContentCreation/ # Content creation tools
│   │   ├── ContentReview/   # Review interfaces
│   │   └── ContentLibrary/  # Content management
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── pages/               # Page components
│   └── types/               # TypeScript type definitions
├── docs/                    # Project documentation
├── memory-bank/             # Project memory system
├── public/                  # Static assets
└── configuration files      # Build and config files
```

### Component Architecture
- **Atomic Design**: Components organized by complexity
- **Compound Components**: Complex UI patterns with multiple parts
- **Custom Hooks**: Reusable state logic
- **Context Providers**: Global state management

## Configuration Files

### Build Configuration
- **vite.config.ts**: Vite build and development configuration
- **tsconfig.json**: TypeScript compiler configuration
- **tsconfig.app.json**: Application-specific TypeScript config
- **tsconfig.node.json**: Node.js TypeScript configuration

### Styling Configuration
- **tailwind.config.ts**: Tailwind CSS customization
- **postcss.config.js**: PostCSS plugin configuration
- **components.json**: shadcn/ui component configuration

### Code Quality
- **eslint.config.js**: ESLint rules and configuration
- **.gitignore**: Git ignore patterns

## Development Environment

### Required Tools
- **Node.js**: v18+ for modern JavaScript features
- **npm/yarn/bun**: Package manager
- **TypeScript**: Language support in IDE
- **VS Code**: Recommended IDE with extensions

### Environment Variables (Planned)
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key

# Optional: Backend API URL
VITE_BACKEND_API_URL=https://your-backend-api.com

# Application Configuration
VITE_APP_ARTICLE_BASE_URL=https://your-frontend.com/blog/article
```

## Database Schema (Target Implementation)

### Content Management Tables
```sql
-- Raw articles from external sources
CREATE TABLE staged_raw_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT NOT NULL,
  raw_json_content JSONB NOT NULL,
  status TEXT DEFAULT 'pending_processing',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Processed articles with multi-language content
CREATE TABLE processed_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staged_article_id UUID REFERENCES staged_raw_articles(id),
  content_en_rewritten TEXT,
  content_es_translated TEXT,
  content_pt_translated TEXT,
  curation_status TEXT DEFAULT 'pending_review',
  is_rag_indexed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vector search chunks for RAG
CREATE TABLE article_professional_chunks (
  id BIGSERIAL PRIMARY KEY,
  chunk_text TEXT NOT NULL,
  embedding VECTOR(1536),
  post_slug TEXT,
  retrieved_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API usage tracking
CREATE TABLE API_tracking (
  id BIGSERIAL PRIMARY KEY,
  call_type TEXT NOT NULL,
  token_type TEXT CHECK (token_type IN ('input', 'output')),
  token_count INTEGER NOT NULL,
  model TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Vector Search Functions
```sql
-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Vector similarity search function
CREATE OR REPLACE FUNCTION match_article_chunks(
  query_embedding vector(1536),
  similarity_threshold float DEFAULT 0.0,
  match_count int DEFAULT 5
) RETURNS TABLE (
  id bigint,
  chunk_text text,
  post_slug text,
  similarity_score float
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    article_professional_chunks.id,
    article_professional_chunks.chunk_text,
    article_professional_chunks.post_slug,
    (1 - (article_professional_chunks.embedding <=> query_embedding)) as similarity_score
  FROM article_professional_chunks
  WHERE (1 - (article_professional_chunks.embedding <=> query_embedding)) > similarity_threshold
  ORDER BY article_professional_chunks.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Increment chunk retrieval count for analytics
CREATE OR REPLACE FUNCTION increment_chunk_retrieved_count(target_chunk_id bigint)
RETURNS void AS $$
BEGIN
  UPDATE article_professional_chunks 
  SET retrieved_count = retrieved_count + 1 
  WHERE id = target_chunk_id;
END;
$$ LANGUAGE plpgsql;
```

## API Integration Patterns

### Service Layer Architecture
```typescript
// Base service pattern
interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

// Service implementations
class ArticleService {
  async fetchPendingArticles(): Promise<Article[]>
  async updateArticleStatus(id: string, status: string): Promise<void>
  async updateArticleContent(id: string, content: Partial<Article>): Promise<void>
}

class RagChatbotService {
  async getChatResponse(request: RagChatRequest): Promise<RagChatResponse>
  private async optimizeUserQuery(query: string): Promise<string>
  private async retrieveRelevantContext(query: string): Promise<ChatContext[]>
  private async generateResponse(context: ChatContext[], query: string): Promise<string>
}

class ApiTrackingService {
  async trackApiCall(record: ApiTrackingRecord): Promise<void>
  async getUsageStats(timeRange?: string): Promise<UsageStats>
}
```

### Error Handling Strategy
```typescript
// Custom error types
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public retryable: boolean = false
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Retry mechanism with exponential backoff
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      if (attempt === maxRetries) throw error
      await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, attempt)))
    }
  }
  throw new Error('Max retries exceeded')
}
```

## Development Workflow

### Local Development Setup
```bash
# Clone repository
git clone <repository-url>
cd ai-med-portal

# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

### Code Quality Standards
- **TypeScript Strict Mode**: Enabled for type safety
- **ESLint Rules**: Enforced code style and best practices
- **Component Naming**: PascalCase for components, camelCase for functions
- **File Organization**: Feature-based directory structure
- **Import Organization**: Absolute imports with @ alias

### Testing Strategy (Planned)
```typescript
// Unit testing with Jest and React Testing Library
describe('ArticleService', () => {
  test('should fetch pending articles', async () => {
    const articles = await articleService.fetchPendingArticles()
    expect(articles).toBeInstanceOf(Array)
  })
})

// Component testing
test('renders dashboard with correct metrics', () => {
  render(<Overview />)
  expect(screen.getByText('Content Performance Dashboard')).toBeInTheDocument()
})

// Integration testing
test('AI chat completes full RAG pipeline', async () => {
  const response = await ragService.getChatResponse({
    message: 'What is diabetes?',
    conversationHistory: []
  })
  expect(response.response).toBeTruthy()
  expect(response.contextUsed).toBeDefined()
})
```

## Performance Considerations

### Bundle Optimization
- **Code Splitting**: Route-based and component-based splitting
- **Tree Shaking**: Eliminates unused code
- **Lazy Loading**: Dynamic imports for non-critical components
- **Asset Optimization**: Image compression and optimization

### Runtime Performance
- **React.memo**: Prevents unnecessary re-renders
- **useMemo/useCallback**: Memoizes expensive calculations
- **Virtual Scrolling**: For large lists (planned)
- **Debounced Search**: Reduces API calls

### API Optimization
- **Request Caching**: React Query for server state caching
- **Request Deduplication**: Prevents duplicate API calls
- **Streaming Responses**: Real-time AI chat responses
- **Rate Limiting**: Client-side rate limiting for API calls

## Security Implementation

### Environment Security
- **Environment Variable Validation**: Runtime validation of required variables
- **API Key Protection**: Client-side keys with appropriate scopes
- **CORS Configuration**: Proper cross-origin resource sharing setup

### Data Security
- **Input Sanitization**: Validates and sanitizes user inputs
- **SQL Injection Prevention**: Parameterized queries via Supabase
- **XSS Prevention**: React's built-in XSS protection
- **Row Level Security**: Database-level access controls

## Deployment Configuration

### Build Process
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

### Environment-Specific Builds
- **Development**: Source maps, hot reload, debug tools
- **Staging**: Production-like with additional logging
- **Production**: Optimized builds, error tracking, performance monitoring

### Deployment Targets
- **Vercel**: Recommended for React applications
- **Netlify**: Alternative deployment platform
- **Custom CDN**: For enterprise deployments

This technical foundation provides a robust, scalable platform for healthcare content management with modern web technologies and AI integration capabilities.
