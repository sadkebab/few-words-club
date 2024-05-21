"use client";
import Image from "next/image";
import CropSelector from "../media/crop-selector";
import { PROFILE_IMAGE_SIZE } from "@/lib/constats";
import { Camera, Loader2 } from "lucide-react";
import { fileFromBase64 } from "@/lib/utils/b64";
import { UserDataMediaValidator } from "@/modules/server/files/validators";
import { uploadFile } from "@/lib/upload";
import { updateProfilePrictureAction } from "@/modules/server/user-data/actions";
import { toast } from "../ui/use-toast";
import { useState } from "react";

export function EditablePicture({ image }: { image: string }) {
  const [fetching, setFetching] = useState(false);

  async function changePicture(fileContent: string) {
    if (fetching) return;
    setFetching(true);
    const file = await fileFromBase64(fileContent, {
      name: "picture.jpg",
      type: "image/jpeg",
    });
    UserDataMediaValidator.parse(file);

    const source = await uploadFile(file, "thumb");
    await updateProfilePrictureAction({ source });
    toast({
      title: "Upload complete",
      description: "Your profile picture has been updated.",
    });
    setFetching(false);
  }

  return (
    <div className="relative -mt-[4.5rem] size-36 rounded-full border-4 border-background bg-muted">
      <Image
        src={image}
        width={144}
        height={144}
        className="rounded-full"
        objectFit="cover"
        alt={"thumbnail"}
      />
      <CropSelector
        toHeight={PROFILE_IMAGE_SIZE.height}
        aspect={PROFILE_IMAGE_SIZE.ratio}
        onCrop={changePicture}
        variant={"outline"}
        size={"icon"}
        className="absolute bottom-0 right-0 rounded-full bg-none"
      >
        {fetching ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Camera className="size-4" />
        )}
      </CropSelector>
    </div>
  );
}
