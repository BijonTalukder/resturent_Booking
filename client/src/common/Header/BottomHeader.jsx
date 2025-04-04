import React from "react";
import { NavLink } from "react-router-dom";
import { HomeIcon, BellIcon, UserIcon } from "@heroicons/react/24/outline";

const BottomHeader = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md border-t border-gray-200 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <NavLink
            to="/"
            className={({ isActive }) => 
              `flex flex-col items-center px-4 py-2 ${isActive ? "text-blue-600" : "text-gray-600"}`
            }
          >
            <HomeIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </NavLink>
          
          <NavLink
            to="/notifications"
            className={({ isActive }) => 
              `flex flex-col items-center px-4 py-2 ${isActive ? "text-blue-600" : "text-gray-600"}`
            }
          >
            <BellIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Alerts</span>
          </NavLink>
          
          <NavLink
            to="/edit-profile"
            className={({ isActive }) => 
              `flex flex-col items-center px-4 py-2 ${isActive ? "text-blue-600" : "text-gray-600"}`
            }
          >
            <UserIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Profile</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default BottomHeader;