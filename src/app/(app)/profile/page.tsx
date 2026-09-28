import type { Metadata } from "next";
import { Suspense } from "react";
import { ProfileView } from "@/components/profile/profile-view";
import { getContinueWatching, listCommunityCreators, listTitles } from "@/lib/api/catalog";

export const metadata: Metadata = { title: "My Profile", robots: { index: false } };

export default async function ProfilePage() {
  const [creators, titles, history] = await Promise.all([listCommunityCreators(), listTitles(), getContinueWatching()]);
  return (
    <Suspense fallback={<div className="h-[276px] bg-[#080b1c]" />}>
      <ProfileView creators={creators} titles={titles} history={history} />
    </Suspense>
  );
}
