import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Cover } from "../view-page/Cover";
import DonationCard from "../view-page/DonationCard";
import ProfileInfo from "../view-page/ProfileInfo";
import { Supporter } from "../view-page/Supporter";

export const dynamic = "force-dynamic";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await prisma.user.findUnique({
    where: { username },
    include: { profile: true },
  });

  if (!user) notFound();

  const { profile } = user;

  return (
    <div className="w-full min-h-screen bg-white pb-20">
      <Cover id={profile.id} cover={profile.backgroundImage} isOwner={false} />

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
