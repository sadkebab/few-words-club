import { usernameId } from "@/modules/server/data/users";
import { PostContextProvider } from "@/components/post/context";
import { FollowingList } from "@/components/post/profile/lists/following";

const PAGE_SIZE = 30;
export default async function Page({
  params: { username },
}: {
  params: { username: string };
}) {
  const id = await usernameId(username);
  const cursorDate = new Date();

  return (
    <PostContextProvider viewerId={id} cursorDate={cursorDate}>
      <FollowingList userId={id} pageSize={PAGE_SIZE} />
    </PostContextProvider>
  );
}
