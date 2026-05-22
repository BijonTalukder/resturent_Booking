import { Menu, Transition, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { Fragment } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  IoLogIn,
  IoLogInOutline,
  IoPersonOutline,
  IoPersonSharp,
} from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../redux/Hook/Hook";
import { logout, useCurrentUser } from "../../redux/Feature/auth/authSlice";
import { toast } from "sonner";

const Dropdown = () => {
  const user = useAppSelector(useCurrentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    toast.success("You are successfully logged out.")
    navigate("/admin-login")
  };
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
          <div className="flex justify-center items-center gap-x-3">
            <div className="rounded-full" style={{
              boxShadow: "2px 2px 4px rgba(0,0,0,0.3), -2px -2px 4px rgba(255,255,255,0.05)",
            }}>
              <img
                className="w-8 h-8 rounded-full"
                src={`https://ui-avatars.com/api/?name=${user?.name?.charAt(0) || "A"}&background=FD3D57&color=fff`}
                alt="user photo"
              />
            </div>
          </div>
        </MenuButton>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems
          className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-2xl shadow-neu-sm bg-[#eef0f4] ring-0 focus:outline-none z-10"
        >
          <div className="px-1 py-1">
            <MenuItem>
              {({ active }) => (
                <NavLink to={`/admin/profile`}>
                  <button
                    className={`group flex w-full items-center rounded-xl px-2 py-2 text-sm ${
                      active ? "neu-inset-sm text-[#373b43]" : "text-[#6b7588]"
                    }`}
                  >
                    {active ? (
                      <IoPersonSharp className="mx-2 text-primary" />
                    ) : (
                      <IoPersonOutline className="mx-2" />
                    )}
                    Profile
                  </button>
                </NavLink>
              )}
            </MenuItem>

            <MenuItem>
              {({ active }) => (
                <button
                  onClick={() => handleLogout()}
                  className={`${
                    active ? "neu-inset-sm text-red-500" : "text-[#6b7588]"
                  } group flex w-full items-center rounded-xl px-2 py-2 text-sm`}
                >
                  {active ? (
                    <IoLogIn className="mx-2 text-red-500" />
                  ) : (
                    <IoLogInOutline className="mx-2" />
                  )}
                  Logout
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default Dropdown;
