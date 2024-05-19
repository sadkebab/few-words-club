"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreatePostDialog } from "./dialogs/create-post-dialog";

export function CreatePostButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant={"default"} size={"lg"} onClick={() => setOpen(true)}>
        Create Post
      </Button>
      {open && <CreatePostDialog open={open} setOpen={setOpen} />}
    </>
  );
}
