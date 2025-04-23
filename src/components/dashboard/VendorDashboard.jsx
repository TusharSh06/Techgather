import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, DollarSign, Calendar, Plus, Edit, Trash, Star } from 'lucide-react';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    const mockServices = [
      {
        id: 1,
        name: 'Catering Service',
        description: 'Professional catering for events up to 200 people',
        price: '$50 per person',
        rating: 4.8,
        bookings: 12
      },
      // Add more mock services as needed
    ];

    const mockBookings = [
      {
        id: 1,
        eventName: 'Tech Conference 2024',
        date: '2024-05-15',
        service: 'Catering Service',
        status: 'confirmed'
      },
      // Add more mock bookings as needed
    ];

    setServices(mockServices);
    setBookings(mockBookings);
  }, []);

  const handleCreateService = () => {
    navigate('/services/create');
  };

  const handleEditService = (serviceId) => {
    navigate(`/services/${serviceId}/edit`);
  };

  const handleDeleteService = (serviceId) => {
    // TODO: Implement delete functionality
    console.log('Delete service:', serviceId);
  };

  return (
    <div className="space-y-8">
      {/* Services Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">My Services</h2>
          <button
            onClick={handleCreateService}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Service
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {service.name}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditService(service.id)}
                      className="p-1 text-purple-600 hover:bg-purple-50 rounded-full"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{service.description}</p>

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-600">
                    <DollarSign size={16} className="mr-2" />
                    <span>{service.price}</span>
                  </div>
                  <div className="flex items-center">
                    <Star size={16} className="mr-2 text-yellow-400" />
                    <span className="text-sm font-medium">{service.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bookings Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upcoming Bookings</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.eventName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard; 