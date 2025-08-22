import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Test the validation schemas
describe('Validation Schemas', () => {
  describe('User registration validation', () => {
    const userSchema = z.object({
      username: z.string().min(3).max(20),
      email: z.string().email(),
      password: z.string().min(6),
      firstName: z.string().min(1),
      lastName: z.string().min(1),
    });

    it('should validate correct user data', () => {
      const validUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      const result = userSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidUser = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject short username', () => {
      const invalidUser = {
        username: 'ab', // too short
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const invalidUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: '123', // too short
        firstName: 'Test',
        lastName: 'User',
      };

      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });
  });

  describe('Post validation', () => {
    const postSchema = z.object({
      content: z.string().min(1).max(2000),
      platforms: z.array(z.string()).min(1),
      mediaUrls: z.array(z.string().url()).optional(),
      scheduledAt: z.date().optional(),
    });

    it('should validate correct post data', () => {
      const validPost = {
        content: 'This is a test post',
        platforms: ['twitter', 'facebook'],
        mediaUrls: ['https://example.com/image.jpg'],
        scheduledAt: new Date('2024-12-31T10:00:00Z'),
      };

      const result = postSchema.safeParse(validPost);
      expect(result.success).toBe(true);
    });

    it('should reject empty content', () => {
      const invalidPost = {
        content: '', // empty content
        platforms: ['twitter'],
      };

      const result = postSchema.safeParse(invalidPost);
      expect(result.success).toBe(false);
    });

    it('should reject empty platforms array', () => {
      const invalidPost = {
        content: 'Test post',
        platforms: [], // no platforms
      };

      const result = postSchema.safeParse(invalidPost);
      expect(result.success).toBe(false);
    });

    it('should reject invalid media URLs', () => {
      const invalidPost = {
        content: 'Test post',
        platforms: ['twitter'],
        mediaUrls: ['not-a-url'], // invalid URL
      };

      const result = postSchema.safeParse(invalidPost);
      expect(result.success).toBe(false);
    });
  });

  describe('Login validation', () => {
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string().min(1),
    });

    it('should validate correct login data', () => {
      const validLogin = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = loginSchema.safeParse(validLogin);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalidLogin = {
        email: 'invalid-email',
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidLogin);
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const invalidLogin = {
        email: 'test@example.com',
        password: '',
      };

      const result = loginSchema.safeParse(invalidLogin);
      expect(result.success).toBe(false);
    });
  });
});