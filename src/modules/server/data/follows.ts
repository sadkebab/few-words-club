import { safe } from "@/lib/safe-actions";
import { currentUserData } from "./users";
import { db } from "@/modules/db";
import { Follows, UserData } from "@/modules/db/schema";
import { eq, desc, and, count, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export async function userFollowingPaginated({
  userId,
  limit,
  offset,
}: {
  userId: string;
  limit: number;
  offset: number;
}) {
  const viewerId = (await safe(currentUserData))?.id;

  const UserFollows = alias(Follows, "user_follows");

  const follows = await db
    .select({
      id: UserData.id,
      username: UserData.username,
      displayName: UserData.displayName,
      picture: UserData.picture,
      followed: sql<boolean>`${UserFollows.origin} = ${viewerId}`,
    })
    .from(Follows)
    .innerJoin(UserData, eq(Follows.target, UserData.id))
    .leftJoin(
      UserFollows,
      and(
        eq(UserFollows.target, UserData.id),
        eq(UserFollows.origin, viewerId ?? ""),
      ),
    )
    .where(eq(Follows.origin, userId))
    .limit(limit)
    .offset(offset)
    .orderBy(desc(Follows.created));

  const countRes = await db
    .select({ count: count() })
    .from(Follows)
    .where(eq(Follows.origin, userId));
  const total = countRes[0]?.count ?? 0;

  const next = offset + limit;

  return { data: follows, nextCursor: next >= total ? null : next };
}

export async function userFollowersPaginated({
  userId,
  limit,
  offset,
}: {
  userId: string;
  limit: number;
  offset: number;
}) {
  const viewerId = (await safe(currentUserData))?.id;

  const UserFollows = alias(Follows, "user_follows");

  const follows = await db
    .select({
      id: UserData.id,
      username: UserData.username,
      displayName: UserData.displayName,
      picture: UserData.picture,
      followed: sql<boolean>`${UserFollows.origin} = ${viewerId}`,
    })
    .from(Follows)
    .innerJoin(UserData, eq(Follows.target, UserData.id))
    .leftJoin(
      UserFollows,
      and(
        eq(UserFollows.target, UserData.id),
        eq(UserFollows.origin, viewerId ?? ""),
      ),
    )
    .where(eq(Follows.target, userId))
    .limit(limit)
    .offset(offset)
    .orderBy(desc(Follows.created));

  const countRes = await db
    .select({ count: count() })
    .from(Follows)
    .where(eq(Follows.target, userId));
  const total = countRes[0]?.count ?? 0;

  const next = offset + limit;

  return { data: follows, nextCursor: next >= total ? null : next };
}

export type FollowerData = Awaited<
  ReturnType<typeof userFollowingPaginated>
>["data"][number];
