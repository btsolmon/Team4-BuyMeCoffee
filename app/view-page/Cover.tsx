import { Camera } from "lucide-react";

export const Cover = ({
  cover,
  isOwner,
}: {
  cover: string | null;
  isOwner: boolean;
}) => {
  return (
    <div
      className="relative w-screen h-64 flex items-center justify-center border-b border-gray-200 transition-colors left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]"
      style={{ backgroundColor: cover ? undefined : "#F4F4F5" }}
    >
      {cover ? (
        <img src={cover} alt="Cover" className="w-full h-full object-cover" />
      ) : (
        isOwner && (
          <button className="flex items-center gap-2 bg-black hover:bg-black/80 text-white px-4 py-2 rounded-md text-sm font-medium transition shadow-sm">
            <Camera className="w-4 h-4" />
            Add a cover image
          </button>
        )
      )}
    </div>
  );
};
