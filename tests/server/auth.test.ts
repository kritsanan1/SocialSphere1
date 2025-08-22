import { describe, it, expect, beforeEach, vi } from 'vitest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock bcrypt and jwt
vi.mock('bcrypt');
vi.mock('jsonwebtoken');

describe('Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Password hashing', () => {
    it('should hash passwords correctly', async () => {
      const mockHash = 'hashedpassword123';
      const password = 'plainpassword';

      vi.mocked(bcrypt.hash).mockResolvedValue(mockHash as never);

      const hashedPassword = await bcrypt.hash(password, 10);
      expect(hashedPassword).toBe(mockHash);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });

    it('should compare passwords correctly', async () => {
      const password = 'plainpassword';
      const hashedPassword = 'hashedpassword123';

      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

      const isValid = await bcrypt.compare(password, hashedPassword);
      expect(isValid).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('should return false for incorrect passwords', async () => {
      const password = 'wrongpassword';
      const hashedPassword = 'hashedpassword123';

      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      const isValid = await bcrypt.compare(password, hashedPassword);
      expect(isValid).toBe(false);
    });
  });

  describe('JWT tokens', () => {
    it('should generate valid JWT tokens', () => {
      const mockToken = 'jwt.token.here';
      const payload = { userId: '123', email: 'test@example.com' };
      const secret = 'test-secret';

      vi.mocked(jwt.sign).mockReturnValue(mockToken as never);

      const token = jwt.sign(payload, secret, { expiresIn: '24h' });
      expect(token).toBe(mockToken);
      expect(jwt.sign).toHaveBeenCalledWith(payload, secret, { expiresIn: '24h' });
    });

    it('should verify JWT tokens correctly', () => {
      const mockPayload = { userId: '123', email: 'test@example.com' };
      const token = 'jwt.token.here';
      const secret = 'test-secret';

      vi.mocked(jwt.verify).mockReturnValue(mockPayload as never);

      const decoded = jwt.verify(token, secret);
      expect(decoded).toEqual(mockPayload);
      expect(jwt.verify).toHaveBeenCalledWith(token, secret);
    });

    it('should throw error for invalid tokens', () => {
      const token = 'invalid.token';
      const secret = 'test-secret';

      vi.mocked(jwt.verify).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => jwt.verify(token, secret)).toThrow('Invalid token');
    });
  });
});