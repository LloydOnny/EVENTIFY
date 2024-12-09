import React from "react";
import { motion } from "framer-motion";
import EventCalendar from "./EventCalendar";

const FilterPanel = ({ filters, setFilters, stats, onClear }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className='w-80 shrink-0'
    >
      <div className='bg-gray-800 rounded-xl p-6 sticky top-4'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-semibold text-white'>Filters</h2>
          {Object.values(filters).some((f) =>
            Array.isArray(f) ? f.length > 0 : f
          ) && (
            <button
              onClick={onClear}
              className='text-primary hover:text-primary/80'
            >
              Clear all
            </button>
          )}
        </div>

        {/* Stats */}
        <div className='mb-6 p-3 bg-gray-700/50 rounded-lg'>
          <p className='text-gray-300'>
            Showing {stats.filtered} of {stats.total} events
          </p>
        </div>

        {/* Categories */}
        <div className='mb-6'>
          <h3 className='text-sm font-medium text-gray-300 mb-3'>Categories</h3>
          <div className='flex flex-wrap gap-2'>
            {stats.categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  const newCategories = filters.categories.includes(category)
                    ? filters.categories.filter((c) => c !== category)
                    : [...filters.categories, category];
                  setFilters({ ...filters, categories: newCategories });
                }}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.categories.includes(category)
                    ? "bg-primary text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Event Types */}
        <div className='mb-6'>
          <h3 className='text-sm font-medium text-gray-300 mb-3'>
            Event Types
          </h3>
          <div className='flex flex-wrap gap-2'>
            {stats.types.map((type) => (
              <button
                key={type}
                onClick={() => {
                  const newTypes = filters.types.includes(type)
                    ? filters.types.filter((t) => t !== type)
                    : [...filters.types, type];
                  setFilters({ ...filters, types: newTypes });
                }}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.types.includes(type)
                    ? "bg-primary text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <EventCalendar
          selectedDate={filters.date}
          onDateSelect={(date) => setFilters({ ...filters, date })}
        />
      </div>
    </motion.div>
  );
};

export default FilterPanel;
