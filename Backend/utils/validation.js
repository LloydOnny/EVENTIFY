const validateEvent = (eventData) => {
  const errors = {};

  // Name/Title validation
  if (!eventData.name || eventData.name.trim() === "") {
    errors.title = "Title is required";
  }

  // Date validations
  if (!eventData.startDateTime) {
    errors.startDate = "Start date is required";
  }

  if (!eventData.endDateTime) {
    errors.endDate = "End date is required";
  }

  if (eventData.startDateTime && eventData.endDateTime) {
    const startDate = new Date(eventData.startDateTime);
    const endDate = new Date(eventData.endDateTime);

    if (endDate <= startDate) {
      errors.endDate = "End date must be after start date";
    }
  }

  // Location validation
  if (!eventData.location || eventData.location.trim() === "") {
    errors.location = "Location is required";
  }

  // Category validation
  if (!eventData.category) {
    errors.category = "Category is required";
  } else if (
    ![
      "conference",
      "workshop",
      "seminar",
      "networking",
      "social",
      "other",
    ].includes(eventData.category)
  ) {
    errors.category = "Invalid category selected";
  }

  // Capacity validation
  if (!eventData.capacity) {
    errors.capacity = "Capacity is required";
  } else if (eventData.capacity < 1) {
    errors.capacity = "Capacity must be at least 1";
  }

  // Description validation
  if (!eventData.description || eventData.description.trim() === "") {
    errors.description = "Description is required";
  }

  // Ticket price validation
  if (eventData.ticketPrice && eventData.ticketPrice < 0) {
    errors.ticketPrice = "Ticket price cannot be negative";
  }

  // Registration deadline validation
  if (eventData.registrationDeadline) {
    const registrationDate = new Date(eventData.registrationDeadline);
    const startDate = new Date(eventData.startDateTime);

    if (registrationDate >= startDate) {
      errors.registrationDeadline =
        "Registration deadline must be before event start date";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateUpdateUser = (data) => {
  const errors = {};

  if (data.username) {
    if (data.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }
    if (data.username.length > 30) {
      errors.username = "Username cannot exceed 30 characters";
    }
  }

  if (data.preferences && !Array.isArray(data.preferences)) {
    errors.preferences = "Preferences must be an array";
  }

  if (data.profileImage) {
    const validImageUrl = /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i;
    if (!validImageUrl.test(data.profileImage)) {
      errors.profileImage = "Invalid image URL format";
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

const validateRegistration = (data) => {
  const errors = {};

  if (!data.username?.trim()) {
    errors.username = "Username is required";
  } else if (data.username.length < 3) {
    errors.username = "Username must be at least 3 characters";
  }

  if (!data.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(data.password)) {
    errors.password =
      "Password must contain at least one number, one lowercase and one uppercase letter";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

const validateLogin = (data) => {
  const errors = {};

  if (!data.email?.trim()) errors.email = "Email is required";
  if (!data.password) errors.password = "Password is required";

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

module.exports = {
  validateEvent,
  validateUpdateUser,
  validateRegistration,
  validateLogin,
};
