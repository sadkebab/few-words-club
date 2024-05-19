"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { type PostData } from "@/modules/server/data/posts";
import { EditPostDialog } from "./dialogs/edit-post-dialog";
import { DeletePostDialog } from "./dialogs/delete-post-dialog";

export function PostOptionsButton({ post }: { post: PostData }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="flex items-center justify-between"
              onClick={() => setEditOpen(true)}
            >
              Edit <Pencil className="size-3" />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center justify-between"
              onClick={() => setDeleteOpen(true)}
            >
              Delete <Trash2 className="size-3" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {editOpen && (
        <EditPostDialog post={post} open={editOpen} setOpen={setEditOpen} />
      )}
      {deleteOpen && (
        <DeletePostDialog
          post={post}
          open={deleteOpen}
          setOpen={setDeleteOpen}
        />
      )}
    </>
  );
}
