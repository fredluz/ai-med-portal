
import React, { useState } from 'react';
import { 
  MessageSquare, 
  FileText, 
  Sparkles,
  Target,
  Globe,
  Palette,
  TrendingUp,
  BookOpen,
  Stethoscope,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CreateWorkspace = () => {
  const [activeTab, setActiveTab] = useState('writer');
  const [chatMessage, setChatMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4.1');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [viewMode, setViewMode] = useState('main'); // 'main' or 'template-detail'

  const templates = [
    {
      id: 1,
      title: "Medical Content",
      description: "Comprehensive medical information structure",
      category: "Medical",
      icon: Stethoscope,
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Portal Patient article",
      description: "Patient-focused educational content",
      category: "Patient Education",
      icon: BookOpen,
      color: "bg-green-500"
    },
    {
      id: 3,
      title: "Pharma MKT content",
      description: "Pharmaceutical marketing materials",
      category: "Marketing",
      icon: Target,
      color: "bg-purple-500"
    }
  ];

  const trendingTopics = [
    "Mental Health Awareness",
    "Diabetes Management",
    "Heart Disease Prevention",
    "Vaccine Information",
    "Nutrition Guidelines"
  ];

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    console.log('Sending message:', chatMessage);
    setChatMessage('');
  };

  const handleTemplateClick = (templateId: number) => {
    if (templateId === 1) { // Medical Content template
      setViewMode('template-detail');
    }
  };

  const renderTemplateDetail = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setViewMode('main')}
            className="text-primary hover:text-primary/80"
          >
            ← Back to Templates
          </Button>
        </div>

        <Card className="medical-shadow">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-500">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Medical Content Template</CardTitle>
                <p className="text-sm text-muted-foreground">Comprehensive medical information structure</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Template Structure</h3>
              <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm">
                <div className="space-y-1">
                  <div className="font-semibold">Article/</div>
                  <div className="ml-4">├── epidemiology</div>
                  <div className="ml-4">├── pathophysiology</div>
                  <div className="ml-4">├── symptoms_and_signs</div>
                  <div className="ml-4">├── diagnosis</div>
                  <div className="ml-4">├── treatment</div>
                  <div className="ml-4">├── prognosis</div>
                  <div className="ml-4">├── prevention</div>
                  <div className="ml-4">└── key_points</div>
                  <div className="mt-2">└── related_articles/</div>
                  <div className="mt-1">└── references/</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Section Descriptions</h3>
              <div className="space-y-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium text-sm">Epidemiology</h4>
                  <p className="text-xs text-muted-foreground">Statistical data about disease occurrence and distribution</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium text-sm">Pathophysiology</h4>
                  <p className="text-xs text-muted-foreground">Biological mechanisms underlying the condition</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium text-sm">Symptoms & Signs</h4>
                  <p className="text-xs text-muted-foreground">Clinical manifestations and observable indicators</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium text-sm">Diagnosis</h4>
                  <p className="text-xs text-muted-foreground">Diagnostic criteria, tests, and procedures</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium text-sm">Treatment</h4>
                  <p className="text-xs text-muted-foreground">Therapeutic options and management strategies</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium text-sm">Prognosis</h4>
                  <p className="text-xs text-muted-foreground">Expected outcomes and recovery expectations</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium text-sm">Prevention</h4>
                  <p className="text-xs text-muted-foreground">Preventive measures and risk reduction strategies</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium text-sm">Key Points</h4>
                  <p className="text-xs text-muted-foreground">Essential takeaways and summary information</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button className="flex-1">
                <Sparkles className="w-4 h-4 mr-2" />
                Use This Template
              </Button>
              <Button variant="outline">
                Edit Template
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (viewMode === 'template-detail') {
    return (
      <div className="h-full bg-gray-50 flex">
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {renderTemplateDetail()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 flex">
      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">Create Medical Content</h1>
            <p className="text-muted-foreground">Generate AI-powered, medically-reviewed content for your patients</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 medical-shadow w-fit">
            {[
              { id: 'writer', label: 'AI Writer', icon: MessageSquare },
              { id: 'templates', label: 'Templates', icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {activeTab === 'writer' && (
                <Card className="medical-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span>AI Content Generator</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium">Model:</span>
                        <Select value={selectedModel} onValueChange={setSelectedModel}>
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gpt-4.1">GPT-4.1 (Recommended)</SelectItem>
                            <SelectItem value="claude-4">Claude 4 Opus</SelectItem>
                            <SelectItem value="claude-sonnet">Claude 4 Sonnet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium">Template:</span>
                        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select template" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="medical">Medical Content</SelectItem>
                            <SelectItem value="patient">Portal Patient article</SelectItem>
                            <SelectItem value="pharma">Pharma MKT content</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Badge variant="outline" className="text-xs">
                      Medical-trained model
                    </Badge>

                    <Textarea
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Describe the medical content you want to create. For example: 'Create a patient-friendly guide about managing high blood pressure, including lifestyle changes and medication information.'"
                      className="min-h-[120px]"
                    />

                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        Tip: Be specific about your target audience and content goals
                      </div>
                      <Button onClick={handleSendMessage} disabled={!chatMessage.trim()}>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Content
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'templates' && (
                <Card className="medical-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Content Templates</CardTitle>
                      <Button size="sm" className="flex items-center space-x-2">
                        <Plus className="w-4 h-4" />
                        <span>New Template</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {templates.map((template) => {
                        const Icon = template.icon;
                        return (
                          <Card 
                            key={template.id} 
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => handleTemplateClick(template.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-3">
                                <div className={`p-2 rounded-lg ${template.color}`}>
                                  <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-medium text-foreground">{template.title}</h3>
                                  <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                                  <Badge variant="secondary" className="mt-2 text-xs">
                                    {template.category}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Content Configuration - only show in writer tab */}
              {activeTab === 'writer' && (
                <Card className="medical-shadow">
                  <CardHeader>
                    <CardTitle className="text-base">Content Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Target Audience</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select target audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="patients">Patients</SelectItem>
                          <SelectItem value="caregivers">Caregivers</SelectItem>
                          <SelectItem value="providers">Healthcare Providers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Primary Language</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="pt">Portuguese</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Reading Level</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reading level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grade-6">Grade 6 (Simple)</SelectItem>
                          <SelectItem value="grade-8">Grade 8 (Standard)</SelectItem>
                          <SelectItem value="grade-10">Grade 10 (Advanced)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Content Tone</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compassionate">Compassionate</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="conversational">Conversational</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Research Suggestions */}
              <Card className="medical-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base">
                    <TrendingUp className="w-4 h-4" />
                    <span>Trending Topics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {trendingTopics.map((topic) => (
                      <Button
                        key={topic}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start h-auto p-2 text-left"
                      >
                        <span className="text-sm">{topic}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="medical-shadow">
                <CardHeader>
                  <CardTitle className="text-base">Content Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">This Month</span>
                      <span className="font-medium">23 articles</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Avg. Rating</span>
                      <span className="font-medium">4.8/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Languages</span>
                      <span className="font-medium">3 active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Templates */}
              <Card className="medical-shadow">
                <CardHeader>
                  <CardTitle className="text-base">Recent Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground p-2 rounded border border-border/50">
                      Diabetes Management Guide
                    </div>
                    <div className="text-sm text-muted-foreground p-2 rounded border border-border/50">
                      Heart Health Checklist
                    </div>
                    <div className="text-sm text-muted-foreground p-2 rounded border border-border/50">
                      Medication Safety Tips
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspace;
