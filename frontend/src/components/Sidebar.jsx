import { NavLink } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaTachometerAlt,
  FaUser,
  FaCode,
  FaProjectDiagram,
  FaBlog,
  FaBriefcase,
  FaComments,
  FaServicestack,
  FaPhotoVideo,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const currentYear = new Date().getFullYear();

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    { label: "Dashboard", path: "/admin/dashboard", icon: FaTachometerAlt },
    { label: "About", path: "/admin/about", icon: FaUser },
    { label: "Skills", path: "/admin/skills", icon: FaCode },
    { label: "Projects", path: "/admin/projects", icon: FaProjectDiagram },
    { label: "Blogs", path: "/admin/blogs", icon: FaBlog },
    { label: "Experience", path: "/admin/experience", icon: FaBriefcase },
    { label: "Testimonials", path: "/admin/testimonials", icon: FaComments },
    { label: "Services", path: "/admin/services", icon: FaServicestack },
    { label: "Media", path: "/admin/media", icon: FaPhotoVideo },
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="
        sticky top-0 h-screen
        bg-gradient-to-b from-cyan-600 via-cyan-700 to-gray-900
        text-white flex flex-col shadow-2xl
      "
    >
      {/* ===== HEADER ===== */}
      <div className="flex font-inter items-center justify-between px-4 py-5 border-b border-white/10">
        {!collapsed && (
          <div>
            <h2 className="text-lg font-bold tracking-wide">Admin Panel</h2>
            <p className="text-xs text-cyan-200">Portfolio CMS</p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-white/10 transition"
          aria-label="Toggle Sidebar"
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* ===== NAVIGATION ===== */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `
                group flex items-center gap-3 px-3 py-2.5 rounded-xl
                transition-all duration-300
                ${
                  isActive
                    ? "bg-white/15 shadow-lg"
                    : "hover:bg-white/10"
                }
              `
              }
            >
              <span className="text-lg">
                <Icon />
              </span>

              {!collapsed && (
                <span className="text-sm font-medium tracking-wide">
                  {item.label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ===== FOOTER ===== */}
      {!collapsed && (
        <div className="px-5 py-4 border-t border-white/10 text-xs text-cyan-200">
          © {currentYear} Portfolio
        </div>
      )}
    </motion.aside>
  );
};

export default Sidebar;
