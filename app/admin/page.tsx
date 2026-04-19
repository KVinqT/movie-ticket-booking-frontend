"use client";

import { useMemo } from "react";
import { Film, Users, Theater, ShieldCheck, UserRound } from "lucide-react";
import { useMovies } from "@/lib/api/admin/movies";
import { useUsers } from "@/lib/api/admin/users";
import { useTheaters } from "@/lib/api/admin/theaters";
import { useAuth } from "@/components/providers/auth-provider";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  isLoading,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  sub?: string;
  isLoading?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-start gap-4">
      <div className="p-3 rounded-lg bg-zinc-100 shrink-0">
        <Icon className="w-5 h-5 text-zinc-600" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {isLoading ? (
          <div className="h-8 w-12 bg-zinc-100 animate-pulse rounded" />
        ) : (
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        )}
        {sub && !isLoading && (
          <p className="text-xs text-zinc-400">{sub}</p>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { currentUser } = useAuth();

  const { data: movies, isLoading: moviesLoading } = useMovies();
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: theaters, isLoading: theatersLoading } = useTheaters();

  const { adminCount, clientCount } = useMemo(() => {
    if (!users) return { adminCount: 0, clientCount: 0 };
    return {
      adminCount: users.filter((u) => u.role === "admin").length,
      clientCount: users.filter((u) => u.role === "client").length,
    };
  }, [users]);

  return (
    <div className="min-h-screen p-6">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back, {currentUser?.name ?? "Admin"}!
        </p>
      </header>

      <div className="space-y-8">
        {/* ── Stats grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            icon={Film}
            label="Total Movies"
            value={movies?.length ?? 0}
            isLoading={moviesLoading}
          />
          <StatCard
            icon={Users}
            label="Total Users"
            value={users?.length ?? 0}
            sub={
              usersLoading
                ? undefined
                : `${adminCount} admin · ${clientCount} client`
            }
            isLoading={usersLoading}
          />
          <StatCard
            icon={Theater}
            label="Theaters"
            value={theaters?.length ?? 0}
            isLoading={theatersLoading}
          />
          <StatCard
            icon={ShieldCheck}
            label="Admins"
            value={adminCount}
            sub={usersLoading ? undefined : `${clientCount} clients`}
            isLoading={usersLoading}
          />
        </div>

        {/* ── Recent movies ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">
            Recent Movies
          </h2>
          {moviesLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-zinc-100 animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : !movies || movies.length === 0 ? (
            <p className="text-sm text-zinc-400">No movies yet.</p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {movies.slice(0, 6).map((movie) => (
                <li
                  key={movie.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <Film className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span className="font-medium text-zinc-800">
                      {movie.movie_name}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400 hidden sm:block">
                    {movie.genre}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Users by role ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserRound className="w-4 h-4 text-zinc-500" />
              <h2 className="text-base font-semibold text-gray-700">Clients</h2>
            </div>
            {usersLoading ? (
              <div className="h-8 w-16 bg-zinc-100 animate-pulse rounded" />
            ) : (
              <>
                <p className="text-3xl font-bold text-gray-900">{clientCount}</p>
                <p className="text-xs text-zinc-400 mt-1">registered clients</p>
              </>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-zinc-500" />
              <h2 className="text-base font-semibold text-gray-700">
                Administrators
              </h2>
            </div>
            {usersLoading ? (
              <div className="h-8 w-16 bg-zinc-100 animate-pulse rounded" />
            ) : (
              <>
                <p className="text-3xl font-bold text-gray-900">{adminCount}</p>
                <p className="text-xs text-zinc-400 mt-1">admin accounts</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
