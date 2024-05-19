import { Ghost } from "lucide-react";

export default function Page() {
  return (
    <div className="flex w-full flex-1 items-center justify-center">
      <div className="flex flex-col items-center justify-between">
        <Ghost className="size-[2.5rem] animate-bounce stroke-muted-foreground" />
        <p className="text-lg font-medium text-muted-foreground">
          Page not found.
        </p>
      </div>
    </div>
  );
}
