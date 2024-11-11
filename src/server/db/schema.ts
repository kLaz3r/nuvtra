// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  uuid,
  pgTableCreator,
  timestamp,
  varchar,
  text,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `nexa_${name}`);

// Define notification type enum
export const notificationTypeEnum = pgEnum('notification_type', ['LIKE', 'COMMENT', 'FOLLOW']);

export const users = createTable(
  "user",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    username: varchar("username", { length: 256 }).notNull().unique(),
    email: varchar("email", { length: 256 }).notNull().unique(),
    bio: text("bio"),
    avatar: varchar("avatar", { length: 512 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    usernameIdx: index("username_idx").on(table.username),
    emailIdx: index("email_idx").on(table.email),
  })
);

export const posts = createTable(
  "post",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    content: text("content").notNull(),
    imageUrl: varchar("image_url", { length: 512 }),
    timestamp: timestamp("timestamp", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => ({
    authorIdx: index("author_idx").on(table.authorId),
  })
);

export const comments = createTable(
  "comment",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    content: text("content").notNull(),
    timestamp: timestamp("timestamp", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => ({
    postIdx: index("post_idx").on(table.postId),
    authorIdx: index("comment_author_idx").on(table.authorId),
  })
);

export const likes = createTable(
  "like",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
  },
  (table) => ({
    userPostIdx: index("user_post_idx").on(table.userId, table.postId),
  })
);

export const notifications = createTable(
  "notification",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: notificationTypeEnum("type").notNull(),
    message: text("message").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdById: uuid("created_by_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    isRead: boolean("is_read").default(false).notNull(),
    timestamp: timestamp("timestamp", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    userIdx: index("notification_user_idx").on(table.userId),
  })
);

// For the follow relationship
export const follows = createTable(
  "follow",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    followerId: uuid("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followingId: uuid("following_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    timestamp: timestamp("timestamp", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    followerIdx: index("follower_idx").on(table.followerId),
    followingIdx: index("following_idx").on(table.followingId),
  })
);
