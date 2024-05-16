import { Inter, Syne_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const syneMono = Syne_Mono({
  style: "normal",
  weight: ["400"],
  subsets: ["latin"],
});

export const Fonts = {
  Inter: inter,
  Syne_Mono: syneMono,
};
