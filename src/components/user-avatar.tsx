import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { mediaUrl } from "@/lib/utils/urls";
import { DEFAULT_THUMBNAIL } from "@/lib/constats";

export function UserAvatar({
  userData,
  className,
}: {
  userData: {
    username: string;
    displayName: string | null;
    picture: string | null;
  } | null;
  className?: string;
}) {
  return (
    <Link
      className="rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      href={`/${userData?.username}`}
    >
      <Avatar className={className}>
        <AvatarFallback>
          {userData?.displayName?.slice(0, 2) ?? "N/A"}
        </AvatarFallback>
        <AvatarImage src={mediaUrl(userData?.picture ?? DEFAULT_THUMBNAIL)} />
      </Avatar>
    </Link>
  );
}
