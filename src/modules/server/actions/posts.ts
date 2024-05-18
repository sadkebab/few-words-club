"use server";
import { userAction } from "@/lib/safe-actions";
import { PostAction } from "../validators/posts";
import { Likes, Posts, Saves } from "@/modules/db/schema";
import { db } from "@/modules/db";
import { and, eq } from "drizzle-orm";

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
  PostAction,
  async ({ postId }, { userData }) => {
    const res = await db
      .insert(Likes)
      .values({
        postId,
        userId: userData.id,
      })
      .returning();

    if (res.length === 0) {
      throw new Error("Failed to like post");
    }

    await updateLikeCount(postId);

    return {
      like: res[0]!.id,
    };
  },
);

export const unlikePostAction = userAction(
  PostAction,
  async ({ postId }, { userData }) => {
    const res = await db
      .delete(Likes)
      .where(and(eq(Likes.postId, postId), eq(Likes.userId, userData.id)))
      .returning();

    if (res.length === 0) {
      throw new Error("Failed to unlike post");
    }

    await updateLikeCount(postId);

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
  PostAction,
  async ({ postId }, { userData }) => {
    const res = await db
      .insert(Saves)
      .values({
        postId,
        userId: userData.id,
      })
      .returning();

    if (res.length === 0) {
      throw new Error("Failed to save post");
    }

    await updateSaveCount(postId);

    return {
      like: res[0]!.id,
    };
  },
);

export const unsavePostAction = userAction(
  PostAction,
  async ({ postId }, { userData }) => {
    const res = await db
      .delete(Saves)
      .where(and(eq(Saves.postId, postId), eq(Saves.userId, userData.id)))
      .returning();

    if (res.length === 0) {
      throw new Error("Failed to unsave post");
    }

    await updateSaveCount(postId);

    return {
      unlike: res[0]!.id,
    };
  },
);
