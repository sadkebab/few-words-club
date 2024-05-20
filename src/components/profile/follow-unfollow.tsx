"use client";

import { Button } from "@/components/ui/button";
import {
  followUserAction,
  unfollowUserAction,
} from "@/modules/server/follows/actions";
import { UserMinus2, UserPlus2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useCallback, useState } from "react";

export function FollowButton({
  target,
  value,
}: {
  target: string;
  value: boolean;
}) {
  const [optimisticFollow, setOptimisticFollow] = useState(value);
  const [fetching, setFetching] = useState(false);

  const { execute: follow } = useAction(followUserAction, {
    onExecute: () => {
      setOptimisticFollow(true);
      setFetching(true);
    },
    onError: () => {
      setOptimisticFollow(false);
    },
    onSuccess: () => {
      setFetching(false);
    },
  });

  const handleFollow = useCallback(() => {
    if (fetching) return;
    follow({ userId: target });
  }, [fetching, target, follow]);

  const { execute: unfollow } = useAction(unfollowUserAction, {
    onExecute: () => {
      setOptimisticFollow(false);
      setFetching(true);
    },
    onError: () => {
      setOptimisticFollow(true);
    },
    onSuccess: () => {
      setFetching(false);
    },
  });

  const handleUnfollow = useCallback(() => {
    if (fetching) return;
    unfollow({ userId: target });
  }, [fetching, target, unfollow]);

  return optimisticFollow ? (
    <Button
      onClick={handleUnfollow}
      variant={"secondary"}
      className="flex items-center gap-2"
    >
      <UserMinus2 className="size-4" /> unfollow
    </Button>
  ) : (
    <Button
      onClick={handleFollow}
      variant={"secondary"}
      className="flex items-center gap-2"
    >
      <UserPlus2 className="size-4" /> follow
    </Button>
  );
}
