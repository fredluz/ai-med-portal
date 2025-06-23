
import React from 'react';
import { 
  Eye, 
  Users, 
  Clock, 
  TrendingUp,
  MousePointer,
  BarChart3,
  Globe,
  Calendar,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const Overview = () => {
  const analyticsStats = [
    {
      title: "Page Views",
      value: "24,589",
      change: "+12.5%",
      trend: "up",
      icon: Eye,
      color: "text-blue-600",
      period: "vs last month"
    },
    {
      title: "Unique Visitors",
      value: "8,421",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "text-green-600",
      period: "vs last month"
    },
    {
      title: "Avg. Session Duration",
      value: "3m 42s",
      change: "+15.3%",
      trend: "up",
      icon: Clock,
      color: "text-purple-600",
      period: "vs last month"
    },
    {
      title: "Bounce Rate",
      value: "34.2%",
      change: "-5.1%",
      trend: "down",
      icon: MousePointer,
      color: "text-amber-600",
      period: "vs last month"
    }
  ];

  const topPages = [
    {
      page: "/articles/understanding-diabetes",
      title: "Understanding Diabetes: A Complete Guide",
      views: "3,247",
      avgTime: "4m 15s",
      bounceRate: "28%"
    },
    {
      page: "/articles/heart-health-tips",
      title: "10 Essential Heart Health Tips",
      views: "2,891",
      avgTime: "3m 32s",
      bounceRate: "31%"
    },
    {
      page: "/articles/mental-health-awareness",
      title: "Mental Health Awareness Guide",
      views: "2,634",
      avgTime: "5m 18s",
      bounceRate: "25%"
    },
    {
      page: "/articles/nutrition-basics",
      title: "Nutrition Basics for Healthy Living",
      views: "2,103",
      avgTime: "3m 47s",
      bounceRate: "35%"
    }
  ];

  const trafficSources = [
    { source: "Organic Search", visitors: "5,234", percentage: 62, color: "bg-blue-500" },
    { source: "Direct", visitors: "1,847", percentage: 22, color: "bg-green-500" },
    { source: "Social Media", visitors: "892", percentage: 11, color: "bg-purple-500" },
    { source: "Referrals", visitors: "448", percentage: 5, color: "bg-amber-500" }
  ];

  const deviceStats = [
    { device: "Desktop", users: "4,892", percentage: 58, icon: Monitor },
    { device: "Mobile", users: "2,847", percentage: 34, icon: Smartphone },
    { device: "Tablet", users: "682", percentage: 8, icon: Tablet }
  ];

  const recentPageViews = [
    {
      page: "Understanding Hypertension",
      views: 234,
      time: "2 hours ago",
      trend: "up",
      change: "+12%"
    },
    {
      page: "Diabetes Management Guide",
      views: 189,
      time: "3 hours ago",
      trend: "up",
      change: "+8%"
    },
    {
      page: "Heart Disease Prevention",
      views: 156,
      time: "4 hours ago",
      trend: "down",
      change: "-3%"
    },
    {
      page: "Mental Health Resources",
      views: 203,
      time: "5 hours ago",
      trend: "up",
      change: "+15%"
    }
  ];

  const geographicData = [
    { country: "United States", sessions: "3,247", percentage: 38.5 },
    { country: "United Kingdom", sessions: "1,892", percentage: 22.4 },
    { country: "Canada", sessions: "1,156", percentage: 13.7 },
    { country: "Australia", sessions: "847", percentage: 10.1 },
    { country: "Germany", sessions: "623", percentage: 7.4 },
    { country: "Other", sessions: "656", percentage: 7.9 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Content Performance Dashboard</h1>
        <p className="text-muted-foreground">Analyze your medical content engagement and user behavior</p>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="medical-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="w-4 h-4 mr-1 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 mr-1 text-red-600" />
                      )}
                      <span className={`text-sm ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">{stat.period}</span>
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
        {/* Top Performing Pages */}
        <Card className="medical-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Top Performing Pages</span>
              <Button variant="outline" size="sm">View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{page.title}</p>
                    <p className="text-xs text-muted-foreground truncate mb-2">{page.page}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {page.views} views
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {page.avgTime}
                      </span>
                      <span>Bounce: {page.bounceRate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className="medical-shadow">
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficSources.map((source, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{source.source}</span>
                    <span className="text-sm text-muted-foreground">{source.visitors} visitors</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`${source.color} h-2 rounded-full`} 
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    {source.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Analytics */}
        <Card className="medical-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Device Analytics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceStats.map((device, index) => {
                const Icon = device.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{device.device}</p>
                        <p className="text-xs text-muted-foreground">{device.percentage}% of users</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{device.users}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Real-time Activity */}
        <Card className="medical-shadow">
          <CardHeader>
            <CardTitle>Real-time Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPageViews.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.trend === 'up' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.page}</p>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <span>{activity.views} views</span>
                      <span className="mx-1">•</span>
                      <span>{activity.time}</span>
                      <span className="mx-1">•</span>
                      <span className={activity.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                        {activity.change}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card className="medical-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Geographic Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {geographicData.map((location, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">{location.country}</p>
                  <p className="text-xs text-muted-foreground">{location.percentage}%</p>
                </div>
                <span className="text-sm font-medium">{location.sessions}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
