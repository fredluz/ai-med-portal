import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, X, Lightbulb, RefreshCw, CheckCircle, Clock, AlertCircle, Check, Edit, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import type { Article } from '@/utils/supabaseClient';
import type { Language } from './ReviewDashboard';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestion?: string;
}

interface AIChatProps {
  onClose: () => void;
  article?: Article | null;
  selectedLanguage?: Language;
  localContent?: string;
  onApplySuggestion?: (suggestion: string) => void;
  onLoadingChange?: (isLoading: boolean) => void;
}

const AIChat = ({ 
  onClose, 
  article, 
  selectedLanguage = 'en', 
  localContent = '', 
  onApplySuggestion,
  onLoadingChange 
}: AIChatProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestedPrompts = [
    "Make this more accessible for patients",
    "Add side effects information",
    "Improve SEO optimization", 
    "Check medical accuracy",
    "Simplify complex terms"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [isLoading, onLoadingChange]);

  const getOriginalContent = () => {
    if (!article?.raw_json_content?.mainContentHtml) return '';
    
    return Object.values(article.raw_json_content.mainContentHtml.sections || {})
      .flat()
      .map((section: any) => section.text)
      .join('\n\n');
  };

  const getLanguageLabel = () => {
    switch (selectedLanguage) {
      case 'en': return 'English (Rewritten)';
      case 'es': return 'Spanish (Translated)';
      case 'pt': return 'Portuguese (Translated)';
      default: return 'Content';
    }
  };

  const getCurrentContent = () => {
    if (localContent) return localContent;
    
    if (!article) return '';
    
    switch (selectedLanguage) {
      case 'en': return article.content_en_rewritten || '';
      case 'es': return article.content_es_translated || '';
      case 'pt': return article.content_pt_translated || '';
      default: return '';
    }
  };

  const constructChatPrompt = (userMessage: string) => {
    const originalContent = getOriginalContent();
    const currentContent = getCurrentContent();
    const languageLabel = getLanguageLabel();
    
    return `You are a medical content curator helping to improve ${languageLabel.toLowerCase()} content for ESL (English as Second Language) readers.

ORIGINAL ARTICLE:
${originalContent}

CURRENT ${languageLabel.toUpperCase()}:
${currentContent}

USER REQUEST:
${userMessage}

Please provide suggestions for improving the content based on the user's request. Focus on making the content more accessible for ESL readers while maintaining medical accuracy. 

IMPORTANT: Be concise and directly address only what the user asked for. Do not elaborate on unrelated topics.

EXAMPLE:
User: "The article has too many signs of dementia"

❌ BAD: "Sure! Here are some suggestions for improving the article based on the user's request to reduce the number of signs:

Simplify and Consolidate Signs
- Group Similar Signs: Instead of listing many separate signs, group similar ones together...
- Use Clear Examples: Provide specific, relatable examples...
- Limit to Key Signs: Choose 5-6 of the most common and impactful signs...

Clearer Language
- Use Simple Words: Replace complex terms with simpler language...
- Define Unfamiliar Terms: Any medical terms that must be included...

Visual Aids
- Add Visuals: Consider including simple visuals or icons..."

✅ GOOD: "I'll reduce the signs from 11 to 6, keeping the most common ones: memory problems, confusion, communication difficulties, getting lost, trouble with money, and losing interest in activities."

Provide your suggestions in a clear, conversational format. Do not output the full revised article - just explain what changes you would make and why they would be helpful.`;
  };

  const constructRewritePrompt = (suggestion: string) => {
    const originalContent = getOriginalContent();
    const currentContent = getCurrentContent();
    const languageLabel = getLanguageLabel();
    
    return `You are a medical content rewriter. Your task is to rewrite the entire article to apply the user's suggestion while maintaining medical accuracy and ESL-friendly language.

ORIGINAL ARTICLE:
${originalContent}

CURRENT ${languageLabel.toUpperCase()}:
${currentContent}

USER'S ACCEPTED SUGGESTION:
${suggestion}

Please rewrite the ENTIRE article to incorporate the user's suggestion. Make sure to:
- Apply the specific changes requested in the suggestion
- Maintain medical accuracy
- Keep the language simple and accessible for ESL readers
- Preserve the overall structure and important information
- Return ONLY the complete rewritten article content`;
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const prompt = constructChatPrompt(userMessage.content);
      
      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          input: prompt,
          temperature: 0.7,
          max_output_tokens: 1500
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      // Extract text from the response
      const output = data.output?.[0];
      const assistantContent = output?.content?.[0]?.text;

      if (!assistantContent) {
        throw new Error('No response content received from OpenAI');
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
        suggestion: assistantContent
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptSuggestion = async (suggestion: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const rewritePrompt = constructRewritePrompt(suggestion);
      
      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          input: rewritePrompt,
          temperature: 0.3,
          max_output_tokens: 2500
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const output = data.output?.[0];
      const rewrittenArticle = output?.content?.[0]?.text;

      if (!rewrittenArticle) {
        throw new Error('No rewritten content received from OpenAI');
      }

      // Apply the rewritten article
      if (onApplySuggestion) {
        onApplySuggestion(rewrittenArticle);
      }

      // Add confirmation message to chat
      const confirmationMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '✅ The article has been rewritten based on the accepted suggestion.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, confirmationMessage]);

    } catch (err) {
      console.error('Error rewriting article:', err);
      setError(err instanceof Error ? err.message : 'Failed to rewrite article');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSuggestion = (suggestion: string) => {
    setMessage(suggestion);
    textareaRef.current?.focus();
  };

  const handlePromptClick = (prompt: string) => {
    setMessage(prompt);
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">AI Curator Assistant</h3>
            <p className="text-xs text-muted-foreground">
              {article ? `Editing ${getLanguageLabel().toLowerCase()}` : 'Content optimization'}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Suggested Prompts */}
      <div className="p-4 border-b border-border/50">
        <p className="text-xs font-medium text-muted-foreground mb-2">Quick actions:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.slice(0, 3).map((prompt) => (
            <Button
              key={prompt}
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => handlePromptClick(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground">
            <div className="mb-4">
              <Lightbulb className="w-12 h-12 mx-auto text-primary/30 mb-2" />
              <p className="text-sm font-medium">👋 Hi! I can help you improve the {getLanguageLabel().toLowerCase()} content.</p>
            </div>
            <div className="text-xs space-y-1">
              <p>Try asking me to:</p>
              <ul className="list-disc list-inside space-y-1 text-left max-w-xs mx-auto">
                <li>Simplify complex medical terms</li>
                <li>Improve readability for ESL readers</li>
                <li>Restructure content for better flow</li>
                <li>Make specific edits or corrections</li>
              </ul>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id}>
            <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                <div className="text-sm">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                <p className={`text-xs mt-1 ${
                  msg.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground/70'
                }`}>
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
            
            {/* Suggestion Actions */}
            {msg.role === 'assistant' && msg.suggestion && onApplySuggestion && (
              <div className="flex justify-start mt-2">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAcceptSuggestion(msg.suggestion!)}
                    disabled={isLoading}
                    className="text-xs h-7 text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Accept
                  </Button>
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditSuggestion(msg.suggestion!)}
                    disabled={isLoading}
                    className="text-xs h-7"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                    className="text-xs h-7 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="w-3 h-3 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-muted-foreground rounded-lg p-3 max-w-[80%]">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Chat Input */}
      <div className="p-4 border-t border-border/50">
        <div className="flex space-x-2">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={article ? "Ask me to improve the content..." : "Select an article to get AI assistance..."}
            className="flex-1 min-h-[40px] resize-none"
            rows={2}
            disabled={isLoading || !article}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading || !article}
            size="sm"
            className="h-[72px]"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              GPT-4o-mini
            </Badge>
            {article && (
              <Badge variant="outline" className="text-xs">
                {selectedLanguage.toUpperCase()}
              </Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={clearChat}
            disabled={messages.length === 0}
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Clear chat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
