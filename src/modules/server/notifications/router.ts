import { z } from "zod";
import { createTRPCRouter, userProcedure } from "../trpc";
import {
  singleNotification,
  unclearedNotificationCount,
  userNotificationsPaginated,
} from "./data";

export const notificationsRouter = createTRPCRouter({
  userNotificationsPaginated: userProcedure
    .input(
      z.object({
        pageSize: z.number(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { cursor, pageSize } = input;
      const res = await userNotificationsPaginated({
        userId: ctx.user.id,
        limit: pageSize,
        offset: cursor ?? 0,
      });
      return res;
    }),
  single: userProcedure
    .input(
      z.object({
        notificationId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { notificationId } = input;
      const res = await singleNotification({
        notificationId,
        userId: ctx.user.id,
      });
      return res;
    }),
  unclearedCount: userProcedure.query(async ({ ctx }) => {
    const res = await unclearedNotificationCount({
      userId: ctx.user.id,
    });
    return res;
  }),
});
