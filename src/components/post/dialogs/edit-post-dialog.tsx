"use client";

import { type PostData } from "@/modules/server/data/posts";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { editPostAction } from "@/modules/server/actions/posts";
import { useForm } from "react-hook-form";
import { EditPostSchema } from "@/modules/server/validators/posts";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Fonts } from "@/lib/fonts";
import { Loader2, Origami } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { type z } from "zod";

export function EditPostDialog({
  post,
  open,
  setOpen,
}: {
  post: PostData;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [fetching, setFetching] = useState(false);

  const { execute } = useAction(editPostAction, {
    onExecute: () => {
      setFetching(true);
    },
    onSuccess: () => {
      toast({
        title: "Post edited.",
        description: "You will see the update soon!",
      });
      form.reset();
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

  const form = useForm<z.infer<typeof EditPostSchema>>({
    resolver: zodResolver(EditPostSchema),
    defaultValues: {
      content: post.content,
      postId: post.id,
    },
  });

  function onSubmit(values: z.infer<typeof EditPostSchema>) {
    if (fetching) return;

    if (values.content === post.content) {
      toast({
        title: "No changes",
        description: "You didn't make any changes to the post.",
      });
      return;
    }

    execute(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle
                className="flex items-end gap-2"
                style={Fonts.Syne_Mono.style}
              >
                <Origami /> <p>Edit post</p>
              </DialogTitle>
            </DialogHeader>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea rows={6} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button className="flex items-center gap-2" type="submit">
                Update {fetching && <Loader2 className="size-4 animate-spin" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
