import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  MessageCircle,
  Send,
  Filter,
  Search,
  Twitter,
  Facebook,
  Instagram,
  User,
  Reply,
  MoreHorizontal
} from 'lucide-react';

interface SocialMessage {
  id: string;
  platform: string;
  messageId: string;
  conversationId?: string;
  senderId: string;
  recipientId?: string;
  content: string;
  messageType: string;
  isIncoming: boolean;
  readAt?: string;
  createdAt: string;
}

const platformIcons: Record<string, any> = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
};

const platformColors: Record<string, string> = {
  twitter: 'bg-blue-500',
  facebook: 'bg-blue-600',
  instagram: 'bg-purple-500',
};

export default function SocialMessages() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: selectedPlatform === 'all' ? ['/api/messages'] : ['/api/messages', selectedPlatform],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: any) => {
      const response = await apiRequest('POST', '/api/messages', messageData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Message sent',
        description: 'Your message has been sent successfully',
      });
      setReplyText('');
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message',
        variant: 'destructive',
      });
    },
  });

  const socialMessages: SocialMessage[] = Array.isArray(messages) ? messages : [];

  // Group messages by conversation
  const conversations = socialMessages.reduce((acc, message) => {
    const key = message.conversationId || `${message.platform}-${message.senderId}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(message);
    return acc;
  }, {} as Record<string, SocialMessage[]>);

  // Filter conversations based on search
  const filteredConversations = Object.entries(conversations).filter(([, messages]) => {
    if (searchQuery) {
      return messages.some(msg => 
        msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.senderId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedConversation) return;

    const conversationMessages = conversations[selectedConversation];
    if (!conversationMessages?.length) return;

    const lastMessage = conversationMessages[conversationMessages.length - 1];
    
    sendMessageMutation.mutate({
      platform: lastMessage.platform,
      conversationId: selectedConversation,
      recipientId: lastMessage.senderId,
      content: replyText,
      messageType: 'text',
      isIncoming: false,
    });
  };

  const selectedMessages = selectedConversation ? conversations[selectedConversation] || [] : [];

  return (
    <MainLayout title="Social Messages">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="glass-morphism border-slate-700 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Conversations
              </CardTitle>
              
              {/* Filters */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-600 text-white"
                    data-testid="input-search-conversations"
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
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {filteredConversations.length === 0 ? (
                  <div className="p-6 text-center" data-testid="empty-conversations">
                    <MessageCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400">No conversations found</p>
                  </div>
                ) : (
                  <div className="space-y-1 p-4">
                    {filteredConversations.map(([conversationId, messages]) => {
                      const lastMessage = messages[messages.length - 1];
                      const unreadCount = messages.filter(msg => msg.isIncoming && !msg.readAt).length;
                      const Icon = platformIcons[lastMessage.platform] || MessageCircle;
                      const isSelected = selectedConversation === conversationId;
                      
                      return (
                        <button
                          key={conversationId}
                          onClick={() => setSelectedConversation(conversationId)}
                          className={`
                            w-full p-3 rounded-lg text-left transition-colors duration-200
                            ${isSelected ? 'bg-indigo-600' : 'hover:bg-slate-700'}
                          `}
                          data-testid={`conversation-${conversationId}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Icon className="w-4 h-4 text-white" />
                              <span className="font-medium text-white text-sm">
                                {lastMessage.senderId}
                              </span>
                            </div>
                            {unreadCount > 0 && (
                              <Badge variant="secondary" className="bg-indigo-600 text-white text-xs">
                                {unreadCount}
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-slate-300 line-clamp-2 mb-1">
                            {lastMessage.content}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <Badge
                              variant="outline"
                              className="text-xs border-slate-600 text-slate-400"
                            >
                              {lastMessage.platform}
                            </Badge>
                            <span className="text-xs text-slate-400">
                              {new Date(lastMessage.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Message Thread */}
        <div className="lg:col-span-2">
          <Card className="glass-morphism border-slate-700 h-full flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {selectedMessages.length > 0 && (
                        <>
                          {(() => {
                            const Icon = platformIcons[selectedMessages[0].platform] || MessageCircle;
                            return <Icon className="w-5 h-5 text-white" />;
                          })()}
                          <div>
                            <h3 className="font-semibold text-white">
                              {selectedMessages[0].senderId}
                            </h3>
                            <p className="text-sm text-slate-400 capitalize">
                              {selectedMessages[0].platform}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-white"
                      data-testid="button-conversation-options"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 p-0 flex flex-col">
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {selectedMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isIncoming ? 'justify-start' : 'justify-end'}`}
                          data-testid={`message-${message.id}`}
                        >
                          <div
                            className={`
                              max-w-[70%] p-3 rounded-lg
                              ${message.isIncoming 
                                ? 'bg-slate-700 text-white' 
                                : 'bg-indigo-600 text-white'
                              }
                            `}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Reply Input */}
                  <div className="border-t border-slate-700 p-4">
                    <div className="flex space-x-2">
                      <Input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply..."
                        className="flex-1 bg-slate-800 border-slate-600 text-white"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendReply();
                          }
                        }}
                        data-testid="input-reply"
                      />
                      <Button
                        onClick={handleSendReply}
                        disabled={!replyText.trim() || sendMessageMutation.isPending}
                        className="bg-indigo-600 hover:bg-indigo-700"
                        data-testid="button-send-reply"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center" data-testid="no-conversation-selected">
                  <MessageCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No Conversation Selected</h3>
                  <p className="text-slate-400">
                    Choose a conversation from the left to start messaging
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
