import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EventContext = createContext(null);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Tech Conference 2024',
      date: '2024-04-15',
      time: '09:00',
      location: 'Convention Center, NY',
      description: 'Annual technology conference featuring the latest innovations in AI, blockchain, and cloud computing.',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
      joined: false,
      attendees: []
    },
    {
      id: 2,
      title: 'Summer Music Festival',
      date: '2024-07-20',
      time: '14:00',
      location: 'Central Park, NY',
      description: 'A three-day music festival featuring over 50 artists across multiple genres.',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
      joined: false,
      attendees: []
    },
    {
      id: 3,
      title: 'Culinary Workshop',
      date: '2024-05-10',
      time: '18:30',
      location: 'Gourmet Kitchen Studio, Chicago',
      description: 'Learn authentic Italian cooking techniques from master chef Marco Rossi.',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
      joined: false,
      attendees: []
    },
    {
      id: 4,
      title: 'Startup Pitch Competition',
      date: '2024-06-05',
      time: '13:00',
      location: 'Innovation Hub, San Francisco',
      description: 'Watch as 10 promising startups pitch their ideas to a panel of venture capitalists.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
      joined: false,
      attendees: []
    },
    {
      id: 5,
      title: 'Yoga & Wellness Retreat',
      date: '2024-08-15',
      time: '07:00',
      location: 'Serenity Lodge, Aspen',
      description: 'A weekend dedicated to self-care and mindfulness. Daily yoga sessions and meditation workshops.',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
      joined: false,
      attendees: []
    }
  ]);

  const navigate = useNavigate();

  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: events.length + 1,
      joined: false,
      attendees: []
    };
    setEvents([newEvent, ...events]);
    navigate('/events');
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const updateEvent = (id, updatedData) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, ...updatedData } : event
    ));
  };

  const joinEvent = (id, userId) => {
    setEvents(events.map(event => {
      if (event.id === id) {
        const isJoined = event.attendees.includes(userId);
        return {
          ...event,
          joined: !isJoined,
          attendees: isJoined
            ? event.attendees.filter(attendeeId => attendeeId !== userId)
            : [...event.attendees, userId]
        };
      }
      return event;
    }));
  };

  return (
    <EventContext.Provider value={{ events, joinEvent, deleteEvent, addEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};