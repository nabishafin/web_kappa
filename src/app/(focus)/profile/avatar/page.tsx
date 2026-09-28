import type { Metadata } from "next";
import { AvatarPicker } from "./avatar-picker";

export const metadata: Metadata = {
  title: "Select an avatar",
  robots: { index: false },
};

export default function AvatarPage() {
  return <AvatarPicker />;
}
