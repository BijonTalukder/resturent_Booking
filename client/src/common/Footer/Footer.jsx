import { Link, useLocation } from "react-router-dom";
import image from "../../assets/icon.png";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { IoMailOutline, IoCallOutline, IoLocationOutline } from "react-icons/io5";
import { useGetDivisionsQuery } from "../../redux/Feature/User/place/placeApi";

const HIDDEN_PATHS = [
  "/login", "/register", "/admin-login",
  "/cancel", "/success", "/checkout",
  "/notification",
];

const Footer = () => {
  const location = useLocation();
  const { data: divisionsData, isLoading: divisionsLoading } = useGetDivisionsQuery();

  const isHotel = location?.pathname?.startsWith("/hotel");
  const isDivision = location?.pathname === "/division";
  const isDistrict = location?.pathname?.startsWith("/district");
  const isArea = location?.pathname?.startsWith("/area");

  const shouldHide =
    HIDDEN_PATHS.includes(location.pathname) ||
    isHotel || isDivision || isDistrict || isArea;

  if (shouldHide) return null;

  const divisions = divisionsData?.data || [];

  return (
    <footer className="hidden lg:block bg-[#1a2b3c] text-gray-300 mt-16">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-teal-400" />

      {/* Main grid */}
      <div className="max-w-[1400px] mx-auto px-6 py-14 grid grid-cols-12 gap-10">

        {/* ── Brand ── */}
        <div className="col-span-4">
          <Link to="/" className="flex items-center gap-3 mb-5 group">
            <img src={image} className="w-10 h-10 object-contain" alt="logo" />
            <div>
              <p className="text-white font-extrabold text-lg leading-none tracking-tight group-hover:text-blue-400 transition-colors">
                BEHB
              </p>
              <p className="text-blue-400 text-xs mt-0.5 tracking-widest uppercase">
                Find your perfect stay
              </p>
            </div>
          </Link>

          <p className="text-sm leading-relaxed text-gray-400 mb-6 max-w-xs">
            Discover thousands of hotels across Bangladesh — from luxury resorts
            to cozy guesthouses. Your next adventure starts here.
          </p>

          {/* Social links */}
          <div className="flex items-center gap-3 mb-8">
            {[
              { icon: <FaFacebookF size={13} />, href: "#", label: "Facebook" },
              { icon: <FaInstagram size={13} />, href: "#", label: "Instagram" },
              { icon: <FaTwitter size={13} />, href: "#", label: "Twitter" },
              { icon: <FaYoutube size={13} />, href: "#", label: "YouTube" },
            ].map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-blue-500 hover:text-white text-gray-400 transition-all duration-200 border border-white/10"
              >
                {icon}
              </a>
            ))}
          </div>

          {/* App badges */}
          <div className="flex gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-blue-500/40 transition-colors cursor-pointer">
              <span className="text-base">🍎</span>
              <div className="leading-none">
                <p className="text-[9px] text-gray-500 uppercase">Download on</p>
                <p className="text-xs text-white font-semibold">App Store</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-blue-500/40 transition-colors cursor-pointer">
              <span className="text-base">▶</span>
              <div className="leading-none">
                <p className="text-[9px] text-gray-500 uppercase">Get it on</p>
                <p className="text-xs text-white font-semibold">Google Play</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Quick Links ── */}
        <div className="col-span-2">
          <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">
            Quick Links
          </h4>
          <ul className="space-y-3">
            {[
              { label: "Home", to: "/" },
              { label: "All Hotels", to: "/" },
              { label: "Browse Divisions", to: "/division" },
              { label: "My Bookings", to: "/user/user-booking" },
              { label: "My Profile", to: "/user/user-profile" },
              { label: "Privacy Policy", to: "/privacy-policy" },
            ].map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-1.5 group"
                >
                  <span className="w-0 group-hover:w-3 h-px bg-blue-400 transition-all duration-300 inline-block" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Divisions — DYNAMIC from API ── */}
        <div className="col-span-3">
          <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">
            Explore by Division
          </h4>

          {divisionsLoading ? (
            <ul className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
              ))}
            </ul>
          ) : (
            <ul className="space-y-3">
              {divisions.slice(0, 8).map((division) => (
                <li key={division.id || division.serialId}>
                  <Link
                    to={`/district/${division.serialId}`}
                    className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-blue-400 transition-all duration-300 inline-block" />
                    {division.name}
                  </Link>
                </li>
              ))}
              {divisions.length === 0 && (
                <li className="text-sm text-gray-500 italic">No divisions available</li>
              )}
            </ul>
          )}
        </div>

        {/* ── Contact ── */}
        <div className="col-span-3">
          <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">
            Contact Us
          </h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <IoLocationOutline className="text-blue-400 shrink-0 mt-0.5" size={16} />
              <span className="text-sm text-gray-400 leading-snug">
                House 12, Road 4, Dhanmondi<br />
                Dhaka - 1205, Bangladesh
              </span>
            </li>
            <li>
              <a
                href="mailto:support@BEHB.com"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                <IoMailOutline className="text-blue-400 shrink-0" size={16} />
                support@BEHB.com
              </a>
            </li>
            <li>
              <a
                href="tel:+8801700000000"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                <IoCallOutline className="text-blue-400 shrink-0" size={16} />
                +880 1700-000000
              </a>
            </li>
          </ul>

          {/* Newsletter mini CTA */}
          <div className="mt-7 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white text-xs font-semibold mb-1">Get the best deals</p>
            <p className="text-gray-400 text-[11px] mb-3">
              Subscribe for exclusive hotel offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-colors"
              />
              <button className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold transition-colors shrink-0">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} BEHB. All rights reserved. Made with ❤️ in Bangladesh.
          </p>
          <div className="flex items-center gap-5 text-xs text-gray-500">
            <Link to="/privacy-policy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
            <Link to="/refund" className="hover:text-gray-300 transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;