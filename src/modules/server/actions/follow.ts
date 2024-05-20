"use server";

import { userAction } from "@/lib/safe-actions";
import { FollowActionSchema } from "../validators/follows";
import { db } from "@/modules/db";
import { ActionError } from "@/lib/safe-actions/error";
import { Follows } from "@/modules/db/schema";
import { and, eq } from "drizzle-orm";
import {
  removeFollowNotification,
  sendFollowNotification,
} from "../data/notifications";

export const followUserAction = userAction(
  FollowActionSchema,
  async ({ userId }, { userData }) => {
    const already = await db.query.Follows.findFirst({
      where: (follow, cmp) =>
        cmp.and(
          cmp.eq(follow.target, userId),
          cmp.eq(follow.origin, userData.id),
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
        origin: userData.id,
        target: userId,
      })
      .returning();

    if (res.length === 0) {
      throw new ActionError("Failed to follow user");
    }

    void sendFollowNotification({
      originId: userData.id,
      targetId: userId,
      originUsername: userData.username,
    });

    return {
      followed: res[0]!.id,
    };
  },
);

export const unfollowUserAction = userAction(
  FollowActionSchema,
  async ({ userId }, { userData }) => {
    const res = await db
      .delete(Follows)
      .where(and(eq(Follows.origin, userData.id), eq(Follows.target, userId)))
      .returning();

    if (res.length === 0) {
      throw new ActionError("Failed to delete post");
    }

    void removeFollowNotification({
      originId: userData.id,
      targetId: userId,
    });

    return {
      unfollowed: res[0]!.id,
    };
  },
);
