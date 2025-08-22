import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Twitter, 
  Facebook, 
  Linkedin, 
  Instagram, 
  Youtube, 
  Github,
  MapPin,
  MessageCircle,
  Plus,
  UserPlus,
  Link as LinkIcon,
  Trash2
} from 'lucide-react';

const availablePlatforms = [
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Share photos & videos',
    icon: Instagram,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Professional networking',
    icon: Linkedin,
    color: 'bg-blue-700',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    description: 'Video content platform',
    icon: Youtube,
    color: 'bg-red-600',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    description: 'Short-form videos',
    icon: Github,
    color: 'bg-black',
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    description: 'Visual discovery',
    icon: MapPin,
    color: 'bg-red-500',
  },
  {
    id: 'reddit',
    name: 'Reddit',
    description: 'Community discussions',
    icon: MessageCircle,
    color: 'bg-orange-500',
  },
];

const platformIcons: Record<string, any> = {
  twitter: Twitter,
  facebook: Facebook,
  linkedin: Linkedin,
  instagram: Instagram,
  multi: UserPlus,
};

export default function ConnectSocials() {
  const [apiKey, setApiKey] = useState('');
  const [isSettingApiKey, setIsSettingApiKey] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: socialProfiles, isLoading } = useQuery({
    queryKey: ['/api/social-profiles'],
  });

  const createProfileMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/social-profiles');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Social profile created successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/social-profiles'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create social profile',
        variant: 'destructive',
      });
    },
  });

  const deleteProfileMutation = useMutation({
    mutationFn: async (profileId: string) => {
      await apiRequest('DELETE', `/api/social-profiles/${profileId}`);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Social profile disconnected successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/social-profiles'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to disconnect profile',
        variant: 'destructive',
      });
    },
  });

  const setApiKeyMutation = useMutation({
    mutationFn: async (key: string) => {
      const response = await apiRequest('PUT', '/api/user/ayrshare-key', { apiKey: key });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Ayrshare API key updated successfully!',
      });
      setIsSettingApiKey(false);
      setApiKey('');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update API key',
        variant: 'destructive',
      });
    },
  });

  const handleCreateProfile = () => {
    createProfileMutation.mutate();
  };

  const handleConnectAccounts = () => {
    // This would open the Ayrshare OAuth flow
    const ayrshareOAuthUrl = 'https://app.ayrshare.com/oauth';
    window.open(ayrshareOAuthUrl, '_blank', 'width=500,height=600');
    
    toast({
      title: 'OAuth Flow',
      description: 'Please complete the authentication process in the new window.',
    });
  };

  const handleDisconnectProfile = (profileId: string) => {
    deleteProfileMutation.mutate(profileId);
  };

  const handleSetApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid API key',
        variant: 'destructive',
      });
      return;
    }
    setApiKeyMutation.mutate(apiKey);
  };

  const connectedProfiles = Array.isArray(socialProfiles) ? socialProfiles : [];

  return (
    <MainLayout title="Connect Socials">
      <div className="space-y-8">
        {/* API Key Configuration */}
        <Card className="glass-morphism border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Ayrshare API Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            {!isSettingApiKey ? (
              <Button
                onClick={() => setIsSettingApiKey(true)}
                className="bg-indigo-600 hover:bg-indigo-700"
                data-testid="button-configure-api"
              >
                Configure API Key
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="apiKey" className="text-slate-300">
                    Ayrshare API Key
                  </Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Ayrshare API key"
                    className="bg-slate-700 border-slate-600 text-white"
                    data-testid="input-api-key"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSetApiKey}
                    disabled={setApiKeyMutation.isPending}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    data-testid="button-save-api-key"
                  >
                    {setApiKeyMutation.isPending ? 'Saving...' : 'Save API Key'}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsSettingApiKey(false);
                      setApiKey('');
                    }}
                    variant="outline"
                    className="border-slate-600 text-slate-300"
                    data-testid="button-cancel-api-key"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connection Status */}
        <div className="glass-morphism rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Connection Status</h3>
            <div className="text-sm text-slate-400">
              <span data-testid="text-connected-count">{Array.isArray(connectedProfiles) ? connectedProfiles.length : 0}</span> of 10 platforms connected
            </div>
          </div>

          {/* Connected Accounts */}
          {Array.isArray(connectedProfiles) && connectedProfiles.length > 0 && (
            <div className="mb-8">
              <h4 className="text-md font-medium text-white mb-4">Connected Accounts</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connectedProfiles.map((profile: any) => {
                  const Icon = platformIcons[profile.platform] || UserPlus;
                  
                  return (
                    <div 
                      key={profile.id}
                      className="flex items-center justify-between p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg"
                      data-testid={`connected-profile-${profile.id}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{profile.platform}</p>
                          <p className="text-sm text-emerald-400">
                            {profile.username || profile.displayName} • Connected
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDisconnectProfile(profile.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        data-testid={`button-disconnect-${profile.id}`}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Disconnect
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Available Platforms */}
          <div>
            <h4 className="text-md font-medium text-white mb-4">Available Platforms</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availablePlatforms.map((platform) => {
                const Icon = platform.icon;
                
                return (
                  <button
                    key={platform.id}
                    className="flex items-center justify-between p-4 bg-slate-800 border border-slate-600 rounded-lg hover:border-indigo-500 transition-colors duration-200 group"
                    data-testid={`platform-${platform.id}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${platform.color.startsWith('bg-') ? platform.color : `bg-gradient-to-r ${platform.color}`} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-white">{platform.name}</p>
                        <p className="text-sm text-slate-400">{platform.description}</p>
                      </div>
                    </div>
                    <Plus className="w-5 h-5 text-slate-400 group-hover:text-indigo-400" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Profile Management */}
          <div className="mt-8 pt-6 border-t border-slate-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleCreateProfile}
                disabled={createProfileMutation.isPending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                data-testid="button-create-profile"
              >
                <UserPlus className="w-4 h-4" />
                <span>
                  {createProfileMutation.isPending ? 'Creating...' : 'Create Social Profile'}
                </span>
              </Button>
              <Button 
                onClick={handleConnectAccounts}
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                data-testid="button-connect-accounts"
              >
                <LinkIcon className="w-4 h-4" />
                <span>Connect Accounts</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
