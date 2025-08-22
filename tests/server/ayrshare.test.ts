import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AyrshareService } from '../../server/services/ayrshare';

// Mock fetch
global.fetch = vi.fn();

describe('AyrshareService', () => {
  let service: AyrshareService;
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    service = new AyrshareService(mockApiKey);
    vi.clearAllMocks();
  });

  describe('createPost', () => {
    it('should create a post successfully', async () => {
      const mockResponse = {
        id: 'post123',
        status: 'success',
        platforms: ['twitter', 'facebook']
      };

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const postData = {
        post: 'Test post content',
        platforms: ['twitter', 'facebook'],
        mediaUrls: [],
      };

      const result = await service.createPost(postData);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://app.ayrshare.com/api/post',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockApiKey}`,
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(postData),
        })
      );
    });

    it('should handle API errors', async () => {
      const mockError = { error: 'Invalid API key' };

      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve(mockError),
      } as Response);

      const postData = {
        post: 'Test post content',
        platforms: ['twitter'],
        mediaUrls: [],
      };

      await expect(service.createPost(postData)).rejects.toThrow('Invalid API key');
    });

    it('should include schedule date when provided', async () => {
      const mockResponse = { id: 'post123', status: 'scheduled' };

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const scheduleDate = new Date().toISOString();
      const postData = {
        post: 'Scheduled post',
        platforms: ['twitter'],
        mediaUrls: [],
        scheduleDate,
      };

      await service.createPost(postData);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://app.ayrshare.com/api/post',
        expect.objectContaining({
          body: JSON.stringify(postData),
        })
      );
    });
  });

  describe('getProfiles', () => {
    it('should get user profiles successfully', async () => {
      const mockProfiles = [
        { platform: 'twitter', username: 'testuser' },
        { platform: 'facebook', username: 'Test User' }
      ];

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockProfiles),
      } as Response);

      const result = await service.getProfiles();

      expect(result).toEqual(mockProfiles);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://app.ayrshare.com/api/profiles',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockApiKey}`,
          }),
        })
      );
    });
  });

  describe('getAnalytics', () => {
    it('should get analytics data successfully', async () => {
      const mockAnalytics = {
        totalPosts: 50,
        totalLikes: 1250,
        totalShares: 300,
        totalComments: 180,
        platforms: {
          twitter: { posts: 25, likes: 600 },
          facebook: { posts: 25, likes: 650 }
        }
      };

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockAnalytics),
      } as Response);

      const result = await service.getAnalytics();

      expect(result).toEqual(mockAnalytics);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://app.ayrshare.com/api/analytics',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockApiKey}`,
          }),
        })
      );
    });
  });

  describe('deletePost', () => {
    it('should delete a post successfully', async () => {
      const mockResponse = { status: 'success', message: 'Post deleted' };

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const postId = 'post123';
      const result = await service.deletePost(postId);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `https://app.ayrshare.com/api/delete/${postId}`,
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockApiKey}`,
          }),
        })
      );
    });
  });
});