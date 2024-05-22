"use server";
import { db } from "@/modules/db";
import { Follows, Likes, Posts, Saves, UserData } from "../../db/schema";
import { count, eq, desc, and, sql, inArray } from "drizzle-orm";
import { currentUserData } from "../user-data/data";
import { safe } from "@/lib/safe-actions";
import { QueryBuilder, alias } from "drizzle-orm/pg-core";

function postQuery(viewerId?: string) {
  return db
    .select({
      id: Posts.id,
      content: Posts.content,
      created: Posts.created,
      likeCount: Posts.likeCount,
      saveCount: Posts.saveCount,
      author: {
        id: UserData.id,
        username: UserData.username,
        displayName: UserData.displayName,
        picture: UserData.picture,
      },
      liked: sql<boolean>`(${Likes.id}) is not null`,
      saved: sql<boolean>`(${Saves.id}) is not null`,
    })
    .from(Posts)
    .leftJoin(UserData, eq(Posts.authorId, UserData.id))
    .leftJoin(
      Likes,
      and(eq(Posts.id, Likes.postId), eq(Likes.userId, viewerId ?? "")),
    )
    .leftJoin(
      Saves,
      and(eq(Posts.id, Saves.postId), eq(Saves.userId, viewerId ?? "")),
    )
    .$dynamic();
}

function savedPostQuery(userId: string) {
  return db
    .select({
      id: Posts.id,
      content: Posts.content,
      created: Posts.created,
      likeCount: Posts.likeCount,
      saveCount: Posts.saveCount,
      author: {
        id: UserData.id,
        username: UserData.username,
        displayName: UserData.displayName,
        picture: UserData.picture,
      },
      liked: sql<boolean>`(${Likes.id}) is not null`,
      saved: sql<boolean>`(${Saves.id}) is not null`,
    })
    .from(Saves)
    .innerJoin(Posts, eq(Saves.postId, Posts.id))
    .leftJoin(UserData, eq(Posts.authorId, UserData.id))
    .leftJoin(Likes, and(eq(Posts.id, Likes.postId), eq(Likes.userId, userId)))
    .$dynamic();
}

export async function userPostsPaginated({
  userId,
  limit,
  offset,
}: {
  userId: string;
  limit: number;
  offset: number;
}) {
  const viewerId = (await safe(currentUserData))?.id;

  const posts = await postQuery(viewerId)
    .where(eq(Posts.authorId, userId))
    .orderBy(desc(Posts.created))
    .limit(limit)
    .offset(offset);

  const countRes = await db
    .select({ count: count() })
    .from(Posts)
    .where(eq(Posts.authorId, userId));
  const total = countRes[0]?.count ?? 0;

  const next = offset + limit;

  return { data: posts, nextCursor: next >= total ? null : next };
}

export async function singlePost(postId: string): Promise<PostData> {
  const viewerId = (await safe(currentUserData))?.id;

  const posts = await postQuery(viewerId).where(eq(Posts.id, postId));

  if (posts.length === 0) {
    throw new Error("Post not found");
  }

  return posts[0]!;
}

export async function publicFeedPaginated({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}): Promise<{ data: PostData[]; nextCursor: number | null }> {
  const viewerId = (await safe(currentUserData))?.id;

  const posts = await postQuery(viewerId)
    .orderBy(desc(Posts.created))
    .limit(limit)
    .offset(offset);

  const countRes = await db.select({ count: count() }).from(Posts);
  const total = countRes[0]?.count ?? 0;

  const next = offset + limit;

  return { data: posts, nextCursor: next >= total ? null : next };
}

export async function followedFeedPaginated({
  userId,
  limit,
  offset,
}: {
  userId: string;
  limit: number;
  offset: number;
}): Promise<{
  data: PostData[];
  nextCursor: number | null;
  cursor: number | null;
}> {
  const viewerId = (await safe(currentUserData))?.id;
  const qb = new QueryBuilder();
  const isSaved = inArray(
    Posts.authorId,
    qb
      .select({
        id: Follows.target,
      })
      .from(Follows)
      .where(eq(Follows.origin, userId)),
  );

  const posts = await postQuery(viewerId)
    .where(isSaved)
    .orderBy(desc(Posts.created))
    .limit(limit)
    .offset(offset);

  const countRes = await db
    .select({ count: count() })
    .from(Posts)
    .where(isSaved);
  const total = countRes[0]?.count ?? 0;

  const next = offset + limit;

  return {
    data: posts,
    cursor: offset,
    nextCursor: next >= total ? null : next,
  };
}

export async function savedFeedPaginated({
  userId,
  limit,
  offset,
}: {
  userId: string;
  limit: number;
  offset: number;
}): Promise<{ data: PostData[]; nextCursor: number | null }> {
  const qb = new QueryBuilder();
  const posts = await savedPostQuery(userId)
    .where(
      inArray(
        Posts.id,
        qb
          .select({
            id: Saves.postId,
          })
          .from(Saves)
          .where(eq(Saves.userId, userId)),
      ),
    )
    .orderBy(desc(Posts.created))
    .limit(limit)
    .offset(offset);

  const countRes = await db
    .select({ count: count() })
    .from(Saves)
    .where(eq(Saves.userId, userId));
  const total = countRes[0]?.count ?? 0;

  const next = offset + limit;

  return { data: posts, nextCursor: next >= total ? null : next };
}

export async function likeFeedPaginated({
  userId,
  limit,
  offset,
}: {
  userId: string;
  limit: number;
  offset: number;
}): Promise<{ data: PostData[]; nextCursor: number | null }> {
  const UserLikes = alias(Likes, "user_likes");

  const posts = await db
    .select({
      id: Posts.id,
      content: Posts.content,
      created: Posts.created,
      likeCount: Posts.likeCount,
      saveCount: Posts.saveCount,
      author: {
        id: UserData.id,
        username: UserData.username,
        displayName: UserData.displayName,
        picture: UserData.picture,
      },
      liked: sql<boolean>`(${UserLikes.id}) is not null`,
      saved: sql<boolean>`(${Saves.id}) is not null`,
    })
    .from(Likes)
    .innerJoin(Posts, eq(Likes.postId, Posts.id))
    .leftJoin(UserData, eq(Posts.authorId, UserData.id))
    .leftJoin(
      UserLikes,
      and(eq(UserLikes.postId, Posts.id), eq(UserLikes.userId, userId)),
    )
    .leftJoin(Saves, and(eq(Saves.postId, Posts.id), eq(Saves.userId, userId)))
    .where(eq(Likes.userId, userId))
    .orderBy(desc(Likes.created))
    .limit(limit)
    .offset(offset);

  const countRes = await db
    .select({ count: count() })
    .from(Likes)
    .where(eq(Likes.userId, userId));

  const total = countRes[0]?.count ?? 0;
  const next = offset + limit;

  return { data: posts, nextCursor: next >= total ? null : next };
}

export type PostData = Awaited<
  ReturnType<typeof userPostsPaginated>
>["data"][number];

export async function userPost(userId: string, postId: string) {
  const viewerId = (await safe(currentUserData))?.id;
  const result = await postQuery(viewerId).where(
    and(eq(Posts.id, postId), eq(Posts.authorId, userId)),
  );

  return result[0] ?? undefined;
}
