import { NotificationList } from "@/components/notifications/notification-list";
import { QUERY_PAGE_SIZE } from "@/lib/constats";
import { unstable_noStore } from "next/cache";

export default async function Page() {
  unstable_noStore();
  return <NotificationList pageSize={QUERY_PAGE_SIZE} />;
}
