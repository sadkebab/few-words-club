import { PostContextProvider } from "@/components/post/context";
import { FollowedFeed } from "@/components/feeds/followed";
import { currentUserData } from "@/modules/server/user-data/data";
import { QUERY_PAGE_SIZE } from "@/lib/constats";

export default async function Page() {
  const id = (await currentUserData()).id;
  const cursorDate = new Date();

  return (
    <PostContextProvider viewerId={id} cursorDate={cursorDate}>
      <FollowedFeed userId={id} pageSize={QUERY_PAGE_SIZE} />
    </PostContextProvider>
  );
}
