import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FiFilter, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const EventCalendar = ({
  onDateSelect,
  onPreferencesChange,
  events,
  preferences,
}) => {
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Function to check if date has events
  const hasEvents = (date) => {
    return events.some((event) => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Updated tile content with new styling
  const tileContent = ({ date, view }) => {
    if (view === "month" && hasEvents(date)) {
      return (
        <div className='h-1.5 w-1.5 bg-blue-400 rounded-full mx-auto mt-1'></div>
      );
    }
  };

  const handlePreferenceToggle = (pref) => {
    const newPreferences = selectedPreferences.includes(pref)
      ? selectedPreferences.filter((p) => p !== pref)
      : [...selectedPreferences, pref];

    setSelectedPreferences(newPreferences);
    onPreferencesChange(newPreferences); // Pass the updated preferences to parent
  };

  return (
    <div
      className='bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800'
      style={{ width: "350px" }}
    >
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-semibold text-gray-100'>Event Calendar</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className='flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-gray-700 hover:bg-gray-800 text-gray-300'
        >
          <FiFilter className='text-gray-300' />
          <span>Filters</span>
        </button>
      </div>

      {showFilters && (
        <div className='mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700'>
          <h3 className='text-sm font-medium text-gray-300 mb-3'>
            Event Types
          </h3>
          <div className='flex flex-wrap gap-2'>
            {preferences.map((pref) => (
              <button
                key={pref}
                onClick={() => handlePreferenceToggle(pref)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  selectedPreferences.includes(pref)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className='calendar-container bg-transparent'>
        <Calendar
          onChange={onDateSelect}
          tileContent={tileContent}
          prevLabel={<FiChevronLeft className='text-gray-300' />}
          nextLabel={<FiChevronRight className='text-gray-300' />}
          className='rounded-lg'
        />
      </div>
    </div>
  );
};

export default EventCalendar;
