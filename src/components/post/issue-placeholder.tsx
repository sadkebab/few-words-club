import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";

export function IssuePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex w-full flex-1 items-center justify-center",
        className,
      )}
    >
      <div className="flex flex-col items-center justify-between p-8">
        <TriangleAlert className="size-[2.5rem] stroke-muted-foreground" />
        <p className="text-lg font-medium text-muted-foreground">
          There was an issue fetching data.
        </p>
      </div>
    </div>
  );
}
