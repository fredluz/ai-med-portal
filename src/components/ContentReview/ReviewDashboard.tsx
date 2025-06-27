import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Eye, 
  Clock,
  User,
  Calendar,
  Tag,
  FileText,
  Edit,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AIChat from './AIChat';
import { fetchPendingArticles, updateArticleStatus, updateArticleContent, type Article } from '@/utils/supabaseClient';

export type Language = 'en' | 'es' | 'pt';

// Interface for local content state management
interface LocalContentState {
  [articleId: string]: {
    [language in Language]?: string
  }
}

const ReviewDashboard = () => {
  // Core state
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedContent, setSelectedContent] = useState<Article | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // UI state
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);
  const [activeTab, setActiveTab] = useState<'patient-education' | 'medical'>('patient-education');

  // Local content editing state
  const [localContentState, setLocalContentState] = useState<LocalContentState>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Helper function to get the current local content for selected article/language
  const getCurrentLocalContent = (): string => {
    if (!selectedContent) return '';
    
    const localContent = localContentState[selectedContent.id]?.[selectedLanguage];
    if (localContent !== undefined) return localContent;
    
    // If no local content, return the saved content from database
    switch (selectedLanguage) {
      case 'en': return selectedContent.content_en_rewritten || '';
      case 'es': return selectedContent.content_es_translated || '';
      case 'pt': return selectedContent.content_pt_translated || '';
      default: return '';
    }
  };

  // Helper function to get the saved content from database
  const getSavedContent = (article: Article, language: Language): string => {
    switch (language) {
      case 'en': return article.content_en_rewritten || '';
      case 'es': return article.content_es_translated || '';
      case 'pt': return article.content_pt_translated || '';
      default: return '';
    }
  };

  // Helper function to get article title or first line of content
  const getArticleDisplayTitle = (article: Article): string => {
    // First try to get the title from raw_json_content
    const title = article.raw_json_content?.title;
    if (title && title.trim() && title !== 'Unknown Title') {
      return title;
    }

    // If no title, get the first line from content (prefer English, then others)
    const content = article.content_en_rewritten || 
                   article.content_es_translated || 
                   article.content_pt_translated || '';
    
    if (content) {
      // Strip HTML tags and get first meaningful line
      const textContent = content
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/\s+/g, ' ')    // Normalize whitespace
        .trim();
      
      // Get first sentence or first 80 characters
      const firstSentence = textContent.split(/[.!?]/)[0];
      const displayText = firstSentence.length > 80 
        ? firstSentence.substring(0, 80).trim() + '...'
        : firstSentence;
        
      return displayText || 'No content available';
    }

    return 'No content available';
  };

  // Check if current content differs from saved content
  const checkHasUnsavedChanges = (articleId: string, language: Language) => {
    const article = articles.find(a => a.id === articleId);
    if (!article) return false;
    
    const localContent = localContentState[articleId]?.[language];
    const savedContent = getSavedContent(article, language);
    
    return localContent !== undefined && localContent !== savedContent;
  };

  // Update local content for current article/language
  const updateLocalContent = (content: string) => {
    if (!selectedContent) return;
    
    setLocalContentState(prev => ({
      ...prev,
      [selectedContent.id]: {
        ...prev[selectedContent.id],
        [selectedLanguage]: content
      }
    }));
    
    setHasUnsavedChanges(checkHasUnsavedChanges(selectedContent.id, selectedLanguage));
  };

  // Initialize local content when article/language changes
  useEffect(() => {
    if (selectedContent) {
      const currentHasChanges = checkHasUnsavedChanges(selectedContent.id, selectedLanguage);
      setHasUnsavedChanges(currentHasChanges);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [selectedContent, selectedLanguage, localContentState, articles]);

  // Warning for unsaved changes on navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Reset local state for an article
  const resetLocalChanges = () => {
    if (!selectedContent) return;
    
    setLocalContentState(prev => {
      const newState = { ...prev };
      if (newState[selectedContent.id]) {
        delete newState[selectedContent.id][selectedLanguage];
        if (Object.keys(newState[selectedContent.id]).length === 0) {
          delete newState[selectedContent.id];
        }
      }
      return newState;
    });
    setHasUnsavedChanges(false);
  };

  // Load articles from Supabase
  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPendingArticles();
      setArticles(data);
      
      if (data.length > 0) {
        // If selected article is no longer in the list (e.g. after status update), select the first one
        const currentSelectedStillExists = data.find(a => a.id === selectedContent?.id);
        if (currentSelectedStillExists) {
          setSelectedContent(currentSelectedStillExists);
        } else {
          setSelectedContent(data[0]);
        }
      } else {
        setSelectedContent(null);
      }
    } catch (err) {
      console.error('Error loading articles:', err);
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  // Handle article selection with unsaved changes warning
  const handleSelectArticle = (article: Article) => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Do you want to discard them and switch to a different article?'
      );
      if (!confirmLeave) return;
    }
    
    setSelectedContent(article);
  };

  // Handle language selection with unsaved changes warning
  const handleLanguageChange = (newLanguage: Language) => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Do you want to discard them and switch language?'
      );
      if (!confirmLeave) return;
    }
    
    setSelectedLanguage(newLanguage);
  };

  // Load articles on component mount
  useEffect(() => {
    loadArticles();
  }, []);

  // Approve current changes and persist to database
  const approveCurrentChanges = async () => {
    if (!selectedContent || !hasUnsavedChanges) return;
    
    const currentContent = getCurrentLocalContent();
    setIsUpdating(true);
    setError(null);
    
    try {
      // Save the content to the database
      await updateArticleContent(selectedContent.id, selectedLanguage, currentContent);
      
      // Reset local state after successful save
      resetLocalChanges();
      
      // Refresh articles to get updated data
      await loadArticles();
      
      console.log('Content approved and saved successfully');
    } catch (err) {
      console.error('Error approving changes:', err);
      setError(err instanceof Error ? err.message : 'Failed to approve changes');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle final approval (triggers N8N webhook)
  const handleApprove = async () => {
    if (!selectedContent) return;

    setIsUpdating(true);
    setError(null);
    
    try {
      // Trigger N8N webhook for approval
      if (!selectedContent.processed_id) {
        console.error('Error: processed_id is missing for the selected article. Cannot trigger webhook.');
        setError('Missing processed_id - cannot trigger approval workflow');
        return;
      }

      const webhookSecret = import.meta.env.VITE_N8N_WEBHOOK_SECRET;
      const webhookUrl = import.meta.env.VITE_N8N_PUBLISH_WEBHOOK_URL;
      
      if (!webhookSecret || !webhookUrl) {
        console.error('Error: N8N webhook configuration missing in environment variables');
        setError('N8N webhook configuration missing');
        return;
      }

      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Secret': webhookSecret,
          },
          body: JSON.stringify({ id: selectedContent.processed_id }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Webhook call failed with status: ${response.status}`, errorText);
          setError(`Approval webhook failed: ${response.status}`);
          return;
        }

        console.log('Webhook triggered successfully for article:', selectedContent.processed_id);
        
        // Refresh articles list after successful webhook
        await loadArticles();
        
      } catch (webhookError) {
        console.error('Error triggering webhook:', webhookError);
        setError('Failed to trigger approval webhook');
      }
    } catch (err) {
      console.error('Error in approval process:', err);
      setError(err instanceof Error ? err.message : 'Failed to approve article');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle rejection
  const handleReject = async () => {
    if (!selectedContent || !rejectComment.trim()) return;

    setIsUpdating(true);
    setError(null);
    
    try {
      // Update status directly in Supabase for rejection
      await updateArticleStatus(selectedContent.id, 'rejected');
      
      // TODO: Store rejection comment - may need additional table/field
      console.log('Article rejected with comment:', rejectComment);
      
      setShowRejectDialog(false);
      setRejectComment('');
      
      // Refresh articles list after rejection
      await loadArticles();
      
    } catch (err) {
      console.error('Error rejecting article:', err);
      setError(err instanceof Error ? err.message : 'Failed to reject article');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePreview = () => {
    if (selectedContent) {
      const newWindow = window.open('', '_blank', 'width=1200,height=800');
      if (newWindow) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${getArticleDisplayTitle(selectedContent)}</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              .medical-shadow { box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); }
              .prose { max-width: none; }
              .prose h1 { font-size: 2rem; font-weight: 700; margin-bottom: 1rem; }
              .prose h2 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; margin-top: 1.5rem; }
              .prose h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem; }
              .prose p { margin-bottom: 1rem; line-height: 1.6; }
              .prose ul { margin-bottom: 1rem; padding-left: 1.5rem; }
              .prose li { margin-bottom: 0.5rem; }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script type="module">
              import React from 'https://esm.sh/react@18';
              import ReactDOM from 'https://esm.sh/react-dom@18/client';
              
              const content = ${JSON.stringify(getCurrentLocalContent())};
              
              function App() {
                return React.createElement('div', {
                  className: 'min-h-screen bg-gray-50 p-8'
                }, React.createElement('div', {
                  className: 'max-w-4xl mx-auto bg-white rounded-lg medical-shadow p-8'
                }, content ? React.createElement('div', {
                  className: 'prose prose-lg max-w-none',
                  dangerouslySetInnerHTML: { __html: content }
                }) : React.createElement('div', {}, 'Content not available for preview')));
              }
              
              const root = ReactDOM.createRoot(document.getElementById('root'));
              root.render(React.createElement(App));
            </script>
          </body>
          </html>
        `);
        newWindow.document.close();
      }
    }
  };

  const handleEdit = () => {
    console.log('Edit content:', getArticleDisplayTitle(selectedContent!));
    // TODO: Implement content editing functionality
    // This could open the content in an editable text area or rich text editor
  };

  // Filter articles by type (simplified categorization)
  const getFilteredArticles = () => {
    // Since we don't have explicit patient-education vs medical categorization,
    // we'll use all articles for now - this can be enhanced with tags or categories
    return articles;
  };

  // Determine article count for current filter
  const currentArticles = getFilteredArticles();

  // Show loading state
  if (loading && articles.length === 0) {
    return (
      <div className="flex h-full bg-gray-50 items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading articles...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !isUpdating) {
    return (
      <div className="flex h-full bg-gray-50 items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Error Loading Articles</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadArticles} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

    return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* Content List */}
      <div className={`${showAIChat ? 'w-32' : 'w-40'} bg-white border-r border-border/50 flex flex-col flex-shrink-0 transition-all duration-300`}>
        <div className="p-4 border-b border-border/50 flex-shrink-0">
          <h2 className="text-sm font-semibold text-foreground">Review Queue</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {loading ? 'Loading...' : `${articles.length} items awaiting review`}
          </p>
        </div>
        
        {/* Language Selector */}
        {selectedContent && (
          <div className="p-2 flex-shrink-0">
            <div className="mb-1 p-2 bg-gray-50 rounded-md">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value as Language)}
                className="w-full text-xs border border-gray-200 rounded px-2 py-1"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="pt">Português</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-2 min-h-0">
          <div className="space-y-2 pb-2">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-3">
                    <div className="animate-pulse">
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded mb-1"></div>
                      <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : currentArticles.length === 0 ? (
              <div className="text-center py-6">
                <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No articles found</p>
              </div>
            ) : (
              currentArticles.map((article) => (
                <Card 
                  key={article.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedContent?.id === article.id ? 'ring-2 ring-primary/20 bg-primary/5' : ''
                  }`}
                  onClick={() => handleSelectArticle(article)}
                >
                  <CardContent className="p-3">
                    <h3 className="font-medium text-xs text-foreground mb-2 line-clamp-2">
                      {getArticleDisplayTitle(article)}
                    </h3>
                    
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <User className="w-2 h-2 mr-1" />
                        <span className="truncate">System Generated</span>
                      </div>
                      
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-2 h-2 mr-1" />
                        <span className="truncate">
                          {article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Unknown'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            article.curation_status === 'pending_review' 
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {article.curation_status || 'pending'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {article.content_en_rewritten?.length || 0}ch
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedContent ? (
          <>
            {/* Content Header */}
            <div className="bg-white border-b border-border/50 p-6 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-foreground mb-2">
                    {getArticleDisplayTitle(selectedContent)}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      System Generated
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {selectedContent.created_at ? new Date(selectedContent.created_at).toLocaleDateString() : 'Unknown date'}
                    </span>
                    <span>Language: {selectedLanguage.toUpperCase()}</span>
                    {hasUnsavedChanges && (
                      <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
                        Unsaved Changes
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAIChat(!showAIChat)}
                    className="flex items-center space-x-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>AI Assistant</span>
                  </Button>
                  
                  <Button variant="outline" size="sm" onClick={handlePreview}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </div>

            {/* Split Content Area */}
            <div className="flex-1 flex min-h-0">
              {/* Content Editor */}
              <div className="flex-1 p-6 overflow-y-auto min-w-0">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-lg medical-shadow p-8">
                    <div className="prose prose-lg max-w-none">
                      {getCurrentLocalContent() ? (
                        <ReactMarkdown>
                          {getCurrentLocalContent()}
                        </ReactMarkdown>
                      ) : (
                        <div className="text-muted-foreground italic">
                          No content available for {selectedLanguage.toUpperCase()} language
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Save Changes Button (if there are unsaved changes) */}
                  {hasUnsavedChanges && (
                    <div className="mt-6 flex justify-center">
                      <Button 
                        onClick={approveCurrentChanges}
                        disabled={isUpdating}
                        className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2"
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Article Action Buttons */}
                  <div className="mt-6 flex justify-center space-x-4">
                    <Button 
                      variant="outline"
                      onClick={handleEdit}
                      className="flex items-center space-x-2 px-6 py-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={handlePreview}
                      className="flex items-center space-x-2 px-6 py-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* AI Chat Sidebar */}
              {showAIChat && (
                <div className="w-80 border-l border-border/50 flex-shrink-0">
                  <AIChat 
                    onClose={() => setShowAIChat(false)}
                    article={selectedContent}
                    selectedLanguage={selectedLanguage}
                    localContent={getCurrentLocalContent()}
                    onApplySuggestion={updateLocalContent}
                    onLoadingChange={setIsUpdating}
                  />
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="bg-white border-t border-border/50 p-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="text-sm px-3 py-1 border-amber-200 bg-amber-50 text-amber-800">
                    {selectedContent.curation_status || 'Pending Review'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Last modified {selectedContent.created_at ? new Date(selectedContent.created_at).toLocaleDateString() : 'Unknown'}
                  </span>
                  {isUpdating && (
                    <div className="flex items-center text-sm text-blue-600">
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Processing...
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline"
                    onClick={() => setShowRejectDialog(true)}
                    disabled={isUpdating}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 px-6 py-2 font-medium transition-all duration-200"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  
                  <Button 
                    onClick={handleApprove} 
                    disabled={isUpdating || hasUnsavedChanges}
                    className="bg-green-600 text-white hover:bg-green-700 px-6 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:bg-gray-400"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve & Publish
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {hasUnsavedChanges && (
                <div className="mt-3 text-sm text-amber-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  You have unsaved changes. Please save before approving.
                </div>
              )}
            </div>

            {/* Reject Dialog */}
            {showRejectDialog && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-96 medical-shadow">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Reject Content</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please provide a reason for rejecting this content:
                  </p>
                  <Textarea
                    value={rejectComment}
                    onChange={(e) => setRejectComment(e.target.value)}
                    placeholder="Enter your feedback..."
                    className="mb-4"
                    rows={4}
                  />
                  <div className="flex justify-end space-x-3">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowRejectDialog(false);
                        setRejectComment('');
                      }}
                      disabled={isUpdating}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleReject}
                      disabled={!rejectComment.trim() || isUpdating}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Rejecting...
                        </>
                      ) : (
                        'Reject Content'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Select Content to Review</h3>
              <p className="text-muted-foreground">
                {articles.length === 0 ? 'No articles available for review' : 'Choose an item from the queue to begin reviewing'}
              </p>
              {articles.length === 0 && !loading && (
                <Button onClick={loadArticles} variant="outline" className="mt-4">
                  Refresh
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewDashboard;
