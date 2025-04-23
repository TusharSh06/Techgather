import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AttendeeDashboard from '../components/dashboard/AttendeeDashboard';
import OrganizerDashboard from '../components/dashboard/OrganizerDashboard';
import VendorDashboard from '../components/dashboard/VendorDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';

const Dashboard = () => {
  const { user, roles } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case roles.ATTENDEE:
        return <AttendeeDashboard />;
      case roles.ORGANIZER:
        return <OrganizerDashboard />;
      case roles.VENDOR:
        return <VendorDashboard />;
      case roles.ADMIN:
        return <AdminDashboard />;
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Welcome, {user?.name}!
          </h1>
          {renderDashboard()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 