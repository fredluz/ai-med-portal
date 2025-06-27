import { createClient } from '@supabase/supabase-js'
import type { ApiTrackingRecord, ChatContext } from '../types/ragTypes'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our data
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

// Function to fetch articles with pending curation status
export const fetchPendingArticles = async (): Promise<Article[]> => {
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

  // Transform the data to flatten the nested structure
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

// Function to update article curation status
export const updateArticleStatus = async (articleId: string, status: 'approved' | 'rejected' | 'needs_revision'): Promise<void> => {
  // Find the processed_article_id associated with the staged_article_id
  const { data: processedEntry, error: fetchError } = await supabase
    .from('processed_articles')
    .select('id')
    .eq('staged_article_id', articleId)
    .single()

  if (fetchError || !processedEntry) {
    throw new Error(`Failed to find processed article for staged_article_id ${articleId}: ${fetchError?.message || 'No entry found'}`)
  }

  const processedArticleId = processedEntry.id

  const { error } = await supabase
    .from('processed_articles')
    .update({ curation_status: status, updated_at: new Date().toISOString() })
    .eq('id', processedArticleId)

  if (error) {
    throw new Error(`Failed to update article status: ${error.message}`)
  }
}

// Function to update article content for a specific language
export const updateArticleContent = async (
  articleId: string, 
  language: 'en' | 'es' | 'pt', 
  content: string
): Promise<void> => {
  // Find the processed_article_id associated with the staged_article_id
  const { data: processedEntry, error: fetchError } = await supabase
    .from('processed_articles')
    .select('id')
    .eq('staged_article_id', articleId)
    .single()

  if (fetchError || !processedEntry) {
    throw new Error(`Failed to find processed article for staged_article_id ${articleId}: ${fetchError?.message || 'No entry found'}`)
  }

  const processedArticleId = processedEntry.id
  
  // Determine which field to update based on language
  let updateField: string
  switch (language) {
    case 'en':
      updateField = 'content_en_rewritten'
      break
    case 'es':
      updateField = 'content_es_translated'
      break
    case 'pt':
      updateField = 'content_pt_translated'
      break
    default:
      throw new Error(`Unsupported language: ${language}`)
  }

  const { error } = await supabase
    .from('processed_articles')
    .update({ 
      [updateField]: content, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', processedArticleId)

  if (error) {
    throw new Error(`Failed to update article content: ${error.message}`)
  }
}

// --- RAG Vector Search Utilities ---

/**
 * Match article chunks using vector similarity (Supabase RPC)
 */
export async function matchArticleChunks(queryEmbedding: number[], topK: number): Promise<{ data: ChatContext[]; error?: any }> {
  try {
    const SIMILARITY_THRESHOLD_VALUE = 0
    const params = {
      query_embedding: queryEmbedding,
      similarity_threshold: SIMILARITY_THRESHOLD_VALUE,
      match_count: topK
    }
    console.log('[Supabase] matchArticleChunks RPC params:', params)
    const { data, error } = await supabase.rpc('match_article_chunks', params)
    console.log('[Supabase] matchArticleChunks RPC raw result:', { error, data })
    if (error) return { data: [], error }
    // Map to ChatContext[]
    const chatContexts = (data || []).map((chunk: any) => ({
      id: chunk.id,
      content: chunk.chunk_text,
      post_slug: chunk.post_slug,
      relevanceScore: chunk.similarity_score
    }))
    console.log('[Supabase] matchArticleChunks mapped ChatContext:', chatContexts)
    return { data: chatContexts, error: undefined }
  } catch (err) {
    console.error('[Supabase] Error in matchArticleChunks:', err)
    return { data: [], error: err }
  }
}

/**
 * Increment chunk retrieval count (analytics, fire-and-forget)
 */
export async function incrementChunkRetrievedCount(chunkId: string): Promise<{ success: boolean; error?: any }> {
  try {
    const { error } = await supabase.rpc('increment_chunk_retrieved_count', { target_chunk_id: chunkId })
    if (error) return { success: false, error }
    return { success: true }
  } catch (err) {
    return { success: false, error: err }
  }
}

/**
 * Insert API tracking record (real implementation)
 */
export async function insertApiTrackingRecord(record: ApiTrackingRecord): Promise<{ success: boolean; error?: any }> {
  try {
    const { error } = await supabase.from('API_tracking').insert(record)
    if (error) return { success: false, error }
    return { success: true }
  } catch (err) {
    return { success: false, error: err }
  }
}

/**
 * Get API usage statistics (real implementation)
 */
export async function getApiTrackingStats(timeRange?: string): Promise<{ data: any[] | null; error?: any }> {
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
    if (error) return { data: null, error }
    return { data, error: undefined }
  } catch (err) {
    return { data: null, error: err }
  }
}
