"use client";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useState } from "react";
import { CreatePostDialog } from "../dialogs/create-post-dialog";

export function CreatePostButton({
  className,
  variant,
  size,
  children,
}: {
  className?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant ?? "default"}
        size={size ?? "lg"}
        className={className}
        onClick={() => setOpen(true)}
      >
        <span className="flex w-full items-center justify-center gap-1">
          {children}
        </span>
      </Button>
      {open && <CreatePostDialog open={open} setOpen={setOpen} />}
    </>
  );
}
