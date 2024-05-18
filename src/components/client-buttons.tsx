"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
type ToolbarButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "asChild" | "variant"
> & {
  href: string;
};

export function ToolbarButton({
  href,
  className,
  ...props
}: ToolbarButtonProps) {
  const pathname = usePathname();
  const isActive = href === pathname || pathname.startsWith(`${href}/`);

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn("h-12 justify-between gap-1 px-4 text-base", className)}
      {...props}
      asChild
    >
      <Link href={href}>{props.children}</Link>
    </Button>
  );
}

type ProfileSectionButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "variant" | "asChild"
> & {
  href: string;
};

export function ProfileSectionButton({
  href,
  children,
  className,
  ...props
}: ProfileSectionButtonProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Button
      className={cn(isActive && "hover:bg-background", className)}
      variant={isActive ? "outline" : "ghost"}
      {...props}
      asChild
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
