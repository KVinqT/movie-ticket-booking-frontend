"use client";

import { useEffect, useState } from "react";
import { Clapperboard, Ticket, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getMovies } from "@/lib/api/movies";
import { getUsers } from "@/lib/api/users";

export default function Dashboard() {
  const navigate = useRouter();
  const [stats, setStats] = useState({ movies: 0, users: 0, clients: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMovies({ per_page: 100 }), getUsers()]).then(
      ([moviesRes, users]) => {
        setStats({
          movies: moviesRes.total,
          users: users.length,
          clients: users.filter((u) => u.role === "client").length,
        });
        setLoading(false);
      },
    );
  }, []);

  const cards = [
    {
      label: "Movies",
      value: stats.movies,
      icon: Clapperboard,
      action: () => navigate.push("/admin/movies"),
      cta: "Manage Movies",
    },
    {
      label: "Total Users",
      value: stats.users,
      icon: Users,
      action: () => navigate.push("/admin/users"),
      cta: "Manage Users",
    },
    {
      label: "Clients",
      value: stats.clients,
      icon: Ticket,
      action: () => navigate.push("/admin/users"),
      cta: "View Clients",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-zinc-500 text-sm">Overview of your cinema platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {cards.map(({ label, value, icon: Icon, action, cta }) => (
          <div
            key={label}
            className="flex flex-col justify-between p-6 rounded-xl border bg-white shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-500">{label}</span>
              <Icon className="w-5 h-5 text-zinc-400" />
            </div>
            <span className="text-4xl font-bold">
              {loading ? "—" : value}
            </span>
            <Button variant="outline" size="sm" onClick={action}>
              {cta}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
