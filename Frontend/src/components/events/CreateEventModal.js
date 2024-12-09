import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { AVAILABLE_CATEGORIES } from "../../constants";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../services/api";

const EventSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .required("Title is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters")
    .required("Description is required"),
  category: Yup.string()
    .oneOf(AVAILABLE_CATEGORIES, "Invalid category")
    .required("Category is required"),
  startDate: Yup.date()
    .min(new Date(), "Start date cannot be in the past")
    .required("Start date is required"),
  endDate: Yup.date()
    .min(Yup.ref("startDate"), "End date must be after start date")
    .required("End date is required"),
  location: Yup.string().required("Location is required"),
  capacity: Yup.number()
    .min(1, "Capacity must be at least 1")
    .max(1000, "Capacity cannot exceed 1000")
    .required("Capacity is required"),
  reminders: Yup.array().of(
    Yup.number().min(0, "Reminder must be a positive number")
  ),
});

const CreateEventModal = ({
  isOpen,
  onClose,
  selectedDate,
  onEventCreated,
  children,
}) => {
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await api.post("/events", values);
      toast.success("Event created successfully!");
      onEventCreated(response.data);
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-50 overflow-y-auto'>
          <div className='flex items-center justify-center min-h-screen px-4'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black bg-opacity-30'
              onClick={onClose}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className='bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative'
            >
              <h2 className='text-2xl font-bold mb-6'>Create New Event</h2>

              <Formik
                initialValues={{
                  title: "",
                  description: "",
                  category: "",
                  startDate: selectedDate,
                  endDate: selectedDate,
                  location: "",
                  capacity: 1,
                  reminders: [24], // Default 24-hour reminder
                }}
                validationSchema={EventSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form className='space-y-4'>
                    <div>
                      <Field
                        name='title'
                        placeholder='Event Title'
                        className='w-full p-2 border rounded focus:ring-2 focus:ring-primary'
                      />
                      {errors.title && touched.title && (
                        <div className='text-red-500 text-sm mt-1'>
                          {errors.title}
                        </div>
                      )}
                    </div>

                    <div>
                      <Field
                        as='textarea'
                        name='description'
                        placeholder='Description'
                        className='w-full p-2 border rounded focus:ring-2 focus:ring-primary h-24'
                      />
                      {errors.description && touched.description && (
                        <div className='text-red-500 text-sm mt-1'>
                          {errors.description}
                        </div>
                      )}
                    </div>

                    <div>
                      <Field
                        as='select'
                        name='category'
                        className='w-full p-2 border rounded focus:ring-2 focus:ring-primary'
                      >
                        <option value=''>Select Category</option>
                        {AVAILABLE_CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </Field>
                      {errors.category && touched.category && (
                        <div className='text-red-500 text-sm mt-1'>
                          {errors.category}
                        </div>
                      )}
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <Field
                          type='datetime-local'
                          name='startDate'
                          className='w-full p-2 border rounded focus:ring-2 focus:ring-primary'
                        />
                        {errors.startDate && touched.startDate && (
                          <div className='text-red-500 text-sm mt-1'>
                            {errors.startDate}
                          </div>
                        )}
                      </div>

                      <div>
                        <Field
                          type='datetime-local'
                          name='endDate'
                          className='w-full p-2 border rounded focus:ring-2 focus:ring-primary'
                        />
                        {errors.endDate && touched.endDate && (
                          <div className='text-red-500 text-sm mt-1'>
                            {errors.endDate}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Field
                        name='location'
                        placeholder='Location'
                        className='w-full p-2 border rounded focus:ring-2 focus:ring-primary'
                      />
                      {errors.location && touched.location && (
                        <div className='text-red-500 text-sm mt-1'>
                          {errors.location}
                        </div>
                      )}
                    </div>

                    <div>
                      <Field
                        name='capacity'
                        placeholder='Capacity'
                        className='w-full p-2 border rounded focus:ring-2 focus:ring-primary'
                      />
                      {errors.capacity && touched.capacity && (
                        <div className='text-red-500 text-sm mt-1'>
                          {errors.capacity}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Reminders (hours before event)
                      </label>
                      <Field
                        name='reminders'
                        as='select'
                        multiple
                        className='w-full p-2 border rounded focus:ring-2 focus:ring-primary'
                      >
                        <option value='1'>1 hour</option>
                        <option value='24'>1 day</option>
                        <option value='168'>1 week</option>
                      </Field>
                    </div>

                    <div className='flex justify-end space-x-4 mt-6'>
                      <button
                        type='button'
                        onClick={onClose}
                        className='px-4 py-2 text-gray-600 hover:text-gray-800'
                      >
                        Cancel
                      </button>
                      <button
                        type='submit'
                        disabled={isSubmitting}
                        className='px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50'
                      >
                        {isSubmitting ? "Creating..." : "Create Event"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </motion.div>
          </div>
        </div>
      )}
      {children}
    </AnimatePresence>
  );
};

export default CreateEventModal;
