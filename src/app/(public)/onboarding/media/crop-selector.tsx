"use client";

import { Button } from "@/components/ui/button";
import { useState, type ComponentProps } from "react";

import ImageUploading, { type ImageType } from "react-images-uploading";
import Cropper, { type Area, type Point } from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cropImage } from "@/lib/crop";
import { cn } from "@/lib/utils";

const ImageUploadingButton = ({
  value,
  onChange,
  children,
  className,
  ...props
}: Omit<ComponentProps<typeof Button>, "value" | "onChange"> & {
  value: ComponentProps<typeof ImageUploading>["value"];
  onChange: ComponentProps<typeof ImageUploading>["onChange"];
}) => {
  return (
    <ImageUploading value={value} onChange={onChange}>
      {({ onImageUpload, onImageUpdate }) => (
        <Button
          variant={"unstyled"}
          size={"unsized"}
          className={cn("hover:bg-none hover:backdrop-blur-xs", className)}
          onClick={value ? onImageUpload : () => onImageUpdate(0)}
          {...props}
        >
          <div>{children}</div>
        </Button>
      )}
    </ImageUploading>
  );
};

const ImageCropper = ({
  open,
  aspect,
  toHeight,
  setOpen,
  image,
  onComplete,
  ...props
}: {
  aspect: number;
  toHeight: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  image: string | undefined;
  onComplete: (croppedImage: Promise<string | undefined>) => Promise<void>;
} & Partial<
  Omit<
    ComponentProps<typeof Cropper>,
    "crop" | "zoom" | "aspect" | "onCropChange"
  >
>) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Cropper
            style={{
              containerStyle: {
                position: "relative",
                width: "100%",
                height: 300,
                background: "#333",
              },
            }}
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={(_, croppedAreaPixels) => {
              setCroppedAreaPixels(croppedAreaPixels);
            }}
            onZoomChange={setZoom}
            {...props}
          />
        </div>

        <DialogFooter>
          <Button
            color="primary"
            onClick={async () => {
              if (!image || !croppedAreaPixels) return;

              await onComplete(
                cropImage(image, croppedAreaPixels, toHeight, console.log),
              );
            }}
          >
            Finish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function CropSelector({
  aspect,
  toHeight,
  children,
  className,
  onCrop,
}: {
  aspect: number;
  toHeight: number;
  children: React.ReactNode;
  className?: string;
  onCrop: (image: string) => void;
}) {
  const [image, setImage] = useState<ImageType[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <ImageUploadingButton
        value={image}
        className={className}
        onChange={(newImage) => {
          setDialogOpen(true);
          setImage(newImage);
        }}
      >
        {children}
      </ImageUploadingButton>
      <ImageCropper
        toHeight={toHeight}
        aspect={aspect}
        open={dialogOpen}
        setOpen={setDialogOpen}
        image={image.length > 0 ? image[0]!.dataURL : undefined}
        onComplete={async (imagePromisse) => {
          await imagePromisse.then(async (image) => {
            if (image) {
              onCrop(image);
              setDialogOpen(false);
            }
            // setCroppedImage(image);
            // console.log(image);
            // if (image) {
            //   const file = await fileFromBase64(image, {
            //     name: "image.jpg",
            //     type: "image/jpeg",
            //   });
            //   const s = await uploadFile(file, "thumb");
            //   console.log("file key", s);
            // }
            // setDialogOpen(false);
          });
        }}
      />
    </>
  );
}
