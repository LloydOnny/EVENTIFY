import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import AuthNavbar from "../components/AuthNavbar";
import toast from "react-hot-toast";
import api from "../services/api";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      preferences: [],
      profile: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        bio: "",
        company: "",
        jobTitle: "",
      },
    },
  });

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection) => {
    if (page + newDirection >= 0 && page + newDirection <= 2) {
      setPage([page + newDirection, newDirection]);
      setStep(page + newDirection + 1);
    }
  };

  const onSubmit = async (data) => {
    if (page < 2) {
      paginate(1);
      return;
    }

    const loadingToast = toast.loading("Creating your account...");
    try {
      // Transform the data to match the required format
      const formattedData = {
        username:
          `${data.profile.firstName}${data.profile.lastName}`.toLowerCase(),
        email: data.email,
        password: data.password,
        role: "user",
        preferences: data.preferences,
        profile: data.profile,
      };

      await api.post("/auth/register", formattedData);
      toast.dismiss(loadingToast);
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message || "Failed to create account");
    }
  };

  const renderStep = () => {
    return (
      <AnimatePresence initial={false} custom={direction} mode='wait'>
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial='enter'
          animate='center'
          exit='exit'
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag='x'
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
        >
          {(() => {
            switch (step) {
              case 1:
                return (
                  <div className='space-y-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-300 mb-1'>
                        Email
                      </label>
                      <input
                        type='email'
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                        className={`w-full bg-gray-800 text-white p-4 py-2 rounded-lg border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all ${
                          errors.email ? "border-red-500" : ""
                        }`}
                      />
                      {errors.email && (
                        <p className='text-red-500 text-sm mt-1'>
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type='password'
                        placeholder='Password'
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                          pattern: {
                            value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                            message:
                              "Password must contain at least one letter and one number",
                          },
                        })}
                        className={`w-full bg-gray-800 text-white p-4 py-2 rounded-lg border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all ${
                          errors.password ? "border-red-500" : ""
                        }`}
                      />
                      {errors.password && (
                        <p className='text-red-500 text-sm mt-1'>
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  </div>
                );

              case 2:
                return (
                  <div className='space-y-6'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-300 mb-1'>
                          First Name
                        </label>
                        <input
                          type='text'
                          {...register("profile.firstName", {
                            required: "First name is required",
                          })}
                          className='w-full bg-gray-800 text-white p-4 py-2 rounded-lg border border-gray-700'
                        />
                        {errors.profile?.firstName && (
                          <p className='text-red-500 text-sm mt-1'>
                            {errors.profile.firstName.message}
                          </p>
                        )}
                      </div>
                      <input
                        type='text'
                        placeholder='Last Name'
                        {...register("profile.lastName", {
                          required: "Last name is required",
                        })}
                        className='w-full bg-gray-800 text-white p-4 py-2 rounded-lg border border-gray-700'
                      />
                    </div>
                    <input
                      type='tel'
                      placeholder='Phone Number'
                      {...register("profile.phoneNumber")}
                      className='w-full bg-gray-800 text-white p-4 py-2 rounded-lg border border-gray-700'
                    />
                    <input
                      type='text'
                      placeholder='Company'
                      {...register("profile.company")}
                      className='w-full bg-gray-800 text-white p-4 py-2 rounded-lg border border-gray-700'
                    />
                    <input
                      type='text'
                      placeholder='Job Title'
                      {...register("profile.jobTitle")}
                      className='w-full bg-gray-800 text-white p-4 py-2 rounded-lg border border-gray-700'
                    />
                    <textarea
                      placeholder='Bio'
                      {...register("profile.bio")}
                      className='w-full bg-gray-800 text-white p-4 py-2 rounded-lg border border-gray-700'
                      rows={3}
                    />
                  </div>
                );

              case 3:
                return (
                  // Preferences
                  <div className='space-y-6'>
                    <div className='grid grid-cols-2 gap-4'>
                      {[
                        "conference",
                        "workshop",
                        "technology",
                        "artificial-intelligence",
                        "blockchain",
                      ].map((preference) => (
                        <label
                          key={preference}
                          className='flex items-center space-x-2 text-gray-200'
                        >
                          <input
                            type='checkbox'
                            value={preference}
                            {...register("preferences")}
                            className='form-checkbox text-blue-600'
                          />
                          <span className='capitalize'>
                            {preference.replace("-", " ")}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );

              default:
                return null;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className='h-screen overflow-hidden flex flex-col bg-gray-900'>
      <AuthNavbar />
      <div className='flex-1 flex items-center justify-center'>
        <div className='p-6 w-full max-w-sm'>
          <h1 className='text-2xl text-gray-100 font-bold mb-2'>Sign Up</h1>
          <div className='flex mb-6 space-x-2'>
            <AnimatePresence>
              {[1, 2, 3].map((stepNumber) => (
                <motion.div
                  key={stepNumber}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: stepNumber <= step ? 1 : 0 }}
                  className={`h-2 flex-1 rounded-full ${
                    stepNumber <= step ? "bg-blue-600" : "bg-gray-700"
                  }`}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </AnimatePresence>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {renderStep()}

            <div className='flex space-x-4'>
              {step > 1 && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type='button'
                  onClick={() => paginate(-1)}
                  className='flex-1 bg-gray-700 text-white p-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-600 transition-all'
                >
                  Previous
                </motion.button>
              )}
              <motion.button
                whileTap={{ scale: 0.95 }}
                type='submit'
                className='flex-1 bg-blue-600 text-white p-4 py-2 rounded-lg border border-gray-700 hover:bg-blue-700 transition-all'
              >
                {step === 3 ? "Create Account" : "Next"}
              </motion.button>
            </div>
          </form>

          <p className='mt-10 text-center text-sm text-gray-400'>
            Already have an account?{" "}
            <Link to='/login' className='text-blue-600 font-bold'>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
