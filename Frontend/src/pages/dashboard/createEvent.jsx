import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { createEvent } from "../../services/eventService";

const eventSchema = yup.object().shape({
  name: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  startDateTime: yup.string().required("Start date is required"),
  endDateTime: yup
    .string()
    .required("End date is required")
    .test("endDateTime", "End date must be after start date", function (value) {
      const { startDateTime } = this.parent;
      if (!startDateTime || !value) return true;
      return new Date(value) > new Date(startDateTime);
    }),
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
  registrationDeadline: yup
    .string()
    .test(
      "registrationDeadline",
      "Registration deadline must be before event start date",
      function (value) {
        const { startDateTime } = this.parent;
        if (!startDateTime || !value) return true;
        return new Date(value) < new Date(startDateTime);
      }
    ),
  cancellationPolicy: yup.string(),
});

const CreateEvent = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
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

  const imageUrl = watch("imageUrl");

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    setValue("tags", tags);
  };

  const onSubmit = async (data) => {
    try {
      const transformedData = {
        ...data,
        capacity: Number(data.capacity),
        ticketPrice: Number(data.ticketPrice),
        maxTicketsPerUser: Number(data.maxTicketsPerUser),
        venue: {
          ...data.venue,
          coordinates: {
            latitude: Number(data.venue.coordinates.latitude),
            longitude: Number(data.venue.coordinates.longitude),
          },
        },
      };

      await createEvent(transformedData);
      toast.success("Event created successfully!");
      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create event";
      toast.error(errorMessage);
    }
  };

  return (
    <div className='h-full bg-gray-900 overflow-y-auto p-4 md:p-8'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-2xl font-bold text-gray-100 mb-8'>
          Create New Event
        </h1>
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
                Create Event
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
