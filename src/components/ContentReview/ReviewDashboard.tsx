
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AIChat from './AIChat';

const ReviewDashboard = () => {
  const [selectedContent, setSelectedContent] = useState(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);
  const [activeTab, setActiveTab] = useState('patient-education');

  const patientEducationArticles = [
    {
      id: 1,
      title: "ADHD in Teens: What Parents Need to Know",
      author: "Dr. Sarah Martinez",
      language: "English",
      status: "pending",
      created: "2024-01-15",
      wordCount: 1247,
      readingLevel: "Grade 8",
      tags: ["adhd", "teens", "parenting", "patient-education"],
      content: `
        <h1>ADHD in Teens: What Parents Need to Know</h1>
        
        <p class="lead">
          Attention deficit hyperactivity disorder (ADHD) affects millions of teenagers worldwide. 
          Understanding the signs, symptoms, and treatment options can help parents support their teens effectively.
        </p>

        <h2>What Is ADHD?</h2>
        <p>
          ADHD is a neurodevelopmental disorder that affects a person's ability to focus, control impulses, 
          and manage hyperactive behaviors. While often diagnosed in childhood, ADHD continues into the 
          teenage years and can present unique challenges during adolescence.
        </p>

        <h2>Signs of ADHD in Teenagers</h2>
        <p>ADHD symptoms in teens may include:</p>
        <ul>
          <li><strong>Inattention:</strong> Difficulty focusing on schoolwork, frequently losing assignments, 
          trouble following through on tasks</li>
          <li><strong>Hyperactivity:</strong> Restlessness, difficulty sitting still, talking excessively</li>
          <li><strong>Impulsivity:</strong> Acting without thinking, interrupting others, making quick decisions 
          without considering consequences</li>
        </ul>

        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
          <p class="text-sm">
            <strong>Important:</strong> ADHD symptoms can be mistaken for typical teenage behavior. 
            If symptoms significantly impact your teen's daily life, consider consulting a healthcare professional.
          </p>
        </div>

        <h2>Treatment Options</h2>
        <p>
          Treatment for ADHD typically involves a combination of approaches including medication, 
          behavioral therapy, and lifestyle modifications. Work with your teen's healthcare provider 
          to develop a comprehensive treatment plan.
        </p>

        <h2>Supporting Your Teen</h2>
        <p>
          Parents can help by maintaining consistent routines, providing clear expectations, 
          and celebrating small victories. Remember that ADHD is a medical condition, not a 
          character flaw or result of poor parenting.
        </p>
      `
    },
    {
      id: 2,
      title: "Managing Diabetes: A Teen's Guide to Staying Healthy",
      author: "AI Assistant",
      language: "English",
      status: "pending",
      created: "2024-01-14",
      wordCount: 892,
      readingLevel: "Grade 7",
      tags: ["diabetes", "teens", "self-care", "patient-education"],
      content: `
        <h1>Managing Diabetes: A Teen's Guide to Staying Healthy</h1>
        
        <p class="lead">
          Living with diabetes as a teenager comes with unique challenges, but with the right knowledge 
          and support, you can live a full, healthy life.
        </p>

        <h2>Understanding Your Condition</h2>
        <p>
          Diabetes affects how your body processes glucose (sugar). Whether you have Type 1 or Type 2 diabetes, 
          managing blood sugar levels is key to staying healthy and feeling your best.
        </p>
      `
    }
  ];

  const medicalArticles = [
    {
      id: 3,
      title: "Attention-Deficit/Hyperactivity Disorder (ADHD): Clinical Overview",
      author: "Dr. Michael Thompson, MD",
      language: "English",
      status: "pending",
      created: "2024-01-16",
      wordCount: 2134,
      readingLevel: "Medical Professional",
      tags: ["adhd", "diagnosis", "treatment", "clinical-guidelines"],
      content: `
        <h1>Attention-Deficit/Hyperactivity Disorder (ADHD): Clinical Overview</h1>
        
        <h2>Diagnostic Criteria</h2>
        <p>
          ADHD is diagnosed based on DSM-5 criteria, requiring evidence of inattention and/or 
          hyperactivity-impulsivity that interferes with functioning or development. Symptoms must:
        </p>
        
        <ul>
          <li>Be present for at least 6 months</li>
          <li>Occur in multiple settings (home, school, work)</li>
          <li>Be inappropriate for developmental level</li>
          <li>Directly impact social, academic, or occupational functioning</li>
        </ul>

        <h2>Clinical Presentation</h2>
        <p>
          ADHD presents with persistent patterns of inattention and/or hyperactivity-impulsivity. 
          The disorder is categorized into three presentations:
        </p>
        
        <h3>Predominantly Inattentive Presentation</h3>
        <ul>
          <li>Difficulty sustaining attention in tasks or play activities</li>
          <li>Frequent careless mistakes in schoolwork or other activities</li>
          <li>Appears not to listen when spoken to directly</li>
          <li>Fails to follow through on instructions</li>
          <li>Difficulty organizing tasks and activities</li>
        </ul>

        <h3>Predominantly Hyperactive-Impulsive Presentation</h3>
        <ul>
          <li>Fidgets with hands or feet or squirms in seat</li>
          <li>Leaves seat in situations when remaining seated is expected</li>
          <li>Runs about or climbs in inappropriate situations</li>
          <li>Unable to play or engage in leisure activities quietly</li>
          <li>Often "on the go" or acts as if "driven by a motor"</li>
        </ul>

        <h2>Pharmacological Management</h2>
        <p>
          First-line treatment typically involves stimulant medications, including:
        </p>
        
        <h3>Methylphenidate-based medications:</h3>
        <ul>
          <li>Immediate-release: 2.5-5mg BID/TID, titrated to effect</li>
          <li>Extended-release formulations for once-daily dosing</li>
        </ul>

        <h3>Amphetamine-based medications:</h3>
        <ul>
          <li>Starting dose: 5mg daily, increased by 5mg weekly</li>
          <li>Maximum recommended dose varies by formulation</li>
        </ul>

        <div class="bg-amber-50 border-l-4 border-amber-400 p-4 my-4">
          <p class="text-sm">
            <strong>Clinical Note:</strong> Monitor for cardiovascular effects, growth suppression, 
            and psychiatric symptoms. Regular follow-up appointments are essential for optimal management.
          </p>
        </div>

        <h2>Non-Pharmacological Interventions</h2>
        <p>
          Behavioral interventions should be considered as part of comprehensive treatment:
        </p>
        <ul>
          <li>Cognitive-behavioral therapy (CBT)</li>
          <li>Parent training programs</li>
          <li>School-based interventions</li>
          <li>Lifestyle modifications (exercise, sleep hygiene)</li>
        </ul>
      `
    },
    {
      id: 4,
      title: "Hypertension Management: Evidence-Based Approach",
      author: "Dr. Jennifer Lee, MD",
      language: "English",
      status: "pending",
      created: "2024-01-13",
      wordCount: 1876,
      readingLevel: "Medical Professional",
      tags: ["hypertension", "cardiology", "treatment-guidelines"],
      content: `
        <h1>Hypertension Management: Evidence-Based Approach</h1>
        
        <h2>Classification and Diagnosis</h2>
        <p>
          According to current guidelines, hypertension is classified as sustained blood pressure 
          measurements ≥130/80 mmHg. Accurate diagnosis requires proper measurement technique and 
          confirmation over multiple visits.
        </p>
      `
    }
  ];

  const getAllArticles = () => {
    return activeTab === 'patient-education' ? patientEducationArticles : medicalArticles;
  };

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

  const currentArticles = getAllArticles();

  return (
    <div className="flex h-full bg-gray-50">
      {/* Content List with Tabs */}
      <div className={`${showAIChat ? 'w-32' : 'w-40'} bg-white border-r border-border/50 overflow-y-auto transition-all duration-300`}>
        <div className="p-4 border-b border-border/50">
          <h2 className="text-sm font-semibold text-foreground">Review Queue</h2>
          <p className="text-xs text-muted-foreground mt-1">{patientEducationArticles.length + medicalArticles.length} items awaiting review</p>
        </div>
        
        <div className="p-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-3">
              <TabsTrigger value="patient-education" className="text-xs">Patient Ed</TabsTrigger>
              <TabsTrigger value="medical" className="text-xs">Medical</TabsTrigger>
            </TabsList>
            
            <TabsContent value="patient-education" className="space-y-2 mt-0">
              {patientEducationArticles.map((item) => (
                <Card 
                  key={item.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedContent?.id === item.id ? 'ring-2 ring-primary/20 bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedContent(item)}
                >
                  <CardContent className="p-3">
                    <h3 className="font-medium text-xs text-foreground mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <User className="w-2 h-2 mr-1" />
                        <span className="truncate">{item.author}</span>
                      </div>
                      
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-2 h-2 mr-1" />
                        <span className="truncate">{item.created}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          Patient Ed
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {item.wordCount}w
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="medical" className="space-y-2 mt-0">
              {medicalArticles.map((item) => (
                <Card 
                  key={item.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedContent?.id === item.id ? 'ring-2 ring-primary/20 bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedContent(item)}
                >
                  <CardContent className="p-3">
                    <h3 className="font-medium text-xs text-foreground mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <User className="w-2 h-2 mr-1" />
                        <span className="truncate">{item.author}</span>
                      </div>
                      
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-2 h-2 mr-1" />
                        <span className="truncate">{item.created}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          Medical
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {item.wordCount}w
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
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
                    <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: selectedContent.content }}>
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
                  <Badge variant="outline" className="text-sm px-3 py-1 border-amber-200 bg-amber-50 text-amber-800">
                    Medical Review Required
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Last modified 2 hours ago
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline"
                    onClick={() => setShowRejectDialog(true)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 px-6 py-2 font-medium transition-all duration-200"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  
                  <Button 
                    onClick={handleApprove} 
                    className="bg-green-600 text-white hover:bg-green-700 px-6 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
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
                      className="bg-red-600 text-white hover:bg-red-700"
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
