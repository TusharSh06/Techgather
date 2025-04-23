import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Plus, Edit, Trash, Users, BarChart } from 'lucide-react';

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockEvents = [
      {
        id: 1,
        title: 'Tech Conference 2024',
        date: '2024-05-15',
        time: '09:00 AM',
        location: 'Convention Center',
        attendees: 150,
        capacity: 200,
        status: 'active'
      },
      // Add more mock events as needed
    ];
    setEvents(mockEvents);
  }, []);

  const handleCreateEvent = () => {
    navigate('/events/create');
  };

  const handleEditEvent = (eventId) => {
    navigate(`/events/${eventId}/edit`);
  };

  const handleDeleteEvent = (eventId) => {
    // TODO: Implement delete functionality
    console.log('Delete event:', eventId);
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">My Events</h2>
        <button
          onClick={handleCreateEvent}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Create Event
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {event.title}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditEvent(event.id)}
                    className="p-1 text-purple-600 hover:bg-purple-50 rounded-full"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-gray-600 mb-4">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-2" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center text-gray-600">
                  <Users size={16} className="mr-2" />
                  <span>{event.attendees}/{event.capacity}</span>
                </div>
                <div className="flex items-center">
                  <BarChart size={16} className="mr-2" />
                  <span className="text-sm font-medium text-green-600">
                    {event.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizerDashboard; 