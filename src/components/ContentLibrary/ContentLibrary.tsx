import React, { useState, useEffect } from 'react';
import { 
  Search,
  Filter,
  Eye,
  Edit,
  MoreHorizontal,
  Calendar,
  User,
  BarChart3,
  TrendingUp,
  Star,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getApprovedArticles, type SupportedLanguage } from '@/services/supabaseBlogService';
import type { ProcessedArticle } from '@/types/articles';
import { generateExcerpt } from '@/utils/textUtils';

const ContentLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articles, setArticles] = useState<ProcessedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentLanguage: SupportedLanguage = 'en'; // Default to English for now

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedArticles = await getApprovedArticles();
        setArticles(fetchedArticles);
      } catch (err) {
        console.error('Error loading articles:', err);
        setError('Failed to load articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Helper to get language-specific content with fallback to English
  const getTranslatedField = (
    article: ProcessedArticle,
    contentType: 'title' | 'content',
    lang: SupportedLanguage
  ): string | null | undefined => {
    if (contentType === 'title') {
      if (lang === 'pt' && article.seo_meta_title_pt) {
        return article.seo_meta_title_pt;
      }
      if (lang === 'es' && article.seo_meta_title_es) {
        return article.seo_meta_title_es;
      }
      return article.seo_meta_title_en;
    } else if (contentType === 'content') {
      if (lang === 'pt' && article.content_pt_translated) {
        return article.content_pt_translated;
      }
      if (lang === 'es' && article.content_es_translated) {
        return article.content_es_translated;
      }
      return article.content_en_rewritten;
    }
    
    return null;
  };

  const handleEdit = (article: ProcessedArticle) => {
    console.log('Edit article:', article.id);
    // TODO: Add edit navigation logic here
  };

  const handleView = (article: ProcessedArticle) => {
    console.log('View article:', article.id);
    // TODO: Add view navigation logic here
  };

  const filteredArticles = articles.filter(article => {
    const title = getTranslatedField(article, 'title', currentLanguage) || '';
    const content = getTranslatedField(article, 'content', currentLanguage) || '';
    const searchLower = searchQuery.toLowerCase();
    
    return title.toLowerCase().includes(searchLower) || 
           content.toLowerCase().includes(searchLower) ||
           (article.original_source_url && article.original_source_url.toLowerCase().includes(searchLower));
  });

  // Calculate mock statistics from real data
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const thisMonthArticles = articles.filter(article => {
    if (!article.created_at) return false;
    const articleDate = new Date(article.created_at);
    return articleDate.getMonth() === currentMonth && articleDate.getFullYear() === currentYear;
  });

  const avgRating = 4.8; // Mock rating for now
  const activeLanguages = 3; // English, Portuguese, Spanish

  // Generate trending topics from article content
  const trendingTopics = [
    "Diabetes Management",
    "Heart Health", 
    "Mental Wellness",
    "Preventive Care",
    "Patient Education"
  ];

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-full">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Content Library</h1>
          <p className="text-muted-foreground">Manage and organize your published medical content</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <div>
                <h3 className="font-semibold">Unable to load articles</h3>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Content Library</h1>
        <p className="text-muted-foreground">Manage and organize your published medical content</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search articles, content, or sources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Articles Grid */}
          {filteredArticles.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  {searchQuery ? 'No articles found matching your search.' : 'No articles available.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles.map((article) => {
                const title = getTranslatedField(article, 'title', currentLanguage) || 'Untitled Article';
                const contentForExcerpt = getTranslatedField(article, 'content', currentLanguage);
                const excerpt = generateExcerpt(contentForExcerpt, 200);
                
                return (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="secondary" className="text-xs">
                          Published
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>

                      <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
                        {title}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {excerpt}
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(article.created_at)}
                            </span>
                          </div>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {Math.ceil(excerpt.length / 200)} min read
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center text-muted-foreground">
                              <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                              {avgRating}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleView(article)}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEdit(article)}
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {article.application_article_url && (
                            <Badge variant="outline" className="text-xs">
                              published
                            </Badge>
                          )}
                          {article.is_rag_indexed && (
                            <Badge variant="outline" className="text-xs">
                              indexed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Content Statistics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Content Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="font-medium text-foreground mb-1">This Month</div>
                <div className="text-2xl font-bold text-primary">{thisMonthArticles.length} articles</div>
              </div>
              
              <div className="text-sm">
                <div className="font-medium text-foreground mb-1">Total Articles</div>
                <div className="text-2xl font-bold text-primary">{articles.length}</div>
              </div>
              
              <div className="text-sm">
                <div className="font-medium text-foreground mb-1">Languages</div>
                <div className="text-2xl font-bold text-primary">{activeLanguages} active</div>
              </div>
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {trendingTopics.map((topic, index) => (
                  <div 
                    key={topic}
                    className="flex items-center justify-between py-2 text-sm hover:bg-muted/50 rounded px-2 cursor-pointer transition-colors"
                  >
                    <span className="text-foreground">{topic}</span>
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContentLibrary;
