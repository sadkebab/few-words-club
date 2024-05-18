import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs/server";
import { Bell, Home, Mail, Bookmark, Cog, User, Search } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignOutButton } from "@/components/sign-out-button";
import { ToolbarButton } from "@/components/client-buttons";
import { Fonts } from "@/lib/fonts";
import { db } from "@/modules/db";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";

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
  const user = await currentUser();

  if (user === null) {
    return (
      <div className="flex flex-1 flex-col justify-between gap-1">
        <div className="flex flex-col gap-1 space-y-2 p-4">
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

  const userData = await db.query.UserData.findFirst({
    where: (data, cmp) => cmp.eq(data.clerkId, user.id),
  });

  const userDisplay =
    userData !== undefined ? (
      <div className="flex items-center gap-4">
        <Avatar className="size-12">
          <AvatarImage src={userData.picture ?? "/default_thumb.png"} />
          <AvatarFallback>{userData.displayName?.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text font-medium">{userData.displayName}</p>
          <p className="text-sm font-light text-muted-foreground">
            @{userData.username}
          </p>
        </div>
      </div>
    ) : (
      <p>user data not found</p>
    );

  return (
    <div className="flex flex-1 flex-col justify-between gap-1">
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="flex flex-col gap-1">
          <ToolbarButton href="/dashboard">
            Feed <Home />
          </ToolbarButton>
          <ToolbarButton href="/notifications">
            Notifications <Bell />
          </ToolbarButton>
          <ToolbarButton href="/messages">
            Messages <Mail />
          </ToolbarButton>
          <ToolbarButton href="/saved">
            Saved <Bookmark />
          </ToolbarButton>
          <ToolbarButton href="/profile">
            Profile <User />
          </ToolbarButton>
          <ToolbarButton href="/search">
            Search <Search />
          </ToolbarButton>
        </div>
        <Button variant={"default"} size={"lg"}>
          Create Post
        </Button>
      </div>

      <div className="flex flex-col gap-4 border-t p-4">
        {userDisplay}
        <div className="flex justify-between">
          <div className="flex gap-1">
            <Button variant={"outline"} size={"icon"} asChild>
              <Link href="/settings">
                <Cog />
              </Link>
            </Button>
            <ThemeToggle />
          </div>
          <SignOutButton className="w-fit" variant={"outline"}>
            Sign Out
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}
