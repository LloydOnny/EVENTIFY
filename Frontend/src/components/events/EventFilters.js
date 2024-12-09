import React from "react";
// import { motion } from "framer-motion";

const EventFilters = ({
  search,
  setSearch,
  category,
  setCategory,
  categories,
}) => {
  return (
    <div className='mb-8 space-y-4'>
      <div className='flex flex-col sm:flex-row gap-4'>
        {/* Search Input */}
        <div className='flex-1'>
          <input
            type='text'
            placeholder='Search events...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
          />
        </div>

        {/* Category Filter */}
        <div className='sm:w-48'>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
          >
            <option value=''>All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default EventFilters;
