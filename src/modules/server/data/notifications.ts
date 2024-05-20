import { first } from "@/lib/drizzle";
import { db } from "@/modules/db";
import { Notifications, Posts, UserData } from "@/modules/db/schema";
import { dispatch } from "@/modules/pusher/server";
import { eq, and, desc, count } from "drizzle-orm";

type LikeNotificationOptions = {
  postId: string;
  userId: string;
};

export async function sendLikeNotification({
  postId,
  userId,
}: LikeNotificationOptions) {
  const post = await first(
    db
      .select({
        authorId: Posts.authorId,
        authorUsername: UserData.username,
      })
      .from(Posts)
      .innerJoin(UserData, eq(UserData.id, Posts.authorId))
      .where(eq(Posts.id, postId)),
  );

  if (!post) {
    console.error("Post not found, impossible to send like notification.");
    return;
  }

  if (post.authorId === userId) {
    return;
  }

  const alreadyNotified = await db.query.Notifications.findFirst({
    where: (table, cmp) =>
      cmp.and(
        cmp.eq(table.type, "like"),
        cmp.eq(table.entityId, postId),
        cmp.eq(table.origin, userId),
        cmp.eq(table.target, post.authorId),
      ),
  });

  if (alreadyNotified) {
    console.warn(`Already notified like, skipping. [${userId} -> ${postId}]`);
    return;
  }

  await db.insert(Notifications).values({
    type: "like",
    entityId: postId,
    link: `/${post.authorUsername}/${postId}`,
    origin: userId,
    target: post.authorId,
  });

  await dispatch({
    channel: "notification",
    event: post.authorId,
    data: null,
  });
}

export async function removeLikeNotification({
  postId,
  userId,
}: LikeNotificationOptions) {
  const post = await db.query.Posts.findFirst({
    where: (table, cmp) => cmp.eq(table.id, postId),
  });

  if (!post) {
    console.error("Post not found, impossible to remove like notification.");
    return;
  }

  await db
    .delete(Notifications)
    .where(
      and(
        eq(Notifications.type, "like"),
        eq(Notifications.entityId, postId),
        eq(Notifications.origin, userId),
        eq(Notifications.target, post.authorId),
      ),
    );

  await dispatch({
    channel: "notification",
    event: post.authorId,
    data: null,
  });
}

type FollowNotificationOptions = {
  targetId: string;
  originId: string;
};

export async function sendFollowNotification({
  targetId,
  originId,
  originUsername,
}: FollowNotificationOptions & { originUsername: string }) {
  if (targetId === originId) {
    console.warn("User tried to follow themselves, skipping.");
    return;
  }

  const alreadyNotified = await db.query.Notifications.findFirst({
    where: (table, cmp) =>
      cmp.and(
        cmp.eq(table.type, "follow"),
        cmp.eq(table.origin, originId),
        cmp.eq(table.target, targetId),
      ),
  });

  if (alreadyNotified) {
    console.warn(
      `Already notified follow, skipping. [${originId} -> ${targetId}]`,
    );

    await dispatch({
      channel: "notification",
      event: targetId,
      data: null,
    });

    return;
  }

  await db.insert(Notifications).values({
    type: "follow",
    entityId: targetId,
    link: `/${originUsername}`,
    origin: originId,
    target: targetId,
  });
}

export async function removeFollowNotification({
  targetId,
  originId,
}: FollowNotificationOptions) {
  await db
    .delete(Notifications)
    .where(
      and(
        eq(Notifications.type, "follow"),
        eq(Notifications.origin, originId),
        eq(Notifications.target, targetId),
      ),
    );

  await dispatch({
    channel: "notification",
    event: targetId,
    data: null,
  });
}

export async function postNotificationCleanup(postId: string) {
  await db.delete(Notifications).where(eq(Notifications.entityId, postId));
}

function notificationQuery() {
  return db
    .select({
      id: Notifications.id,
      type: Notifications.type,
      entityId: Notifications.entityId,
      created: Notifications.created,
      link: Notifications.link,
      seen: Notifications.cleared,
      origin: {
        id: UserData.id,
        username: UserData.username,
        displayName: UserData.displayName,
        picture: UserData.picture,
      },
    })
    .from(Notifications)
    .innerJoin(UserData, eq(UserData.id, Notifications.origin));
}

export async function userNotificationsPaginated({
  userId,
  limit,
  offset,
}: {
  userId: string;
  limit: number;
  offset: number;
}) {
  const notifications = await notificationQuery()
    .where(eq(Notifications.target, userId))
    .limit(limit)
    .offset(offset)
    .orderBy(desc(Notifications.created));

  const countRes = await first(
    db
      .select({ count: count() })
      .from(Notifications)
      .where(eq(Notifications.target, userId)),
  );

  const total = countRes?.count ?? 0;
  const next = offset + limit;

  return { data: notifications, nextCursor: next >= total ? null : next };
}

export async function singleNotification({
  notificationId,
  userId,
}: {
  notificationId: number;
  userId: string;
}) {
  const notification = await first(
    notificationQuery().where(
      and(
        eq(Notifications.target, userId),
        eq(Notifications.id, notificationId),
      ),
    ),
  );

  if (!notification) {
    throw new Error("Notification not found");
  }

  return notification;
}

export async function unclearedNotificationCount({
  userId,
}: {
  userId: string;
}) {
  const countRes = await first(
    db
      .select({ count: count() })
      .from(Notifications)
      .where(
        and(eq(Notifications.target, userId), eq(Notifications.cleared, false)),
      ),
  );

  if (!countRes) {
    throw new Error("Notification count not found");
  }

  return countRes;
}

export type NotificationData = Awaited<
  ReturnType<typeof userNotificationsPaginated>
>["data"][number];
