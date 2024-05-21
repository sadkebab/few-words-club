import { type LikeData } from "@/modules/server/likes/data";
import { Heart } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { UserAvatar } from "../user-avatar";

export function LikeCard({ likeData }: { likeData: LikeData }) {
  return (
    <div className="flex flex-row items-center justify-between border-b p-6">
      <div className="flex flex-row items-center gap-4">
        <UserAvatar userData={likeData.user} className="size-8" />
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
