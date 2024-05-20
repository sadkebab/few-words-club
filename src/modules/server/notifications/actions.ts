"use server";

import { userAction } from "@/lib/safe-actions";
import { NotificationActionSchema } from "./validators";
import { db } from "@/modules/db";
import { Notifications } from "@/modules/db/schema";
import { and, count, eq } from "drizzle-orm";
import { ActionError } from "@/lib/safe-actions/error";
import { dispatch } from "@/modules/pusher/server";
import { z } from "zod";
import { first } from "@/lib/drizzle";

export const clearNotificationAction = userAction(
  NotificationActionSchema,
  async ({ notificationId }, { userData }) => {
    const res = await db
      .update(Notifications)
      .set({
        cleared: true,
      })
      .where(
        and(
          eq(Notifications.id, notificationId),
          eq(Notifications.target, userData.id),
        ),
      )
      .returning();

    if (res.length === 0) {
      throw new ActionError("Failed to follow user");
    }

    await dispatch({
      channel: "notification",
      event: userData.id,
      payload: null,
    });

    return {
      cleared: res[0]!.id,
    };
  },
);

export const clearAllNotificationsAction = userAction(
  z.undefined(),
  async (_, { userData }) => {
    const toBeCleard = await first(
      db
        .select({ count: count() })
        .from(Notifications)
        .where(
          and(
            eq(Notifications.target, userData.id),
            eq(Notifications.cleared, false),
          ),
        ),
    );

    if (!toBeCleard) {
      throw new ActionError("Failed to clear notifications");
    }

    if (toBeCleard.count === 0) {
      return {
        cleared: 0,
      };
    }

    const res = await db
      .update(Notifications)
      .set({
        cleared: true,
      })
      .where(
        and(
          eq(Notifications.target, userData.id),
          eq(Notifications.cleared, false),
        ),
      )
      .returning();

    await dispatch({
      channel: "notification",
      event: userData.id,
      payload: null,
    });

    return {
      cleared: res.length,
    };
  },
);
