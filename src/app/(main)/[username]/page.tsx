import { usernameId } from "@/modules/server/data/users";
import { UserFeed } from "@/components/post/feeds/user";
import { PostContextProvider } from "@/components/post/context";

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
      <UserFeed userId={id} pageSize={PAGE_SIZE} />
    </PostContextProvider>
  );
}
