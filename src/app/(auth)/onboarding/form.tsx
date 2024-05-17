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
import { saveUserDataAction } from "@/modules/server/actions/onboarding";
import { useEffect } from "react";
import { saveUserSchema } from "@/modules/server/validators/onboarding";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Combobox } from "@/components/combobox";
import countries from "@/lib/utils/countries";
import ReactCountryFlag from "react-country-flag";

export function OnboardingForm() {
  const { execute, result } = useAction(saveUserDataAction);
  const router = useRouter();
  const { data, serverError, fetchError, validationErrors } = result;

  useEffect(() => {
    if (data?.created) {
      toast({
        title: "Account created.",
        description: "Wellcome to the Few Words Club!",
      });
      router.push("/dashboard");
    }
  }, [data, router]);

  useEffect(() => {
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
  }, [serverError, fetchError, validationErrors]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof saveUserSchema>>({
    resolver: zodResolver(saveUserSchema),
    defaultValues: {
      username: "",
      displayName: "",
      bio: undefined,
      picture: undefined,
      country: undefined,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof saveUserSchema>) {
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
                          title="US"
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

        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
