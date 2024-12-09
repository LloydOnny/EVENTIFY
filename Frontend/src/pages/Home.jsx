import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import EventCalendar from "./Calendar";
import SearchBar from "../components/SearchBar";
import toast from "react-hot-toast";
import { getEvents } from "../services/eventService";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import EventCard from "../components/EventCard";
import CreateEventModal from "../components/events/CreateEventModal";
import { useNavigate } from "react-router-dom";
import EventCardSkeleton from "../components/EventCardSkeleton";

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCreateEventModalOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data || []);
    } catch (error) {
      toast.error("Failed to fetch events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const handleRSVP = () => {
    fetchEvents();
  };

  // Extract unique categories from events
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(events.map((event) => event?.category || "Uncategorized")),
    ];
    return uniqueCategories.filter(Boolean);
  }, [events]);

  // Filter events based on search and category
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (!event) return false;

      const eventTitle = event.title?.toLowerCase() || "";
      const eventDescription = event.description?.toLowerCase() || "";
      const searchTerm = searchQuery.toLowerCase();

      const matchesSearch =
        searchTerm === "" ||
        eventTitle.includes(searchTerm) ||
        eventDescription.includes(searchTerm);

      const matchesCategory = category === "" || event.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [events, searchQuery, category]);

  // Enhanced animation variants
  const pageVariants = {
    initial: { opacity: 0, backgroundColor: "#111827" }, // Dark background
    animate: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
    exit: { opacity: 0 },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial='initial'
      animate='animate'
      exit='exit'
      className='min-h-screen bg-gray-900 text-gray-100'
    >
      <Navbar />

      <motion.div
        className='mx-auto px-4 py-8 container'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className='flex flex-col lg:flex-row gap-8 h-[calc(100vh-theme(spacing.20))]'>
          {/* Calendar Section */}
          <motion.div
            className='lg:w-[350px] h-auto max-h-[50dvh] w-full bg-gray-800 rounded-xl p-4 shadow-lg'
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <EventCalendar
              events={events}
              onDateSelect={setSelectedDate}
              onPreferencesChange={setSelectedPreferences}
              preferences={categories}
            />
          </motion.div>

          {/* Events Section */}
          <motion.div
            className='flex-1 overflow-hidden'
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className='flex flex-col h-full'>
              <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
                <h2 className='text-2xl font-bold text-gray-100'>
                  {selectedDate
                    ? `Events on ${selectedDate.toLocaleDateString()}`
                    : "All Events"}
                </h2>
                <div className='w-full md:w-64'>
                  <SearchBar
                    placeholder='Search events...'
                    value={searchQuery}
                    onChange={setSearchQuery}
                    className='w-full md:w-64 bg-gray-800 text-gray-100'
                  />
                </div>
              </div>

              {/* Filter clear button */}
              {(selectedDate ||
                selectedPreferences.length > 0 ||
                searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedDate(null);
                    setSelectedPreferences([]);
                    setSearchQuery("");
                  }}
                  className='text-sm text-primary hover:text-primary/90 mt-2 mb-6'
                >
                  Clear filters
                </button>
              )}

              {/* Scrollable events grid */}
              <div className='overflow-y-auto flex-1'>
                <LayoutGroup>
                  <motion.div
                    layout
                    className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8'
                  >
                    <AnimatePresence mode='wait'>
                      {loading ? (
                        // Skeleton loader grid
                        <>
                          {[1, 2, 3, 4, 5, 6].map((index) => (
                            <motion.div
                              key={`skeleton-${index}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                              }}
                            >
                              <EventCardSkeleton />
                            </motion.div>
                          ))}
                        </>
                      ) : filteredEvents.length === 0 ? (
                        <motion.div
                          key='no-events'
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className='col-span-full text-center py-12'
                        >
                          <p className='text-gray-400 text-lg'>
                            No events found
                          </p>
                        </motion.div>
                      ) : (
                        // Actual events
                        <>
                          {filteredEvents.map((event, index) => (
                            <motion.div
                              key={event.id || index}
                              layout
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                              }}
                            >
                              <EventCard
                                id={event._id}
                                startDate={event.startDateTime}
                                endDate={event.endDateTime}
                                title={event.name}
                                image={event.imageUrl}
                                capacity={event.capacity}
                                type={event.category}
                                description={event.description}
                                attendees={event.attendees}
                                organizer={event?.organizer?.username}
                                seatsLeft={
                                  event.capacity - event?.attendees?.length
                                }
                                location={event.location}
                                event={event}
                                onRSVP={() => handleRSVP()}
                              />
                            </motion.div>
                          ))}
                          {user?.role === "admin" && (
                            <CreateEventModal isOpen={isCreateEventModalOpen}>
                              <motion.div
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              >
                                <EventCard
                                  create_Button
                                  link={"/dashboard/create-event"}
                                  onClick={() =>
                                    navigate("/dashboard/create-event")
                                  }
                                />
                              </motion.div>
                            </CreateEventModal>
                          )}
                        </>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </LayoutGroup>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
