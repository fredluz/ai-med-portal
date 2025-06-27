// Client-side RAG Chatbot Service (adapted from backend)
import { openaiService } from '../utils/openaiClient'
import { matchArticleChunks, incrementChunkRetrievedCount } from '../utils/supabaseClient'
import type { StreamingCallbacks, ChatMessage, ChatContext, RagChatRequest, RagChatResponse } from '../types/ragTypes'

class RagChatbotService {
  private queryOptimizerPrompt = `You are a medical translation specialist. Your job is to translate simple questions from everyday people into the comprehensive medical queries that an educated doctor would need answered to provide complete information.

Think of yourself as bridging the gap between:
- A person with basic English and limited medical knowledge asking simple questions
- The detailed, technical medical information a doctor would want to explain

Your translation should anticipate what comprehensive information the person actually needs, even if they don't know to ask for it.

Guidelines:
- Translate simple questions into comprehensive medical information requests
- Use medical terminology that will match professional health content

Input: Simple user question (often from ESL speakers with basic medical knowledge)
Output: Comprehensive medical information request (as if asking a medical expert for complete education on the topic)

Examples:
User: "whats asthma"
Optimized: "Please explain asthma, including it's symptoms, causes and triggers."

User: "My doctor says I have high blood pressure, what should I do?"
Optimized: "What are the best ways to treat high blood pressure, including lifestyle modifications, home blood pressure monitoring techniques, long-term management strategies or complications prevention"

Transform the following query:`

  private technicalResponsePrompt = `You are a medical information specialist providing detailed, technical health information based on retrieved medical content. Your responses should be comprehensive and medically accurate.

Guidelines:
- Use the provided medical context to create detailed, technical responses
- Include relevant medical terminology and concepts
- Provide comprehensive information about conditions, treatments, and recommendations
- Maintain medical accuracy and detail
- Reference symptoms, causes, diagnostic criteria, and treatment options when relevant
- Use precise medical language and terminology

This response will be simplified in a subsequent step, so prioritize accuracy and completeness over simplicity.`

  private simplificationPromptTemplate = `You are a health communication specialist who simplifies complex medical information for ESL (English as Second Language) readers with basic education levels. 

Your job is to act as a translator, converting detailed medical responses into simple, easy-to-understand language.
Here is the conversation you have been having with the user:
{{conversationHistory}}
In this conversation turn, the user originally asked: {{unoptimized_query}} which was translated into a comprehensive medical query {{optimizedQuery}}, which was answered by a specialized technical agent with {{technicalresponse}}. 
Now you will simplify the detailed response into language that is accessible to someone with basic English skills, keeping in mind the user's original question : {{originalMessage}}. Make sure to focus your simplification on the key points that answer the user's question, as to not overwhelm them.
You should respond with a SHORT , clear answer that uses simple words and short sentences. Do not respond with more than a paragraph, due to subpar literacy skills. After your response paragraph, ask 2 follow-up questions that may help the user understand better.

Guidelines:
- Convert complex medical terms to simple, everyday words
- Use short, clear sentences (max 15 words per sentence)
- Explain medical concepts using analogies and simple comparisons
- Break information into numbered lists or bullet points
- Use active voice instead of passive voice
- Replace technical jargon with common terms
- Ensure reading level is appropriate for someone with basic English skills
- Maintain all important health information while making it accessible
- Keep the caring, supportive tone
- Always include advice to see a doctor for serious concerns`

  // Helper to deduplicate citations by link
  private dedupeCitations(context: ChatContext[]) {
    const seen = new Set<string>();
    const citations = [];
    for (const ctx of context) {
      const link = `/blog/article/${ctx.post_slug}`;
      if (!seen.has(link)) {
        seen.add(link);
        citations.push({ text: `[${citations.length + 1}]`, link });
      }
    }
    return citations;
  }

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
    // Step 4: Simplify technical response for ESL readers (with streaming)
    // If streaming, wrap the callbacks to include citations/context onComplete
    let simplifiedResponse = ''
    const citations = this.dedupeCitations(relevantContext);
    if (request.streamingCallbacks) {
      let accumulated = ''
      const originalCallbacks = request.streamingCallbacks
      const wrappedCallbacks: StreamingCallbacks = {
        onStart: originalCallbacks.onStart,
        onToken: (token) => {
          accumulated += token
          originalCallbacks.onToken && originalCallbacks.onToken(token)
        },
        onComplete: () => {
          if (originalCallbacks.onComplete) {
            originalCallbacks.onComplete(accumulated, { citations, contextUsed: relevantContext })
          }
        },
        onError: originalCallbacks.onError
      }
      simplifiedResponse = await this.simplifyResponse(
        technicalResponse,
        request.message,
        optimizedQuery,
        request.conversationHistory,
        wrappedCallbacks
      )
    } else {
      simplifiedResponse = await this.simplifyResponse(
        technicalResponse,
        request.message,
        optimizedQuery,
        request.conversationHistory
      )
    }
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

  private fireAndForgetIncrementChunkCount(chunkId: string): void {
    (async () => {
      try {
        await incrementChunkRetrievedCount(chunkId)
      } catch {}
    })()
  }

  private async retrieveRelevantContext(optimizedQuery: string, topK: number = 3): Promise<ChatContext[]> {
    try {
      console.log('[RAG] Optimized Query:', optimizedQuery)
      let queryEmbedding: number[]
      try {
        queryEmbedding = await openaiService.getEmbedding(optimizedQuery, 'rag_query_embedding')
        console.log('[RAG] Query Embedding:', queryEmbedding)
        if (!queryEmbedding || queryEmbedding.length === 0) {
          console.warn('[RAG] No embedding generated for optimized query.')
          return []
        }
      } catch (embeddingError) {
        console.error('[RAG] Error generating embedding:', embeddingError)
        return []
      }
      console.log('[RAG] Calling matchArticleChunks with embedding and topK:', { topK, embeddingPreview: queryEmbedding.slice(0, 5) })
      const { data: retrievedDbChunks, error: dbError } = await matchArticleChunks(queryEmbedding, topK)
      console.log('[RAG] matchArticleChunks result:', { error: dbError, chunks: retrievedDbChunks })
      if (dbError || !retrievedDbChunks || retrievedDbChunks.length === 0) {
        console.warn('[RAG] No relevant chunks found or error occurred:', dbError)
        return []
      }
      const chatContexts: ChatContext[] = []
      for (const chunk of retrievedDbChunks) {
        if (!chunk.id || !chunk.content || !chunk.post_slug) {
          console.warn('[RAG] Skipping malformed chunk:', chunk)
          continue
        }
        chatContexts.push(chunk)
        this.fireAndForgetIncrementChunkCount(chunk.id)
      }
      console.log('[RAG] Final ChatContext array:', chatContexts)
      return chatContexts
    } catch (err) {
      console.error('[RAG] Error in retrieveRelevantContext:', err)
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
      .replace('{{originalMessage}}', originalMessage)
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

  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

export const ragChatbotService = new RagChatbotService()
