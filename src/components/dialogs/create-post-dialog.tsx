"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { createPostAction } from "@/modules/server/posts/actions";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePostSchema } from "@/modules/server/posts/validators";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Origami } from "lucide-react";
import { Fonts } from "@/lib/fonts";
import { Button } from "@/components/ui/button";

export function CreatePostDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [fetching, setFetching] = useState(false);

  const { execute } = useAction(createPostAction, {
    onExecute: () => {
      setFetching(true);
    },
    onSuccess: () => {
      toast({
        title: "Post created.",
        description: "It will show up in your feed soon!",
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

  const form = useForm<z.infer<typeof CreatePostSchema>>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      content: "",
    },
  });

  function onSubmit(values: z.infer<typeof CreatePostSchema>) {
    if (fetching) return;
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
                <Origami /> <p>Say it in few words</p>
              </DialogTitle>
            </DialogHeader>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea rows={6} placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button className="flex items-center gap-2" type="submit">
                Post {fetching && <Loader2 className="size-4 animate-spin" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
