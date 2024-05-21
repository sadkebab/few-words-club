"use client";

import { COVER_IMAGE_SIZE } from "@/lib/constats";
import CropSelector from "../media/crop-selector";
import { Camera, Loader2 } from "lucide-react";
import { fileFromBase64 } from "@/lib/utils/b64";
import { UserDataMediaValidator } from "@/modules/server/files/validators";
import { uploadFile } from "@/lib/upload";
import { updateCoverAction } from "@/modules/server/user-data/actions";
import { toast } from "../ui/use-toast";
import { useState } from "react";

export function EditableCover({ image }: { image: string }) {
  const [fetching, setFetching] = useState(false);

  async function changeCover(fileContent: string) {
    if (fetching) return;
    setFetching(true);
    const file = await fileFromBase64(fileContent, {
      name: "cover.jpg",
      type: "image/jpeg",
    });
    UserDataMediaValidator.parse(file);

    const source = await uploadFile(file, "cover");
    await updateCoverAction({ source });
    toast({
      title: "Upload complete",
      description: "Your cover has been updated.",
    });
    setFetching(false);
  }
  return (
    <div
      className="w-full bg-cover bg-center"
      style={{ backgroundImage: image }}
    >
      <div className="relative h-48">
        <CropSelector
          toHeight={COVER_IMAGE_SIZE.height}
          aspect={COVER_IMAGE_SIZE.ratio}
          onCrop={changeCover}
          variant={"secondary"}
          size={"sm"}
          className="absolute right-2 top-2"
        >
          <span className="flex items-center gap-1">
            {fetching ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Camera className="size-4 " />
            )}
            change cover
          </span>
        </CropSelector>
      </div>
    </div>
  );
}
