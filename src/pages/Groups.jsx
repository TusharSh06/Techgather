import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialGroups = [
  { id: 1, name: 'Tech Innovators', description: 'A group for tech enthusiasts and innovators.', members: ['Alice', 'Bob', 'Charlie'] },
  { id: 2, name: 'Event Planners', description: 'Connect with people who love organizing events.', members: ['Diana', 'Eve'] },
  { id: 3, name: 'Developers Hub', description: 'A place for developers to share and learn.', members: ['Frank', 'Grace', 'Heidi'] },
];

const Groups = () => {
  const [groups, setGroups] = useState(initialGroups);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const navigate = useNavigate();

  const handleJoin = (groupId) => {
    if (!joinedGroups.includes(groupId)) {
      setJoinedGroups([...joinedGroups, groupId]);
      navigate(`/groups/${groupId}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-600">Groups</h1>
      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.id} className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">{group.name}</h2>
                <p className="text-gray-500">{group.description}</p>
              </div>
              <button
                onClick={() => handleJoin(group.id)}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  joinedGroups.includes(group.id)
                    ? 'bg-green-500 text-white cursor-default' : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
                disabled={joinedGroups.includes(group.id)}
              >
                {joinedGroups.includes(group.id) ? 'Joined' : 'Join'}
              </button>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Members:</span>
              <ul className="list-disc list-inside text-gray-600">
                {group.members.map((member, idx) => (
                  <li key={idx}>{member}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Groups; 