import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  text,
  pgTableCreator,
  serial,
  timestamp,
  integer,
  pgEnum,
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
    content: text("content").notNull(),
    created: timestamp("created")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    likeCount: integer("like_count").notNull().default(0),
    saveCount: integer("save_count").notNull().default(0),
    edited: timestamp("edited"),
  },
  (table) => ({
    idIdx: index("post_id").on(table.id),
    authorIdIdx: index("post_author_id").on(table.authorId),
  }),
);

export const postRelations = relations(Posts, ({ one }) => ({
  authorData: one(UserData, {
    fields: [Posts.authorId],
    references: [UserData.id],
  }),
}));

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

export const PostMentions = pgTable(
  "post_mentions",
  {
    id: serial("id").primaryKey(),
    postId: text("post_id")
      .notNull()
      .references(() => Posts.id, { onDelete: "cascade" }),
    mentionText: text("mention_text").notNull(),
    mentionedId: text("mentioned_id")
      .notNull()
      .references(() => UserData.id, { onDelete: "cascade" }),
    created: timestamp("created"),
  },
  (table) => ({
    postIdIdx: index("post_mention_post_id").on(table.postId),
    mentionedIdIdx: index("post_mention_mentioned_id").on(table.mentionedId),
  }),
);

export const Follows = pgTable(
  "follows",
  {
    id: serial("id").primaryKey(),
    origin: text("origin")
      .notNull()
      .references(() => UserData.id, { onDelete: "cascade" }),
    target: text("target")
      .notNull()
      .references(() => UserData.id, { onDelete: "cascade" }),
    created: timestamp("created")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    followerIdIdx: index("follows_origin_id").on(table.origin),
    followedIdIdx: index("follows_target_id").on(table.target),
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
    created: timestamp("created")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    postIdIdx: index("like_post_id").on(table.postId),
    userIdIdx: index("like_user_id").on(table.userId),
  }),
);

export const Saves = pgTable(
  "saves",
  {
    id: serial("id").primaryKey(),
    postId: text("post_id")
      .notNull()
      .references(() => Posts.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => UserData.id, { onDelete: "cascade" }),
    created: timestamp("created")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    postIdIdx: index("save_post_id").on(table.postId),
    userIdIdx: index("save_user_id").on(table.userId),
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
    seen: boolean("seen").notNull().default(false),
    created: timestamp("created")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    senderIdIdx: index("dm_sender_id").on(table.senderId),
    recipientIdIdx: index("dm_recipient_id").on(table.recipientId),
  }),
);

export const notificationTypeEnum = pgEnum("notification_type", [
  "like",
  "follow",
]);

export const Notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    origin: text("origin")
      .notNull()
      .references(() => UserData.id, { onDelete: "cascade" }),
    target: text("target")
      .notNull()
      .references(() => UserData.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("notification_type").notNull(),
    entityId: text("entity_id").notNull(),
    link: text("link").notNull(),
    cleared: boolean("cleared").notNull().default(false),
    created: timestamp("created")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    originIdx: index("notification_origin").on(table.origin),
    targetIdx: index("notification_target").on(table.target),
    entityIdIdx: index("notification_entity_id").on(table.entityId),
  }),
);
