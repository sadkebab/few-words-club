import { usernameId } from "@/modules/server/data/users";
import { PostContextProvider } from "@/components/post/context";
import { FollowingList } from "@/components/profile/lists/following";
import { QUERY_PAGE_SIZE } from "@/lib/constats";

export default async function Page({
  params: { username },
}: {
  params: { username: string };
}) {
  const id = await usernameId(username);
  const cursorDate = new Date();

  return (
    <PostContextProvider viewerId={id} cursorDate={cursorDate}>
      <FollowingList userId={id} pageSize={QUERY_PAGE_SIZE} />
    </PostContextProvider>
  );
}
