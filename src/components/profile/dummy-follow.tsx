import { Button } from "@/components/ui/button";
import { UserPlus2 } from "lucide-react";

export function DummyFollow() {
  return (
    <Button variant={"ghost"} className="flex items-center gap-2">
      <UserPlus2 className="size-4" /> follow
    </Button>
  );
}
