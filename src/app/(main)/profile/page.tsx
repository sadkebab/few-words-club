import { currentUserData } from "@/modules/server/data/user";
import { UserPosts } from "../../../components/posts/user-posts";
import { PostContextProvider } from "@/components/posts/context";
// import { userPostsPaginated } from "@/modules/server/data/posts";

const PAGE_SIZE = 30;
export default async function Page() {
  const id = (await currentUserData()).id;
  // const initialData = await userPostsPaginated(id, PAGE_SIZE, 0);
  return (
    <PostContextProvider viewerId={id}>
      <UserPosts userId={id} pageSize={PAGE_SIZE} />
    </PostContextProvider>
  );
}
