// src/types/articles.ts
export interface ProcessedArticle {
  id: string; // uuid
  staged_article_id?: string | null; // uuid
  content_en_rewritten: string;
  content_pt_translated?: string | null;
  content_es_translated?: string | null;
  original_source_url: string;
  curation_status?: string | null; // 'pending_review', 'approved', 'rejected', 'needs_revision'
  is_rag_indexed?: boolean | null;
  published_at?: string | null; // timestamp with time zone
  created_at?: string | null; // timestamp with time zone
  updated_at?: string | null; // timestamp with time zone
  seo_meta_title_en?: string | null;
  seo_meta_title_pt?: string | null;
  seo_meta_title_es?: string | null;
  application_article_url?: string | null;
}
