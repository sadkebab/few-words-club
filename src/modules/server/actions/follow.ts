"use server";

import { userAction } from "@/lib/safe-actions";
import { FollowActionSchema } from "../validators/follow";
import { db } from "@/modules/db";
import { ActionError } from "@/lib/safe-actions/error";
import { Follows } from "@/modules/db/schema";
import { and, eq } from "drizzle-orm";

export const followUserAction = userAction(
  FollowActionSchema,
  async ({ userId }, { userData }) => {
    const already = await db.query.Follows.findFirst({
      where: (follow, cmp) =>
        cmp.and(
          cmp.eq(follow.followedId, userId),
          cmp.eq(follow.followerId, userData.id),
        ),
    });

    if (already) {
      return {
        followed: already.id,
      };
    }

    const res = await db
      .insert(Follows)
      .values({
        followerId: userData.id,
        followedId: userId,
      })
      .returning();

    if (res.length === 0) {
      throw new ActionError("Failed to follow user");
    }

    return {
      followed: res[0]!.id,
    };
  },
);

export const unfollowUserAction = userAction(
  FollowActionSchema,
  async ({ userId }, { userData }) => {
    console.log("userData", userId);

    const res = await db
      .delete(Follows)
      .where(
        and(
          eq(Follows.followerId, userData.id),
          eq(Follows.followedId, userId),
        ),
      )
      .returning();

    if (res.length === 0) {
      throw new ActionError("Failed to delete post");
    }

    return {
      unfollowed: res[0]!.id,
    };
  },
);
