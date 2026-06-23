export const NAV_ITEMS = [
  "Home",
  "Explore",
  "View page",
  "Account settings",
] as const;
export type NavItemType = (typeof NAV_ITEMS)[number];

export type AmountValue = 1 | 2 | 5 | 10;

export interface Donation {
  id: string;
  amount: number;
  specialMessage?: string | null;
  socialURLOrBuyMeACoffee?: string | null;
  donorId: string;
  recipientId: string;
  createdAt: Date;
  // UI-д хэрэгтэй нэмэлт талбарууд (Join хийж ирнэ гэж тооцов)
  donor?: {
    username: string;
    profile?: {
      avatarImage?: string | null;
    } | null;
  };
}

export interface Profile {
  id: string;
  name: string;
  about?: string | null;
  avatarImage?: string | null;
  socialMediaURL?: string | null;
  backgroundImage?: string | null;
  successMessage?: string | null;
  username?: string;
}
export type Creator = Profile;
