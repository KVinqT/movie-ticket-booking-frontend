import { Slot } from "@/app/admin/movies/_components/columns";
import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "../ui/button";

const Slots = ({ slots }: { slots: Slot[] }) => {
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const toggleSeat = (slotId: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId],
    );
  };
  const groupedSlots = Object.values(
    (slots ?? []).reduce(
      (acc, slot) => {
        const row = slot.slotName.split("-")[0];

        if (!acc[row]) acc[row] = [];
        acc[row].push(slot);

        return acc;
      },
      {} as Record<string, typeof slots>,
    ),
  );
  const seatColor = (type: string) => {
    switch (type) {
      case "Premium Seat":
        return "bg-yellow-200";
      case "Couple Seat":
        return "bg-pink-200";
      default:
        return "bg-green-200";
    }
  };

  const selectedSeatObjects = slots.filter((slot) =>
    selectedSlots.includes(slot.id),
  );

  const totalPrice = selectedSeatObjects.reduce((total, seat) => {
    const price = Number(seat.slotPrice.replace(/\D/g, ""));
    return total + price;
  }, 0);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Book The Slot</h1>

        {/* Seat Type Legend */}
        <div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`w-4 h-4 rounded ${seatColor("Premium Seat")}`}
                />
                <p>Premium</p>
              </div>
              <p>10000 MMK</p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`w-4 h-4 rounded ${seatColor("Couple Seat")}`}
                />
                <p>Couple</p>
              </div>
              <p>15000 MMK</p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded ${seatColor("Standard")}`} />
                <p>Standard</p>
              </div>
              <p>7000 MMK</p>
            </div>
          </div>
        </div>
      </div>
      {/* SCREEN */}
      <div className="flex flex-col items-center gap-8">
        {/* Seats */}
        <div className="flex flex-col gap-4">
          {groupedSlots.reverse().map((row, i) => (
            <div key={i} className="flex gap-3 justify-center">
              {row.map((slot) => {
                const isSelected = selectedSlots.includes(slot.id);
                return (
                  <button
                    key={slot.id}
                    disabled={slot.isReserved}
                    onClick={() => !slot.isReserved && toggleSeat(slot.id)}
                    className={`
    relative
    w-12 h-12 rounded-md text-xs font-semibold
    transition-all duration-200 overflow-hidden
    ${seatColor(slot.slotType)}
    ${
      isSelected
        ? "ring-2 ring-black scale-110"
        : !slot.isReserved && "hover:scale-105"
    }
    ${slot.isReserved && "cursor-not-allowed"}
  `}
                  >
                    {slot.slotName}

                    {slot.isReserved && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-lg">
                          <Lock className="w-5 h-5 text-white" />
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="w-full max-w-3xl text-center">
          <div className="bg-zinc-800 text-white py-2 rounded-md text-sm tracking-widest">
            SCREEN
          </div>
        </div>
      </div>
      {/* BOOKING SUMMARY */}
      <div className="mt-8 w-full max-w-3xl border rounded-xl p-5 space-y-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Selected Seats</h2>

          <span className="text-sm text-zinc-500">
            {selectedSeatObjects.length} seat(s)
          </span>
        </div>

        {/* Selected Seats List */}
        <div className="flex flex-wrap gap-2 min-h-[40px]">
          {selectedSeatObjects.length === 0 ? (
            <p className="text-sm text-zinc-400">No seats selected yet.</p>
          ) : (
            selectedSeatObjects.map((seat) => (
              <button
                key={seat.id}
                className={`
    relative
    w-12 h-12 rounded-md text-xs font-semibold
    transition-all duration-200 overflow-hidden
    ${seatColor(seat.slotType)}`}
              >
                {seat.slotName}
              </button>
            ))
          )}
        </div>

        {/* Total + Button */}
        <div className="flex items-center justify-between pt-2 border-t">
          <p className="font-semibold">
            Total: {totalPrice.toLocaleString()} MMK
          </p>

          <Button
            disabled={selectedSeatObjects.length === 0}
            className={`
        px-6 py-2 rounded-md font-semibold transition
        ${
          selectedSeatObjects.length === 0
            ? "bg-zinc-300 text-zinc-500 cursor-not-allowed"
            : "bg-black text-white hover:bg-zinc-800"
        }
      `}
            onClick={() => {
              console.log("Booking seats:", selectedSeatObjects);
            }}
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Slots;
