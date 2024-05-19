import { safe } from "@/lib/safe-actions";
import { userPost } from "@/modules/server/data/posts";
import { currentUserData, usernameId } from "@/modules/server/data/users";
import { Ghost } from "lucide-react";
import { PostView } from "./client";

export default async function Page({
  params: { username, postId },
}: {
  params: { username: string; postId: string };
}) {
  const userId = await safe(() => usernameId(username));

  if (userId === undefined) {
    return (
      <div className="flex w-full flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-between">
          <Ghost className="size-[2.5rem] animate-bounce stroke-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">
            User not found.
          </p>
        </div>
      </div>
    );
  }
  const [viewer, post] = await Promise.all([
    currentUserData(),
    userPost(userId, postId),
  ]);

  if (!post) {
    return (
      <div className="flex w-full flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-between">
          <Ghost className="size-[2.5rem] animate-bounce stroke-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">
            Post not found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <PostView viewerId={viewer.id} postData={post} />
    </div>
  );
}
