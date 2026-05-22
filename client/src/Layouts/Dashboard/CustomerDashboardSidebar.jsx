import { Link, useLocation } from "react-router-dom";
import { CustomerRoutes } from "../../Routes/Customer.Routes";
import { sidebarGenerator } from "../../utils/sidebarGenerator";
import { FiX } from "react-icons/fi";

const CustomerDashboardSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const sidebarData = sidebarGenerator(CustomerRoutes);
  const { pathname } = useLocation();
  return (
    <div className="neu-card w-72 p-4">
      <div className="flex justify-end">
        <button
          className="xl:hidden mb-4 lg:mb-0"
          onClick={toggleSidebar}
          aria-expanded={isSidebarOpen}
        >
          {isSidebarOpen && <FiX size={24} className="text-[#6b7588]" />}
        </button>
      </div>
      <div className="space-y-1">
        {sidebarData.map((item) => (
          <Link to={item.key} key={item.key}>
            <div
              className={`flex items-center gap-x-3 px-5 py-2.5 text-sm rounded-xl transition-all duration-200 ${
                pathname === item.key
                  ? "neu-inset-sm text-primary font-medium"
                  : "text-[#6b7588] hover:text-[#373b43] hover:neu-xs"
              }`}
            >
              <span>{item?.icon}</span>
              <span>{item?.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CustomerDashboardSidebar;
