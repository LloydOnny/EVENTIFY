import React from "react";
import { motion } from "framer-motion";

const EventCardSkeleton = () => {
  return (
    <div className='relative h-full bg-gray-800 rounded-xl overflow-hidden shadow-lg p-4'>
      {/* Image skeleton */}
      <div className='relative w-full h-48 overflow-hidden rounded-lg bg-gray-700 animate-pulse'>
        <div className='absolute top-2 right-2'>
          <div className='w-20 h-6 bg-gray-600 rounded-full' />
        </div>
      </div>

      <div className='mt-4 space-y-4'>
        {/* Title skeleton */}
        <div className='h-7 bg-gray-700 rounded-md animate-pulse' />

        {/* Description skeleton */}
        <div className='space-y-2'>
          <div className='h-4 bg-gray-700 rounded animate-pulse' />
          <div className='h-4 bg-gray-700 rounded animate-pulse w-3/4' />
          <div className='h-4 bg-gray-700 rounded animate-pulse w-1/2' />
        </div>

        {/* Info items skeleton */}
        <div className='space-y-2'>
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className='flex items-center gap-2'>
              <div className='w-4 h-4 bg-gray-700 rounded animate-pulse' />
              <div className='h-4 bg-gray-700 rounded animate-pulse w-32' />
            </div>
          ))}
        </div>

        {/* Seats and button skeleton */}
        <div className='space-y-3'>
          <div className='h-5 bg-gray-700 rounded animate-pulse w-24' />
          <div className='h-10 bg-gray-700 rounded-lg animate-pulse' />
        </div>
      </div>
    </div>
  );
};

export default EventCardSkeleton;
