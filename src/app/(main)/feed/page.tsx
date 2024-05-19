import { PostContextProvider } from "@/components/post/context";
import { PublicFeed } from "@/components/post/feed";
import { safe } from "@/lib/safe-actions";
import { currentUserData } from "@/modules/server/data/user";

const PAGE_SIZE = 30;
export default async function Page() {
  const id = (await safe(currentUserData))?.id;
  const cursorDate = new Date();

  return (
    <PostContextProvider viewerId={id} cursorDate={cursorDate}>
      <PublicFeed pageSize={PAGE_SIZE} />
    </PostContextProvider>
  );
}
