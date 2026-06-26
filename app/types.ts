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

export interface BankCard {
  id: string;
  country: string;
  firstName: string;
  lastName: string;
  cardNumber: string;
  expiryDate: string;
}

export interface CurrentUser {
  id: string;
  username: string;
  email: string;
  profile: Profile;
  bankCard?: BankCard | null;
}

export type EarningsRange = "Last 30 days" | "Last 90 days" | "All time";

export const EARNINGS_OPTIONS: EarningsRange[] = [
  "Last 30 days",
  "Last 90 days",
  "All time",
];

export const EARNINGS_DAYS: Record<EarningsRange, number | null> = {
  "Last 30 days": 30,
  "Last 90 days": 90,
  "All time": null,
};

export const AMOUNT_OPTIONS: { label: string; value: AmountValue | null }[] = [
  { label: "All amounts", value: null },
  { label: "$1", value: 1 },
  { label: "$2", value: 2 },
  { label: "$5", value: 5 },
  { label: "$10", value: 10 },
];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
