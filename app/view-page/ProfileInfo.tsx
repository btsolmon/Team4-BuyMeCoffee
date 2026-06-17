interface ProfileInfoProps {
  name: string;
  username: string;
  about: string | null;
  avatar: string;
}

export default function ProfileInfo({
  name,
  username,
  about,
  avatar,
}: ProfileInfoProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-xl font-bold text-gray-900">{name}</h1>
          </div>
          <button className="px-4 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition">
            Edit page
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-bold text-gray-900">About {name}</h3>
          <p className="mt-2 text-gray-600 text-sm leading-relaxed">
            {about || "No description provided yet."}
          </p>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900">Social media URL</h3>
        <p className="mt-2 text-sm text-gray-600">
          https://buymeacoffee.com/{username}
        </p>
      </div>
    </div>
  );
}
