"use client";

import { LogOut, Shield, Ticket, UserCircle2, UserCog } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { User } from "@/lib/api/types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

type AppHeaderProps = {
  currentUser: User;
};

export function AppHeader({ currentUser }: AppHeaderProps) {
  const navigate = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate.replace("/auth");
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 pt-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">TicketFlix</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {currentUser.name}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="gap-1">
            <UserCircle2 size={14} />
            {currentUser.name}
          </Badge>

          <Badge className="gap-1">
            {currentUser.role === "admin" ? (
              <Shield size={14} />
            ) : (
              <Ticket size={14} />
            )}
            {currentUser.role.toUpperCase()}
          </Badge>

          {currentUser.role === "client" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate.push("/client/profile")}
            >
              <UserCog className="mr-1" size={16} />
              Profile
            </Button>
          )}

          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-1" size={16} />
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
