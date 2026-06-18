import { Cover } from "./Cover";
import DonationCard from "./DonationCard";
import ProfileInfo from "./ProfileInfo";
import { Supporter } from "./Supporter";
import { prisma } from "@/lib/prisma";

export default async function CreatorPreviewPage() {
  const profile = {
    id: "mock-id",
    name: "Jake",
    about: "I'm a typical person who enjoys exploring different things.",
    avatarImage:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    backgroundImage: null,
  };

  return (
    <div className="w-full min-h-screen bg-white pb-20">
      <Cover id={profile.id} cover={profile.backgroundImage} isOwner={true} />

      <div className="flex justify-center">
        <div className="container px-10">
          <div className="relative z-10 -mt-12 flex gap-6 items-start">
            <div className="flex flex-col gap-4 w-1/2">
              <ProfileInfo
                name={profile.name}
                username={profile.name}
                about={profile.about ?? ""}
                avatar={profile.avatarImage ?? ""}
              />
              <Supporter name={profile.name} />
            </div>

            <div className="w-1/2">
              <DonationCard creatorName={profile.name} />
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
