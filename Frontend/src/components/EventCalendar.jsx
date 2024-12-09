import React from "react";
import { Calendar } from "react-calendar";
import { motion } from "framer-motion";

const EventCalendar = ({
  events,
  onDateSelect,
  selectedDate,
  onPreferencesChange,
  preferences,
}) => {
  // Get dates with events
  const eventDates = events.map((event) => new Date(event.date).toDateString());

  // Custom tile content
  const tileContent = ({ date, view }) => {
    const hasEvent = eventDates.includes(date.toDateString());

    if (hasEvent) {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className='w-2 h-2 bg-primary rounded-full mx-auto mt-1'
        />
      );
    }
  };

  // Custom tile className
  const tileClassName = ({ date, view }) => {
    const hasEvent = eventDates.includes(date.toDateString());
    const isSelected = selectedDate?.toDateString() === date.toDateString();

    return `
      ${hasEvent ? "has-event" : ""}
      ${isSelected ? "selected-date" : ""}
      hover:bg-gray-700 rounded-lg transition-colors
    `;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='calendar-container'
    >
      <Calendar
        onChange={onDateSelect}
        value={selectedDate}
        tileContent={tileContent}
        tileClassName={tileClassName}
        className='bg-gray-800 rounded-xl p-4 text-gray-100'
        nextLabel='→'
        prevLabel='←'
        next2Label={null}
        prev2Label={null}
      />

      {/* Event Types Filter */}
      <div className='mt-4'>
        <h4 className='text-sm font-medium mb-2'>Event Types</h4>
        <div className='flex flex-wrap gap-2'>
          {Array.from(new Set(events.map((event) => event.type))).map(
            (type) => (
              <button
                key={type}
                onClick={() => {
                  if (preferences.includes(type)) {
                    onPreferencesChange(preferences.filter((p) => p !== type));
                  } else {
                    onPreferencesChange([...preferences, type]);
                  }
                }}
                className={`px-3 py-1 rounded-full text-sm ${
                  preferences.includes(type)
                    ? "bg-primary text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {type}
              </button>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCalendar;
