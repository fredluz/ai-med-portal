
import React, { useState } from 'react';
import { Send, X, Lightbulb, RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface AIChatProps {
  onClose: () => void;
}

const AIChat = ({ onClose }: AIChatProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m here to help you improve this medical content. What would you like to focus on?',
      timestamp: '10:30 AM'
    }
  ]);

  const suggestedPrompts = [
    "Make this more accessible for patients",
    "Add side effects information",
    "Improve SEO optimization",
    "Check medical accuracy",
    "Simplify complex terms"
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'assistant',
        content: `I understand you'd like to "${message}". Here are my suggestions for improving the content...`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handlePromptClick = (prompt: string) => {
    setMessage(prompt);
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
            <h3 className="font-medium text-foreground">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Content optimization</p>
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
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${
              msg.type === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              <p className="text-sm">{msg.content}</p>
              <p className={`text-xs mt-1 ${
                msg.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground/70'
              }`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-border/50">
        <div className="flex space-x-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask for content improvements..."
            className="flex-1 min-h-[40px] resize-none"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
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
              GPT-4.1
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="text-xs">
            <RefreshCw className="w-3 h-3 mr-1" />
            Clear chat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
