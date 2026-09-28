import type { Metadata } from "next";
import { EditProfile } from "./edit-profile-form";

export const metadata: Metadata = {
  title: "Edit Profile",
  robots: { index: false },
};

export default function EditProfilePage() {
  return <EditProfile />;
}
