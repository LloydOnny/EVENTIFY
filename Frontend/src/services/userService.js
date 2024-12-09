import api from "./api";

export const updateProfile = async (userData) => {
  const response = await api.put("/users/profile", userData);
  return response.data;
};

export const getUserStats = async () => {
  const response = await api.get("/users/stats");
  return response.data;
};

export const getRegisteredEvents = async () => {
  const response = await api.get("/users/registered-events");
  return response.data;
};

export const updatePreferences = async (preferences) => {
  const response = await api.put("/users/preferences", { preferences });
  return response.data;
};
