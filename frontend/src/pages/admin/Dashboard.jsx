import { useEffect, useState } from "react";
import {
  FaCode,
  FaProjectDiagram,
  FaPen,
  FaServicestack,
  FaRegComments,
  FaBriefcase,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const Dashboard = ({ adminName }) => {
  const [counts, setCounts] = useState({
    skills: 0,
    projects: 0,
    blogs: 0,
    services: 0,
    testimonials: 0,
    experience: 0,
  });

  const [wave, setWave] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          skillsRes,
          projectsRes,
          blogsRes,
          servicesRes,
          testimonialsRes,
          experienceRes,
        ] = await Promise.all([
          api.getSkills(),
          api.getProjects(),
          api.getBlogs(),
          api.getServices(),
          api.getTestimonials(),
          api.getExperience(),
        ]);

        setCounts({
          skills: skillsRes.data.length,
          projects: projectsRes.data.length,
          blogs: blogsRes.data.length,
          services: servicesRes.data.length,
          testimonials: testimonialsRes.data.length,
          experience: experienceRes.data.length,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    // Trigger waving hand animation
    setWave(true);
    const timer = setTimeout(() => setWave(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const cards = [
    {
      title: "Skills",
      count: counts.skills,
      path: "/admin/skills",
      icon: <FaCode />,
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Projects",
      count: counts.projects,
      path: "/admin/projects",
      icon: <FaProjectDiagram />,
      color: "from-purple-500 to-purple-700",
    },
    {
      title: "Blogs",
      count: counts.blogs,
      path: "/admin/blogs",
      icon: <FaPen />,
      color: "from-pink-500 to-pink-700",
    },
    {
      title: "Services",
      count: counts.services,
      path: "/admin/services",
      icon: <FaServicestack />,
      color: "from-green-500 to-green-700",
    },
    {
      title: "Testimonials",
      count: counts.testimonials,
      path: "/admin/testimonials",
      icon: <FaRegComments />,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Experience",
      count: counts.experience,
      path: "/admin/experience",
      icon: <FaBriefcase />,
      color: "from-red-500 to-red-700",
    },
  ];

  return (
    <div className=" bg-gray-100 dark:bg-gray-900">
      {/* COMPACT HEADER (NO STICKY) */}
      <div className="mb-6">
        <div
          className="flex items-center justify-between
    rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-700 to-gray-900
    px-6 py-4 shadow-lg text-white"
        >
          <div className="flex items-center gap-2">
            <span className={`inline-block ${wave ? "animate-wave" : ""}`}>
              👋
            </span>
            <h1 className="text-sm md:text-base font-semibold">
              Welcome back, {adminName}
            </h1>
          </div>

          <span className="text-xs text-cyan-100 hidden sm:block">
            Dashboard Overview
          </span>
        </div>
      </div>

      {/* Cards */}
      <main className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              className="group relative cursor-pointer rounded-xl p-6 bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Icon */}
              <div
                className={`absolute -top-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r ${card.color} flex items-center justify-center text-white text-2xl shadow-lg`}
              >
                {card.icon}
              </div>

              <h2 className="mt-8 text-lg font-semibold text-gray-700 dark:text-gray-300">
                {card.title}
              </h2>
              <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
                {card.count}
              </p>
              <span className="mt-4 inline-block text-sm text-cyan-600 group-hover:underline">
                View details →
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
