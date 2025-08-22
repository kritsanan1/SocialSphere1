import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DatabaseStorage } from '../../server/storage';

// Mock the database
vi.mock('../../server/db', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  },
}));

vi.mock('drizzle-orm', () => ({
  eq: vi.fn(),
  and: vi.fn(),
}));

describe('DatabaseStorage', () => {
  let storage: DatabaseStorage;

  beforeEach(() => {
    storage = new DatabaseStorage();
    vi.clearAllMocks();
  });

  describe('User operations', () => {
    it('should create a new user', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        firstName: 'Test',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { db } = await import('../../server/db');
      (db.insert as any).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockUser])
        })
      });

      const insertData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        firstName: 'Test',
        lastName: 'User',
      };

      const result = await storage.createUser(insertData);
      expect(result).toEqual(mockUser);
    });

    it('should get user by username', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        firstName: 'Test',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { db } = await import('../../server/db');
      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockUser])
        })
      });

      const result = await storage.getUserByUsername('testuser');
      expect(result).toEqual(mockUser);
    });

    it('should return undefined when user not found', async () => {
      const { db } = await import('../../server/db');
      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([])
        })
      });

      const result = await storage.getUserByUsername('nonexistent');
      expect(result).toBeUndefined();
    });
  });

  describe('Social Profile operations', () => {
    it('should create a social profile', async () => {
      const mockProfile = {
        id: '1',
        userId: 'user1',
        profileKey: 'profile1',
        platform: 'twitter',
        username: 'testuser',
        displayName: 'Test User',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { db } = await import('../../server/db');
      (db.insert as any).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockProfile])
        })
      });

      const insertData = {
        profileKey: 'profile1',
        platform: 'twitter',
        username: 'testuser',
        displayName: 'Test User',
      };

      const result = await storage.createSocialProfile({ ...insertData, userId: 'user1' });
      expect(result).toEqual(mockProfile);
    });

    it('should get social profiles by user ID', async () => {
      const mockProfiles = [
        {
          id: '1',
          userId: 'user1',
          profileKey: 'profile1',
          platform: 'twitter',
          username: 'testuser',
          displayName: 'Test User',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      const { db } = await import('../../server/db');
      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(mockProfiles)
        })
      });

      const result = await storage.getSocialProfiles('user1');
      expect(result).toEqual(mockProfiles);
    });
  });

  describe('Post operations', () => {
    it('should create a post', async () => {
      const mockPost = {
        id: '1',
        userId: 'user1',
        content: 'Test post content',
        platforms: ['twitter', 'facebook'],
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { db } = await import('../../server/db');
      (db.insert as any).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockPost])
        })
      });

      const insertData = {
        content: 'Test post content',
        platforms: ['twitter', 'facebook'],
        userId: 'user1',
      };

      const result = await storage.createPost(insertData);
      expect(result).toEqual(mockPost);
    });

    it('should get posts by user ID', async () => {
      const mockPosts = [
        {
          id: '1',
          userId: 'user1',
          content: 'Test post 1',
          platforms: ['twitter'],
          status: 'published',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          userId: 'user1',
          content: 'Test post 2',
          platforms: ['facebook'],
          status: 'draft',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      const { db } = await import('../../server/db');
      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue(mockPosts)
          })
        })
      });

      const result = await storage.getPosts('user1');
      expect(result).toEqual(mockPosts);
    });
  });
});