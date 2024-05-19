import { currentUserData } from "@/modules/server/data/user";
import { UserPosts } from "../../../components/posts/user-posts";
import { PostContextProvider } from "@/components/posts/context";

const PAGE_SIZE = 30;
export default async function Page() {
  const id = (await currentUserData()).id;
  const cursorDate = new Date();

  return (
    <PostContextProvider viewerId={id} cursorDate={cursorDate}>
      <UserPosts userId={id} pageSize={PAGE_SIZE} />
    </PostContextProvider>
  );
}
