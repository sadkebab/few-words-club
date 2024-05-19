"use client";

import { type PostData } from "@/modules/server/data/posts";
import { CardContent, CardFooter, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { Bookmark, Heart, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { usePostContext } from "./context";
import { useAction } from "next-safe-action/hooks";
import {
  likePostAction,
  savePostAction,
  unlikePostAction,
  unsavePostAction,
} from "@/modules/server/actions/posts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "../ui/use-toast";
import { api } from "@/modules/trpc/react";
import { Skeleton } from "../ui/skeleton";
import { humanDateDiff } from "@/lib/react/date";
import { CounterLabel } from "../counter";
import Link from "next/link";

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
          <Avatar className="size-12">
            <AvatarFallback>
              {post.author?.displayName?.slice(0, 2) ?? "N/A"}
            </AvatarFallback>
            <AvatarImage src={post.author?.picture ?? "/default_thumb.png"} />
          </Avatar>
          <div className="flex flex-col leading-none">
            <h3 className="font-medium">{post.author?.displayName}</h3>
            <p className="text-sm font-light">
              @{post.author?.username} ·{" "}
              {humanDateDiff(post.created, cursorDate)}
            </p>
          </div>
        </div>
        {canEdit && (
          <Button variant={"ghost"} size={"icon"}>
            <Pencil />
          </Button>
        )}
      </CardHeader>
      <CardContent>{post.content}</CardContent>
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

  const { execute: like, result: likeResult } = useAction(likePostAction);
  const handleLike = useCallback(() => {
    abort();
    setOptimisticLike(true);
    setOptimisticCount((prev) => prev + 1);
    like({ postId });
  }, [postId, like, abort]);

  const { execute: unlike, result: unlikeResult } = useAction(unlikePostAction);
  const handleUnlike = useCallback(() => {
    abort();
    setOptimisticLike(false);
    setOptimisticCount((prev) => prev - 1);
    unlike({ postId });
  }, [postId, unlike, abort]);

  const action = useMemo(
    () => (optimisticLike ? handleUnlike : handleLike),
    [handleLike, handleUnlike, optimisticLike],
  );

  useEffect(() => {
    if (likeResult.fetchError) {
      toast({
        title: "Client Error",
        content: likeResult.fetchError,
      });
    }

    if (likeResult.serverError) {
      toast({
        title: "Server Error",
        content: likeResult.serverError,
      });
    }

    if (likeResult.validationErrors) {
      toast({
        title: "Validation Error",
        content: JSON.stringify(likeResult.validationErrors),
      });
    }

    if (
      likeResult.data ??
      likeResult.fetchError ??
      likeResult.serverError ??
      likeResult.validationErrors
    ) {
      refetch();
    }
  }, [likeResult, refetch]);

  useEffect(() => {
    if (unlikeResult.fetchError) {
      toast({
        title: "Client Error",
        content: unlikeResult.fetchError,
      });
    }

    if (unlikeResult.serverError) {
      toast({
        title: "Server Error",
        content: unlikeResult.serverError,
      });
    }

    if (unlikeResult.validationErrors) {
      toast({
        title: "Validation Error",
        content: JSON.stringify(unlikeResult.validationErrors),
      });
    }

    if (
      unlikeResult.data ??
      unlikeResult.fetchError ??
      unlikeResult.serverError ??
      unlikeResult.validationErrors
    ) {
      refetch();
    }
  }, [unlikeResult, refetch]);

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

  const { execute: save, result: saveResult } = useAction(savePostAction);
  const handleSave = useCallback(() => {
    abort();
    setOptimisticSave(true);
    setOptimisticCount((prev) => prev + 1);
    save({ postId });
  }, [postId, save, abort]);

  const { execute: unsave, result: unsaveResult } = useAction(unsavePostAction);
  const handleUnsave = useCallback(() => {
    abort();
    setOptimisticSave(false);
    setOptimisticCount((prev) => prev - 1);
    unsave({ postId });
  }, [postId, unsave, abort]);

  const action = useMemo(
    () => (optimisticSave ? handleUnsave : handleSave),
    [handleSave, handleUnsave, optimisticSave],
  );

  useEffect(() => {
    if (saveResult.fetchError) {
      toast({
        title: "Client Error",
        content: saveResult.fetchError,
      });
    }

    if (saveResult.serverError) {
      toast({
        title: "Server Error",
        content: saveResult.serverError,
      });
    }

    if (saveResult.validationErrors) {
      toast({
        title: "Validation Error",
        content: JSON.stringify(saveResult.validationErrors),
      });
    }

    if (
      saveResult.data ??
      saveResult.fetchError ??
      saveResult.serverError ??
      saveResult.validationErrors
    ) {
      refetch();
    }
  }, [saveResult, refetch]);

  useEffect(() => {
    if (unsaveResult.fetchError) {
      toast({
        title: "Client Error",
        content: unsaveResult.fetchError,
      });
    }

    if (unsaveResult.serverError) {
      toast({
        title: "Server Error",
        content: unsaveResult.serverError,
      });
    }

    if (unsaveResult.validationErrors) {
      toast({
        title: "Validation Error",
        content: JSON.stringify(unsaveResult.validationErrors),
      });
    }

    if (
      unsaveResult.data ??
      unsaveResult.fetchError ??
      unsaveResult.serverError ??
      unsaveResult.validationErrors
    ) {
      refetch();
    }
  }, [unsaveResult, refetch]);

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
