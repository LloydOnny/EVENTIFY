import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

const BecomeAdmin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      reason: "",
      experience: "",
      references: "",
      additionalInfo: "",
      status: "admin",
    },
  });

  const onSubmit = async (data) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting your request...");

    try {
      const response = await api.put(`/users/be-admin`, {
        ...data,
        userId: user?.id,
      });

      if (response.data) {
        await refreshUser();

        toast.dismiss(loadingToast);
        toast.success("Request submitted successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.dismiss(loadingToast);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to submit request. Please try again.";

      toast.error(errorMessage);

      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          setError(key, {
            type: "manual",
            message: value,
          });
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-900'>
      <Navbar />
      <div className='max-w-2xl mx-auto px-4 py-8'>
        {user?.role === "admin" ? (
          <div className='flex items-center justify-center h-screen'>
            <h1 className='text-2xl font-bold text-gray-100 mb-6'>
              You are already an admin!
            </h1>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='bg-gray-800 rounded-xl shadow-lg p-6'
          >
            <h1 className='text-2xl font-bold text-gray-100 mb-6'>
              Request Admin Access
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              {/* Reason for Request */}
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  Why do you want to become an admin?
                </label>
                <textarea
                  {...register("reason", {
                    required: "Please provide a reason for your request",
                  })}
                  className={`w-full bg-gray-700 text-white rounded-lg border ${
                    errors.reason ? "border-red-500" : "border-gray-600"
                  } p-3 focus:outline-none focus:border-blue-500`}
                  rows={4}
                  placeholder='Explain your motivation...'
                />
                {errors.reason && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.reason.message}
                  </p>
                )}
              </div>

              {/* Experience */}
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  Relevant Experience
                </label>
                <textarea
                  {...register("experience", {
                    required: "Please provide your relevant experience",
                  })}
                  className={`w-full bg-gray-700 text-white rounded-lg border ${
                    errors.experience ? "border-red-500" : "border-gray-600"
                  } p-3 focus:outline-none focus:border-blue-500`}
                  rows={4}
                  placeholder='Describe your experience in event management...'
                />
                {errors.experience && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.experience.message}
                  </p>
                )}
              </div>

              {/* References */}
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  References (Optional)
                </label>
                <input
                  type='text'
                  {...register("references")}
                  className='w-full bg-gray-700 text-white rounded-lg border border-gray-600 p-3 focus:outline-none focus:border-blue-500'
                  placeholder='List any references...'
                />
              </div>

              {/* Additional Information */}
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  Additional Information
                </label>
                <textarea
                  {...register("additionalInfo")}
                  className='w-full bg-gray-700 text-white rounded-lg border border-gray-600 p-3 focus:outline-none focus:border-blue-500'
                  rows={3}
                  placeholder="Any additional information you'd like to share..."
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type='submit'
                disabled={isSubmitting}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium 
                ${
                  isSubmitting
                    ? "bg-blue-500/50 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } transition-colors`}
              >
                {isSubmitting ? (
                  <div className='flex items-center justify-center'>
                    <svg
                      className='animate-spin h-5 w-5 mr-3'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      />
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      />
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  "Submit Request"
                )}
              </motion.button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BecomeAdmin;
