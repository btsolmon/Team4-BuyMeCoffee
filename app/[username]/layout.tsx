import AppHeaderLayout from "../components/AppHeaderLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AppHeaderLayout>{children}</AppHeaderLayout>;
}
