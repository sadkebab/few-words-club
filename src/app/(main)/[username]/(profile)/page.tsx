import { usernameId } from "@/modules/server/data/users";
import { UserFeed } from "@/components/feeds/user";
import { PostContextProvider } from "@/components/post/context";
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
      <UserFeed userId={id} pageSize={QUERY_PAGE_SIZE} />
    </PostContextProvider>
  );
}
