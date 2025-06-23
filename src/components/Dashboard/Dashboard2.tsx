import React from 'react';
import { 
  Search, 
  CheckCircle, 
  Edit3, 
  FileText,
  TrendingUp,
  TrendingDown,
  BarChart3,
  AlertTriangle,
  Users,
  Clock,
  Eye,
  Target,
  UserCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const Dashboard2 = () => {
  const topStats = [
    {
      title: "Research Phase",
      value: "23",
      subtitle: "from last week",
      change: "+15%",
      trend: "up",
      icon: Search,
      color: "text-blue-600"
    },
    {
      title: "Fact-Checking",
      value: "18",
      subtitle: "from last week",
      change: "+8%",
      trend: "up",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Writing Phase",
      value: "12",
      subtitle: "from last week",
      change: "-3%",
      trend: "down",
      icon: Edit3,
      color: "text-purple-600"
    },
    {
      title: "Published",
      value: "147",
      subtitle: "from last week",
      change: "+22%",
      trend: "up",
      icon: FileText,
      color: "text-emerald-600"
    }
  ];

  const bottomStats = [
    {
      title: "Health Topics",
      value: "89",
      subtitle: "from last week",
      change: "+12%",
      trend: "up",
      icon: Target,
      color: "text-red-500"
    },
    {
      title: "Sources Scraped",
      value: "2,847",
      subtitle: "from last week",
      change: "+26%",
      trend: "up",
      icon: BarChart3,
      color: "text-blue-500"
    },
    {
      title: "Plagiarism Alerts",
      value: "3",
      subtitle: "from last week",
      change: "-67%",
      trend: "down",
      icon: AlertTriangle,
      color: "text-amber-600"
    }
  ];

  const pipelineStatus = [
    { title: "Articles Requested", subtitle: "Pending assignment to agents", value: "128", icon: FileText },
    { title: "Research & Evidence", subtitle: "Gathering sources & citations", value: "23", icon: Search },
    { title: "Fact-Checking", subtitle: "Validating sources & accuracy", value: "18", icon: CheckCircle },
    { title: "Writing & SEO", subtitle: "Creating patient-friendly content", value: "12", icon: Edit3 },
    { title: "Reviewing", subtitle: "Final quality check & approval", value: "7", icon: Eye },
    { title: "Approved", subtitle: "Ready for publication", value: "4", icon: UserCheck },
    { title: "Published", subtitle: "Live content", value: "147", icon: FileText }
  ];

  const pipelineArticles = [
    {
      title: "Understanding Hypertension",
      author: "Joe Doe",
      time: "2 hours ago",
      status: "Requested",
      color: "bg-gray-100 text-gray-800"
    },
    {
      title: "Diabetes Prevention Guide",
      time: "3 hours ago",
      status: "AI Generated",
      color: "bg-blue-100 text-blue-800"
    },
    {
      title: "Managing Chronic Pain",
      author: "Dr. Smith",
      time: "4 hours ago",
      status: "Reviewing",
      color: "bg-amber-100 text-amber-800"
    },
    {
      title: "Heart Disease Prevention",
      author: "Dr. Johnson",
      time: "6 hours ago",
      status: "Approved",
      color: "bg-purple-100 text-purple-800"
    },
    {
      title: "Understanding Anxiety Disorders",
      author: "Medical Team",
      time: "1 day ago",
      status: "Published",
      color: "bg-green-100 text-green-800"
    }
  ];

  const recentArticles = [
    {
      title: "ADHD in Adults: Recognition and Treatment",
      time: "Started 2 hours ago",
      phase: "Research phase",
      status: "research",
      color: "bg-blue-100 text-blue-800"
    },
    {
      title: "Managing Type 2 Diabetes: Lifestyle Changes",
      time: "Started 4 hours ago",
      phase: "Fact-checking",
      status: "validation",
      color: "bg-amber-100 text-amber-800"
    },
    {
      title: "Understanding Anxiety Disorders in Teens",
      time: "Started 6 hours ago",
      phase: "Writing phase",
      status: "writing",
      color: "bg-green-100 text-green-800"
    },
    {
      title: "Childhood Asthma: Signs and Management",
      time: "Started 8 hours ago",
      phase: "Under review",
      status: "reviewing",
      color: "bg-purple-100 text-purple-800"
    },
    {
      title: "Heart Health: Prevention and Early Detection",
      time: "Started 1 day ago",
      phase: "Completed",
      status: "published",
      color: "bg-emerald-100 text-emerald-800"
    }
  ];

  const agentPerformance = [
    { name: "Research Agent", processing: "2.3k", successRate: "98%", status: "active" },
    { name: "Validator Agent", processing: "1.8k", successRate: "94%", status: "active" },
    { name: "Writing Agent", processing: "2.1k", successRate: "96%", status: "active" },
    { name: "Quality Agent", processing: "1.2k", successRate: "99%", status: "active" }
  ];

  const qualityMetrics = [
    { title: "SEO Score", value: "87", max: "100", subtitle: "from last week", icon: "📊", color: "bg-blue-500" },
    { title: "Readability Grade", value: "6.2", max: "10", subtitle: "Perfect for patients", icon: "📖", color: "bg-green-500" },
    { title: "Citation Accuracy", value: "98.5", max: "100", subtitle: "from last week", icon: "✓", color: "bg-purple-500" },
    { title: "Plagiarism Rate", value: "0.3", max: "100", subtitle: "from last week", icon: "⚠", color: "bg-red-500" }
  ];

  const healthTopics = [
    { name: "Mental Health & Psychology", articles: 34 },
    { name: "Chronic Diseases", articles: 28 },
    { name: "Pediatric Health", articles: 22 },
    { name: "Preventive Care", articles: 19 },
    { name: "Women's Health", articles: 16 },
    { name: "Senior Health", articles: 14 },
    { name: "Nutrition & Diet", articles: 12 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Advanced Analytics Dashboard</h1>
        <p className="text-muted-foreground">Comprehensive view of your medical content creation pipeline and performance metrics</p>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="medical-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1 text-red-600" />
                      )}
                      <span className={`text-sm ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">{stat.subtitle}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-muted/50 ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bottomStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="medical-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1 text-red-600" />
                      )}
                      <span className={`text-sm ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">{stat.subtitle}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-muted/50 ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Article Production Pipeline */}
        <Card className="medical-shadow">
          <CardHeader>
            <CardTitle>Article Production Pipeline - Last 30 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipelineArticles.map((article, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={article.color}>
                        {article.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-foreground">{article.title}</p>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      {article.author && (
                        <>
                          <span>{article.author}</span>
                          <span className="mx-1">•</span>
                        </>
                      )}
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{article.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Pipeline Status */}
        <Card className="medical-shadow">
          <CardHeader>
            <CardTitle>Current Pipeline Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipelineStatus.map((status, index) => {
                const Icon = status.icon;
                return (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{status.title}</p>
                      <p className="text-xs text-muted-foreground">{status.subtitle}</p>
                    </div>
                    <span className="text-lg font-bold text-foreground">{status.value}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Articles */}
        <Card className="medical-shadow">
          <CardHeader>
            <CardTitle>Recent Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentArticles.map((article, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{article.title}</p>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{article.time}</span>
                      <span className="mx-1">•</span>
                      <span>{article.phase}</span>
                    </div>
                  </div>
                  <Badge className={article.color}>
                    {article.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agent Performance Monitoring */}
        <Card className="medical-shadow">
          <CardHeader>
            <CardTitle>Agent Performance Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agentPerformance.map((agent, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">Avg. Processing: {agent.processing}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Success Rate: {agent.successRate}</p>
                    <Badge variant="default" className="text-xs mt-1">
                      {agent.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Quality Dashboard */}
      <Card className="medical-shadow">
        <CardHeader>
          <CardTitle>Content Quality Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {qualityMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 rounded-full ${metric.color} text-white flex items-center justify-center text-2xl mx-auto mb-3`}>
                  {metric.icon}
                </div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">{metric.title}</h3>
                <p className="text-2xl font-bold text-foreground">
                  {metric.value}
                  {metric.title === "Readability Grade" ? "" : metric.title === "Plagiarism Rate" ? "%" : `/${metric.max}`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{metric.subtitle}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Health Topics */}
      <Card className="medical-shadow">
        <CardHeader>
          <CardTitle>Popular Health Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {healthTopics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span className="text-sm text-foreground">{topic.name}</span>
                <span className="text-sm font-medium text-muted-foreground">{topic.articles} articles</span>
              </div>
            ))}
            <div className="pt-4 border-t border-border/50">
              <button className="text-sm text-primary hover:underline">All Health Topics →</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard2;
