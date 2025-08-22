import { Upload, CalendarPlus, BarChart3, Link } from 'lucide-react';
import { useLocation } from 'wouter';

const actions = [
  {
    title: 'Create Post',
    description: 'Publish content across all your connected social media platforms',
    icon: Upload,
    gradient: 'from-blue-500 to-indigo-600',
    href: '/upload-posts',
    testId: 'action-create-post'
  },
  {
    title: 'Schedule Content',
    description: 'Plan and schedule your social media content in advance',
    icon: CalendarPlus,
    gradient: 'from-purple-500 to-pink-600',
    href: '/content-calendar',
    testId: 'action-schedule-content'
  },
  {
    title: 'View Analytics',
    description: 'Track performance and engagement across all platforms',
    icon: BarChart3,
    gradient: 'from-emerald-500 to-teal-600',
    href: '/analytics',
    testId: 'action-view-analytics'
  },
  {
    title: 'Connect Accounts',
    description: 'Link new social media accounts to your dashboard',
    icon: Link,
    gradient: 'from-orange-500 to-red-600',
    href: '/connect-socials',
    testId: 'action-connect-accounts'
  },
];

export function QuickActions() {
  const [, setLocation] = useLocation();

  return (
    <div className="mt-6 sm:mt-8">
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          
          return (
            <button
              key={action.title}
              onClick={() => setLocation(action.href)}
              className="glass-morphism rounded-xl p-4 sm:p-6 hover:scale-105 transition-all duration-200 group text-left min-h-[120px] touch-manipulation"
              data-testid={action.testId}
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${action.gradient} rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">{action.title}</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{action.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
