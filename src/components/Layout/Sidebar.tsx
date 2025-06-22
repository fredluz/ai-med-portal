
import React from 'react';
import { 
  FileText, 
  Edit3, 
  CheckCircle, 
  BarChart3, 
  Users, 
  Settings,
  Folder,
  Calendar,
  Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, badge: null },
    { id: 'create', label: 'Create Content', icon: Edit3, badge: null },
    { id: 'review', label: 'Review Queue', icon: CheckCircle, badge: '5' },
    { id: 'library', label: 'Content Library', icon: FileText, badge: null },
    { id: 'templates', label: 'Templates', icon: Folder, badge: null },
    { id: 'schedule', label: 'Publishing', icon: Calendar, badge: '2' },
    { id: 'archive', label: 'Archive', icon: Archive, badge: null },
    { id: 'users', label: 'User Management', icon: Users, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <aside className="w-64 bg-white border-r border-border/50 h-full flex flex-col medical-shadow">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Medical Content Hub</h2>
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={`w-full justify-start h-10 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="w-4 h-4 mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge 
                    variant={isActive ? "secondary" : "outline"} 
                    className="ml-auto text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-border/50">
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-foreground mb-2">Content Statistics</h3>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Published</span>
              <span className="font-medium">142</span>
            </div>
            <div className="flex justify-between">
              <span>In Review</span>
              <span className="font-medium">5</span>
            </div>
            <div className="flex justify-between">
              <span>Drafts</span>
              <span className="font-medium">12</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
