import AppHeaderLayout from "../components/AppHeaderLayout";
import { getCurrentUser, toHeaderUser } from "@/lib/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <AppHeaderLayout initialUser={toHeaderUser(user)}>
      {children}
    </AppHeaderLayout>
  );
}
