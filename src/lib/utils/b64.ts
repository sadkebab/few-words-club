export async function fileFromBase64(
  base64: string,
  fileOptions: { name: string; type: string },
) {
  const result = await fetch(base64);
  const blob = await result.blob();
  return new File([blob], fileOptions.name, { type: fileOptions.type });
}
