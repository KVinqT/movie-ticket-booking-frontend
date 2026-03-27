"use client";

import { useRouter, usePathname } from "next/navigation";
import { AppHeader } from "@/components/dashboard/app-header";
import { useAuth } from "@/components/providers/auth-provider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { currentUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname.includes("/admin/movies")) return "manage-movies";
    if (pathname.includes("/admin/users")) return "manage-users";
    return "dashboard";
  };

  const handleTabChange = (value: string) => {
    if (value === "dashboard") router.push("/admin");
    if (value === "manage-movies") router.push("/admin/movies");
    if (value === "manage-users") router.push("/admin/users");
  };

  return (
    <main className="min-h-screen bg-background p-4 text-foreground sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {currentUser && <AppHeader currentUser={currentUser} />}
        <Tabs value={getActiveTab()} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="manage-movies">Manage Movies</TabsTrigger>
            <TabsTrigger value="manage-users">Manage Users</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}
