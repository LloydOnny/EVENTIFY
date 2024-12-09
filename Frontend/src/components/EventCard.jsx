import React from "react";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaMapMarkerAlt,
  FaUserAlt,
  FaClock,
  FaCalendar,
} from "react-icons/fa";
import RSVPButton from "./events/RSVPButton";

const EventCard = ({
  title,
  startDate,
  endDate,
  description,
  organizer,
  seatsLeft,
  type,
  location,
  isFiltered = false,
  image,
  create_Button,
  id,
  onClick,
  event,
  onRSVP,
  link,
}) => {
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 1.2, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial='hidden'
      animate='visible'
      whileHover='hover'
      className='relative h-full bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300'
    >
      <div className='p-4'>
        <motion.div
          variants={imageVariants}
          className='relative w-full h-48 overflow-hidden rounded-lg'
        >
          <motion.img
            className='w-full h-full object-cover transform hover:scale-110 transition-transform duration-500'
            src={image}
            alt={title}
          />
          <div className='absolute top-2 right-2'>
            <span className='px-3 py-1 bg-gray-900/80 text-gray-100 rounded-full text-sm backdrop-blur-sm'>
              {type}
            </span>
          </div>
        </motion.div>

        <div className='mt-4 space-y-4'>
          <h3 className='text-xl font-semibold text-gray-100 line-clamp-1'>
            {title}
          </h3>
          <p className='text-gray-400 h-[4.5rem] line-clamp-3'>{description}</p>

          <div className='space-y-2 text-sm'>
            <div className='flex items-center text-gray-400'>
              <FaCalendar className='w-4 h-4 mr-2' />
              <span>
                {new Date(startDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className='flex items-center text-gray-400'>
              <FaClock className='w-4 h-4 mr-2' />
              <span>
                {new Date(startDate).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" - "}
                {new Date(endDate).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className='flex items-center text-gray-400'>
              <FaMapMarkerAlt className='w-4 h-4 mr-2' />
              <span className='line-clamp-1'>{location}</span>
            </div>

            <div className='flex items-center text-gray-400'>
              <FaUserAlt className='w-4 h-4 mr-2' />
              <span className='line-clamp-1'>By {organizer}</span>
            </div>
          </div>

          <div className='flex justify-between items-center pt-2'>
            <span className='text-primary font-medium'>
              {seatsLeft} seats left
            </span>
          </div>

          {seatsLeft > 0 && <RSVPButton event={event} onRSVP={onRSVP} />}
        </div>
      </div>

      {create_Button && (
        <motion.a
          href={link}
          className='absolute top-0 right-0 w-full h-full flex items-center justify-center bg-gray-700/90 text-white text-xl backdrop-blur-sm'
          whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.95)" }}
          whileTap={{ scale: 0.98 }}
        >
          <FaPlus className='w-12 h-12' />
        </motion.a>
      )}
    </motion.div>
  );
};

export default EventCard;
