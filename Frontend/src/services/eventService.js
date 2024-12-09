import api from "./api";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3",
];

const getRandomImage = () => {
  return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
};

export const getEvents = async () => {
  try {
    const response = await api.get("http://localhost:3001/api/events");
    return response?.data?.data?.map((event) => ({
      ...event,
      image: event.image || getRandomImage(),
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const getMyEvents = async (userId) => {
  const events = await getEvents();
  return events.filter((event) =>
    event.attendees.some((attendee) => attendee.user._id === String(userId))
  );
};

export const getEventById = async (eventId) => {
  const events = await getEvents();
  return events.filter((event) => event._id === eventId);
};

export const cancelRSVP = async (eventId) => {
  try {
    const response = await api.delete(`/events/${eventId}/rsvp`);
    return response.data;
  } catch (error) {
    console.error("Error canceling RSVP:", error);
    throw error;
  }
};

export const eventsCreatedByUser = async (userId) => {
  const events = await getEvents();
  return events.filter((event) => event.organizer._id === userId);
};

export const deleteEvent = async (eventId) => {
  const response = await api.delete(`/events/${eventId}`);
  return response.data;
};

export const createEvent = async (event) => {
  const response = await api.post("/events", event);
  return response.data;
};

export const getEvent = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

export const updateEvent = async (id, eventData) => {
  const response = await api.put(`/events/${id}`, eventData);
  return response.data;
};
