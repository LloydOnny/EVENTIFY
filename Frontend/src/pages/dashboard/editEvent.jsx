/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import {
  //   getEvent,
  getEventById,
  updateEvent,
} from "../../services/eventService";

const eventSchema = yup.object().shape({
  name: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  startDateTime: yup.string().required("Start date is required"),
  endDateTime: yup
    .string()
    .required("End date is required")
    .test(
      "is-after-start",
      "End time must be after start time",
      function (value) {
        const { startDateTime } = this.parent;
        return new Date(value) > new Date(startDateTime);
      }
    ),
  location: yup.string().required("Location is required"),
  venue: yup.object().shape({
    name: yup.string(),
    address: yup.string(),
    city: yup.string(),
    state: yup.string(),
    zipCode: yup.string(),
    coordinates: yup.object().shape({
      latitude: yup.number(),
      longitude: yup.number(),
    }),
  }),
  category: yup
    .string()
    .required("Category is required")
    .oneOf(
      ["conference", "workshop", "seminar", "networking", "social", "other"],
      "Invalid category selected"
    ),
  capacity: yup
    .number()
    .required("Capacity is required")
    .min(1, "Capacity must be at least 1"),
  ticketPrice: yup.number().min(0, "Ticket price cannot be negative"),
  tags: yup.array().of(yup.string()),
  imageUrl: yup.string().url("Must be a valid URL"),
  isPrivate: yup.boolean(),
  maxTicketsPerUser: yup.number().min(1),
  registrationDeadline: yup.string(),
  cancellationPolicy: yup.string(),
});

// Custom validation function
const validateEvent = (eventData) => {
  const errors = {};

  if (!eventData.name || eventData.name.trim() === "") {
    errors.name = "Name is required";
  }

  if (!eventData.startDateTime) {
    errors.startDateTime = "Start date is required";
  }

  if (!eventData.endDateTime) {
    errors.endDateTime = "End date is required";
  }

  if (eventData.startDateTime && eventData.endDateTime) {
    const startDate = new Date(eventData.startDateTime);
    const endDate = new Date(eventData.endDateTime);

    if (endDate <= startDate) {
      errors.endDateTime = "End date must be after start date";
    }
  }

  if (!eventData.location || eventData.location.trim() === "") {
    errors.location = "Location is required";
  }

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

  if (!eventData.capacity) {
    errors.capacity = "Capacity is required";
  } else if (eventData.capacity < 1) {
    errors.capacity = "Capacity must be at least 1";
  }

  if (!eventData.description || eventData.description.trim() === "") {
    errors.description = "Description is required";
  }

  if (eventData.ticketPrice && eventData.ticketPrice < 0) {
    errors.ticketPrice = "Ticket price cannot be negative";
  }

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

const UpdateEvent = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      name: "",
      description: "",
      startDateTime: "",
      endDateTime: "",
      location: "",
      venue: {
        name: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        coordinates: {
          latitude: 0,
          longitude: 0,
        },
      },
      category: "",
      capacity: "",
      ticketPrice: "",
      tags: [],
      imageUrl: "",
      isPrivate: false,
      maxTicketsPerUser: 1,
      registrationDeadline: "",
      cancellationPolicy: "",
    },
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        console.log("Fetching event with ID:", eventId);
        const response = await getEventById(eventId);
        console.log("Fetched event data:", response);

        const eventData = response[0];

        if (eventData) {
          const formatDate = (dateString) => {
            if (!dateString) return "";
            return new Date(dateString).toISOString().slice(0, 16);
          };

          const formattedData = {
            name: eventData.name || "",
            description: eventData.description || "",
            startDateTime: formatDate(eventData.startDateTime),
            endDateTime: formatDate(eventData.endDateTime),
            location: eventData.location || "",
            venue: {
              name: eventData.venue?.name || "",
              address: eventData.venue?.address || "",
              city: eventData.venue?.city || "",
              state: eventData.venue?.state || "",
              zipCode: eventData.venue?.zipCode || "",
              coordinates: {
                latitude: eventData.venue?.coordinates?.latitude || 0,
                longitude: eventData.venue?.coordinates?.longitude || 0,
              },
            },
            category: eventData.category || "",
            capacity: eventData.capacity || "",
            ticketPrice: eventData.ticketPrice || "",
            tags: eventData.tags || [],
            imageUrl: eventData.imageUrl || "",
            isPrivate: eventData.isPrivate || false,
            maxTicketsPerUser: eventData.maxTicketsPerUser || 1,
            registrationDeadline: formatDate(eventData.registrationDeadline),
            cancellationPolicy: eventData.cancellationPolicy || "",
          };

          console.log("Formatted data for form:", formattedData);
          reset(formattedData);

          if (eventData.tags && eventData.tags.length > 0) {
            const tagsInput = document.querySelector(
              'input[placeholder="e.g., blockchain, web3, ethereum"]'
            );
            if (tagsInput) {
              tagsInput.value = eventData.tags.join(", ");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Failed to load event data");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId, reset]);

  useEffect(() => {
    const currentTags = watch("tags");
    if (currentTags && currentTags.length > 0) {
      const tagsInput = document.querySelector(
        'input[placeholder="e.g., blockchain, web3, ethereum"]'
      );
      if (tagsInput) {
        tagsInput.value = currentTags.join(", ");
      }
    }
  }, [watch]);

  const imageUrl = watch("imageUrl");

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    setValue("tags", tags);
  };

  const onSubmit = async (data) => {
    const { isValid, errors } = validateEvent(data);
    if (!isValid) {
      setValidationErrors(errors);
      return;
    }

    try {
      const transformedData = {
        name: data.name,
        description: data.description,
        startDateTime: new Date(data.startDateTime).toISOString(),
        endDateTime: new Date(data.endDateTime).toISOString(),
        location: data.location,
        venue: {
          name: data.venue.name,
          address: data.venue.address,
          city: data.venue.city,
          state: data.venue.state,
          zipCode: data.venue.zipCode,
          coordinates: {
            latitude: Number(data.venue.coordinates.latitude),
            longitude: Number(data.venue.coordinates.longitude),
          },
        },
        category: data.category,
        capacity: Number(data.capacity),
        ticketPrice: Number(data.ticketPrice),
        tags: data.tags,
        imageUrl: data.imageUrl,
        isPrivate: data.isPrivate,
        maxTicketsPerUser: Number(data.maxTicketsPerUser),
        registrationDeadline: new Date(data.registrationDeadline).toISOString(),
        cancellationPolicy: data.cancellationPolicy,
      };

      console.log("Data being sent to server:", transformedData);

      await updateEvent(eventId, transformedData);
      toast.success("Event updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating event:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update event";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className='flex flex-col justify-center items-center h-screen w-full bg-gray-900'>
        <div className='flex flex-col justify-center items-center h-auto w-auto space-y-4'>
          <div className='flex justify-center items-center h-full w-full'>
            <div className='h-12 w-12 border-t-2 border-b-2 border-primary rounded-full animate-spin'></div>
          </div>
          <p className='text-gray-400 text-lg'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='h-full bg-gray-900 overflow-y-auto p-4 md:p-8'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-2xl font-bold text-gray-100 mb-8'>Update Event</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700'
        >
          <div className='space-y-6'>
            {/* Image URL */}
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Event Image URL
              </label>
              <input
                type='url'
                {...register("imageUrl")}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.imageUrl ? "border-red-500" : "border-gray-600"
                } bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.imageUrl && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.imageUrl.message}
                </p>
              )}
              {imageUrl && (
                <div className='mt-4'>
                  <img
                    src={imageUrl}
                    alt='Event preview'
                    className='max-h-48 rounded-lg'
                    onError={(e) => {
                      e.target.onerror = null;
                      toast.error("Invalid image URL");
                    }}
                  />
                </div>
              )}
            </div>

            {/* Name */}
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Event Name
              </label>
              <input
                type='text'
                {...register("name")}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.name ? "border-red-500" : "border-gray-600"
                } bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.name && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Category
              </label>
              <select
                {...register("category")}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.category ? "border-red-500" : "border-gray-600"
                } bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value=''>Select category</option>
                <option value='conference'>Conference</option>
                <option value='workshop'>Workshop</option>
                <option value='seminar'>Seminar</option>
                <option value='networking'>Networking</option>
                <option value='social'>Social</option>
                <option value='other'>Other</option>
              </select>
              {errors.category && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Dates */}
            <div className='grid grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  Start Date & Time
                </label>
                <input
                  type='datetime-local'
                  {...register("startDateTime")}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.startDateTime ? "border-red-500" : "border-gray-600"
                  } bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.startDateTime && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.startDateTime.message}
                  </p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  End Date & Time
                </label>
                <input
                  type='datetime-local'
                  {...register("endDateTime")}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.endDateTime ? "border-red-500" : "border-gray-600"
                  } bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.endDateTime && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.endDateTime.message}
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Location
              </label>
              <input
                type='text'
                {...register("location")}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.location ? "border-red-500" : "border-gray-600"
                } bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.location && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Venue Details */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-200'>
                Venue Details
              </h3>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  Venue Name
                </label>
                <input
                  type='text'
                  {...register("venue.name")}
                  className='w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  Address
                </label>
                <input
                  type='text'
                  {...register("venue.address")}
                  className='w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div className='grid grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-2'>
                    City
                  </label>
                  <input
                    type='text'
                    {...register("venue.city")}
                    className='w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-2'>
                    State
                  </label>
                  <input
                    type='text'
                    {...register("venue.state")}
                    className='w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-2'>
                    ZIP Code
                  </label>
                  <input
                    type='text'
                    {...register("venue.zipCode")}
                    className='w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>
            </div>

            {/* Capacity and Price */}
            <div className='grid grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  Capacity
                </label>
                <input
                  type='number'
                  {...register("capacity")}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.capacity ? "border-red-500" : "border-gray-600"
                  } bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.capacity && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.capacity.message}
                  </p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  Ticket Price ($)
                </label>
                <input
                  type='number'
                  step='0.01'
                  {...register("ticketPrice")}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.ticketPrice ? "border-red-500" : "border-gray-600"
                  } bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.ticketPrice && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.ticketPrice.message}
                  </p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Tags (comma-separated)
              </label>
              <input
                type='text'
                onChange={handleTagsChange}
                placeholder='e.g., blockchain, web3, ethereum'
                className='w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            {/* Description */}
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Description
              </label>
              <textarea
                {...register("description")}
                rows='4'
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.description ? "border-red-500" : "border-gray-600"
                } bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              ></textarea>
              {errors.description && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Additional Settings */}
            <div className='space-y-4'>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  {...register("isPrivate")}
                  className='h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600'
                />
                <label className='ml-2 text-sm text-gray-300'>
                  Private Event
                </label>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  Max Tickets Per User
                </label>
                <input
                  type='number'
                  {...register("maxTicketsPerUser")}
                  min='1'
                  className='w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  Registration Deadline
                </label>
                <input
                  type='datetime-local'
                  {...register("registrationDeadline")}
                  className='w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                {errors.registrationDeadline && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.registrationDeadline.message}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  Cancellation Policy
                </label>
                <textarea
                  {...register("cancellationPolicy")}
                  rows='3'
                  className='w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <div className='flex justify-end'>
              <button
                type='submit'
                className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
              >
                Update Event
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateEvent;
