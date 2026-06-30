"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

export default function OnboardingPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profileId, setProfileId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [name, setName] = useState("");
    const [birthday, setBirthday] = useState("");
    const [gender, setGender] = useState("");
    const [avatarImage, setAvatarImage] = useState("");

    useEffect(() => {
        fetch("/api/profile/current-user")
            .then((res) => res.json())
            .then((data) => {
                setProfileId(data.profile?.id);
            })
            .catch((err) => {
                console.log("something went wrong", err);
                router.push("/login");
            });
    }, []);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !profileId) return;

        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("profileId", profileId);
        formData.append("field", "avatarImage");

        try {
            const res = await fetch("/api/upload", {
                method: "PUT",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                setError("could not upload image");
                setUploading(false);
                return;
            }

            setAvatarImage(data.url);
        } catch (err) {
            console.log(err);
            setError("upload failed");
        }

        setUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!profileId) {
            setError("Profile not found, try logging in again");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`/api/profile/${profileId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    birthday,
                    gender,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "something went wrong");
                setLoading(false);
                return;
            }

            router.push("/view-page");

        } catch (err) {
            console.log(err);
            setError("network error, try again");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm space-y-4 p-8 border rounded-xl shadow-sm"
            >
                <h1 className="text-xl font-bold">Create your profile</h1>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex justify-center">
                    <div className="relative w-24 h-24">
                        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                            {avatarImage ? (
                                <img
                                    src={avatarImage}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-14 h-14 text-gray-400"
                                >
                                    <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.6-9.8 4.9v2.4h19.6v-2.4c0-3.3-6.5-4.9-9.8-4.9z" />
                                </svg>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleAvatarClick}
                            className="absolute bottom-0 right-0 bg-black text-white rounded-full p-1.5"
                        >
                            <Pencil size={14} />
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                    </div>
                </div>

                {uploading && (
                    <p className="text-xs text-gray-500 text-center">Uploading...</p>
                )}

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                />

                <input
                    type="text"
                    placeholder="MM/DD/YYYY"
                    value={birthday}
                    onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, ""); // remove non-numbers

                        if (value.length > 8) value = value.slice(0, 8);

                        if (value.length >= 5) {
                            value = value.slice(0, 2) + "/" + value.slice(2, 4) + "/" + value.slice(4);
                        } else if (value.length >= 3) {
                            value = value.slice(0, 2) + "/" + value.slice(2);
                        }

                        setBirthday(value);
                    }}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                />

                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                </select>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-black text-white rounded-lg text-sm disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Continue"}
                </button>
            </form>
        </div>
    );
}