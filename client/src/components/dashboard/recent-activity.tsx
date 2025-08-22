import { Check, MessageCircle, Calendar, AlertTriangle, TrendingUp } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'success' | 'comment' | 'scheduled' | 'warning' | 'analytics';
  message: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const activityIcons = {
  success: Check,
  comment: MessageCircle,
  scheduled: Calendar,
  warning: AlertTriangle,
  analytics: TrendingUp,
};

const activityColors = {
  success: 'bg-emerald-500',
  comment: 'bg-blue-500',
  scheduled: 'bg-purple-500',
  warning: 'bg-amber-500',
  analytics: 'bg-emerald-500',
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="glass-morphism rounded-xl p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Recent Activity</h3>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8" data-testid="empty-activity">
            <p className="text-slate-400">No recent activity</p>
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = activityIcons[activity.type];
            const colorClass = activityColors[activity.type];

            return (
              <div 
                key={activity.id}
                className="flex items-start space-x-3 p-3 hover:bg-slate-800 rounded-lg transition-colors duration-200"
                data-testid={`activity-${activity.type}`}
              >
                <div className={`w-8 h-8 ${colorClass} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">{activity.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{activity.timestamp}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}