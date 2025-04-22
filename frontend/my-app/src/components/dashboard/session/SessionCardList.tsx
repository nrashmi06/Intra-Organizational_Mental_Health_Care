import React, { useEffect, useState } from 'react';
import { SessionCard } from './SessionSummaryCard';
import { SessionModal } from './SessionModal';
import { getSessionsByCategory } from '@/service/session/getSessionByCategory'; // API service to fetch sessions
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const sessionCategories = [
  "STRESS",
  "DEPRESSION",
  "SUICIDAL",
  "BREAKUP",
  "ANXIETY",
  "GRIEF",
  "TRAUMA",
  "RELATIONSHIP_ISSUES",
  "SELF_ESTEEM",
  "OTHER"
];

export const SessionCardList = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    if (selectedCategory) {
      // Fetch sessions based on selected category
      getSessionsByCategory(selectedCategory, accessToken).then(fetchedSessions => {
        setSessions(fetchedSessions);
      }).catch(err => {
        console.error("Error fetching sessions:", err);
      });
    }
  }, [selectedCategory]);

  return (
    <div className="p-6 space-y-6">
      {/* Dropdown to select session category */}
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700">Select Session Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="">-- Select a Category --</option>
          {sessionCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.replace(/_/g, ' ').toLowerCase().replace(/(^\w|\s\w)/g, m => m.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      {/* Session Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((session) => (
          <SessionCard
            key={session.sessionId}
            session={session}
            onView={() => setSelectedSession(session)}
          />
        ))}
      </div>

      {/* Modal for viewing session details */}
      {selectedSession && (
        <SessionModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
};
