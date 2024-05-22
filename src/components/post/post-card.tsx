"use client";

import { type PostData } from "@/modules/server/posts/data";
import { CardContent, CardFooter, CardHeader } from "../ui/card";

import { Bookmark, Heart } from "lucide-react";
import { Button } from "../ui/button";
import { usePostContext } from "./context";
import { useAction } from "next-safe-action/hooks";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "../ui/use-toast";
import { Skeleton } from "../ui/skeleton";
import { humanDateDiff } from "@/lib/react/date";
import { CounterLabel } from "../counter";
import Link from "next/link";
import { PostOptionsButton } from "./post-options-button";
import {
  likePostAction,
  unlikePostAction,
} from "@/modules/server/likes/actions";
import {
  savePostAction,
  unsavePostAction,
} from "@/modules/server/saves/actions";
import { UserAvatar } from "../user-avatar";

export function PostCard({ post }: { post: PostData }) {
  const { viewerId, cursorDate } = usePostContext();
  const canEdit = viewerId === post.author?.id;

  return (
    <div className="border-b">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          <UserAvatar userData={post.author} className="size-12" />

          <div className="flex flex-col leading-none">
            <Link href={`/${post.author?.username}`}>
              <h3 className="font-medium">{post.author?.displayName}</h3>
            </Link>

            <p className="text-sm font-light">
              <Link href={`/${post.author?.username}`}>
                <span>@{post.author?.username}</span>
              </Link>
              {" · "}
              <Link href={`/${post.author?.username}/${post.id}`}>
                <span>{humanDateDiff(post.created, cursorDate)}</span>
              </Link>
            </p>
          </div>
        </div>
        {canEdit && <PostOptionsButton post={post} />}
      </CardHeader>
      <CardContent>
        <Link
          className="focus-visible:underline focus-visible:ring-0"
          href={`/${post.author?.username}/${post.id}`}
        >
          <p>{post.content}</p>
        </Link>
      </CardContent>
      <CardFooter className="flex gap-1">
        {viewerId ? (
          <>
            <LikeButton
              liked={post.liked}
              postId={post.id}
              count={post.likeCount}
            />
            <SaveButton
              saved={post.saved}
              postId={post.id}
              count={post.saveCount}
            />{" "}
          </>
        ) : (
          <>
            <Button variant={"ghost"} size={"icon"} asChild>
              <Link href="/sign-in">
                <Heart />
              </Link>
            </Button>
            <CounterLabel count={post.likeCount} />
            <Button variant={"ghost"} size={"icon"} asChild>
              <Link href="/sign-in">
                <Bookmark />
              </Link>
            </Button>
            <CounterLabel count={post.saveCount} />
          </>
        )}
      </CardFooter>
    </div>
  );
}

function LikeButton({
  liked,
  postId,
  count,
}: {
  liked: boolean;
  postId: string;
  count: number;
}) {
  const [optimisticLike, setOptimisticLike] = useState(liked);
  const [optimisticCount, setOptimisticCount] = useState(count);

  useEffect(() => {
    setOptimisticLike(liked);
  }, [liked]);

  useEffect(() => {
    setOptimisticCount(count);
  }, [count]);

  const { execute: like } = useAction(likePostAction, {
    onExecute: () => {
      setOptimisticLike(true);
      setOptimisticCount((c) => c + 1);
    },
    onError: ({ fetchError, serverError, validationErrors }) => {
      if (serverError) {
        toast({
          title: "Server Error",
          content: serverError,
        });
      }
      if (fetchError) {
        toast({
          title: "Client Error",
          content: fetchError,
        });
      }
      if (validationErrors) {
        toast({
          title: "Validation Error",
          content: JSON.stringify(validationErrors),
        });
      }
      setOptimisticLike(false);
      setOptimisticCount((c) => c - 1);
    },
  });

  const handleLike = useCallback(() => {
    like({ postId });
  }, [postId, like]);

  const { execute: unlike } = useAction(unlikePostAction, {
    onExecute: () => {
      setOptimisticLike(false);
      setOptimisticCount((c) => c - 1);
    },
    onError: ({ fetchError, serverError, validationErrors }) => {
      if (serverError) {
        toast({
          title: "Server Error",
          content: serverError,
        });
      }
      if (fetchError) {
        toast({
          title: "Client Error",
          content: fetchError,
        });
      }
      if (validationErrors) {
        toast({
          title: "Validation Error",
          content: JSON.stringify(validationErrors),
        });
      }
      setOptimisticLike(true);
      setOptimisticCount((c) => c + 1);
    },
  });

  const handleUnlike = useCallback(() => {
    unlike({ postId });
  }, [postId, unlike]);

  const action = useMemo(
    () => (optimisticLike ? handleUnlike : handleLike),
    [handleLike, handleUnlike, optimisticLike],
  );

  return (
    <>
      <Button variant={"ghost"} size={"icon"} onClick={action}>
        {optimisticLike ? (
          <Heart className="fill-red-500 stroke-red-500" />
        ) : (
          <Heart />
        )}
      </Button>
      <CounterLabel count={optimisticCount} />
    </>
  );
}

function SaveButton({
  saved,
  postId,
  count,
}: {
  saved: boolean;
  postId: string;
  count: number;
}) {
  const [optimisticSave, setOptimisticSave] = useState(saved);
  const [optimisticCount, setOptimisticCount] = useState(count);

  useEffect(() => {
    setOptimisticSave(saved);
  }, [saved]);

  useEffect(() => {
    setOptimisticCount(count);
  }, [count]);

  const { execute: save } = useAction(savePostAction, {
    onExecute: () => {
      setOptimisticSave(true);
      setOptimisticCount((c) => c + 1);
    },
    onError: ({ fetchError, serverError, validationErrors }) => {
      if (serverError) {
        toast({
          title: "Server Error",
          content: serverError,
        });
      }
      if (fetchError) {
        toast({
          title: "Client Error",
          content: fetchError,
        });
      }
      if (validationErrors) {
        toast({
          title: "Validation Error",
          content: JSON.stringify(validationErrors),
        });
      }
      setOptimisticSave(false);
      setOptimisticCount((c) => c - 1);
    },
  });

  const handleSave = useCallback(() => {
    save({ postId });
  }, [postId, save]);

  const { execute: unsave } = useAction(unsavePostAction, {
    onExecute: () => {
      setOptimisticSave(false);
      setOptimisticCount((c) => c - 1);
    },
    onError: ({ fetchError, serverError, validationErrors }) => {
      if (serverError) {
        toast({
          title: "Server Error",
          content: serverError,
        });
      }
      if (fetchError) {
        toast({
          title: "Client Error",
          content: fetchError,
        });
      }
      if (validationErrors) {
        toast({
          title: "Validation Error",
          content: JSON.stringify(validationErrors),
        });
      }
      setOptimisticSave(true);
      setOptimisticCount((c) => c + 1);
    },
  });

  const handleUnsave = useCallback(() => {
    unsave({ postId });
  }, [postId, unsave]);

  const action = useMemo(
    () => (optimisticSave ? handleUnsave : handleSave),
    [handleSave, handleUnsave, optimisticSave],
  );

  return (
    <>
      <Button variant={"ghost"} size={"icon"} onClick={action}>
        {optimisticSave ? (
          <Bookmark className="fill-black dark:fill-white" />
        ) : (
          <Bookmark />
        )}
      </Button>
      <CounterLabel count={optimisticCount} />
    </>
  );
}

export function PostSkeleton() {
  return (
    <div>
      <CardHeader className="flex flex-row gap-2">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex flex-col">
          <Skeleton className="mb-1 h-5 w-32 rounded-sm" />
          <Skeleton className="h-3 w-20 rounded-sm" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-6 w-full rounded-sm" />
        <Skeleton className="mt-1 h-6 w-24 rounded-sm sm:w-96" />
      </CardContent>
      <CardFooter className="flex gap-1"></CardFooter>
    </div>
  );
}
