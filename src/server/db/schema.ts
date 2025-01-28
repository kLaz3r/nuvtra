import { relations, sql } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTableCreator,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// Create a custom pgTable function with the prefix
const pgTable = pgTableCreator((name) => `nexa_${name}`);

export const users = pgTable("user", {
  id: varchar("id", { length: 256 }).primaryKey().notNull().unique(),
  username: varchar("username", { length: 256 }).notNull().unique(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  bio: text("bio"),
  avatar: varchar("avatar", { length: 512 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  location: varchar("location", { length: 256 }),
});

export const posts = pgTable("post", {
  id: varchar("id", { length: 256 }).primaryKey().notNull().unique(),
  content: text("content").notNull(),
  imageUrl: varchar("image_url", { length: 512 }),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  authorId: varchar("author_id", { length: 256 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const comments = pgTable("comment", {
  id: varchar("id", { length: 256 }).primaryKey().notNull().unique(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  postId: varchar("post_id", { length: 256 })
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  authorId: varchar("author_id", { length: 256 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const likes = pgTable("like", {
  id: varchar("id", { length: 256 }).primaryKey().notNull().unique(),
  userId: varchar("user_id", { length: 256 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  postId: varchar("post_id", { length: 256 })
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
});

export const notificationTypeEnum = pgEnum("notification_type", [
  "LIKE",
  "COMMENT",
  "FOLLOW",
]);

export const notifications = pgTable("notification", {
  id: varchar("id", { length: 256 }).primaryKey().notNull().unique(),
  type: notificationTypeEnum("type").notNull(),
  message: text("message").notNull(),
  userId: varchar("user_id", { length: 256 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdById: varchar("created_by_id", { length: 256 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  isRead: boolean("is_read").default(false).notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const follows = pgTable("follow", {
  id: varchar("id", { length: 256 }).primaryKey().notNull().unique(),
  followerId: varchar("follower_id", { length: 256 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  followingId: varchar("following_id", { length: 256 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  likes: many(likes),
  receivedNotifications: many(notifications, {
    relationName: "userNotifications",
  }),
  createdNotifications: many(notifications, {
    relationName: "createdNotifications",
  }),
  followedBy: many(follows, {
    relationName: "following",
  }),
  following: many(follows, {
    relationName: "follower",
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  comments: many(comments),
  likes: many(likes),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  recipient: one(users, {
    fields: [notifications.userId],
    references: [users.id],
    relationName: "userNotifications",
  }),
  creator: one(users, {
    fields: [notifications.createdById],
    references: [users.id],
    relationName: "createdNotifications",
  }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName: "follower",
  }),
  following: one(users, {
    fields: [follows.followingId],
    references: [users.id],
    relationName: "following",
  }),
}));
