/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import {
  FiList,
  FiPlusCircle,
  FiLogOut,
  FiMenu,
  FiX,
  FiUpload,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import { eventsCreatedByUser, deleteEvent } from "../../services/eventService";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeMenu, setActiveMenu] = useState("allEvents");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchEvents = useCallback(async () => {
    try {
      const data = await eventsCreatedByUser(user.id);
      setEvents(data || []);
    } catch (error) {
      toast.error("Failed to fetch events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, user]);

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      toast.success("Event deleted successfully!");
      fetchEvents();
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const menuItems = [
    {
      id: "allEvents",
      label: "All Events",
      icon: <FiList />,
      path: "/dashboard",
    },
    {
      id: "createEvent",
      label: "Create Event",
      icon: <FiPlusCircle />,
      path: "/dashboard/create-event",
    },
  ];

  const eventTypes = [
    "Workshops",
    "Seminars",
    "Music Events",
    "Sports",
    "Cultural",
    "Academic",
  ];

  const EventCard = ({ event }) => {
    const startDate = new Date(event.startDateTime);
    const endDate = new Date(event.endDateTime);

    return (
      <div className='bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-700'>
        <div className='flex justify-between items-start'>
          <div>
            <h2 className='text-xl font-semibold text-gray-100'>
              {event.name}
            </h2>
            <div className='flex items-center gap-2'>
              <p className='text-sm text-gray-400 mt-1'>
                {startDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at{" "}
                {startDate.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
              <span className='text-gray-400'>-</span>
              <p className='text-sm text-gray-400 mt-1'>
                {endDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at{" "}
                {endDate.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs ${
              event.seatsLeft > 10
                ? "bg-green-900 text-green-200"
                : event.seatsLeft > 0
                ? "bg-yellow-900 text-yellow-200"
                : "bg-red-900 text-red-200"
            } inline-flex items-center justify-center`}
          >
            {event.capacity - event?.attendees?.length} seats left
          </span>
        </div>

        <div className='mt-4'>
          <p className='text-gray-400 text-sm'>{event.location}</p>
          <p className='text-gray-300 mt-2'>{event.description}</p>
        </div>

        <div className='mt-6 flex gap-3'>
          <a
            href={`/event-bookings/${event._id}`}
            className='px-4 py-2 text-sm rounded-lg bg-blue-900 text-blue-200 hover:bg-blue-800 transition-colors'
          >
            View Bookings
          </a>
          <button
            onClick={() => handleDeleteEvent(event._id)}
            className='px-4 py-2 text-sm rounded-lg border border-red-800 text-red-200 hover:bg-red-900 transition-colors'
          >
            Delete
          </button>
          <a
            href={`/dashboard/edit-event/${event._id}`}
            className='px-4 py-2 text-sm rounded-lg border border-blue-800 text-blue-200 hover:bg-blue-900 transition-colors'
          >
            Edit
          </a>
        </div>
      </div>
    );
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "allEvents":
        return (
          <div>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
              <h1 className='text-2xl font-bold text-gray-100'>All Events</h1>
              <SearchBar
                placeholder='Search events...'
                value={searchQuery}
                onChange={setSearchQuery}
                className='w-full md:w-64 bg-gray-800 text-gray-100'
              />
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {filteredEvents.map((event, index) => (
                <EventCard
                  key={event.id + "dashboard" + index + "allEvents"}
                  event={event}
                />
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className='text-center py-12 bg-gray-800 rounded-lg shadow-sm border border-gray-700'>
                <p className='text-gray-400'>
                  No events found matching your search.
                </p>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className='text-gray-300'>
            Select an option from the sidebar.
          </div>
        );
    }
  };

  return (
    <div className='min-h-screen bg-gray-900'>
      {/* Mobile Navbar */}
      <div className='md:hidden bg-gray-800 border-b border-gray-700 px-4 py-4'>
        <div className='flex justify-between items-center'>
          <h1 className='text-xl font-bold text-gray-800'>Admin Dashboard</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='text-gray-600 hover:text-gray-900'
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='md:hidden bg-gray-900 border-b border-gray-700'>
          <nav className='px-4 py-2'>
            <ul className='space-y-2'>
              {menuItems.map((item, index) => (
                <li key={item.id + "mobile" + index + "dashboard"}>
                  <a
                    href={item.path}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
              <li className='pt-4'>
                <button
                  onClick={() => navigate("/login")}
                  className='w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      <div className='flex'>
        {/* Desktop Sidebar */}
        <div className='hidden md:block w-64 bg-gray-800 border-r border-gray-700 min-h-screen'>
          <div className='p-6'>
            <h1 className='text-xl font-bold text-gray-100'>Admin Dashboard</h1>
            <nav className='mt-8'>
              <ul className='space-y-2'>
                {menuItems.map((item, index) => (
                  <li key={item.id + "desktop" + index + "dashboard"}>
                    <a
                      href={item.path}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        location.pathname === item.path
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
                <li className='pt-4'>
                  <button
                    onClick={() => navigate("/login")}
                    className='w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className='flex-1 p-4 md:p-8'>{renderContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
