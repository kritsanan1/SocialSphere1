import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  ayrshareApiKey: text("ayrshare_api_key"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const socialProfiles = pgTable("social_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  profileKey: text("profile_key").notNull().unique(),
  platform: text("platform").notNull(),
  platformUserId: text("platform_user_id"),
  username: text("username"),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  isActive: boolean("is_active").default(true),
  connectionData: jsonb("connection_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const posts = pgTable("posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  ayrsharePostId: text("ayrshare_post_id"),
  content: text("content").notNull(),
  mediaUrls: jsonb("media_urls"),
  platforms: jsonb("platforms").notNull(),
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  status: text("status").notNull().default("draft"), // draft, scheduled, published, failed
  analytics: jsonb("analytics"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const socialMessages = pgTable("social_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  platform: text("platform").notNull(),
  messageId: text("message_id").notNull(),
  conversationId: text("conversation_id"),
  senderId: text("sender_id"),
  recipientId: text("recipient_id"),
  content: text("content"),
  messageType: text("message_type"), // text, image, video
  isIncoming: boolean("is_incoming").default(true),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const socialComments = pgTable("social_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  postId: varchar("post_id").references(() => posts.id, { onDelete: "cascade" }),
  platform: text("platform").notNull(),
  commentId: text("comment_id").notNull(),
  socialPostId: text("social_post_id"),
  authorId: text("author_id"),
  authorName: text("author_name"),
  content: text("content"),
  parentCommentId: text("parent_comment_id"),
  likes: integer("likes").default(0),
  isReply: boolean("is_reply").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
});

export const insertSocialProfileSchema = createInsertSchema(socialProfiles).pick({
  profileKey: true,
  platform: true,
  platformUserId: true,
  username: true,
  displayName: true,
  avatarUrl: true,
  connectionData: true,
});

export const insertPostSchema = createInsertSchema(posts).pick({
  content: true,
  mediaUrls: true,
  platforms: true,
  scheduledAt: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSocialProfile = z.infer<typeof insertSocialProfileSchema>;
export type SocialProfile = typeof socialProfiles.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;
export type SocialMessage = typeof socialMessages.$inferSelect;
export type SocialComment = typeof socialComments.$inferSelect;
export type LoginCredentials = z.infer<typeof loginSchema>;
