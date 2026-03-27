import React from "react";

const page = () => {
  return (
    <div className="min-h-screen p-6">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-lg text-gray-600">Welcome back!</p>
      </header>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Active Bookings
            </h3>
            <p className="text-3xl font-bold">5</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Upcoming Movies
            </h3>
            <p className="text-3xl font-bold">12</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Available Theaters
            </h3>
            <p className="text-3xl font-bold">8</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
