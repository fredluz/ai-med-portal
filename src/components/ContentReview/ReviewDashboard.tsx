
import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Eye, 
  Clock,
  User,
  Calendar,
  Tag,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import AIChat from './AIChat';

const ReviewDashboard = () => {
  const [selectedContent, setSelectedContent] = useState(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);

  const contentItems = [
    {
      id: 1,
      title: "Understanding Type 2 Diabetes: A Complete Guide",
      author: "AI Assistant",
      language: "English",
      status: "pending",
      created: "2024-01-15",
      wordCount: 1247,
      readingLevel: "Grade 8",
      tags: ["diabetes", "chronic-conditions", "patient-education"]
    },
    {
      id: 2,
      title: "Hypertension Management and Lifestyle Changes",
      author: "Dr. Johnson",
      language: "Portuguese",
      status: "pending",
      created: "2024-01-14",
      wordCount: 892,
      readingLevel: "Grade 7",
      tags: ["hypertension", "lifestyle", "prevention"]
    }
  ];

  const handleApprove = () => {
    console.log('Content approved');
    // Add approval logic here
  };

  const handleReject = () => {
    if (rejectComment.trim()) {
      console.log('Content rejected:', rejectComment);
      setShowRejectDialog(false);
      setRejectComment('');
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Content List */}
      <div className="w-80 bg-white border-r border-border/50 overflow-y-auto">
        <div className="p-6 border-b border-border/50">
          <h2 className="text-lg font-semibold text-foreground">Review Queue</h2>
          <p className="text-sm text-muted-foreground mt-1">5 items awaiting review</p>
        </div>
        
        <div className="p-4 space-y-3">
          {contentItems.map((item) => (
            <Card 
              key={item.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedContent?.id === item.id ? 'ring-2 ring-primary/20 bg-primary/5' : ''
              }`}
              onClick={() => setSelectedContent(item)}
            >
              <CardContent className="p-4">
                <h3 className="font-medium text-sm text-foreground mb-2 line-clamp-2">
                  {item.title}
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <User className="w-3 h-3 mr-1" />
                    {item.author}
                  </div>
                  
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {item.created}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {item.language}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {item.wordCount} words
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {selectedContent ? (
          <>
            {/* Content Header */}
            <div className="bg-white border-b border-border/50 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-foreground mb-2">
                    {selectedContent.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {selectedContent.author}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {selectedContent.created}
                    </span>
                    <span>{selectedContent.readingLevel} reading level</span>
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
                  
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </div>

            {/* Split Content Area */}
            <div className="flex-1 flex">
              {/* Content Editor */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-lg medical-shadow p-8">
                    <div className="prose prose-lg max-w-none">
                      <h1>Understanding Type 2 Diabetes: A Complete Guide</h1>
                      
                      <p className="lead">
                        Type 2 diabetes is a chronic condition that affects the way your body processes blood sugar (glucose). 
                        Unlike type 1 diabetes, your body still produces insulin, but it doesn't use it effectively.
                      </p>

                      <h2>What Causes Type 2 Diabetes?</h2>
                      <p>
                        Several factors contribute to the development of type 2 diabetes, including genetics, 
                        lifestyle choices, and environmental factors. The primary causes include:
                      </p>

                      <ul>
                        <li><strong>Insulin resistance:</strong> Your body's cells don't respond properly to insulin</li>
                        <li><strong>Genetic factors:</strong> Family history increases your risk</li>
                        <li><strong>Lifestyle factors:</strong> Poor diet, lack of exercise, and obesity</li>
                        <li><strong>Age:</strong> Risk increases after age 45</li>
                      </ul>

                      <h2>Common Symptoms</h2>
                      <p>Type 2 diabetes symptoms often develop slowly and may include:</p>
                      
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                        <p className="text-sm">
                          <strong>Important:</strong> Some people with type 2 diabetes have no symptoms at all. 
                          Regular screening is essential for early detection.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Chat Sidebar */}
              {showAIChat && (
                <div className="w-80 border-l border-border/50">
                  <AIChat onClose={() => setShowAIChat(false)} />
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="bg-white border-t border-border/50 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="text-sm">
                    Medical Review Required
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Last modified 2 hours ago
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline"
                    onClick={() => setShowRejectDialog(true)}
                    className="text-destructive hover:text-destructive"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  
                  <Button onClick={handleApprove} className="bg-success text-success-foreground hover:bg-success/90">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve & Publish
                  </Button>
                </div>
              </div>
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
                      onClick={() => setShowRejectDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleReject}
                      disabled={!rejectComment.trim()}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Reject Content
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
              <p className="text-muted-foreground">Choose an item from the queue to begin reviewing</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewDashboard;
