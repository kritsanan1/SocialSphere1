interface AyrshareConfig {
  apiKey: string;
  profileKey?: string;
}

interface PostRequest {
  post: string;
  platforms: string[];
  mediaUrls?: string[];
  scheduleDate?: string;
  profileKey?: string;
}

interface PostResponse {
  status: string;
  id: string;
  postIds: Record<string, string>;
  errors?: any[];
}

interface AnalyticsResponse {
  status: string;
  analytics: {
    totalFollowers: number;
    totalPosts: number;
    totalViews: number;
    engagement: number;
    platforms: Record<string, any>;
  };
}

interface SocialProfileResponse {
  status: string;
  profileKey: string;
  userId: string;
}

export class AyrshareService {
  private baseUrl = 'https://api.ayrshare.com/api';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}, profileKey?: string) {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (profileKey) {
      headers['Profile-Key'] = profileKey;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ayrshare API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async createPost(postData: PostRequest): Promise<PostResponse> {
    return this.makeRequest('/post', {
      method: 'POST',
      body: JSON.stringify(postData),
    }, postData.profileKey);
  }

  async deletePost(postId: string, profileKey?: string): Promise<any> {
    return this.makeRequest('/delete', {
      method: 'DELETE',
      body: JSON.stringify({ id: postId }),
    }, profileKey);
  }

  async getAnalytics(profileKey?: string): Promise<AnalyticsResponse> {
    return this.makeRequest('/analytics', {
      method: 'GET',
    }, profileKey);
  }

  async getHistory(profileKey?: string): Promise<any> {
    return this.makeRequest('/history', {
      method: 'GET',
    }, profileKey);
  }

  async createSocialProfile(): Promise<SocialProfileResponse> {
    return this.makeRequest('/profiles/profile', {
      method: 'POST',
    });
  }

  async deleteSocialProfile(profileKey: string): Promise<any> {
    return this.makeRequest('/profiles/profile', {
      method: 'DELETE',
      body: JSON.stringify({ profileKey }),
    });
  }

  async uploadMedia(file: Buffer, fileName: string, profileKey?: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', new Blob([file]), fileName);

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
    };

    if (profileKey) {
      headers['Profile-Key'] = profileKey;
    }

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ayrshare Upload Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async getMessages(profileKey?: string): Promise<any> {
    return this.makeRequest('/messages', {
      method: 'GET',
    }, profileKey);
  }

  async sendMessage(messageData: any, profileKey?: string): Promise<any> {
    return this.makeRequest('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    }, profileKey);
  }

  async getComments(postId?: string, profileKey?: string): Promise<any> {
    const endpoint = postId ? `/comments?id=${postId}` : '/comments';
    return this.makeRequest(endpoint, {
      method: 'GET',
    }, profileKey);
  }

  async postComment(commentData: any, profileKey?: string): Promise<any> {
    return this.makeRequest('/comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    }, profileKey);
  }
}

export const createAyrshareService = (apiKey: string) => {
  return new AyrshareService(apiKey);
};
