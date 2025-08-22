import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { MainLayout } from '@/components/layout/main-layout';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ConnectedPlatforms } from '@/components/dashboard/connected-platforms';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { QuickActions } from '@/components/dashboard/quick-actions';

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

  return (
    <MainLayout title="Social Dashboard">
      <div className="space-y-8">
        <StatsCards 
          stats={analytics?.analytics || {}} 
          loading={analyticsLoading} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
