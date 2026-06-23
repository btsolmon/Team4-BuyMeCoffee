"use client";
import axios from "axios";
import { Camera, Trash2 } from "lucide-react";
import { useState } from "react";

export const Cover = ({
  cover,
  isOwner,
  id,
}: {
  cover: string | null;
  isOwner: boolean;
  id: string;
}) => {
  const [image, setImage] = useState(cover);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLoading(true);
      const form = new FormData();

      form.append("file", e.target.files[0]);
      form.append("profileId", id);

      form.append("field", "backgroundImage");

      axios
        .put("/api/upload", form)
        .then((res) => {
          setImage(res.data.url);
        })
        .catch((err) => {
          console.error("Ковер хуулахад алдаа гарлаа:", err);
          const errMsg =
            err.response?.data?.error || "Зургийг шинэчилж чадсангүй.";
          alert(errMsg);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleDelete = () => {
    if (!image) return;
    setLoading(true);

    axios
      .delete(`/api/profile?url=${encodeURIComponent(image)}&profileId=${id}`)
      .then(() => {
        setImage(null);
      })
      .catch((err) => {
        console.error("Устгахад алдаа гарлаа:", err);
        alert("Зургийг устгаж чадсангүй.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      className="group relative w-screen h-80 flex items-center justify-center border-b border-gray-200 transition-colors left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]"
      style={{ backgroundColor: image ? undefined : "#F4F4F5" }}
    >
      {loading ? (
        <div className="flex items-center justify-center p-4">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-neutral-800 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {image && (
            <img
              src={image}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}

          {isOwner && (
            <div
              className={`absolute flex gap-2 ${image ? "opacity-0 group-hover:opacity-100 transition-opacity" : "opacity-100"}`}
            >
              {image && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition shadow-sm cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete cover
                </button>
              )}

              <label className="flex items-center gap-2 bg-black/60 hover:bg-black text-white px-4 py-2 rounded-md text-sm font-medium transition shadow-sm cursor-pointer">
                <Camera className="w-4 h-4" />
                {image ? "Change cover" : "Add a cover image"}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleUpload}
                  accept="image/*"
                />
              </label>
            </div>
          )}
        </>
      )}
    </div>
  );
};
