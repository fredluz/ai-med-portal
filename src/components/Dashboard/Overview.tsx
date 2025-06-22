import React from 'react';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Users, 
  TrendingUp,
  Globe,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Overview = () => {
  const stats = [
    {
      title: "Total Content",
      value: "142",
      change: "+12%",
      trend: "up",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Published",
      value: "128",
      change: "+8%",
      trend: "up",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "In Review",
      value: "5",
      change: "-20%",
      trend: "down",
      icon: Clock,
      color: "text-amber-600"
    },
    {
      title: "Active Users",
      value: "23",
      change: "+15%",
      trend: "up",
      icon: Users,
      color: "text-purple-600"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Content approved",
      title: "Understanding Hypertension",
      user: "Dr. Smith",
      time: "2 hours ago",
      status: "approved"
    },
    {
      id: 2,
      action: "New content created",
      title: "Diabetes Prevention Guide",
      user: "AI Assistant",
      time: "3 hours ago",
      status: "pending"
    },
    {
      id: 3,
      action: "Content rejected",
      title: "Heart Disease Overview",
      user: "Dr. Johnson",
      time: "5 hours ago",
      status: "rejected"
    }
  ];

  const upcomingDeadlines = [
    {
      title: "Quarterly Health Report",
      date: "Jan 25, 2024",
      priority: "high"
    },
    {
      title: "Patient Education Update",
      date: "Jan 28, 2024",
      priority: "medium"
    },
    {
      title: "Translation Review",
      date: "Feb 2, 2024",
      priority: "low"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Monitor your medical content performance and workflow</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="medical-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className={`w-4 h-4 mr-1 ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`} />
                      <span className={`text-sm ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">vs last month</span>
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
        {/* Recent Activity */}
        <Card className="medical-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Activity</span>
              <Button variant="outline" size="sm">View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'approved' ? 'bg-green-500' :
                    activity.status === 'pending' ? 'bg-amber-500' :
                    'bg-red-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground truncate">{activity.title}</p>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <span>{activity.user}</span>
                      <span className="mx-1">•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      activity.status === 'approved' ? 'default' :
                      activity.status === 'pending' ? 'secondary' :
                      'destructive'
                    }
                    className="text-xs"
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Pipeline */}
        <Card className="medical-shadow">
          <CardHeader>
            <CardTitle>Content Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  <span className="text-sm font-medium">Requested</span>
                </div>
                <span className="text-sm font-bold">8 articles</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-sm font-medium">AI Generated</span>
                </div>
                <span className="text-sm font-bold">12 articles</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-amber-500 rounded-full" />
                  <span className="text-sm font-medium">Reviewing</span>
                </div>
                <span className="text-sm font-bold">5 articles</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium">Published</span>
                </div>
                <span className="text-sm font-bold">128 articles</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Distribution */}
        <Card className="medical-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Language Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">English</span>
                  <Badge variant="outline" className="text-xs">Primary</Badge>
                </div>
                <span className="text-sm font-medium">85 articles</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }} />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Portuguese</span>
                <span className="text-sm font-medium">43 articles</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{ width: '30%' }} />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Spanish</span>
                <span className="text-sm font-medium">14 articles</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: '10%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="medical-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Upcoming Deadlines</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">{deadline.title}</p>
                    <p className="text-xs text-muted-foreground">{deadline.date}</p>
                  </div>
                  <Badge 
                    variant={
                      deadline.priority === 'high' ? 'destructive' :
                      deadline.priority === 'medium' ? 'default' :
                      'secondary'
                    }
                    className="text-xs"
                  >
                    {deadline.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
