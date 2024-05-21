"use client";
import { Loader2, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { updateUserDataAction } from "@/modules/server/user-data/actions";
import { toast } from "../ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { UpdateUserDataSchema } from "@/modules/server/user-data/validators";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Combobox } from "../combobox";
import countries from "@/lib/utils/countries";
import ReactCountryFlag from "react-country-flag";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export function EditProfileButton({
  userData,
}: {
  userData: {
    id: string;
    displayName: string | null;
    bio: string | null;
    location: string | null;
  };
}) {
  const [fetching, setFetching] = useState(false);
  const [open, setOpen] = useState(false);

  const { execute } = useAction(updateUserDataAction, {
    onExecute: () => {
      setFetching(true);
    },
    onSuccess: () => {
      toast({
        title: "Success.",
        description: "Your profile has been updated.",
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

  const form = useForm<z.infer<typeof UpdateUserDataSchema>>({
    resolver: zodResolver(UpdateUserDataSchema),
    defaultValues: {
      displayName: userData.displayName ?? undefined,
      bio: userData.bio ?? undefined,
      country: userData.location ?? undefined,
    },
  });

  function onSubmit(values: z.infer<typeof UpdateUserDataSchema>) {
    if (fetching) return;
    if (
      values.bio === userData.bio &&
      values.displayName === userData.displayName &&
      values.country === userData.location
    ) {
      toast({
        title: "No changes.",
        description: "You haven't made any changes.",
      });
      return;
    }
    execute(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"secondary"}
          size={"sm"}
          className="absolute right-2 top-2"
        >
          <Pencil className="mr-1 size-3" /> edit profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>Edit Profile</DialogHeader>
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your display name that can contain spaces and emojis.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <div>
                      <Combobox
                        options={countries.map((x) => ({
                          label: x.name,
                          value: x.iso,
                          icon: (
                            <ReactCountryFlag
                              countryCode={x.iso}
                              svg
                              className="size-4"
                              title={x.name}
                            />
                          ),
                        }))}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>The place you write from.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio (Optional)</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>Something about you.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                Save{" "}
                {fetching && <Loader2 className="ml-2 size-4 animate-spin" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
