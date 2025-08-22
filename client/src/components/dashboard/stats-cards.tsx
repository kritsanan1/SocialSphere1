import { Users, FileText, Link, Eye } from 'lucide-react';

interface StatsData {
  totalFollowers?: number;
  totalPosts?: number;
  connectedAccounts?: number;
  totalViews?: string;
  totalLikes?: number;
  totalShares?: number;
  totalComments?: number;
}

interface StatsCardsProps {
  stats?: StatsData;
  loading?: boolean;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  const defaultStats = {
    totalFollowers: 0,
    totalPosts: 0,
    connectedAccounts: 0,
    totalViews: '0',
    totalLikes: 0,
    totalShares: 0,
    totalComments: 0
  };

  const data = { ...defaultStats, ...stats };

  const cards = [
    {
      title: 'Total Posts',
      value: loading ? 'Loading...' : (data.totalPosts || 0).toLocaleString(),
      change: '+12 this week',
      icon: FileText,
      gradient: 'from-purple-500 to-pink-600',
      testId: 'stat-posts'
    },
    {
      title: 'Total Likes',
      value: loading ? 'Loading...' : (data.totalLikes || 0).toLocaleString(),
      change: '+5.2% from last month',
      icon: Users,
      gradient: 'from-blue-500 to-indigo-600',
      testId: 'stat-likes'
    },
    {
      title: 'Total Shares',
      value: loading ? 'Loading...' : (data.totalShares || 0).toLocaleString(),
      change: 'across platforms',
      icon: Link,
      gradient: 'from-emerald-500 to-teal-600',
      testId: 'stat-shares'
    },
    {
      title: 'Total Comments',
      value: loading ? 'Loading...' : (data.totalComments || 0).toLocaleString(),
      change: '+18.3% engagement',
      icon: Eye,
      gradient: 'from-orange-500 to-red-600',
      testId: 'stat-comments'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div 
            key={card.title}
            className="glass-morphism rounded-xl p-4 sm:p-6 hover:scale-105 transition-transform duration-200 min-h-[120px] touch-manipulation"
            data-testid={card.testId}
          >
            <div className="flex items-center justify-between h-full">
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium text-slate-400 mb-2">{card.title}</p>
                <p className="text-2xl sm:text-3xl font-bold text-white mb-1 break-words" data-testid={card.testId === 'stat-posts' ? 'text-total-posts' : card.testId === 'stat-likes' ? 'text-total-likes' : card.testId === 'stat-shares' ? 'text-total-shares' : 'text-total-comments'}>
                  {card.value}
                </p>
                <p className="text-xs sm:text-sm text-emerald-400">{card.change}</p>
              </div>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${card.gradient} rounded-lg flex items-center justify-center ml-3 flex-shrink-0`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
