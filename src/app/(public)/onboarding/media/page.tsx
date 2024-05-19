import { ThemeToggle } from "@/components/theme-toggle";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Fonts } from "@/lib/fonts";
import { Origami } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SkipMediaButton } from "./skip-media-button";

export default async function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-8">
      <Card backdrop>
        <CardHeader>
          <h1
            className="flex items-center gap-2 text-xl"
            style={Fonts.Syne_Mono.style}
          >
            <Origami className="size-5" /> Add Picture and Banner
          </h1>
        </CardHeader>
        <CardContent>TODO</CardContent>
        <Separator />
        <CardFooter className="justify-between gap-1 p-6">
          <SkipMediaButton
            className="p-0 hover:bg-transparent"
            variant={"ghost"}
          >
            Skip
          </SkipMediaButton>
          <ThemeToggle />
        </CardFooter>
      </Card>
    </div>
  );
}
