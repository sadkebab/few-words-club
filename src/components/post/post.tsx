"use client";

import { type PostData } from "@/modules/server/data/posts";
import { CardContent, CardFooter, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { Bookmark, Heart } from "lucide-react";
import { Button } from "../ui/button";
import { usePostContext } from "./context";
import { useAction } from "next-safe-action/hooks";
import {
  likePostAction,
  savePostAction,
  unlikePostAction,
  unsavePostAction,
} from "@/modules/server/actions/posts";
import { useCallback, useMemo, useState } from "react";
import { toast } from "../ui/use-toast";
import { api } from "@/modules/trpc/react";
import { Skeleton } from "../ui/skeleton";
import { humanDateDiff } from "@/lib/react/date";
import { CounterLabel } from "../counter";
import Link from "next/link";
import { PostOptionsButton } from "./post-options-button";

export function Post({ postData }: { postData: PostData }) {
  const { data: post, refetch } = api.posts.single.useQuery(
    {
      postId: postData.id,
    },
    {
      initialData: postData,
    },
  );

  const utils = api.useUtils();
  const abort = async () => {
    await utils.posts.single.cancel();
  };
  const { viewerId, cursorDate } = usePostContext();
  const canEdit = viewerId === post.author?.id;

  return (
    <div className="">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          <Link href={`/${post.author?.username}`}>
            <Avatar className="size-12">
              <AvatarFallback>
                {post.author?.displayName?.slice(0, 2) ?? "N/A"}
              </AvatarFallback>
              <AvatarImage src={post.author?.picture ?? "/default_thumb.png"} />
            </Avatar>
          </Link>
          <div className="flex flex-col leading-none">
            <Link href={`/${post.author?.username}`}>
              <h3 className="font-medium">{post.author?.displayName}</h3>
            </Link>

            <p className="text-sm font-light">
              <Link href={`/${post.author?.username}`}>
                <span>@{post.author?.username}</span>
              </Link>
              {" · "}
              <Link href={`/${post.author?.username}/post/${post.id}`}>
                <span>{humanDateDiff(post.created, cursorDate)}</span>
              </Link>
            </p>
          </div>
        </div>
        {canEdit && <PostOptionsButton post={post} />}
      </CardHeader>
      <Link href={`/${post.author?.username}/post/${post.id}`}>
        <CardContent>{post.content}</CardContent>
      </Link>
      <CardFooter className="flex gap-1">
        {viewerId ? (
          <>
            <LikeButton
              liked={post.liked}
              postId={post.id}
              count={post.likeCount}
              refetch={refetch}
              abort={abort}
            />
            <SaveButton
              saved={post.saved}
              postId={post.id}
              count={post.saveCount}
              refetch={refetch}
              abort={abort}
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
  refetch,
  abort,
}: {
  liked: boolean;
  postId: string;
  count: number;
  refetch: () => void;
  abort: () => void;
}) {
  const [optimisticLike, setOptimisticLike] = useState(liked);
  const [optimisticCount, setOptimisticCount] = useState(count);

  const { execute: like } = useAction(likePostAction, {
    onExecute: () => {
      abort();
      setOptimisticLike(true);
      setOptimisticCount((prev) => prev + 1);
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
    },
    onSettled: () => {
      refetch();
    },
  });

  const handleLike = useCallback(() => {
    like({ postId });
  }, [postId, like]);

  const { execute: unlike } = useAction(unlikePostAction, {
    onExecute: () => {
      abort();
      setOptimisticLike(false);
      setOptimisticCount((prev) => prev - 1);
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
    },
    onSettled: () => {
      refetch();
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
  refetch,
  abort,
}: {
  saved: boolean;
  postId: string;
  count: number;
  refetch: () => void;
  abort: () => void;
}) {
  const [optimisticSave, setOptimisticSave] = useState(saved);
  const [optimisticCount, setOptimisticCount] = useState(count);

  const { execute: save } = useAction(savePostAction, {
    onExecute: () => {
      abort();
      setOptimisticSave(true);
      setOptimisticCount((prev) => prev + 1);
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
    },
    onSettled: () => {
      refetch();
    },
  });

  const handleSave = useCallback(() => {
    save({ postId });
  }, [postId, save]);

  const { execute: unsave } = useAction(unsavePostAction, {
    onExecute: () => {
      abort();
      setOptimisticSave(false);
      setOptimisticCount((prev) => prev - 1);
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
    },
    onSettled: () => {
      refetch();
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
        <Skeleton className="mt-1 h-6 w-96 rounded-sm" />
      </CardContent>
      <CardFooter className="flex gap-1"></CardFooter>
    </div>
  );
}
