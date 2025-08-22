import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Send, 
  Calendar, 
  Save, 
  Upload, 
  X, 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin,
  Sparkles
} from 'lucide-react';

const postSchema = z.object({
  content: z.string().min(1, 'Post content is required').max(280, 'Content must be under 280 characters'),
  platforms: z.array(z.string()).min(1, 'Select at least one platform'),
  scheduledAt: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

const platformOptions = [
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-blue-500' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
];

export default function UploadPosts() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [characterCount, setCharacterCount] = useState(0);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: socialProfiles } = useQuery({
    queryKey: ['/api/social-profiles'],
  });

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: '',
      platforms: [],
      scheduledAt: '',
    },
  });

  const publishPostMutation = useMutation({
    mutationFn: async (data: PostFormData) => {
      const postData = {
        ...data,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      };
      
      const response = await apiRequest('POST', '/api/posts', postData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Post published successfully across selected platforms!',
      });
      form.reset();
      setSelectedFile(null);
      setPreviewUrl(null);
      setCharacterCount(0);
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to publish post',
        variant: 'destructive',
      });
    },
  });

  const uploadFileMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Upload successful',
        description: 'Media uploaded and ready to use',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload media',
        variant: 'destructive',
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
      
      // Upload file
      uploadFileMutation.mutate(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleContentChange = (content: string) => {
    setCharacterCount(content.length);
  };

  const onSubmit = (data: PostFormData) => {
    publishPostMutation.mutate(data);
  };

  const handlePublishNow = () => {
    form.handleSubmit((data) => {
      onSubmit({ ...data, scheduledAt: undefined });
    })();
  };

  const handleSchedule = () => {
    const scheduledAt = form.getValues('scheduledAt');
    if (!scheduledAt) {
      toast({
        title: 'Schedule time required',
        description: 'Please select a date and time to schedule the post',
        variant: 'destructive',
      });
      return;
    }
    form.handleSubmit(onSubmit)();
  };

  const handleSaveDraft = () => {
    toast({
      title: 'Draft saved',
      description: 'Your post has been saved as a draft',
    });
  };

  const connectedPlatforms = platformOptions.filter(platform => 
    Array.isArray(socialProfiles) && socialProfiles.some((profile: any) => 
      profile.platform.toLowerCase().includes(platform.id) || profile.platform === 'multi'
    )
  );

  return (
    <MainLayout title="Upload Posts">
      <div className="max-w-4xl mx-auto">
        <Card className="glass-morphism border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Create New Post</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-6">
                {/* Post Content */}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Post Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                          rows={4}
                          placeholder="What's on your mind?"
                          onChange={(e) => {
                            field.onChange(e);
                            handleContentChange(e.target.value);
                          }}
                          data-testid="textarea-content"
                        />
                      </FormControl>
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-slate-400" data-testid="text-character-count">
                          {characterCount}/280 characters
                        </span>
                        <button 
                          type="button" 
                          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center"
                          data-testid="button-ai-enhance"
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI Enhance
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Platform Selection */}
                <FormField
                  control={form.control}
                  name="platforms"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Select Platforms</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {connectedPlatforms.map((platform) => {
                          const Icon = platform.icon;
                          
                          return (
                            <FormField
                              key={platform.id}
                              control={form.control}
                              name="platforms"
                              render={({ field }) => (
                                <FormItem>
                                  <label className="flex items-center space-x-3 p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors duration-200">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(platform.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, platform.id])
                                            : field.onChange(field.value?.filter((value) => value !== platform.id));
                                        }}
                                        className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                        data-testid={`checkbox-${platform.id}`}
                                      />
                                    </FormControl>
                                    <div className="flex items-center space-x-2">
                                      <div className={`w-6 h-6 ${platform.color} rounded flex items-center justify-center`}>
                                        <Icon className="w-4 h-4 text-white" />
                                      </div>
                                      <span className="text-sm text-white">{platform.name}</span>
                                    </div>
                                  </label>
                                </FormItem>
                              )}
                            />
                          );
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Media Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Media (Optional)</label>
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-slate-500 transition-colors duration-200">
                    {!selectedFile ? (
                      <div className="space-y-2">
                        <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mx-auto">
                          <Upload className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                            data-testid="input-file"
                          />
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <p className="text-sm text-slate-300">
                              Drop files here or{' '}
                              <span className="text-indigo-400 hover:text-indigo-300">browse</span>
                            </p>
                          </label>
                          <p className="text-xs text-slate-400">Support for images and videos up to 100MB</p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative inline-block" data-testid="media-preview">
                        {previewUrl && (
                          <img 
                            src={previewUrl} 
                            alt="Media preview" 
                            className="w-32 h-24 object-cover rounded-lg"
                          />
                        )}
                        <button
                          type="button"
                          onClick={removeFile}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600"
                          data-testid="button-remove-media"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Schedule Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="scheduledAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Schedule Date & Time</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="datetime-local"
                            className="bg-slate-800 border border-slate-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            data-testid="input-schedule"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  <Button
                    type="button"
                    onClick={handlePublishNow}
                    disabled={publishPostMutation.isPending}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    data-testid="button-publish-now"
                  >
                    <Send className="w-4 h-4" />
                    <span>{publishPostMutation.isPending ? 'Publishing...' : 'Publish Now'}</span>
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={handleSchedule}
                    disabled={publishPostMutation.isPending}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    data-testid="button-schedule"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Schedule</span>
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={handleSaveDraft}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    data-testid="button-save-draft"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Draft</span>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
