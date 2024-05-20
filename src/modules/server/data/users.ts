"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "../../db";
import { eq, count, and } from "drizzle-orm";
import { DirectMessages, Follows, Notifications } from "../../db/schema";

export async function userDataWithStats(username?: string) {
  const userId = await usernameId(username);

  const userData = await db.query.UserData.findFirst({
    where: (data, cmp) => cmp.eq(data.id, userId),
  });

  if (!userData) {
    throw new Error("User data not found");
  }

  const follows = await userFollows(userId);
  const followers = await userFollowers(userId);

  return { userData, follows, followers };
}

export async function usernameId(username?: string) {
  if (!username) {
    return (await currentUserData()).id;
  }
  const user = await db.query.UserData.findFirst({
    where: (user, cmp) => cmp.eq(user.username, username),
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.id;
}

export async function currentUserData() {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not found");
  }

  const userData = await db.query.UserData.findFirst({
    where: (data, cmp) => cmp.eq(data.clerkId, user.id),
  });

  if (!userData) {
    throw new Error("User data not found");
  }

  return userData;
}

export async function userFollows(userId: string) {
  const follows = await db
    .select({ count: count() })
    .from(Follows)
    .where(eq(Follows.origin, userId));
  return follows[0]?.count ?? 0;
}

export async function userFollowers(userId: string) {
  const followers = await db
    .select({ count: count() })
    .from(Follows)
    .where(eq(Follows.target, userId));
  return followers[0]?.count ?? 0;
}

export async function unreadCounter(userId: string) {
  const notifications = await db
    .select({ count: count() })
    .from(Notifications)
    .where(
      and(eq(Notifications.target, userId), eq(Notifications.cleared, false)),
    );

  const messages = await db
    .select({ count: count() })
    .from(DirectMessages)
    .where(
      and(
        eq(DirectMessages.recipientId, userId),
        eq(DirectMessages.seen, false),
      ),
    );

  return {
    notifications: notifications[0]?.count ?? 0,
    messages: messages[0]?.count ?? 0,
  };
}
