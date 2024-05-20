import { currentUserData, usernameId } from "@/modules/server/user-data/data";
import { UserFeed } from "@/components/feeds/user";
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
      <UserFeed userId={id} pageSize={QUERY_PAGE_SIZE} />
    </PostContextProvider>
  );
}
