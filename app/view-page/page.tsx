import { Cover } from "./Cover";
import DonationCard from "./DonationCard";
import ProfileInfo from "./ProfileInfo";
import { Supporter } from "./Supporter";

export default function CreatorPreviewPage() {
  const user = {
    name: "Jake",
    username: "spacerulz44",
    about:
      "I'm a typical person who enjoys exploring different things. I also make music art as a hobby. Follow me along.",
    avatarImage:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
  };

  return (
    <div className="w-full min-h-screen bg-white pb-20">
      <Cover cover={null} isOwner={true} />

      <div className="flex justify-center">
        <div className="container px-10">
          <div className="relative z-10 -mt-12 flex gap-6 items-start">
            <div className="flex flex-col gap-4 w-1/2">
              <ProfileInfo
                name={user.name}
                username={user.username}
                about={user.about}
                avatar={user.avatarImage}
              />
              <Supporter name={user.name} />
            </div>

            <div className="w-1/2">
              <DonationCard creatorName={user.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
