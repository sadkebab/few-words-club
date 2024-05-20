"use server";

import { userAction } from "@/lib/safe-actions";
import { SaveActionSchema } from "./validators";
import { Posts, Saves } from "@/modules/db/schema";
import { db } from "@/modules/db";
import { and, eq } from "drizzle-orm";
import { ActionError } from "@/lib/safe-actions/error";

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
  SaveActionSchema,
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
  SaveActionSchema,
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
