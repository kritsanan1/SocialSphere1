import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  MessageSquare,
  Reply,
  Heart,
  MoreHorizontal,
  Search,
  Filter,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  User,
  Send
} from 'lucide-react';

interface SocialComment {
  id: string;
  postId?: string;
  platform: string;
  commentId: string;
  socialPostId?: string;
  authorId: string;
  authorName: string;
  content: string;
  parentCommentId?: string;
  likes: number;
  isReply: boolean;
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

export default function SocialComments() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComment, setSelectedComment] = useState<SocialComment | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['/api/comments'],
  });

  const { data: posts } = useQuery({
    queryKey: ['/api/posts'],
  });

  const replyToCommentMutation = useMutation({
    mutationFn: async (replyData: any) => {
      const response = await apiRequest('POST', '/api/comments', replyData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Reply sent',
        description: 'Your reply has been posted successfully',
      });
      setReplyText('');
      setSelectedComment(null);
      queryClient.invalidateQueries({ queryKey: ['/api/comments'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to post reply',
        variant: 'destructive',
      });
    },
  });

  const socialComments: SocialComment[] = Array.isArray(comments) ? comments : [];

  // Filter comments
  const filteredComments = socialComments.filter(comment => {
    const matchesPlatform = selectedPlatform === 'all' || comment.platform === selectedPlatform;
    const matchesSearch = !searchQuery || 
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesPlatform && matchesSearch && !comment.isReply;
  });

  // Get replies for a comment
  const getReplies = (commentId: string) => {
    return socialComments.filter(comment => 
      comment.parentCommentId === commentId
    );
  };

  const handleReply = () => {
    if (!replyText.trim() || !selectedComment) return;

    replyToCommentMutation.mutate({
      platform: selectedComment.platform,
      socialPostId: selectedComment.socialPostId,
      parentCommentId: selectedComment.commentId,
      content: replyText,
      isReply: true,
    });
  };

  const toggleReplies = (commentId: string) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const getPostTitle = (postId?: string) => {
    if (!postId || !Array.isArray(posts)) return 'Unknown Post';
    const post = posts.find((p: any) => p.id === postId);
    return post ? post.content.substring(0, 50) + '...' : 'External Post';
  };

  return (
    <MainLayout title="Social Comments">
      <div className="space-y-6">
        {/* Filters and Search */}
        <Card className="glass-morphism border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Comment Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search comments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-600 text-white"
                  data-testid="input-search-comments"
                />
              </div>
              
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Filter by platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Comments List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="glass-morphism border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Comments ({filteredComments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  {filteredComments.length === 0 ? (
                    <div className="text-center py-12" data-testid="empty-comments">
                      <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">No Comments Found</h3>
                      <p className="text-slate-400">
                        Comments will appear here when people interact with your posts
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredComments.map((comment) => {
                        const Icon = platformIcons[comment.platform] || MessageSquare;
                        const platformColor = platformColors[comment.platform] || 'bg-slate-600';
                        const replies = getReplies(comment.commentId);
                        const showCommentReplies = showReplies[comment.id];
                        
                        return (
                          <div
                            key={comment.id}
                            className="p-4 bg-slate-800 rounded-lg border border-slate-600"
                            data-testid={`comment-${comment.id}`}
                          >
                            {/* Comment Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-medium text-white text-sm">
                                      {comment.authorName}
                                    </h4>
                                    <Badge
                                      variant="outline"
                                      className={`${platformColor} border-0 text-white text-xs flex items-center space-x-1`}
                                    >
                                      <Icon className="w-3 h-3" />
                                      <span>{comment.platform}</span>
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-slate-400">
                                    {new Date(comment.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 hover:text-white"
                                data-testid={`button-comment-options-${comment.id}`}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Post Context */}
                            {comment.postId && (
                              <div className="mb-3 p-2 bg-slate-700 rounded text-xs text-slate-300">
                                <strong>On post:</strong> {getPostTitle(comment.postId)}
                              </div>
                            )}

                            {/* Comment Content */}
                            <p className="text-white mb-3">{comment.content}</p>

                            {/* Comment Actions */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <button className="flex items-center space-x-1 text-slate-400 hover:text-red-400 transition-colors">
                                  <Heart className="w-4 h-4" />
                                  <span className="text-sm">{comment.likes}</span>
                                </button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedComment(comment)}
                                  className="text-slate-400 hover:text-white text-sm"
                                  data-testid={`button-reply-${comment.id}`}
                                >
                                  <Reply className="w-4 h-4 mr-1" />
                                  Reply
                                </Button>

                                {replies.length > 0 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleReplies(comment.id)}
                                    className="text-slate-400 hover:text-white text-sm"
                                    data-testid={`button-toggle-replies-${comment.id}`}
                                  >
                                    {showCommentReplies ? 'Hide' : 'Show'} {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                                  </Button>
                                )}
                              </div>
                            </div>

                            {/* Replies */}
                            {showCommentReplies && replies.length > 0 && (
                              <div className="mt-4 pl-6 border-l-2 border-slate-600 space-y-3">
                                {replies.map((reply) => (
                                  <div key={reply.id} className="p-3 bg-slate-700 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <div className="w-6 h-6 bg-slate-500 rounded-full flex items-center justify-center">
                                        <User className="w-3 h-3 text-white" />
                                      </div>
                                      <span className="font-medium text-white text-sm">
                                        {reply.authorName}
                                      </span>
                                      <span className="text-xs text-slate-400">
                                        {new Date(reply.createdAt).toLocaleString()}
                                      </span>
                                    </div>
                                    <p className="text-sm text-slate-200">{reply.content}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Reply Panel */}
          <div>
            <Card className="glass-morphism border-slate-700 sticky top-6">
              <CardHeader>
                <CardTitle className="text-white">
                  {selectedComment ? 'Reply to Comment' : 'Select a Comment'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedComment ? (
                  <div className="space-y-4">
                    {/* Original Comment */}
                    <div className="p-3 bg-slate-800 rounded-lg border-l-4 border-indigo-500">
                      <div className="flex items-center space-x-2 mb-2">
                        {(() => {
                          const Icon = platformIcons[selectedComment.platform] || MessageSquare;
                          return <Icon className="w-4 h-4 text-slate-400" />;
                        })()}
                        <span className="font-medium text-white text-sm">
                          {selectedComment.authorName}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 line-clamp-3">
                        {selectedComment.content}
                      </p>
                    </div>

                    {/* Reply Form */}
                    <div className="space-y-3">
                      <Textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply..."
                        className="bg-slate-800 border-slate-600 text-white resize-none"
                        rows={4}
                        data-testid="textarea-reply"
                      />
                      
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedComment(null);
                            setReplyText('');
                          }}
                          className="border-slate-600 text-slate-300"
                          data-testid="button-cancel-reply"
                        >
                          Cancel
                        </Button>
                        
                        <Button
                          onClick={handleReply}
                          disabled={!replyText.trim() || replyToCommentMutation.isPending}
                          className="bg-indigo-600 hover:bg-indigo-700"
                          data-testid="button-send-reply"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {replyToCommentMutation.isPending ? 'Sending...' : 'Send Reply'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8" data-testid="no-comment-selected">
                    <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400">
                      Select a comment from the list to reply
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
