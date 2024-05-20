"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { saveUserDataAction } from "@/modules/server/user-data/actions";
import { useState } from "react";
import { SaveUserSchema } from "@/modules/server/user-data/validators";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Combobox } from "@/components/combobox";
import countries from "@/lib/utils/countries";
import ReactCountryFlag from "react-country-flag";
import { Loader2 } from "lucide-react";

export function OnboardingForm() {
  const [fetching, setFetching] = useState(false);
  const router = useRouter();

  const { execute } = useAction(saveUserDataAction, {
    onExecute: () => {
      setFetching(true);
    },
    onSuccess: () => {
      toast({
        title: "Account created.",
        description: "Wellcome to the Few Words Club!",
      });
      router.push("/feed");
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

  const form = useForm<z.infer<typeof SaveUserSchema>>({
    resolver: zodResolver(SaveUserSchema),
    defaultValues: {
      username: "",
      displayName: "",
      bio: undefined,
      country: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof SaveUserSchema>) {
    if (fetching) return;
    execute(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription>
                URL friendly username that will be used to tag you.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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

        <Button type="submit" className="flex items-center gap-2">
          Save {fetching && <Loader2 className="size-4 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
