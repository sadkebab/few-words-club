import { Ghost } from "lucide-react";

export function GhostPlaceholder({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-1 items-center justify-center border-t p-16">
      <div className="flex flex-col items-center justify-between">
        <Ghost className="size-[2.5rem] animate-bounce stroke-muted-foreground" />
        <p className="text-center text-lg font-medium text-muted-foreground">
          {children}
        </p>
      </div>
    </div>
  );
}
