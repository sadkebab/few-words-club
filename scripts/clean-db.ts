import "dotenv/config";

import { db } from "@/modules/db";
import { Likes, Posts } from "@/modules/db/schema";
import { count, eq } from "drizzle-orm";

/**
 * select fwc_posts.id, fwc_posts.like_count, count(fwc_likes.*) from fwc_posts
 * right join fwc_likes on fwc_posts.id = fwc_likes.post_id GROUP by fwc_posts.id;
 *  */

const list = await db
  .select({
    id: Posts.id,
    likeCount: Posts.likeCount,
    actuallikeCount: count(Likes),
  })
  .from(Posts)
  .rightJoin(Likes, eq(Likes.postId, Posts.id))
  .groupBy(Posts.id);

for (const item of list) {
  if (item.likeCount !== item.actuallikeCount) {
    console.log(
      `⚠️ Post ${item.id} has ${item.actuallikeCount} likes but the materialized count is ${item.likeCount}`,
    );
    await db
      .update(Posts)
      .set({
        likeCount: item.actuallikeCount,
      })
      .where(eq(Posts.id, item.id!));

    console.log(`✅ Like count updated on post ${item.id}`);
  }
}
