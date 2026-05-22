import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  HomeIcon as HomeIconOutline,
  BellIcon as BellIconOutline,
  UserIcon as UserIconOutline,
} from "@heroicons/react/24/outline";
import { HomeIcon, BellIcon, UserIcon } from "@heroicons/react/24/solid";
import { useAppSelector } from "../../redux/Hook/Hook";
import { useCurrentUser } from "../../redux/Feature/auth/authSlice";
import { useGetUserNotificationsQuery } from "../../redux/Feature/Admin/notification/notificationApi";
import { Badge } from "antd";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaFacebookMessenger } from "react-icons/fa";
import { HiOutlineInboxIn } from "react-icons/hi";
import { IoArrowBack } from "react-icons/io5";
import { useGetAllSettingsQuery } from "../../redux/Feature/Admin/setting/settingApi";

const BottomHeader = () => {
    const user = useAppSelector(useCurrentUser);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showInbox, setShowInbox] = useState(false);
    const [whatsapp, setWhatsapp] = useState("");
    const [messenger, setMessenger] = useState("");
    const location = useLocation();
    const isAdminLogin = location.pathname === '/admin-login';

    const { data: notifications } = useGetUserNotificationsQuery(user?.id);
    const { data: settingsData } = useGetAllSettingsQuery();

    useEffect(() => {
      if (notifications) {
        setUnreadCount(notifications?.data?.filter((n) => !n.isRead).length);
      }
    }, [notifications]);

    useEffect(() => {
      if (settingsData?.data) {
        const whatsappSetting = settingsData.data.find(s => s.key === "inbox_whatsapp");
        const messengerSetting = settingsData.data.find(s => s.key === "inbox_messenger");
        if (whatsappSetting) setWhatsapp(whatsappSetting.value);
        if (messengerSetting) setMessenger(messengerSetting.value);
      }
    }, [settingsData]);

  return (
    <>
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 bg-[#eef0f4] shadow-neu-sm border-t-0 z-50 ${isAdminLogin ? "hidden" : ""}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex flex-col items-center px-4 py-2 ${isActive ? "text-primary" : "text-[#6b7588]"}`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`neu-circle w-10 h-10 flex items-center justify-center ${isActive ? "shadow-neu-inset-sm" : "shadow-neu-sm"}`}>
                    {isActive ? (
                      <HomeIcon className="w-5 h-5 text-primary" />
                    ) : (
                      <HomeIconOutline className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs mt-1 font-medium">Home</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/notification"
              className={({ isActive }) =>
                `flex flex-col items-center px-4 py-2 ${isActive ? "text-primary" : "text-[#6b7588]"}`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`neu-circle w-10 h-10 flex items-center justify-center ${isActive ? "shadow-neu-inset-sm" : "shadow-neu-sm"}`}>
                    <Badge count={unreadCount} overflowCount={9} className="cursor-pointer">
                      {isActive ? (
                        <BellIcon className="w-5 h-5 text-primary" />
                      ) : (
                        <BellIconOutline className="w-5 h-5" />
                      )}
                    </Badge>
                  </div>
                  <span className="text-xs mt-1 font-medium">Notifications</span>
                </>
              )}
            </NavLink>

            <button
              onClick={() => setShowInbox(true)}
              className="flex flex-col items-center px-4 py-2 text-[#6b7588]"
            >
              <div className="neu-circle w-10 h-10 flex items-center justify-center shadow-neu-sm">
                <HiOutlineInboxIn className="w-5 h-5" />
              </div>
              <span className="text-xs mt-1 font-medium">Inbox</span>
            </button>

            <NavLink
              to="/user/user-profile"
              className={({ isActive }) =>
                `flex flex-col items-center px-4 py-2 ${isActive ? "text-primary" : "text-[#6b7588]"}`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`neu-circle w-10 h-10 flex items-center justify-center ${isActive ? "shadow-neu-inset-sm" : "shadow-neu-sm"}`}>
                    {isActive ? (
                      <UserIcon className="w-5 h-5 text-primary" />
                    ) : (
                      <UserIconOutline className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs mt-1 font-medium">Profile</span>
                </>
              )}
            </NavLink>
          </div>
        </div>
      </div>

      {/* Inbox Drawer */}
      {showInbox && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#eef0f4] lg:hidden">
          <div className="sticky top-0 bg-[#eef0f4] p-4 shadow-neu-sm z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowInbox(false)}
                className="neu-btn w-10 h-10 flex items-center justify-center"
              >
                <IoArrowBack size={20} className="text-[#6b7588]" />
              </button>
              <h2 className="text-lg font-semibold text-[#373b43]">Inbox</h2>
            </div>
          </div>

          <div className="flex-1 p-4 space-y-4">
            <a
              href={whatsapp || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`neu-card p-5 flex items-center gap-4 transition-all ${
                !whatsapp ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center"
                style={{ boxShadow: "inset 3px 3px 6px rgba(163,177,198,0.3), inset -3px -3px 6px rgba(255,255,255,0.5)" }}
              >
                <IoLogoWhatsapp className="text-green-500 text-3xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#373b43]">WhatsApp</h3>
                <p className="text-sm text-[#6b7588]">Chat with us on WhatsApp</p>
              </div>
              <span className="text-[#6b7588]">→</span>
            </a>

            <a
              href={messenger || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`neu-card p-5 flex items-center gap-4 transition-all ${
                !messenger ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center"
                style={{ boxShadow: "inset 3px 3px 6px rgba(163,177,198,0.3), inset -3px -3px 6px rgba(255,255,255,0.5)" }}
              >
                <FaFacebookMessenger className="text-blue-500 text-3xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#373b43]">Messenger</h3>
                <p className="text-sm text-[#6b7588]">Message us on Facebook</p>
              </div>
              <span className="text-[#6b7588]">→</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default BottomHeader;
