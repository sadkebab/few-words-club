import { PostContextProvider } from "@/components/post/context";
import { SavedFeed } from "@/components/feeds/saved";
import { safe } from "@/lib/safe-actions";
import { currentUserData } from "@/modules/server/data/users";
import { QUERY_PAGE_SIZE } from "@/lib/constats";

export default async function Page() {
  const id = (await safe(currentUserData))?.id;
  const cursorDate = new Date();

  return (
    <PostContextProvider viewerId={id} cursorDate={cursorDate}>
      <SavedFeed pageSize={QUERY_PAGE_SIZE} />
    </PostContextProvider>
  );
}
