"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardHeader } from "@/components/ui/card";
import { type FollowerData } from "@/modules/server/follows/data";
import { FollowButton } from "./follow-unfollow";
import Link from "next/link";
import { DEFAULT_THUMBNAIL } from "@/lib/constats";
import { mediaUrl } from "@/lib/utils/urls";

export function Follower({ followerData }: { followerData: FollowerData }) {
  return (
    <div className="border-b">
      <CardHeader className="flex flex-row items-center justify-between">
        <Link href={`/${followerData.username}`}>
          <div className="flex items-center gap-4">
            <Avatar className="size-12">
              <AvatarImage
                src={mediaUrl(followerData.picture ?? DEFAULT_THUMBNAIL)}
              />
              <AvatarFallback>
                {followerData.displayName?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text font-medium">{followerData.displayName}</p>
              <p className="text-sm font-light text-muted-foreground">
                @{followerData.username}
              </p>
            </div>
          </div>
        </Link>
        <FollowButton target={followerData.id} value={followerData.followed} />
      </CardHeader>
    </div>
  );
}

export function FollowerSkeleton() {
  return <></>;
}
