"use client";

import { CardHeader } from "@/components/ui/card";
import { type FollowerData } from "@/modules/server/follows/data";
import { FollowButton } from "./follow-unfollow";
import Link from "next/link";
import { UserAvatar } from "../user-avatar";
import { Skeleton } from "../ui/skeleton";

export function Follower({ followerData }: { followerData: FollowerData }) {
  return (
    <div className="border-b">
      <CardHeader className="flex flex-row items-center justify-between">
        <Link href={`/${followerData.username}`}>
          <div className="flex items-center gap-4">
            <UserAvatar userData={followerData} className="size-12" />
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
  return (
    <CardHeader className="flex flex-row gap-2 border-b">
      <div className="flex flex-1 items-center gap-2">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex flex-col">
          <Skeleton className="mb-1 h-5 w-32 rounded-sm" />
          <Skeleton className="h-3 w-20 rounded-sm" />
        </div>
      </div>
      <div className="w-[113px] items-center justify-center">
        <Skeleton className="mt-1 h-8 w-full rounded-sm" />
      </div>
    </CardHeader>
  );
}
