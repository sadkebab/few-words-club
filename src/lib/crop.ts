import { type Area } from "react-easy-crop";

function createImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });
}

async function getCroppedImg(source: string, cropArea: Area, toHeight: number) {
  const image = await createImage(source);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx || !cropArea) {
    throw new Error("Could not get cropped image");
  }

  const aspect = cropArea.width / cropArea.height;
  canvas.width = toHeight * aspect;
  canvas.height = toHeight;

  ctx.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    toHeight * aspect,
    toHeight,
  );

  return canvas.toDataURL("image/jpeg");
}

export async function cropImage(
  source: string,
  cropArea: Area,
  toHeight: number,
  onError: (e: unknown) => void,
) {
  try {
    const croppedImage = await getCroppedImg(source, cropArea, toHeight);
    return croppedImage;
  } catch (err) {
    onError(err);
  }
}
