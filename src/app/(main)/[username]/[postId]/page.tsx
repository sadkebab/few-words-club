import { safe } from "@/lib/safe-actions";
import { userPost } from "@/modules/server/data/posts";
import { currentUserData, usernameId } from "@/modules/server/data/users";
import { PostView } from "../../../../components/post/post-view";
import { GhostPlaceholder } from "@/components/ghost-placeholder";

export default async function Page({
  params: { username, postId },
}: {
  params: { username: string; postId: string };
}) {
  const userId = await safe(() => usernameId(username));

  if (userId === undefined) {
    return <GhostPlaceholder>User not found.</GhostPlaceholder>;
  }

  const [viewer, post] = await Promise.all([
    safe(currentUserData),
    userPost(userId, postId),
  ]);

  if (!post) {
    return <GhostPlaceholder>Post not found.</GhostPlaceholder>;
  }

  return (
    <div className="w-full">
      <PostView viewerId={viewer?.id ?? ""} postData={post} />
    </div>
  );
}
