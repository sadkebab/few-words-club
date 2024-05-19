import { PostContextProvider } from "@/components/post/context";
import { PublicFeed } from "@/components/feeds/public";
import { safe } from "@/lib/safe-actions";
import { currentUserData } from "@/modules/server/data/users";
import { QUERY_PAGE_SIZE } from "@/lib/constats";

export default async function Page() {
  const id = (await safe(currentUserData))?.id;
  const cursorDate = new Date();

  return (
    <PostContextProvider viewerId={id} cursorDate={cursorDate}>
      <PublicFeed pageSize={QUERY_PAGE_SIZE} />
    </PostContextProvider>
  );
}
