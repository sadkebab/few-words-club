import { usernameId } from "@/modules/server/data/user";
import { LikeFeed } from "@/components/post/feeds/like";
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
      <LikeFeed userId={id} pageSize={PAGE_SIZE} />
    </PostContextProvider>
  );
}
