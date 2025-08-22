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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div 
            key={card.title}
            className="glass-morphism rounded-xl p-6 hover:scale-105 transition-transform duration-200"
            data-testid={card.testId}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">{card.title}</p>
                <p className="text-3xl font-bold text-white mt-2" data-testid={card.testId === 'stat-posts' ? 'text-total-posts' : card.testId === 'stat-likes' ? 'text-total-likes' : card.testId === 'stat-shares' ? 'text-total-shares' : 'text-total-comments'}>
                  {card.value}
                </p>
                <p className="text-sm text-emerald-400 mt-1">{card.change}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${card.gradient} rounded-lg flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
