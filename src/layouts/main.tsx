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
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignOutButton } from "@/components/sign-out-button";
import { ToolbarButton } from "@/components/client-buttons";
import { Fonts } from "@/lib/fonts";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";

import {
  currentUserData,
  unreadCounter,
} from "@/modules/server/user-data/data";
import { safe } from "@/lib/safe-actions";
import { Badge } from "@/components/ui/badge";
import { CreatePostButton } from "@/components/post/create-post-button";
import { DEFAULT_THUMBNAIL } from "@/lib/constats";
import { NotificationCounter } from "@/components/notification-counter";
import { mediaUrl } from "@/lib/utils/urls";

export async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="fixed -left-1/2 -top-1/2 h-[200vh] w-[200vw] animate-spin-slow bg-confetti bg-cover bg-center bg-no-repeat opacity-50" />
      <main className="flex min-h-screen w-full">
        <div className="flex w-full flex-1 gap-4 p-4 2xl:container">
          <div className="z-10 flex w-[458px]">
            <div className="flex flex-1 rounded-xl border backdrop-blur-md">
              <Toolbar />
            </div>
          </div>
          <div className="flex flex-1 bg-background">
            <div className="flex max-h-[calc(100vh-2rem)] flex-1 flex-nowrap overflow-y-scroll rounded-xl border backdrop-blur-md">
              {children}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

async function Toolbar() {
  const userData = await safe(currentUserData);

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

  const unread = await unreadCounter(userData.id);

  const userDisplay = (
    <div className="flex items-center gap-4">
      <Avatar className="size-12">
        <AvatarImage src={mediaUrl(userData.picture ?? DEFAULT_THUMBNAIL)} />
        <AvatarFallback>{userData.displayName?.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="text font-medium">{userData.displayName}</p>
        <p className="text-sm font-light text-muted-foreground">
          @{userData.username}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col justify-between gap-1">
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="flex flex-col gap-1">
          <ToolbarButton href="/feed">
            Public Feed <Globe2 />
          </ToolbarButton>
          <ToolbarButton href="/followed-user-feed">
            People You Follow <UsersRound />
          </ToolbarButton>
          <ToolbarButton href="/trending">
            Trending <TrendingUp />
          </ToolbarButton>
          <ToolbarButton href="/saved">
            Saved <Bookmark />
          </ToolbarButton>
          <ToolbarButton href="/messages">
            <Counter count={unread.messages}>Messages</Counter>
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
            Search <Search />
          </ToolbarButton>
        </div>
        <CreatePostButton />
      </div>

      <div className="flex flex-col gap-4 border-t p-4">
        <Link href={`/${userData.username}`}>{userDisplay}</Link>
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

function Counter({
  count,
  children,
}: {
  count: number;
  children: React.ReactNode;
}) {
  if (count === 0) {
    return <>{children}</>;
  }

  return (
    <div className="flex gap-2">
      {children}
      <Badge>{count}</Badge>
    </div>
  );
}
