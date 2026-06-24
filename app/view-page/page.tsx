import { cookies } from "next/headers";
import { Cover } from "./Cover";
import DonationCard from "./DonationCard";
import ProfileInfo from "./ProfileInfo";
import { Supporter } from "./Supporter";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/token";

export default async function CreatorPreviewPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) redirect("/login");

  const payload = await verifyToken(token);
  if (!payload) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: payload.sub as string },
    include: { profile: true },
  });
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
//  const profile = await prisma.profile.findFirst();
//   if (!profile)
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="border border-gray-200 rounded-lg p-6 text-sm text-gray-500">
//           Profile олдсонгүй
//         </div>
//       </div>
//     );
