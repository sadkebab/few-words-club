"use server";
import { userAction } from "@/lib/safe-actions";
import {
  CreatePostSchema,
  EditPostSchema,
  PostActionSchema,
} from "../validators/posts";
import { Likes, Posts, Saves } from "@/modules/db/schema";
import { db } from "@/modules/db";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { ActionError } from "@/lib/safe-actions/error";
import {
  postNotificationCleanup,
  removeLikeNotification,
  sendLikeNotification,
} from "../data/notifications";

export const createPostAction = userAction(
  CreatePostSchema,
  async ({ content }, { userData }) => {
    const id = nanoid();
    const res = await db
      .insert(Posts)
      .values({
        id,
        content,
        authorId: userData.id,
      })
      .returning();

    if (res.length === 0) {
      throw new ActionError("Failed to create post");
    }

    return {
      created: res[0]!.id,
    };
  },
);

export const editPostAction = userAction(
  EditPostSchema,
  async ({ postId, content }, { userData }) => {
    const res = await db
      .update(Posts)
      .set({
        content,
      })
      .where(and(eq(Posts.id, postId), eq(Posts.authorId, userData.id)))
      .returning();

    if (res.length === 0) {
      throw new ActionError("Failed to edit post");
    }

    return {
      edited: res[0]!.id,
    };
  },
);

export const deletePostAction = userAction(
  PostActionSchema,
  async ({ postId }, { userData }) => {
    const res = await db
      .delete(Posts)
      .where(and(eq(Posts.id, postId), eq(Posts.authorId, userData.id)))
      .returning();

    if (res.length === 0) {
      throw new ActionError("Failed to delete post");
    }

    await postNotificationCleanup(postId);

    return {
      deleted: res[0]!.id,
    };
  },
);

async function updateLikeCount(postId: string) {
  const likesForPost = await db
    .selectDistinct({
      userId: Likes.userId,
    })
    .from(Likes)
    .where(eq(Likes.postId, postId));

  await db
    .update(Posts)
    .set({
      likeCount: likesForPost.length,
    })
    .where(eq(Posts.id, postId));
}

export const likePostAction = userAction(
  PostActionSchema,
  async ({ postId }, { userData }) => {
    const already = await db.query.Likes.findFirst({
      where: (like, cmp) =>
        cmp.and(cmp.eq(like.postId, postId), cmp.eq(like.userId, userData.id)),
    });

    if (already) {
      return {
        liked: already.id,
      };
    }

    const res = await db
      .insert(Likes)
      .values({
        postId,
        userId: userData.id,
      })
      .returning();

    if (res.length === 0) {
      throw new ActionError("Failed to like post");
    }

    await updateLikeCount(postId);
    await sendLikeNotification({ postId, userId: userData.id });

    return {
      like: res[0]!.id,
    };
  },
);

export const unlikePostAction = userAction(
  PostActionSchema,
  async ({ postId }, { userData }) => {
    const res = await db
      .delete(Likes)
      .where(and(eq(Likes.postId, postId), eq(Likes.userId, userData.id)))
      .returning();

    if (res.length === 0) {
      throw new ActionError("Failed to unlike post");
    }

    await updateLikeCount(postId);
    await removeLikeNotification({ postId, userId: userData.id });

    return {
      unlike: res[0]!.id,
    };
  },
);

async function updateSaveCount(postId: string) {
  const savesForPost = await db
    .selectDistinct({
      userId: Saves.userId,
    })
    .from(Saves)
    .where(eq(Saves.postId, postId));

  await db
    .update(Posts)
    .set({
      saveCount: savesForPost.length,
    })
    .where(eq(Posts.id, postId));
}

export const savePostAction = userAction(
  PostActionSchema,
  async ({ postId }, { userData }) => {
    const already = await db.query.Saves.findFirst({
      where: (save, cmp) =>
        cmp.and(cmp.eq(save.postId, postId), cmp.eq(save.userId, userData.id)),
    });

    if (already) {
      return {
        saved: already.id,
      };
    }
    const res = await db
      .insert(Saves)
      .values({
        postId,
        userId: userData.id,
      })
      .returning();

    if (res.length === 0) {
      throw new ActionError("Failed to save post");
    }

    await updateSaveCount(postId);

    return {
      like: res[0]!.id,
    };
  },
);

export const unsavePostAction = userAction(
  PostActionSchema,
  async ({ postId }, { userData }) => {
    const res = await db
      .delete(Saves)
      .where(and(eq(Saves.postId, postId), eq(Saves.userId, userData.id)))
      .returning();

    if (res.length === 0) {
      throw new ActionError("Failed to unsave post");
    }

    await updateSaveCount(postId);

    return {
      unlike: res[0]!.id,
    };
  },
);
