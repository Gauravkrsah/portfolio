
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, FilePenLine, FileVideo, Code, Briefcase, Mail, CalendarClock, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/lib/services/supabaseService';

interface StatsCardProps {
  title: string;
  value: number | React.ReactNode;
  description: string;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description, icon }) => (
  <Card className="overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground pt-1">{description}</p>
    </CardContent>
  </Card>
);

const DashboardOverview: React.FC = () => {
  // Fetch dashboard stats from Supabase
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats
  });
  
  // Loading state for stats
  const loadingIndicator = <Loader2 className="h-4 w-4 animate-spin" />;
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your website content and statistics
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Projects"
          value={isLoading ? loadingIndicator : stats?.projects || 0}
          description="Total projects in your portfolio"
          icon={<Code className="h-4 w-4" />}
        />
        <StatsCard
          title="Blog Posts"
          value={isLoading ? loadingIndicator : stats?.blogPosts || 0}
          description="Published articles and tutorials"
          icon={<FilePenLine className="h-4 w-4" />}
        />
        <StatsCard
          title="Videos"
          value={isLoading ? loadingIndicator : stats?.videos || 0}
          description="Video content and tutorials"
          icon={<FileVideo className="h-4 w-4" />}
        />
        <StatsCard
          title="Other Works"
          value={isLoading ? loadingIndicator : stats?.otherWorks || 0}
          description="Designs, consultations, and more"
          icon={<Briefcase className="h-4 w-4" />}
        />
        <StatsCard
          title="Messages"
          value={isLoading ? loadingIndicator : stats?.messages || 0}
          description="Contact form submissions"
          icon={<Mail className="h-4 w-4" />}
        />
        <StatsCard
          title="Scheduled Calls"
          value={isLoading ? loadingIndicator : stats?.meetings || 0}
          description="Upcoming client meetings"
          icon={<CalendarClock className="h-4 w-4" />}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
          <CardDescription>
            Website traffic and engagement over time
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <BarChart3 className="h-16 w-16 text-gray-300 dark:text-gray-600" />
            <p className="mt-4 text-sm text-muted-foreground">
              Analytics data will be displayed here once connected to your analytics service.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
