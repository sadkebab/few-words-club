import { Button } from "@/components/ui/button";
import {
  Bell,
  Mail,
  Globe2,
  UsersRound,
  Origami,
  PenBox,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

import { type UserData } from "@/modules/server/user-data/data";
import { CreatePostButton } from "@/components/post/create-post-button";
import { UserAvatar } from "@/components/user-avatar";
import { MobileMenuButton } from "@/components/mobile/menu-button";
import { Badge } from "../ui/badge";

export function MobileToolbar({
  userData,
  unread,
}: {
  userData?: UserData;
  unread: { messages: number; notifications: number };
}) {
  if (userData === undefined) {
    return (
      <div className="flex w-full flex-row gap-2 p-2">
        <div className="flex flex-1 flex-row gap-2">
          <Button className="flex-1" variant={"default"} asChild>
            <Link href="/sign-up">Join</Link>
          </Button>
          <Button className="flex-1" variant={"secondary"} asChild>
            <Link href="/sign-in">Enter</Link>
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant={"outline"} size={"icon"} asChild>
            <Link href="/about">
              <Origami className="size-4" />
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col justify-end gap-2 p-2">
      <div className="relative flex flex-1 flex-row items-center justify-between gap-2">
        <div className="flex items-end gap-2">
          <UserAvatar className="size-9" userData={userData} />
          <Button size={"icon"} variant="outline" asChild>
            <Link className="relative" href={"/notifications"}>
              <Bell className="size-4" />
              {unread.notifications > 0 && (
                <Badge
                  variant={"secondary"}
                  className="absolute -right-1.5 -top-1.5 size-5 items-center justify-center rounded-full p-0"
                >
                  {unread.notifications}
                </Badge>
              )}
            </Link>
          </Button>
          <Button size={"icon"} variant="outline">
            <Link href={"/messages"}>
              <Mail className="size-4" />
              {unread.messages > 0 && (
                <Badge
                  variant={"secondary"}
                  className="absolute -right-1 -top-1 size-4 items-center justify-center rounded-full p-0"
                >
                  {unread.messages}
                </Badge>
              )}
            </Link>
          </Button>
        </div>
        <CreatePostButton size={"icon"} className="scale-125 rounded-full">
          <PenBox className="size-4" />
        </CreatePostButton>
        <div className="flex items-end gap-2">
          <Button variant={"outline"} size={"icon"} asChild>
            <Link href="/">
              <Globe2 className="size-4" />
            </Link>
          </Button>
          <Button variant={"outline"} size={"icon"} asChild>
            <Link href="/followed-user-feed">
              <UsersRound className="size-4" />
            </Link>
          </Button>
          {/* <ThemeToggle /> */}
          <MobileMenuButton>
            <Menu className="size-4" />
          </MobileMenuButton>
        </div>
      </div>
    </div>
  );
}
