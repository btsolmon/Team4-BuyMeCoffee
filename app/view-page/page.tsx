import { Cover } from "./Cover";
import DonationCard from "./DonationCard";
import ProfileInfo from "./ProfileInfo";
import { Supporter } from "./Supporter";
import { prisma } from "@/lib/prisma";

export default async function CreatorPreviewPage() {
  const user = await prisma.user.findFirst({
    include: { profile: true },
  });
  if (!user) return null;

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
              />
              <Supporter name={profile.name} userId={user.id} />
            </div>
            <div className="w-1/2">
              <DonationCard creatorName={profile.name} recipientId={user.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
