import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Calendar = () => {
  const { user, loading } = useAuth();
  const { events } = useEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Redirect to login if not authenticated
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedEvent(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedEvent(null);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === date.toDateString();
      });

      days.push(
        <div key={day} className="h-24 border p-2 bg-white">
          <div className="font-semibold">{day}</div>
          <div className="space-y-1 mt-1">
            {dayEvents.map(event => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded truncate cursor-pointer transition-colors ${
                  event.joined
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
                title={event.title}
                onClick={() => handleEventClick(event)}
              >
                {event.joined && <Check size={12} className="inline-block mr-1" />}
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-purple-600">Calendar</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft size={24} />
              </button>
              <span className="text-xl font-semibold">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-100 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Scheduled Events</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-100 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Joined Events</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-gray-50 p-2 text-center font-semibold">
                {day}
              </div>
            ))}
            {renderCalendarDays()}
          </div>

          {selectedEvent && (
            <div className="mt-8 p-6 bg-purple-50 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <img 
                    src={selectedEvent.image} 
                    alt={selectedEvent.title} 
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-800">{selectedEvent.title}</h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-gray-700">
                      <CalendarIcon size={16} className="mr-2" />
                      <span>{selectedEvent.date} at {selectedEvent.time}</span>
                    </div>
                    <p className="text-gray-600 mt-2">{selectedEvent.description}</p>
                    {selectedEvent.joined && (
                      <div className="mt-2 flex items-center text-green-600">
                        <Check size={16} className="mr-2" />
                        <span>You have joined this event</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar; 