"use client";

import { Button } from "@/components/ui/button";
import { type ComponentProps, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { skipMediaOnboardingAction } from "@/modules/server/actions/onboarding";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ActionButtonProps = Omit<ComponentProps<typeof Button>, "onClick">;

export function SkipMediaButton({
  children,
  className,
  ...props
}: ActionButtonProps) {
  const [fetching, setFetching] = useState(false);
  const router = useRouter();
  const { execute } = useAction(skipMediaOnboardingAction, {
    onExecute: () => {
      setFetching(true);
    },
    onSuccess: () => {
      toast({
        title: "Skipped",
        description: "Redirecting to the feed page",
      });
      router.refresh();
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

  return (
    <Button
      {...props}
      className={cn("flex items-center gap-2", className)}
      onClick={() => execute(null)}
    >
      {children} {fetching && <Loader2 className="size-4 animate-spin" />}
    </Button>
  );
}
