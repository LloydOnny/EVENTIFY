import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import toast from "react-hot-toast";

const EventCalendar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preferences] = useState([]);

  const formatEventsForCalendar = (events) => {
    return events.map((event) => ({
      id: event._id,
      title: event.title,
      start: event.startDate,
      end: event.endDate,
      extendedProps: {
        description: event.description,
        location: event.location,
        category: event.category,
      },
    }));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchEvents = async () => {
    try {
      const response = await api.get("/events", {
        params: {
          category: preferences.length > 0 ? preferences.join(",") : undefined,
        },
      });
      setEvents(formatEventsForCalendar(response.data));
    } catch (error) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, preferences]);

  const handleEventClick = (clickInfo) => {
    navigate(`/events/${clickInfo.event.id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        events={events}
        eventClick={handleEventClick}
        height='auto'
      />
    </div>
  );
};

export default EventCalendar;
