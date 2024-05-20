import { z } from "zod";

export const NotificationActionSchema = z.object({
  notificationId: z.number(),
});
