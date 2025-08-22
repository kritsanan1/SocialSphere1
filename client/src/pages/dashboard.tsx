import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { MainLayout } from '@/components/layout/main-layout';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ConnectedPlatforms } from '@/components/dashboard/connected-platforms';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/analytics'],
    enabled: true,
  });

  const { data: socialProfiles, isLoading: profilesLoading } = useQuery({
    queryKey: ['/api/social-profiles'],
    enabled: true,
  });

  const { data: recentPosts } = useQuery({
    queryKey: ['/api/posts'],
    enabled: true,
  });

  // Transform social profiles for connected platforms component
  const connectedPlatforms = Array.isArray(socialProfiles) ? socialProfiles.map((profile: any) => ({
    id: profile.id,
    platform: profile.platform,
    username: profile.username || '@username',
    displayName: profile.displayName || profile.username,
    followers: '0 followers', // This would come from analytics
    isActive: profile.isActive,
  })) : [];

  // Generate recent activity from posts and other actions
  const recentActivity = [
    {
      id: '1',
      type: 'success' as const,
      message: 'Post published successfully to Twitter and Facebook',
      timestamp: '2 minutes ago',
    },
    {
      id: '2',
      type: 'comment' as const,
      message: 'New comment on Instagram post',
      timestamp: '15 minutes ago',
    },
    {
      id: '3',
      type: 'scheduled' as const,
      message: 'Scheduled post for tomorrow at 2 PM',
      timestamp: '1 hour ago',
    },
  ];

  const handleConnectPlatforms = () => {
    setLocation('/connect-socials');
  };

  // Transform analytics data for StatsCards
  const statsData = analytics ? {
    totalPosts: analytics.totalPosts || 0,
    totalLikes: analytics.totalLikes || 0,
    totalShares: analytics.totalShares || 0,
    totalComments: analytics.totalComments || 0,
    totalFollowers: analytics.totalFollowers || 0,
    connectedAccounts: connectedPlatforms.length,
    totalViews: analytics.totalViews || '0'
  } : undefined;

  return (
    <MainLayout title="Social Dashboard">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
          <Button 
            onClick={() => setLocation('/upload-posts')} 
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto min-h-[44px] touch-manipulation font-medium"
          >
            Create Post
          </Button>
        </div>

        <StatsCards 
          stats={statsData} 
          loading={analyticsLoading} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <ConnectedPlatforms 
            platforms={connectedPlatforms}
            onConnect={handleConnectPlatforms}
          />

          <RecentActivity activities={recentActivity} />
        </div>

        <QuickActions />
      </div>
    </MainLayout>
  );
}