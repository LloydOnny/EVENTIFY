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
  const [isCreateEventModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

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

  // Enhanced filtering logic with memoization
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (!event) return false;

      // Search query filter
      const matchesSearch = searchQuery
        ? event.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          event.location?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      // Date filter
      const matchesDate = selectedDate
        ? new Date(event.startDateTime).toDateString() ===
          selectedDate.toDateString()
        : true;

      // Category/preferences filter
      const matchesPreferences = selectedPreferences.length
        ? selectedPreferences.includes(event.category)
        : true;

      return matchesSearch && matchesDate && matchesPreferences;
    });
  }, [events, searchQuery, selectedDate, selectedPreferences]);

  // Function to handle preference changes from Calendar
  const handlePreferenceChange = (preferences) => {
    setSelectedPreferences(preferences);
  };

  // Function to handle date selection from Calendar
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Function to clear all filters
  const clearFilters = () => {
    setSelectedDate(null);
    setSelectedPreferences([]);
    setSearchQuery("");
  };

  // Filter status for UI feedback
  const isFiltering =
    selectedDate || selectedPreferences.length > 0 || searchQuery;

  return (
    <motion.div
      initial='initial'
      animate='animate'
      exit='exit'
      className='min-h-screen bg-gray-900 text-gray-100'
    >
      <Navbar />
      <motion.div className='mx-auto px-4 py-8 container'>
        <div className='flex flex-col lg:flex-row gap-8 h-[calc(100vh-theme(spacing.20))]'>
          {/* Calendar Section */}
          <motion.div className='lg:w-[350px] w-full'>
            <EventCalendar
              events={events}
              onDateSelect={handleDateSelect}
              onPreferencesChange={handlePreferenceChange}
              preferences={categories}
              selectedDate={selectedDate}
              selectedPreferences={selectedPreferences}
            />
          </motion.div>

          {/* Events Section */}
          <motion.div className='flex-1 lg:overflow-hidden'>
            <div className='flex flex-col h-full'>
              {/* Header with search and filter info */}
              <div className='flex flex-col space-y-4 mb-6'>
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
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

                {/* Active filters display */}
                {isFiltering && (
                  <div className='flex flex-wrap items-center gap-2'>
                    {selectedDate && (
                      <span className='px-3 py-1 bg-gray-800 rounded-full text-sm flex items-center gap-2'>
                        <span>{selectedDate.toLocaleDateString()}</span>
                        <button
                          onClick={() => setSelectedDate(null)}
                          className='hover:text-primary'
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {selectedPreferences.map((pref) => (
                      <span
                        key={pref}
                        className='px-3 py-1 bg-gray-800 rounded-full text-sm flex items-center gap-2'
                      >
                        <span>{pref}</span>
                        <button
                          onClick={() =>
                            setSelectedPreferences(
                              selectedPreferences.filter((p) => p !== pref)
                            )
                          }
                          className='hover:text-primary'
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {searchQuery && (
                      <span className='px-3 py-1 bg-gray-800 rounded-full text-sm flex items-center gap-2'>
                        <span>"{searchQuery}"</span>
                        <button
                          onClick={() => setSearchQuery("")}
                          className='hover:text-primary'
                        >
                          ×
                        </button>
                      </span>
                    )}
                    <button
                      onClick={clearFilters}
                      className='text-sm text-primary hover:text-primary/90'
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>

              {/* Events grid */}
              <div className='lg:overflow-y-auto flex-1'>
                <LayoutGroup>
                  <motion.div
                    layout
                    className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8'
                  >
                    <AnimatePresence mode='wait'>
                      {loading ? (
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
                        <>
                          {filteredEvents.map((event, index) => (
                            <motion.div
                              key={event._id || index}
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
                                onRSVP={handleRSVP}
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
                                  link='/dashboard/create-event'
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
