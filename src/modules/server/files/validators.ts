import { z } from "zod";

const accepted = ["image/jpeg", "image/png"];

export const UserDataMediaValidator = z.instanceof(File).refine((file) => {
  if (file.size > 1024 * 1024 * 0.5) {
    return false;
  }
  if (!accepted.includes(file.type)) {
    throw false;
  }
  return true;
});
