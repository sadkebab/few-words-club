"use server";

import { userAction } from "@/lib/safe-actions";
import { db } from "@/modules/db";
import { Likes, Posts } from "@/modules/db/schema";
import { and, eq } from "drizzle-orm";
import { LikeActionSchema } from "./validators";
import { ActionError } from "@/lib/safe-actions/error";
import {
  removeLikeNotification,
  sendLikeNotification,
} from "../notifications/data";

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
  LikeActionSchema,
  async ({ postId }, { userData }) => {
    const already = await db.query.Likes.findFirst({
      where: (like, cmp) =>
        cmp.and(cmp.eq(like.postId, postId), cmp.eq(like.userId, userData.id)),
    });

    if (already) {
      return {
        liked: true,
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
      liked: true,
    };
  },
);

export const unlikePostAction = userAction(
  LikeActionSchema,
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
