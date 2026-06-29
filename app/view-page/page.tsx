import { redirect } from "next/navigation";
import { Cover } from "./Cover";
import DonationCard from "./DonationCard";
import ProfileInfo from "./ProfileInfo";
import { Supporter } from "./Supporter";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CreatorPreviewPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { profile } = user;
  return (
    <div className="w-full min-h-screen bg-white pb-20">
      <Cover id={profile.id} cover={profile.backgroundImage} isOwner={true} />
      <div className="flex justify-center">
        <div className="container px-10">
          <div className="relative z-10 -mt-12 flex gap-6 items-start">
            <div className="flex flex-col gap-4 w-1/2">
              <ProfileInfo
                profileId={profile.id}
                currentAvatar={profile.avatarImage ?? null}
                currentName={profile.name}
                currentAbout={profile.about ?? null}
                username={user.username}
                currentSocialMediaURL={profile.socialMediaURL}
                isOwner={true}
              />
              <Supporter name={profile.name} userId={user.id} />
            </div>
            <div className="w-1/2">
              <DonationCard
                UserSocialUrl={profile.socialMediaURL ?? ""}
                creatorName={profile.name}
                recipientId={user.id}
                isOwner={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
