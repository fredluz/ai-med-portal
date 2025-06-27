// src/services/supabaseBlogService.ts
import { supabase } from '../utils/supabaseClient';
import type { ProcessedArticle } from '../types/articles';

export type SupportedLanguage = 'en' | 'pt' | 'es';

/**
 * Fetches all articles where curation_status is 'approved'.
 * Orders articles by created_at in descending order (newest first).
 * Selects all language fields, allowing components to handle fallbacks.
 * @returns Promise<ProcessedArticle[]>
 */
export async function getApprovedArticles(): Promise<ProcessedArticle[]> {
  const { data, error } = await supabase
    .from('processed_articles')
    .select(`
      id,
      seo_meta_title_en, seo_meta_title_pt, seo_meta_title_es,
      content_en_rewritten, content_pt_translated, content_es_translated,
      created_at,
      application_article_url,
      original_source_url,
      curation_status,
      published_at,
      updated_at,
      staged_article_id,
      is_rag_indexed
    `)
    .eq('curation_status', 'approved')
    .not('application_article_url', 'is', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching approved articles:', error);
    throw error;
  }
  return data as ProcessedArticle[] || [];
}

/**
 * Fetches a single article by its slug (application_article_url).
 * Ensures the fetched article has curation_status 'approved' for public viewing.
 * Selects all fields, including all language variations.
 * @param slug - The slug of the article to fetch.
 * @returns Promise<ProcessedArticle | null>
 */
export async function getArticleBySlug(slug: string): Promise<ProcessedArticle | null> {
  const { data, error } = await supabase
    .from('processed_articles')
    .select('*')
    .eq('application_article_url', slug)
    .eq('curation_status', 'approved')
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // PostgREST error for "Searched for one row, but found 0"
      console.warn(`Article with slug "${slug}" not found or not approved.`);
      return null;
    }
    console.error(`Error fetching article by slug "${slug}":`, error);
    throw error;
  }

  return data as ProcessedArticle | null;
}
