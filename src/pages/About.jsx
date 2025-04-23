import React from 'react';
import { Calendar, Users, Bell, Share2 } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-purple-600 mb-6">About EventEase</h1>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <Calendar className="text-purple-600 mt-1" size={24} />
              <div>
                <h2 className="text-xl font-semibold mb-2">Event Management Made Easy</h2>
                <p className="text-gray-600">
                  EventEase is your all-in-one platform for creating, managing, and sharing events. 
                  Whether you're organizing a small gathering or a large conference, our intuitive 
                  tools make event planning effortless.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Users className="text-purple-600 mt-1" size={24} />
              <div>
                <h2 className="text-xl font-semibold mb-2">Connect with Attendees</h2>
                <p className="text-gray-600">
                  Build your event community with ease. Manage attendees, track RSVPs, and 
                  communicate effectively with all participants through our integrated messaging system.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Bell className="text-purple-600 mt-1" size={24} />
              <div>
                <h2 className="text-xl font-semibold mb-2">Stay Updated</h2>
                <p className="text-gray-600">
                  Never miss an important event update. Our notification system keeps you informed 
                  about changes, reminders, and new events that match your interests.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Share2 className="text-purple-600 mt-1" size={24} />
              <div>
                <h2 className="text-xl font-semibold mb-2">Seamless Integration</h2>
                <p className="text-gray-600">
                  Connect your events with Google Calendar for easy scheduling and management. 
                  Share events across platforms and keep all your calendars in sync.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 