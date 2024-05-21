import { toast } from "@/components/ui/use-toast";
import { fileUploadUrlAction } from "@/modules/server/files/actions";

export async function uploadFile(file: File, type: "thumb" | "cover") {
  const { data, serverError, validationErrors } = await fileUploadUrlAction({
    key: file.name,
    type: type,
    contentType: file.type,
  });

  if (serverError) {
    toast({
      title: `URL signature failed for ${file.name}`,
      description: serverError,
    });
    throw new Error("upload failure");
  }

  if (validationErrors) {
    toast({
      title: `Validation error for ${file.name}`,
      description: JSON.stringify(validationErrors),
    });
    throw new Error("upload failure");
  }

  if (!data) {
    throw new Error("upload failure");
  }

  const response = await fetch(data.url, {
    method: "PUT",
    body: file,
  });

  if (!response.ok) {
    toast({
      title: `Upload failed for ${file.name}`,
      description: `Response status: ${response.status}`,
    });
    throw new Error("upload failure");
  }

  return data.key;
}
