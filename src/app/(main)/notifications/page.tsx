import { NotificationList } from "@/components/notifications/notification-list";
import { QUERY_PAGE_SIZE } from "@/lib/constats";

export default async function Page() {
  return <NotificationList pageSize={QUERY_PAGE_SIZE} />;
}
