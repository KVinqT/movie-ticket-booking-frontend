"use client";

import { LogOut, Shield, Ticket, UserCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type User } from "@/lib/mock-data";

type AppHeaderProps = {
  currentUser: User;
  onLogout: () => void;
};

export function AppHeader({ currentUser, onLogout }: AppHeaderProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 pt-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Online Movie Ticket Booking System
          </h1>
          <p className="text-sm text-muted-foreground">
            User: May Phyu Han Khin
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
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="mr-1" size={16} />
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
