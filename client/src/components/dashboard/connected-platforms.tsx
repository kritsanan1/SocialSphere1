import { Twitter, Facebook, Linkedin, Instagram, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConnectedPlatform {
  id: string;
  platform: string;
  username: string;
  displayName: string;
  followers: string;
  isActive: boolean;
}

interface ConnectedPlatformsProps {
  platforms: ConnectedPlatform[];
  onConnect: () => void;
}

const platformIcons: Record<string, any> = {
  twitter: Twitter,
  facebook: Facebook,
  linkedin: Linkedin,
  instagram: Instagram,
};

const platformColors: Record<string, string> = {
  twitter: 'bg-blue-500',
  facebook: 'bg-blue-600',
  linkedin: 'bg-blue-700',
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
};

export function ConnectedPlatforms({ platforms, onConnect }: ConnectedPlatformsProps) {
  return (
    <div className="glass-morphism rounded-xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <h3 className="text-lg sm:text-xl font-semibold text-white">Connected Platforms</h3>
        <button
          onClick={onConnect}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium min-h-[44px] px-3 py-2 touch-manipulation self-start"
        >
          Connect More
        </button>
      </div>

      <div className="space-y-4">
        {platforms.length === 0 ? (
          <div className="text-center py-8" data-testid="empty-platforms">
            <p className="text-slate-400 mb-4">No connected platforms yet</p>
            <Button 
              onClick={onConnect}
              className="bg-indigo-600 hover:bg-indigo-700"
              data-testid="button-connect-first"
            >
              Connect Your First Platform
            </Button>
          </div>
        ) : (
          platforms.map((platform) => {
            const Icon = platformIcons[platform.platform.toLowerCase()] || Twitter;
            const colorClass = platformColors[platform.platform.toLowerCase()] || 'bg-blue-500';

            return (
              <div 
                key={platform.id}
                className="flex items-center justify-between p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-200"
                data-testid={`platform-${platform.platform.toLowerCase()}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{platform.platform}</p>
                    <p className="text-sm text-slate-400">{platform.username}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-emerald-400">
                    {platform.isActive ? 'Active' : 'Inactive'}
                  </p>
                  <p className="text-xs text-slate-400">{platform.followers}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Button 
        onClick={onConnect}
        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
        data-testid="button-connect-platform"
      >
        <Plus className="w-4 h-4" />
        <span>Connect New Platform</span>
      </Button>
    </div>
  );
}