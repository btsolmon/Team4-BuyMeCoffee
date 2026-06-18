"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

export function DialogDemo({
  profileId,
  currentAvatar,
  currentName,
  currentAbout,
}: {
  profileId: string;
  currentAvatar?: string;
  currentName: string;
  currentAbout?: string;
}) {
  const [avatar, setAvatar] = useState(currentAvatar);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("profileId", profileId);

      const res = await fetch("/api/upload", {
        method: "PUT",
        body: form,
      });

      const blob = await res.json();
      setAvatar(blob.url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Edit page
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <div className="flex flex-col items-center gap-2">
            <div
              className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="w-10 h-10 border-4 border-gray-200 border-t-neutral-800 rounded-full animate-spin"></div>
                </div>
              ) : avatar ? (
                <div>
                  <Image
                    src={avatar}
                    alt="Avatar"
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"></div>
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            <span className="text-xs text-gray-500">Change photo</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name-1">Name</Label>
            <Input id="name-1" name="name" defaultValue={currentName} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="username-1">Username</Label>
            <Input
              id="username-1"
              name="username"
              defaultValue={currentAbout ?? ""}
            />
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
