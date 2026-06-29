import { notFound } from "next/navigation";
import { Cover } from "../view-page/Cover";
import DonationCard from "../view-page/DonationCard";
import ProfileInfo from "../view-page/ProfileInfo";
import { Supporter } from "../view-page/Supporter";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  if (!username) notFound();

  const [user, currentUser] = await Promise.all([
    prisma.user.findUnique({
      where: { username },
      include: { profile: true },
    }),
    getCurrentUser(),
  ]);

  const currentUserProfile = currentUser
    ? await prisma.user.findUnique({
        where: { id: currentUser.id },
        include: { profile: true },
      })
    : null;
  if (!user) notFound();

  const { profile } = user;
  const isOwner = currentUser?.id === user.id;

  return (
    <div className="w-full min-h-screen bg-white pb-20">
      <Cover
        id={profile.id}
        cover={profile.backgroundImage}
        isOwner={isOwner}
      />

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
                isOwner={isOwner}
              />
              <Supporter name={profile.name} userId={user.id} />
            </div>

            <div className="w-1/2">
              <DonationCard
                UserSocialUrl={currentUser?.profile?.socialMediaURL ?? ""}
                creatorName={profile.name}
                recipientId={user.id}
                isOwner={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
