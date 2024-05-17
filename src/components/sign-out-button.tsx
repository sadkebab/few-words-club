"use client";
import { useClerk } from "@clerk/nextjs";
import { Button } from "./ui/button";

export const SignOutButton: React.FC<
  Omit<React.ComponentProps<typeof Button>, "onClick">
> = (props) => {
  const { signOut } = useClerk();
  return (
    <Button {...props} onClick={() => signOut()}>
      Sign Out
    </Button>
  );
};
