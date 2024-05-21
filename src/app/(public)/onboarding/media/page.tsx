"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Fonts } from "@/lib/fonts";
import { Camera, Loader2, Origami } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SkipMediaButton } from "./skip-media-button";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { saveUserMediaAction } from "@/modules/server/user-data/actions";
import { useAction } from "next-safe-action/hooks";

import CropSelector from "../../../../components/media/crop-selector";
import { COVER_IMAGE_SIZE, PROFILE_IMAGE_SIZE } from "@/lib/constats";
import { UserDataMediaValidator } from "@/modules/server/files/validators";
import { fileFromBase64 } from "@/lib/utils/b64";
import { uploadFile } from "@/lib/upload";

export default function Page() {
  const [profileImage, setCroppedImage] = useState<string>();
  const [coverImage, setCoverImage] = useState<string>();
  const [fetching, setFetching] = useState(false);
  const { execute } = useAction(saveUserMediaAction, {
    onExecute: () => {
      setFetching(true);
    },
    onSuccess: () => {
      toast({
        title: "Media uploaded",
        description: "You will be redirected to the club.",
      });
      location.reload();
    },
    onError: ({ fetchError, validationErrors, serverError }) => {
      if (serverError) {
        toast({
          title: "Server Error",
          description: serverError,
        });
      }
      if (fetchError) {
        toast({
          title: "Client Error",
          description: fetchError,
        });
      }
      if (validationErrors) {
        toast({
          title: "Validation Error",
          description: JSON.stringify(validationErrors),
        });
      }
    },
    onSettled: () => {
      setFetching(false);
    },
  });

  async function handleSubmit() {
    if (!profileImage) {
      toast({
        title: "Profile picture is required",
        description: "Please select a profile picture",
      });
      return;
    }

    if (fetching) return;
    setFetching(true);

    try {
      const profileFile = await fileFromBase64(profileImage, {
        name: "profile.jpg",
        type: "image/jpeg",
      });

      UserDataMediaValidator.parse(profileFile);

      const coverFile = coverImage
        ? await fileFromBase64(coverImage, {
            name: "cover.jpg",
            type: "image/jpeg",
          })
        : undefined;

      coverFile && UserDataMediaValidator.parse(coverFile);

      const pictureKey = await uploadFile(profileFile, "thumb");

      const coverKey = coverFile
        ? await uploadFile(coverFile, "cover")
        : undefined;

      execute({ picture: pictureKey, cover: coverKey });
    } catch (e) {
      setFetching(false);
    }
  }

  return (
    <div className="flex min-h-dvh w-full items-center justify-center p-8">
      <Card backdrop>
        <CardHeader>
          <h1
            className="flex items-center gap-2 text-xl"
            style={Fonts.Syne_Mono.style}
          >
            <Origami className="size-5" /> Add Picture and Cover
          </h1>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-2">
          <div
            className="w-fit rounded-full border bg-muted/40 bg-cover bg-center"
            style={{
              backgroundImage: profileImage ? `url(${profileImage})` : "",
            }}
          >
            <CropSelector
              aspect={PROFILE_IMAGE_SIZE.ratio}
              toHeight={PROFILE_IMAGE_SIZE.height}
              onCrop={setCroppedImage}
              variant={"unstyled"}
              size={"unsized"}
              className={
                "size-24 rounded-full hover:bg-none hover:backdrop-blur-xs"
              }
            >
              <Camera className="fill-background/40 stroke-foreground/60" />
            </CropSelector>
          </div>
          <p>Profile picture</p>
          <div
            className="w-full rounded-md border bg-muted/40 bg-contain bg-center"
            style={{
              backgroundImage: coverImage ? `url(${coverImage})` : "",
            }}
          >
            <CropSelector
              aspect={COVER_IMAGE_SIZE.ratio}
              toHeight={COVER_IMAGE_SIZE.height}
              variant={"unstyled"}
              size={"unsized"}
              className={"size-24 w-full hover:bg-none hover:backdrop-blur-xs"}
              onCrop={setCoverImage}
            >
              <Camera className="fill-background/40 stroke-foreground/60" />
            </CropSelector>
          </div>
          <p>Cover</p>
        </CardContent>
        <Separator />
        <CardFooter className="justify-between gap-1 p-6">
          <div className="flex flex-row gap-2">
            <ThemeToggle />
            <SkipMediaButton
              className="p-0 hover:bg-transparent"
              variant={"ghost"}
              type="button"
            >
              Skip
            </SkipMediaButton>
          </div>

          <Button disabled={fetching} onClick={handleSubmit}>
            Finish{" "}
            {fetching && <Loader2 className="ml-1 size-4 animate-spin" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
