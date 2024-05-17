import { sql } from "drizzle-orm";
import {
  index,
  text,
  pgTableCreator,
  serial,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `fwc_${name}`);

export const UserData = pgTable(
  "user_data",
  {
    id: text("id").primaryKey().unique(),
    clerkId: text("clerk_id").notNull(),
    username: text("username").notNull().unique(),
    picture: text("picture"),
    banner: text("banner"),
    displayName: text("display_name"),
    bio: text("bio"),
    location: text("location"),
    created: timestamp("created")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    idIdx: index("ud_id").on(table.id),
    clerkIdIdx: index("ud_clerk_id").on(table.clerkId),
    usernameIdx: index("ud_username").on(table.username),
  }),
);

export const Posts = pgTable(
  "posts",
  {
    id: text("id").primaryKey().unique(),
    authorId: text("author_id")
      .notNull()
      .references(() => UserData.id),
    content: text("title").notNull(),
    created: timestamp("created")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    likeCount: integer("like_count").notNull().default(0),
    edited: timestamp("edited"),
  },
  (table) => ({
    idIdx: index("post_id").on(table.id),
    authorIdIdx: index("post_author_id").on(table.authorId),
  }),
);

export const PostTags = pgTable(
  "post_tags",
  {
    id: serial("id").primaryKey(),
    postId: text("post_id")
      .notNull()
      .references(() => Posts.id, { onDelete: "cascade" }),
    tag: text("tag").notNull(),
    created: timestamp("created"),
  },
  (table) => ({
    postIdIdx: index("post_tag_post_id").on(table.postId),
    tagIdx: index("post_tag_tag").on(table.tag),
  }),
);

export const Following = pgTable(
  "following",
  {
    id: serial("id").primaryKey(),
    followerId: text("follower_id")
      .notNull()
      .references(() => UserData.id, { onDelete: "cascade" }),
    followingId: text("following_id")
      .notNull()
      .references(() => UserData.id, { onDelete: "cascade" }),
  },
  (table) => ({
    followerIdIdx: index("following_follower_id").on(table.followerId),
    followingIdIdx: index("following_following_id").on(table.followingId),
  }),
);

export const Likes = pgTable(
  "likes",
  {
    id: serial("id").primaryKey(),
    postId: text("post_id")
      .notNull()
      .references(() => Posts.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => UserData.id, { onDelete: "cascade" }),
  },
  (table) => ({
    postIdIdx: index("like_post_id").on(table.postId),
    userIdIdx: index("like_user_id").on(table.userId),
  }),
);

export const Comments = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    postId: text("post_id")
      .notNull()
      .references(() => Posts.id, { onDelete: "cascade" }),
    authorId: text("author_id")
      .notNull()
      .references(() => UserData.id, { onDelete: "cascade" }),
    parentCommentId: integer("parent_comment_id"),
    content: text("content").notNull(),
    created: timestamp("created")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    postIdIdx: index("comment_post_id").on(table.postId),
    authorIdIdx: index("comment_author_id").on(table.authorId),
  }),
);

export const DirectMessages = pgTable(
  "direct_messages",
  {
    id: serial("id").primaryKey(),
    senderId: text("sender_id")
      .notNull()
      .references(() => UserData.id, { onDelete: "cascade" }),
    recipientId: text("recipient_id")
      .notNull()
      .references(() => UserData.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    created: timestamp("created")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    senderIdIdx: index("dm_sender_id").on(table.senderId),
    recipientIdIdx: index("dm_recipient_id").on(table.recipientId),
  }),
);

export const Notification = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => UserData.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    actionUrl: text("action_url").notNull(),
    seen: text("seen").notNull().default("false"),
    updated: timestamp("updated")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    userIdIdx: index("notification_user_id").on(table.userId),
  }),
);
