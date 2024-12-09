import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaTicketAlt,
  FaEllo,
  FaAccusoft,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className='bg-gray-900 border-b border-gray-800 px-4 md:px-6 py-4'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center space-x-4'>
          <Link to='/' className='flex items-center space-x-2'>
            <FaEllo className='text-blue-600 h-8 md:h-11' />
            <h1 className='text-xl font-bold text-gray-100'>Eventify</h1>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className='hidden md:flex items-center space-x-6'>
          <Link
            to='/my-events'
            className={`flex items-center space-x-2 ${
              window.location.pathname === "/my-events"
                ? "text-gray-300 underline underline-offset-4"
                : "text-gray-100"
            } hover:text-gray-300`}
          >
            <FaTicketAlt />
            <span>My Events</span>
          </Link>

          {user?.role === "admin" && (
            <Link
              to='/dashboard'
              className={`flex items-center space-x-2 ${
                window.location.pathname === "/dashboard"
                  ? "text-gray-300 underline underline-offset-4"
                  : "text-gray-100"
              } hover:text-gray-300`}
            >
              <FaAccusoft />
              <span>Dashboard</span>
            </Link>
          )}

          <button
            onClick={handleLogout}
            className='bg-gray-200 px-4 py-2 rounded-lg text-gray-900 hover:bg-gray-300'
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className='md:hidden text-gray-600'
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className='md:hidden mt-4 space-y-4'>
          <div className='flex flex-col space-y-4'>
            <Link
              to='/my-events'
              className='flex items-center space-x-2 px-4 py-2 text-gray-600'
              onClick={() => setIsOpen(false)}
            >
              <FaTicketAlt />
              <span>My Events</span>
            </Link>

            {user?.role === "admin" && (
              <Link
                to='/dashboard'
                className='flex items-center space-x-2 px-4 py-2 text-gray-600'
                onClick={() => setIsOpen(false)}
              >
                <FaAccusoft />
                <span>Dashboard</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className='bg-gray-200 text-gray-900 px-4 py-2 rounded-lg text-center w-full'
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
