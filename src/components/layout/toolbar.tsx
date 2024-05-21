import { Button } from "@/components/ui/button";
import {
  Bell,
  Mail,
  Bookmark,
  Search,
  Globe2,
  UsersRound,
  TrendingUp,
  Origami,
  PenBox,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignOutButton } from "@/components/sign-out-button";
import { ToolbarButton } from "@/components/client-buttons";
import { Fonts } from "@/lib/fonts";

import { CreatePostButton } from "@/components/post/create-post-button";
import { NotificationCounter } from "@/components/notification-counter";
import { UserAvatar } from "@/components/user-avatar";
import { type UserData } from "@/modules/server/user-data/data";

export async function Toolbar({
  userData,
  unread,
}: {
  userData?: UserData;
  unread: { messages: number; notifications: number };
}) {
  if (userData === undefined) {
    return (
      <div className="flex flex-1 flex-col justify-between gap-1">
        <div className="flex flex-col gap-1 space-y-2 p-4">
          <Origami />
          <p style={Fonts.Syne_Mono.style} className="text-xl">
            Looks like you are not a club member.
          </p>
          <Button variant={"default"} size={"lg"} asChild>
            <Link href="/sign-up">Join</Link>
          </Button>
          <Button variant={"secondary"} size={"lg"} asChild>
            <Link href="/sign-in">Enter</Link>
          </Button>
        </div>
        <div className="flex justify-between border-t p-4">
          <ThemeToggle />
        </div>
      </div>
    );
  }

  const userDisplay = (
    <div className="flex items-center gap-4">
      <UserAvatar className="size-12" userData={userData} />

      <div className="flex-1">
        <Link href={`/${userData.username}`}>
          <p className="text font-medium">{userData.displayName}</p>
        </Link>
        <Link href={`/${userData.username}`}>
          <p className="text-sm font-light text-muted-foreground">
            @{userData.username}
          </p>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col justify-between gap-1">
      <div className="flex flex-1 flex-col justify-between p-0 sm:p-4">
        <div className="flex flex-col gap-1">
          <ToolbarButton href="/feed">
            Public Feed
            <Globe2 />
          </ToolbarButton>
          <ToolbarButton href="/followed-user-feed">
            People You Follow
            <UsersRound />
          </ToolbarButton>
          <ToolbarButton href="/trending">
            Trending
            <TrendingUp />
          </ToolbarButton>
          <ToolbarButton href="/saved">
            Saved
            <Bookmark />
          </ToolbarButton>
          <ToolbarButton href="/messages">
            Messages
            <Mail />
          </ToolbarButton>
          <ToolbarButton href="/notifications">
            <NotificationCounter
              count={unread.notifications}
              userId={userData.id}
            >
              Notifications
            </NotificationCounter>
            <Bell />
          </ToolbarButton>
          <ToolbarButton href="/search">
            Search
            <Search />
          </ToolbarButton>
        </div>
        <CreatePostButton>
          <PenBox className="size-4 sm:size-auto" /> Write Something
        </CreatePostButton>
      </div>

      <div className="hidden flex-col gap-4 border-t p-4 sm:flex">
        {userDisplay}
        <div className="flex justify-between">
          <div className="flex gap-1">
            <Button variant={"outline"} size={"icon"} asChild>
              <Link href="/about">
                <Origami />
              </Link>
            </Button>

            <ThemeToggle />
          </div>
          <div className="flex gap-1">
            <SignOutButton className="w-fit" variant={"outline"}>
              Sign Out
            </SignOutButton>
          </div>
        </div>
      </div>
    </div>
  );
}
