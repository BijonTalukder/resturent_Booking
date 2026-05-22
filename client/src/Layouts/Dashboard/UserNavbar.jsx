import React from 'react'
import { IoIosArrowDroprightCircle } from 'react-icons/io'

const UserNavbar = ({ isSidebarOpen, toggleSidebar, setIsSidebarOpen }) => {
  return (
    <div className="lg:px-6 bg-[#eef0f4]">
      <div className="flex justify-between items-center z-40 top-0 py-2 px-4">
        <div>
          {isSidebarOpen === false && (
            <button
              className="lg:hidden"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
            >
              <IoIosArrowDroprightCircle size={25} className="text-primary" />
            </button>
          )}
        </div>
        <div>
        </div>
      </div>
    </div>
  )
}

export default UserNavbar
