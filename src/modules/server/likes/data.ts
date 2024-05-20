import { db } from "@/modules/db";
import { Likes, UserData } from "@/modules/db/schema";
import { count, desc, eq } from "drizzle-orm";

export async function postLikesPaginated({
  postId,
  limit,
  offset,
}: {
  postId: string;
  limit: number;
  offset: number;
}) {
  const likes = await db
    .select({
      id: Likes.id,
      user: {
        id: UserData.id,
        username: UserData.username,
        displayName: UserData.displayName,
        picture: UserData.picture,
      },
    })
    .from(Likes)
    .innerJoin(UserData, eq(UserData.id, Likes.userId))
    .where(eq(Likes.postId, postId))
    .limit(limit)
    .offset(offset)
    .orderBy(desc(Likes.created));

  const countRes = await db
    .select({ count: count() })
    .from(Likes)
    .where(eq(Likes.postId, postId));

  const total = countRes[0]?.count ?? 0;
  const next = offset + limit;

  return { data: likes, nextCursor: next >= total ? null : next };
}

export type LikeData = Awaited<
  ReturnType<typeof postLikesPaginated>
>["data"][number];
