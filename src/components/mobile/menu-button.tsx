"use client";

import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Bookmark,
  Globe2,
  Origami,
  Search,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { useState } from "react";

export function MobileMenuButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={className} variant={"outline"} size={"icon"}>
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-[332px] rounded-xl"
        onClick={() => setOpen(false)}
      >
        <DialogHeader>
          <DialogTitle>Menu</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <MobileMenuButtonItem href="/feed">
            Public Feed
            <Globe2 />
          </MobileMenuButtonItem>
          <MobileMenuButtonItem href="/followed-user-feed">
            People You Follow
            <UsersRound />
          </MobileMenuButtonItem>
          <MobileMenuButtonItem href="/trending">
            Trending
            <TrendingUp />
          </MobileMenuButtonItem>
          <MobileMenuButtonItem href="/saved">
            Saved
            <Bookmark />
          </MobileMenuButtonItem>
          <MobileMenuButtonItem href="/search">
            Search
            <Search />
          </MobileMenuButtonItem>
        </div>
        <DialogFooter className="flex flex-row gap-1">
          <Button size={"icon"} variant={"outline"} asChild>
            <Link href={"/about"}>
              <Origami />
            </Link>
          </Button>
          <ThemeToggle />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MobileMenuButtonItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      className="flex w-full justify-between"
      variant={"outline"}
      size={"lg"}
      asChild
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
