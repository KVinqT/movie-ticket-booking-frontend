"use client";

import { useAuth } from "@/components/providers/auth-provider";
import EditProfileDialog from "@/components/shared/EditProfileDialog";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Profile = () => {
  const { currentUser } = useAuth();

  const navigate = useRouter();

  if (!currentUser) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <Undo2
        className="w-7 h-7 text-black cursor-pointer"
        onClick={() => navigate.back()}
      />
      {/* ================= USER HEADER ================= */}
      <div className="border rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">{currentUser.userName}</h1>
          <p className="text-zinc-500">{currentUser.email}</p>
          <p className="text-zinc-500">{currentUser.phoneNumber}</p>
        </div>

        <div className="flex justify-center items-center gap-3">
          <EditProfileDialog />
          <div className="text-sm px-4 py-2 rounded-md bg-black text-white capitalize">
            {currentUser.role}
          </div>
        </div>
      </div>

      {/* ================= BOOKINGS ================= */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Your Bookings</h2>

        {currentUser.bookedInfo?.length === 0 ? (
          <p className="text-zinc-400">No bookings yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentUser.bookedInfo &&
              currentUser.bookedInfo.map((booking, index) => (
                <div
                  key={index}
                  className="group border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
                >
                  {/* Poster */}
                  <div className="relative w-full h-64">
                    <Image
                      src={booking.moviePoster}
                      alt={booking.movieName}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />

                    {/* overlay */}
                    <div className="absolute inset-0 bg-black/40" />
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-lg">
                      {booking.movieName}
                    </h3>

                    <div className="text-sm text-zinc-600 space-y-1">
                      <p>
                        🎬 Show Time:{" "}
                        <span className="font-medium">{booking.bookTime}</span>
                      </p>

                      <p>
                        📅 Date:{" "}
                        <span className="font-medium">
                          {new Date(booking.showDate).toLocaleDateString()}
                        </span>
                      </p>
                    </div>

                    {/* Seat */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-zinc-500">Seat</span>

                      <span className="px-3 py-1 text-xs rounded-md bg-black text-white">
                        {booking.slots.slotName}
                      </span>
                    </div>

                    {/* Seat Type + Price */}
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">
                        {booking.slots.slotType}
                      </span>

                      <span className="font-semibold">
                        {booking.slots.slotPrice}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
