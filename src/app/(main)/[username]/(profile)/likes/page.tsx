import { currentUserData, usernameId } from "@/modules/server/data/users";
import { LikeFeed } from "@/components/feeds/like";
import { PostContextProvider } from "@/components/post/context";
import { QUERY_PAGE_SIZE } from "@/lib/constats";
import { safe } from "@/lib/safe-actions";

export default async function Page({
  params: { username },
}: {
  params: { username: string };
}) {
  const id = await usernameId(username);
  const viewerId = (await safe(currentUserData))?.id;
  const cursorDate = new Date();

  return (
    <PostContextProvider viewerId={viewerId} cursorDate={cursorDate}>
      <LikeFeed userId={id} pageSize={QUERY_PAGE_SIZE} />
    </PostContextProvider>
  );
}
