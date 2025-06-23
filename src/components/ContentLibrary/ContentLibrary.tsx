
import React, { useState } from 'react';
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
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const ContentLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const articles = [
    {
      id: 1,
      title: "Understanding Type 2 Diabetes: A Complete Guide",
      author: "Dr. Sarah Wilson",
      publishDate: "2024-01-15",
      readingTime: "8 min read",
      views: 2400,
      rating: 4.8,
      status: "published",
      category: "Diabetes",
      tags: ["diabetes", "chronic-conditions", "patient-education"],
      excerpt: "A comprehensive guide to understanding type 2 diabetes, its causes, symptoms, and management strategies."
    },
    {
      id: 2,
      title: "Heart Disease Prevention: Essential Steps",
      author: "Dr. Michael Chen",
      publishDate: "2024-01-12",
      readingTime: "6 min read",
      views: 1850,
      rating: 4.9,
      status: "published",
      category: "Cardiology",
      tags: ["heart-disease", "prevention", "lifestyle"],
      excerpt: "Learn about the most effective strategies for preventing heart disease through lifestyle modifications."
    },
    {
      id: 3,
      title: "Mental Health Awareness in Primary Care",
      author: "Dr. Lisa Rodriguez",
      publishDate: "2024-01-10",
      readingTime: "10 min read",
      views: 3200,
      rating: 4.7,
      status: "published",
      category: "Mental Health",
      tags: ["mental-health", "primary-care", "awareness"],
      excerpt: "Understanding the importance of mental health screening and support in primary care settings."
    }
  ];

  const trendingTopics = [
    "Mental Health Awareness",
    "Diabetes Management", 
    "Heart Disease Prevention",
    "Vaccine Information",
    "Nutrition Guidelines"
  ];

  const handleEdit = (article) => {
    console.log('Edit article:', article.id);
    // Add edit logic here
  };

  const handleView = (article) => {
    console.log('View article:', article.id);
    // Add view logic here
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                    placeholder="Search articles, authors, or categories..."
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {article.category}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>

                  <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {article.author}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {article.publishDate}
                        </span>
                      </div>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {article.readingTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center text-muted-foreground">
                          <Eye className="w-3 h-3 mr-1" />
                          {article.views.toLocaleString()}
                        </span>
                        <span className="flex items-center text-muted-foreground">
                          <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {article.rating}
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
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
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
                <div className="text-2xl font-bold text-primary">23 articles</div>
              </div>
              
              <div className="text-sm">
                <div className="font-medium text-foreground mb-1">Avg. Rating</div>
                <div className="text-2xl font-bold text-primary">4.8/5</div>
              </div>
              
              <div className="text-sm">
                <div className="font-medium text-foreground mb-1">Languages</div>
                <div className="text-2xl font-bold text-primary">3 active</div>
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
