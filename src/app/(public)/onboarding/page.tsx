import { ThemeToggle } from "@/components/theme-toggle";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Fonts } from "@/lib/fonts";
import { Origami } from "lucide-react";
import { OnboardingForm } from "./form";
import { SignOutButton } from "@/components/sign-out-button";
import { Separator } from "@/components/ui/separator";

export default async function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-8">
      <Card backdrop>
        <CardHeader>
          <h1
            className="flex items-center gap-2 text-xl"
            style={Fonts.Syne_Mono.style}
          >
            <Origami className="size-5" /> Create Your Account
          </h1>
        </CardHeader>
        <CardContent>
          <OnboardingForm />
        </CardContent>
        <Separator />
        <CardFooter className="justify-between gap-1 p-6">
          <SignOutButton
            className="p-0 hover:bg-transparent"
            variant={"ghost"}
          />
          <ThemeToggle />
        </CardFooter>
      </Card>
    </div>
  );
}
