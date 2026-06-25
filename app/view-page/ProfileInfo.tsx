import { DialogDemo } from "./Dialog";

export default function ProfileInfo({
  profileId,
  currentAvatar,
  currentName,
  currentAbout,
  username,
  currentSocialMediaURL,
  isOwner = false,
}: {
  profileId: string;
  currentAvatar: string | null;
  currentName: string;
  currentAbout: string | null;
  username: string;
  currentSocialMediaURL?: string | null;
  isOwner?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
              {currentAvatar && (
                <img
                  src={currentAvatar}
                  alt={currentName}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <h1 className="text-xl font-bold text-gray-900">{currentName}</h1>
          </div>
          {isOwner && (
            <DialogDemo
              profileId={profileId}
              currentAvatar={currentAvatar ?? undefined}
              currentName={currentName}
              currentAbout={currentAbout ?? undefined}
              currentSocialMediaURL={currentSocialMediaURL ?? undefined}
            />
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-bold text-gray-900">
            About {currentName}
          </h3>
          <p className="mt-2 text-gray-600 text-sm leading-relaxed">
            {currentAbout || "No description provided yet."}
          </p>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900">Social media URL</h3>
        <p className="mt-2 text-sm text-gray-600">
          {process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/
          {username}
        </p>
      </div>
    </div>
  );
}
