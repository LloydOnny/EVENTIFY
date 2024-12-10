import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
import Home from "./pages/Home";
import EventCalendar from "./pages/Calendar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import MyEvents from "./pages/MyEvents";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import AdminRoute from "./components/auth/AdminRoute";
import { AuthProvider } from "./contexts/AuthContext";
import EventBookings from "./pages/EventBookings";
import CreateEvent from "./pages/dashboard/createEvent";
import EditEvent from "./pages/dashboard/editEvent";
import BecomeAdmin from "./pages/becomeAdmin";

const App = () => {
  return (
    <LazyMotion features={domAnimation}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />

            {/* Protected User Routes */}
            <Route
              path='/'
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path='/calendar'
              element={
                <ProtectedRoute>
                  <EventCalendar />
                </ProtectedRoute>
              }
            />
            <Route
              path='/my-events'
              element={
                <ProtectedRoute>
                  <MyEvents />
                </ProtectedRoute>
              }
            />

            <Route
              path='/become-admin'
              element={
                <ProtectedRoute>
                  <BecomeAdmin />
                </ProtectedRoute>
              }
            />

            {/* Admin Only Routes */}
            <Route
              path='/dashboard'
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              }
            />
            <Route
              path='/dashboard/create-event'
              element={
                <AdminRoute>
                  <CreateEvent />
                </AdminRoute>
              }
            />

            <Route
              path='/dashboard/edit-event/:eventId'
              element={
                <AdminRoute>
                  <EditEvent />
                </AdminRoute>
              }
            />

            <Route
              path='/event-bookings/:eventId'
              element={
                <AdminRoute>
                  <EventBookings />
                </AdminRoute>
              }
            />

            {/* Redirect unauthorized access to login */}
            <Route path='*' element={<Navigate to='/login' />} />
          </Routes>
        </Router>
        <Toaster
          position='top-right'
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              style: {
                background: "#4ade80",
                color: "#fff",
              },
            },
            error: {
              style: {
                background: "#ef4444",
                color: "#fff",
              },
            },
          }}
        />
      </AuthProvider>
    </LazyMotion>
  );
};

export default App;
