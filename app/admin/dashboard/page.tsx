import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back!</p>
      </header>

      <div className="dashboard-content">
        <div className="stats-container">
          <div className="stat-card">
            <h3>Active Bookings</h3>
            <p className="stat-number">5</p>
          </div>
          <div className="stat-card">
            <h3>Upcoming Movies</h3>
            <p className="stat-number">12</p>
          </div>
          <div className="stat-card">
            <h3>Available Theaters</h3>
            <p className="stat-number">8</p>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn">Browse Movies</button>
            <button className="action-btn">My Bookings</button>
            <button className="action-btn">Book Tickets</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
