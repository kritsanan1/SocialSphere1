import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  Edit,
  Trash2,
  Twitter,
  Facebook,
  Instagram,
  Linkedin
} from 'lucide-react';

interface ScheduledPost {
  id: string;
  content: string;
  platforms: string[];
  scheduledAt: string;
  status: string;
  createdAt: string;
}

const platformIcons: Record<string, any> = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
};

const platformColors: Record<string, string> = {
  twitter: 'bg-blue-500',
  facebook: 'bg-blue-600',
  instagram: 'bg-purple-500',
  linkedin: 'bg-blue-700',
};

export default function ContentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['/api/posts'],
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      await apiRequest('DELETE', `/api/posts/${postId}`);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Post deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete post',
        variant: 'destructive',
      });
    },
  });

  const scheduledPosts: ScheduledPost[] = Array.isArray(posts) ? posts.filter((post: any) => 
    post.status === 'scheduled' && post.scheduledAt
  ) : [];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getPostsForDate = (date: Date) => {
    return scheduledPosts.filter(post => 
      isSameDay(new Date(post.scheduledAt), date)
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDeletePost = (postId: string) => {
    deletePostMutation.mutate(postId);
  };

  const selectedDatePosts = selectedDate ? getPostsForDate(selectedDate) : [];

  return (
    <MainLayout title="Content Calendar">
      <div className="space-y-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
              data-testid="button-prev-month"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <h2 className="text-2xl font-bold text-white" data-testid="text-current-month">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
              data-testid="button-next-month"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <Button 
            className="bg-indigo-600 hover:bg-indigo-700"
            data-testid="button-schedule-post"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Post
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <Card className="glass-morphism border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  Schedule Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-slate-400">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {monthDays.map(day => {
                    const dayPosts = getPostsForDate(day);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isTodayDate = isToday(day);

                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(day)}
                        className={`
                          relative p-2 h-20 text-left rounded-lg transition-colors duration-200
                          ${isSelected ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700'}
                          ${!isCurrentMonth ? 'opacity-50' : ''}
                          ${isTodayDate ? 'ring-2 ring-indigo-500' : ''}
                        `}
                        data-testid={`calendar-day-${format(day, 'yyyy-MM-dd')}`}
                      >
                        <span className={`text-sm font-medium ${isSelected || isTodayDate ? 'text-white' : 'text-slate-300'}`}>
                          {format(day, 'd')}
                        </span>
                        
                        {dayPosts.length > 0 && (
                          <div className="mt-1 space-y-1">
                            {dayPosts.slice(0, 2).map((post, index) => (
                              <div
                                key={post.id}
                                className="w-full h-1 bg-indigo-400 rounded"
                                title={post.content.substring(0, 50) + '...'}
                              />
                            ))}
                            {dayPosts.length > 2 && (
                              <div className="text-xs text-indigo-300">
                                +{dayPosts.length - 2} more
                              </div>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Date Details */}
          <div className="space-y-6">
            <Card className="glass-morphism border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a Date'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <div className="space-y-4">
                    {selectedDatePosts.length === 0 ? (
                      <div className="text-center py-8" data-testid="empty-selected-date">
                        <CalendarIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-400">No posts scheduled for this date</p>
                        <Button 
                          size="sm" 
                          className="mt-3 bg-indigo-600 hover:bg-indigo-700"
                          data-testid="button-schedule-for-date"
                        >
                          Schedule Post
                        </Button>
                      </div>
                    ) : (
                      selectedDatePosts.map((post) => (
                        <div 
                          key={post.id}
                          className="p-4 bg-slate-800 rounded-lg border border-slate-600"
                          data-testid={`scheduled-post-${post.id}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-slate-400" />
                              <span className="text-sm text-slate-300">
                                {format(new Date(post.scheduledAt), 'h:mm a')}
                              </span>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 hover:text-white"
                                data-testid={`button-edit-${post.id}`}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeletePost(post.id)}
                                className="text-red-400 hover:text-red-300"
                                data-testid={`button-delete-${post.id}`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-white mb-3 line-clamp-3">
                            {post.content}
                          </p>
                          
                          <div className="flex flex-wrap gap-2">
                            {post.platforms.map((platform) => {
                              const Icon = platformIcons[platform] || CalendarIcon;
                              const color = platformColors[platform] || 'bg-slate-600';
                              
                              return (
                                <Badge
                                  key={platform}
                                  variant="secondary"
                                  className={`${color} text-white text-xs flex items-center space-x-1`}
                                >
                                  <Icon className="w-3 h-3" />
                                  <span>{platform}</span>
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8" data-testid="no-date-selected">
                    <CalendarIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400">Select a date to view scheduled posts</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="glass-morphism border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Scheduled Posts</span>
                    <span className="text-2xl font-bold text-white" data-testid="stat-scheduled-posts">
                      {scheduledPosts.length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">This Month</span>
                    <span className="text-2xl font-bold text-white" data-testid="stat-month-posts">
                      {scheduledPosts.filter(post => 
                        isSameMonth(new Date(post.scheduledAt), currentDate)
                      ).length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Today</span>
                    <span className="text-2xl font-bold text-white" data-testid="stat-today-posts">
                      {scheduledPosts.filter(post => 
                        isSameDay(new Date(post.scheduledAt), new Date())
                      ).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
