import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiCalendar,
  FiBookmark,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: FiHome, label: "Home", path: "/" },
    { icon: FiCalendar, label: "Calendar", path: "/calendar" },
    { icon: FiBookmark, label: "My Events", path: "/my-events" },
    { icon: FiSettings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-sm transition-all duration-300`}
      >
        <div className='flex flex-col h-full p-4'>
          <div className='flex items-center mb-8'>
            <FiBookmark className='text-blue-600 h-8 w-8' />
            {isSidebarOpen && (
              <span className='ml-3 text-xl font-semibold'>EventHub</span>
            )}
          </div>

          <nav className='flex-1'>
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center w-full p-3 mb-2 rounded-lg transition-colors
                  ${
                    location.pathname === item.path
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <item.icon className='h-5 w-5' />
                {isSidebarOpen && <span className='ml-3'>{item.label}</span>}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className='flex items-center p-3 text-gray-600 hover:bg-gray-50 rounded-lg'
          >
            {isSidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 overflow-auto'>
        <div className='p-8'>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
