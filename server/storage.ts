import { users, socialProfiles, posts, socialMessages, socialComments, type User, type InsertUser, type SocialProfile, type InsertSocialProfile, type Post, type InsertPost, type SocialMessage, type SocialComment } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Social profile methods
  getSocialProfiles(userId: string): Promise<SocialProfile[]>;
  getSocialProfileByKey(profileKey: string): Promise<SocialProfile | undefined>;
  createSocialProfile(profile: InsertSocialProfile & { userId: string }): Promise<SocialProfile>;
  updateSocialProfile(id: string, updates: Partial<SocialProfile>): Promise<SocialProfile | undefined>;
  deleteSocialProfile(id: string): Promise<boolean>;

  // Post methods
  getPosts(userId: string): Promise<Post[]>;
  getPost(id: string): Promise<Post | undefined>;
  createPost(post: InsertPost & { userId: string }): Promise<Post>;
  updatePost(id: string, updates: Partial<Post>): Promise<Post | undefined>;
  deletePost(id: string): Promise<boolean>;

  // Message methods
  getMessages(userId: string, platform?: string): Promise<SocialMessage[]>;
  createMessage(message: Omit<SocialMessage, 'id' | 'createdAt'>): Promise<SocialMessage>;

  // Comment methods
  getComments(userId: string, postId?: string): Promise<SocialComment[]>;
  createComment(comment: Omit<SocialComment, 'id' | 'createdAt'>): Promise<SocialComment>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getSocialProfiles(userId: string): Promise<SocialProfile[]> {
    return await db
      .select()
      .from(socialProfiles)
      .where(eq(socialProfiles.userId, userId))
      .orderBy(desc(socialProfiles.createdAt));
  }

  async getSocialProfileByKey(profileKey: string): Promise<SocialProfile | undefined> {
    const [profile] = await db
      .select()
      .from(socialProfiles)
      .where(eq(socialProfiles.profileKey, profileKey));
    return profile || undefined;
  }

  async createSocialProfile(profile: InsertSocialProfile & { userId: string }): Promise<SocialProfile> {
    const [newProfile] = await db
      .insert(socialProfiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async updateSocialProfile(id: string, updates: Partial<SocialProfile>): Promise<SocialProfile | undefined> {
    const [profile] = await db
      .update(socialProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(socialProfiles.id, id))
      .returning();
    return profile || undefined;
  }

  async deleteSocialProfile(id: string): Promise<boolean> {
    const result = await db.delete(socialProfiles).where(eq(socialProfiles.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getPosts(userId: string): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt));
  }

  async getPost(id: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post || undefined;
  }

  async createPost(post: InsertPost & { userId: string }): Promise<Post> {
    const [newPost] = await db
      .insert(posts)
      .values(post)
      .returning();
    return newPost;
  }

  async updatePost(id: string, updates: Partial<Post>): Promise<Post | undefined> {
    const [post] = await db
      .update(posts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return post || undefined;
  }

  async deletePost(id: string): Promise<boolean> {
    const result = await db.delete(posts).where(eq(posts.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getMessages(userId: string, platform?: string): Promise<SocialMessage[]> {
    const conditions = [eq(socialMessages.userId, userId)];
    if (platform) {
      conditions.push(eq(socialMessages.platform, platform));
    }

    return await db
      .select()
      .from(socialMessages)
      .where(and(...conditions))
      .orderBy(desc(socialMessages.createdAt));
  }

  async createMessage(message: Omit<SocialMessage, 'id' | 'createdAt'>): Promise<SocialMessage> {
    const [newMessage] = await db
      .insert(socialMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getComments(userId: string, postId?: string): Promise<SocialComment[]> {
    const conditions = [eq(socialComments.userId, userId)];
    if (postId) {
      conditions.push(eq(socialComments.postId, postId));
    }

    return await db
      .select()
      .from(socialComments)
      .where(and(...conditions))
      .orderBy(desc(socialComments.createdAt));
  }

  async createComment(comment: Omit<SocialComment, 'id' | 'createdAt'>): Promise<SocialComment> {
    const [newComment] = await db
      .insert(socialComments)
      .values(comment)
      .returning();
    return newComment;
  }
}

export const storage = new DatabaseStorage();
