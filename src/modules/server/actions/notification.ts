"use server";
import { userAction } from "@/lib/safe-actions";
import { NotificationActionSchema } from "../validators/notifications";
import { db } from "@/modules/db";
import { Notifications } from "@/modules/db/schema";
import { and, eq } from "drizzle-orm";
import { ActionError } from "@/lib/safe-actions/error";
import { dispatch } from "@/modules/pusher/server";

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

    void dispatch({
      channel: "notification",
      event: userData.id,
      data: null,
    });

    return {
      cleared: res[0]!.id,
    };
  },
);
