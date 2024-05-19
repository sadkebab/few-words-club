"use client";

import { type PostData } from "@/modules/server/data/posts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Fonts } from "@/lib/fonts";
import { Loader2, Origami } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { deletePostAction } from "@/modules/server/actions/posts";
import { toast } from "@/components/ui/use-toast";

export function DeletePostDialog({
  post,
  open,
  setOpen,
}: {
  post: PostData;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [fetching, setFetching] = useState(false);

  const { execute } = useAction(deletePostAction, {
    onExecute: () => {
      setFetching(true);
    },
    onSuccess: () => {
      toast({
        title: "Post deleted",
        description: "The post has been deleted.",
      });
      setOpen(false);
    },
    onError: ({ fetchError, serverError, validationErrors }) => {
      if (serverError) {
        toast({
          title: "Server Error",
          description: serverError,
        });
      }
      if (fetchError) {
        toast({
          title: "Client Error",
          description: fetchError,
        });
      }
      if (validationErrors) {
        toast({
          title: "Validation Error",
          description: Object.keys(validationErrors)
            .map((k) => {
              const s = validationErrors[k as keyof typeof validationErrors];
              return s ? `Field "${k}": ${s.join(", ")}` : "";
            })
            .join("/n"),
        });
      }
    },
    onSettled: () => {
      setFetching(false);
    },
  });

  function submitDelete() {
    if (fetching) return;
    execute({ postId: post.id });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle
            className="flex items-end gap-2"
            style={Fonts.Syne_Mono.style}
          >
            <Origami /> <p>Confirm Deletion</p>
          </DialogTitle>
          <DialogDescription>
            This action is irreversible. Are you sure you want to proceed?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={submitDelete}>
            Delete {fetching && <Loader2 className="size-4 animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
