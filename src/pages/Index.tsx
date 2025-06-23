
import React, { useState } from 'react';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import Overview from '@/components/Dashboard/Overview';
import Dashboard2 from '@/components/Dashboard/Dashboard2';
import CreateWorkspace from '@/components/ContentCreation/CreateWorkspace';
import ReviewDashboard from '@/components/ContentReview/ReviewDashboard';
import ContentLibrary from '@/components/ContentLibrary/ContentLibrary';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Overview />;
      case 'dashboard2':
        return <Dashboard2 />;
      case 'create':
        return <CreateWorkspace />;
      case 'review':
        return <ReviewDashboard />;
      case 'library':
        return <ContentLibrary />;
      case 'schedule':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Marketing</h2>
            <p className="text-muted-foreground">Manage your content marketing and promotion strategies.</p>
          </div>
        );
      case 'archive':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Archive</h2>
            <p className="text-muted-foreground">View archived content.</p>
          </div>
        );
      case 'users':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">User Management</h2>
            <p className="text-muted-foreground">Manage team members and permissions.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Settings</h2>
            <p className="text-muted-foreground">Configure your medical portal settings.</p>
          </div>
        );
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
