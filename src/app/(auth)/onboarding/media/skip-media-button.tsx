"use client";

import { Button } from "@/components/ui/button";
import { type ComponentProps, useEffect } from "react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { skipMediaOnboardingAction } from "@/modules/server/actions/onboarding";

type ActionButtonProps = Omit<ComponentProps<typeof Button>, "onClick">;

export function SkipMediaButton(props: ActionButtonProps) {
  const { execute, result } = useAction(skipMediaOnboardingAction);
  const router = useRouter();
  const { data, serverError, fetchError, validationErrors } = result;

  useEffect(() => {
    if (data) {
      toast({
        title: "Skipped",
        description: "Redirecting to the feed page",
      });
      router.push("/feed");
    }
  }, [data, router, props]);

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
  return <Button {...props} onClick={() => execute(null)} />;
}
