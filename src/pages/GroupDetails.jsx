import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import GroupChat from '../components/GroupChat';
import { Calendar, Users, MessageSquare } from 'lucide-react';

// Mock data - replace with actual API calls
const mockGroups = [
  {
    id: 1,
    name: 'Tech Innovators',
    description: 'A group for tech enthusiasts and innovators.',
    members: ['Alice', 'Bob', 'Charlie'],
    events: [
      { id: 1, title: 'Tech Meetup 2024', date: '2024-03-20' },
      { id: 2, title: 'Innovation Workshop', date: '2024-03-25' }
    ]
  },
  {
    id: 2,
    name: 'Event Planners',
    description: 'Connect with people who love organizing events.',
    members: ['Diana', 'Eve'],
    events: [
      { id: 3, title: 'Planning Masterclass', date: '2024-03-22' }
    ]
  },
  {
    id: 3,
    name: 'Developers Hub',
    description: 'A place for developers to share and learn.',
    members: ['Frank', 'Grace', 'Heidi'],
    events: [
      { id: 4, title: 'Code Review Session', date: '2024-03-21' },
      { id: 5, title: 'Hackathon', date: '2024-03-28' }
    ]
  }
];

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [group, setGroup] = useState(null);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch group details
    const fetchedGroup = mockGroups.find(g => g.id === parseInt(groupId));
    if (fetchedGroup) {
      setGroup(fetchedGroup);
      // Check if user is a member
      setIsJoined(fetchedGroup.members.includes(user?.name));
    }
  }, [groupId, user]);

  const handleJoin = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsJoined(true);
    addNotification({
      type: 'success',
      title: 'Joined Group',
      message: `You have successfully joined ${group.name}!`
    });
  };

  const handleLeave = () => {
    setIsJoined(false);
    addNotification({
      type: 'info',
      title: 'Left Group',
      message: `You have left ${group.name}`
    });
  };

  const handleJoinEvent = (eventId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    addNotification({
      type: 'success',
      title: 'Event Joined',
      message: 'You have successfully joined the event!'
    });
  };

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-600 dark:text-gray-400">
          Group not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate('/groups')}
        className="mb-6 text-purple-600 hover:text-purple-700 flex items-center"
      >
        ← Back to Groups
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Group Info Section */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {group.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    {group.description}
                  </p>
                </div>
                {user && (
                  <div>
                    {isJoined ? (
                      <button
                        onClick={handleLeave}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Leave Group
                      </button>
                    ) : (
                      <button
                        onClick={handleJoin}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Join Group
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Members Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Members ({group.members.length})
                  </h2>
                  <ul className="space-y-2">
                    {group.members.map((member, index) => (
                      <li
                        key={index}
                        className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                      >
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>{member}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Events Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Upcoming Events
                  </h2>
                  <div className="space-y-3">
                    {group.events.map((event) => (
                      <div
                        key={event.id}
                        className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <div className="flex justify-between items-start">
                          <div 
                            className="cursor-pointer"
                            onClick={() => navigate(`/events/${event.id}`)}
                          >
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {event.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(event.date).toLocaleDateString()}
                            </p>
                          </div>
                          {user && (
                            <button
                              onClick={() => handleJoinEvent(event.id)}
                              className="text-sm bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 transition-colors"
                            >
                              Join Event
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Group Chat</h3>
            </div>
            {!user ? (
              <div className="p-6 text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Sign in to participate in the chat
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <GroupChat groupId={groupId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails; 