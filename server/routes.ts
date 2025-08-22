import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, insertPostSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createAyrshareService } from "./services/ayrshare";
import multer from "multer";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const upload = multer({ storage: multer.memoryStorage() });

// Middleware to verify JWT token
const verifyToken = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/auth/me", verifyToken, async (req: any, res) => {
    const { password, ...userWithoutPassword } = req.user;
    res.json({ user: userWithoutPassword });
  });

  // Social profiles routes
  app.get("/api/social-profiles", verifyToken, async (req: any, res) => {
    try {
      const profiles = await storage.getSocialProfiles(req.user.id);
      res.json(profiles);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/social-profiles", verifyToken, async (req: any, res) => {
    try {
      if (!req.user.ayrshareApiKey) {
        return res.status(400).json({ message: "Ayrshare API key not configured" });
      }

      const ayrshare = createAyrshareService(req.user.ayrshareApiKey);
      const profileResponse = await ayrshare.createSocialProfile();

      const profile = await storage.createSocialProfile({
        userId: req.user.id,
        profileKey: profileResponse.profileKey,
        platform: "multi", // This will be updated when platforms are connected
        platformUserId: profileResponse.userId,
        username: req.user.username,
        displayName: `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim(),
        connectionData: profileResponse,
      });

      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/social-profiles/:id", verifyToken, async (req: any, res) => {
    try {
      const profileId = req.params.id;
      const profile = await storage.getSocialProfileByKey(profileId);
      
      if (!profile || profile.userId !== req.user.id) {
        return res.status(404).json({ message: "Profile not found" });
      }

      if (req.user.ayrshareApiKey) {
        const ayrshare = createAyrshareService(req.user.ayrshareApiKey);
        await ayrshare.deleteSocialProfile(profile.profileKey);
      }

      await storage.deleteSocialProfile(profile.id);
      res.json({ message: "Profile deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Posts routes
  app.get("/api/posts", verifyToken, async (req: any, res) => {
    try {
      const posts = await storage.getPosts(req.user.id);
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/posts", verifyToken, async (req: any, res) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      
      if (!req.user.ayrshareApiKey) {
        return res.status(400).json({ message: "Ayrshare API key not configured" });
      }

      const ayrshare = createAyrshareService(req.user.ayrshareApiKey);
      
      // Create post in Ayrshare
      const ayrshareResponse = await ayrshare.createPost({
        post: postData.content,
        platforms: postData.platforms as string[],
        mediaUrls: postData.mediaUrls as string[] || [],
        scheduleDate: postData.scheduledAt?.toISOString(),
      });

      // Save post to database
      const post = await storage.createPost({
        content: postData.content,
        platforms: postData.platforms,
        mediaUrls: postData.mediaUrls,
        scheduledAt: postData.scheduledAt,
        userId: req.user.id,
        ayrsharePostId: ayrshareResponse.id,
        status: postData.scheduledAt ? "scheduled" : "published",
        publishedAt: postData.scheduledAt ? null : new Date(),
      });

      res.json(post);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/posts/:id", verifyToken, async (req: any, res) => {
    try {
      const postId = req.params.id;
      const post = await storage.getPost(postId);
      
      if (!post || post.userId !== req.user.id) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (req.user.ayrshareApiKey && post.ayrsharePostId) {
        const ayrshare = createAyrshareService(req.user.ayrshareApiKey);
        await ayrshare.deletePost(post.ayrsharePostId);
      }

      await storage.deletePost(postId);
      res.json({ message: "Post deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Analytics routes
  app.get("/api/analytics", verifyToken, async (req: any, res) => {
    try {
      if (!req.user.ayrshareApiKey) {
        return res.status(400).json({ message: "Ayrshare API key not configured" });
      }

      const ayrshare = createAyrshareService(req.user.ayrshareApiKey);
      const analytics = await ayrshare.getAnalytics();
      
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Media upload routes
  app.post("/api/upload", verifyToken, upload.single('file'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      if (!req.user.ayrshareApiKey) {
        return res.status(400).json({ message: "Ayrshare API key not configured" });
      }

      const ayrshare = createAyrshareService(req.user.ayrshareApiKey);
      const uploadResponse = await ayrshare.uploadMedia(
        req.file.buffer,
        req.file.originalname
      );

      res.json(uploadResponse);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Messages routes
  app.get("/api/messages", verifyToken, async (req: any, res) => {
    try {
      const platform = req.query.platform as string;
      const messages = await storage.getMessages(req.user.id, platform);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Comments routes
  app.get("/api/comments", verifyToken, async (req: any, res) => {
    try {
      const postId = req.query.postId as string;
      const comments = await storage.getComments(req.user.id, postId);
      res.json(comments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User settings routes
  app.put("/api/user/ayrshare-key", verifyToken, async (req: any, res) => {
    try {
      const { apiKey } = req.body;
      
      if (!apiKey) {
        return res.status(400).json({ message: "API key is required" });
      }

      await storage.updateUser(req.user.id, { ayrshareApiKey: apiKey });
      res.json({ message: "API key updated successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
