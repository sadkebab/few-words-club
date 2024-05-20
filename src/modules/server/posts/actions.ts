"use server";

import { userAction } from "@/lib/safe-actions";
import {
  CreatePostSchema,
  EditPostSchema,
  PostActionSchema,
} from "./validators";
import { Posts } from "@/modules/db/schema";
import { db } from "@/modules/db";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { ActionError } from "@/lib/safe-actions/error";
import { postNotificationCleanup } from "../notifications/data";

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
