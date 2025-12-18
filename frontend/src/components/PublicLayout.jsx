import React, { useState, useEffect, useRef } from "react";
import { FaRocket, FaBars } from "react-icons/fa";

export default function PublicLayout({ children }) {
  const [pastHero, setPastHero] = useState(false);
  const [showRocket, setShowRocket] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScroll = useRef(0);

  const sections = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" }, // new dot
    { id: "projects", label: "Projects" },
    { id: "testimonials-blogs", label: "Testimonials & Blogs" },
    { id: "contact", label: "Contact" },
  ];

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      const heroHeight = document.getElementById("home")?.offsetHeight || 0;

      setPastHero(current > heroHeight);
      setShowRocket(current > 200);

      // Update active section
      sections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el) {
          const offsetTop = el.offsetTop - 100;
          const offsetBottom = offsetTop + el.offsetHeight;
          if (current >= offsetTop && current <= offsetBottom) {
            setActiveSection(section.id);
          }
        }
      });

      lastScroll.current = current;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsMenuOpen(false);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-gray-100 relative">

      {/* Navbar Dots - Desktop only */}
      {pastHero && (
        <div className="hidden lg:flex fixed right-6 top-1/2 transform -translate-y-1/2 flex-col items-center space-y-6 z-50">
          {sections.map((section) => (
            <div
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className="relative group cursor-pointer"
            >
              <div
                className={`w-4 h-4 rounded-full transition-all duration-300 
                  ${activeSection === section.id ? "bg-[#00b7c7] scale-150" : "bg-gray-600"} 
                  hover:bg-[#00b7c7] hover:scale-150`}
              />
              <span className="absolute right-2 top-0 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                text-white font-semibold text-sm uppercase">
                {section.label.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Hamburger Menu - Mobile only */}
      {pastHero && (
        <div className="lg:hidden fixed top-5 right-5 z-50">
          <button
            onClick={toggleMenu}
            className="p-4 bg-[#00b7c7] text-gray-900 rounded-full shadow-lg"
          >
            <FaBars size={30} />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 top-16 bg-[#008b95] text-white rounded-md shadow-lg p-4">
              <ul className="space-y-4">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollTo(section.id)}
                      className="hover:text-yellow-300 transition"
                    >
                      {section.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <main className="!pt-0">{children}</main>

      {/* Rocket Scroll to Top */}
      {showRocket && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-[#00b7c7] text-gray-900 rounded-full shadow-sm hover:bg-[#009aa9] transition-all duration-300"
        >
          <FaRocket size={30} />
        </button>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>© {new Date().getFullYear()} My Portfolio. All rights reserved.</p>
      </footer>
    </div>
  );
}
