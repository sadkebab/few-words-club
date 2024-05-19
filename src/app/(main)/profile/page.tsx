import { currentUserData } from "@/modules/server/data/user";
import { UserFeed } from "@/components/post/feeds/user";
import { PostContextProvider } from "@/components/post/context";

const PAGE_SIZE = 30;
export default async function Page() {
  const id = (await currentUserData()).id;
  const cursorDate = new Date();

  return (
    <PostContextProvider viewerId={id} cursorDate={cursorDate}>
      <UserFeed userId={id} pageSize={PAGE_SIZE} />
    </PostContextProvider>
  );
}
