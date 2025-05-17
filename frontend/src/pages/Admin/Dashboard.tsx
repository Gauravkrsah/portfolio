
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProjectsManagement from '@/components/admin/ProjectsManagement';
import BlogsManagement from '@/components/admin/BlogsManagement';
import MessagesManagement from '@/components/admin/MessagesManagement';
import VideosManagement from '@/components/admin/VideosManagement';
import MeetingsManagement from '@/components/admin/MeetingsManagement';
import SettingsManagement from '@/components/admin/SettingsManagement';
import DashboardOverview from '@/components/admin/DashboardOverview';
import SubscribersManagement from '@/components/admin/SubscribersManagement';
import ToolsManagement from '@/components/admin/ToolsManagement';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <DashboardLayout
      header={
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span>Admin User</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      }
      sidebar={
        <div className="w-full h-full flex flex-col">
          <Tabs
            defaultValue="overview"
            orientation="vertical"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full h-full flex flex-col"
          >
            <TabsList className="flex flex-col h-full justify-start bg-transparent border-r w-full rounded-none">
              <TabsTrigger
                value="overview"
                className="justify-start px-4 py-2 data-[state=active]:bg-muted w-full rounded-none border-l-2 border-transparent data-[state=active]:border-primary"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="justify-start px-4 py-2 data-[state=active]:bg-muted w-full rounded-none border-l-2 border-transparent data-[state=active]:border-primary"
              >
                Projects
              </TabsTrigger>
              <TabsTrigger
                value="blogs"
                className="justify-start px-4 py-2 data-[state=active]:bg-muted w-full rounded-none border-l-2 border-transparent data-[state=active]:border-primary"
              >
                Blog Posts
              </TabsTrigger>              <TabsTrigger
                value="videos"
                className="justify-start px-4 py-2 data-[state=active]:bg-muted w-full rounded-none border-l-2 border-transparent data-[state=active]:border-primary"
              >
                Contents
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                className="justify-start px-4 py-2 data-[state=active]:bg-muted w-full rounded-none border-l-2 border-transparent data-[state=active]:border-primary"
              >
                Messages
              </TabsTrigger>
              <TabsTrigger
                value="meetings"
                className="justify-start px-4 py-2 data-[state=active]:bg-muted w-full rounded-none border-l-2 border-transparent data-[state=active]:border-primary"
              >
                Schedule
              </TabsTrigger>
              <TabsTrigger
                value="subscribers"
                className="justify-start px-4 py-2 data-[state=active]:bg-muted w-full rounded-none border-l-2 border-transparent data-[state=active]:border-primary"
              >
                Subscribers
              </TabsTrigger>
              <TabsTrigger
                value="tools"
                className="justify-start px-4 py-2 data-[state=active]:bg-muted w-full rounded-none border-l-2 border-transparent data-[state=active]:border-primary"
              >
                Tools
              </TabsTrigger>
              <Separator className="my-2" />
              <TabsTrigger
                value="settings"
                className="justify-start px-4 py-2 data-[state=active]:bg-muted w-full rounded-none border-l-2 border-transparent data-[state=active]:border-primary"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <div className="p-4 mt-auto border-t text-xs text-muted-foreground">
              <p>Portfolio Admin v1.0.0</p>
            </div>
          </Tabs>
        </div>
      }
    >
      <div className="p-4 md:p-6 w-full min-h-screen bg-background">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="overview" className="mt-0 border-0 p-0">
            <DashboardOverview />
          </TabsContent>
          <TabsContent value="projects" className="mt-0 border-0 p-0">
            <ProjectsManagement />
          </TabsContent>
          <TabsContent value="blogs" className="mt-0 border-0 p-0">
            <BlogsManagement />
          </TabsContent>          <TabsContent value="videos" className="mt-0 border-0 p-0">
            <VideosManagement />
          </TabsContent>
          <TabsContent value="messages" className="mt-0 border-0 p-0">
            <MessagesManagement />
          </TabsContent>
          <TabsContent value="meetings" className="mt-0 border-0 p-0">
            <MeetingsManagement />
          </TabsContent>
          <TabsContent value="subscribers" className="mt-0 border-0 p-0">
            <SubscribersManagement />
          </TabsContent>
          <TabsContent value="tools" className="mt-0 border-0 p-0">
            <ToolsManagement />
          </TabsContent>
          <TabsContent value="settings" className="mt-0 border-0 p-0">
            <SettingsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
