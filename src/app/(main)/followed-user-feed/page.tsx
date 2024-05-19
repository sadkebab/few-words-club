import { PostContextProvider } from "@/components/post/context";
import { FollowedFeed } from "@/components/post/feeds/followed";
import { currentUserData } from "@/modules/server/data/user";

const PAGE_SIZE = 30;
export default async function Page() {
  const id = (await currentUserData()).id;
  const cursorDate = new Date();

  return (
    <PostContextProvider viewerId={id} cursorDate={cursorDate}>
      <FollowedFeed userId={id} pageSize={PAGE_SIZE} />
    </PostContextProvider>
  );
}
