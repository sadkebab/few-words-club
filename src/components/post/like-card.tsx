import { type LikeData } from "@/modules/server/data/likes";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DEFAULT_THUMBNAIL } from "@/lib/constats";
import { Heart } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export function LikeCard({ likeData }: { likeData: LikeData }) {
  return (
    <div className="flex flex-row items-center justify-between border-b p-6">
      <div className="flex flex-row items-center gap-4">
        <Avatar className="size-8">
          <AvatarFallback>
            {likeData.user.displayName?.slice(0, 2)}
          </AvatarFallback>
          <AvatarImage src={likeData.user.picture ?? DEFAULT_THUMBNAIL} />
        </Avatar>
        <div className="flex items-center gap-2">
          <span className="font-medium">{likeData.user.displayName}</span>
          <span className="text-sm font-light">@{likeData.user.username}</span>
        </div>
      </div>
      <Heart className="fill-red-500 stroke-red-500" />
    </div>
  );
}
export function LikeCardSkeleton() {
  return (
    <div className="flex flex-row items-center gap-2 border-b p-6">
      <Skeleton className="size-8 rounded-full" />
      <Skeleton className="size-6 w-64" />
    </div>
  );
}
