// src/pages/user/Home.jsx
import React, { useEffect, useState, useCallback } from "react";
import * as FaIcons from "react-icons/fa";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/a11y";

import api from "../../api/api"; // adjust path if your api.js is in a different folder
// Global animation used in motion elements
const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

export default function Home() {
  // States
  const [about, setAbout] = useState(null);
  const [services, setServices] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  const [loading, setLoading] = useState(true);
  const [sendingContact, setSendingContact] = useState(false);
  const [contactResult, setContactResult] = useState(null);
  const [media, setMedia] = useState({}); // empty object

  /* ---------------------------
     Load EVERYTHING normally
     --------------------------- */
  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        setLoading(true);

        const [
          aboutRes,
          servicesRes,
          skillsRes,
          expRes,
          projectRes,
          blogsRes,
          testiRes,
          mediaRes,
        ] = await Promise.all([
          api.getAbout(),
          api.getServices(),
          api.getSkills(),
          api.getExperience(),
          api.getProjects(),
          api.getBlogs(),
          api.getTestimonials(),
          api.getMedia(), // <- media array
        ]);

        if (cancelled) return;

        setAbout(aboutRes.data || null);
        setServices(servicesRes.data || []);
        setSkills(skillsRes.data || []);
        setExperience(expRes.data || []);
        setProjects(projectRes.data || []);
        setBlogs(blogsRes.data || []);
        setTestimonials(testiRes.data || []);
        // map media by section
        const mediaBySection = (mediaRes.data || []).reduce((acc, item) => {
          if (item.section) acc[item.section] = item;
          return acc;
        }, {});
        setMedia(mediaBySection);
        console.log("Hero media object:", mediaBySection.hero); // should log the hero objec
      } catch (err) {
        console.log("Failed to fetch homepage data", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => (cancelled = true);
  }, []);

  /* ---------------------------
     Contact Form Submit
     --------------------------- */
  const handleContactSubmit = useCallback(async (e) => {
    e.preventDefault();
    setContactResult(null);

    const form = e.target;
    const body = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
    };

    if (!body.name || !body.email || !body.message) {
      setContactResult({ ok: false, msg: "Please fill all required fields." });
      return;
    }

    try {
      setSendingContact(true);
      const res = await api.sendContact(body);

      setContactResult({
        ok: true,
        msg: `Message sent successfully! Preview: ${res.data.previewURL}`, // remove preview in prod
      });
      form.reset();
    } catch (err) {
      console.error(err);
      setContactResult({
        ok: false,
        msg: "Failed to send message. Try again.",
      });
    } finally {
      setSendingContact(false);
    }
  }, []);

  /* ---------------------------
     Render Image Helper
     --------------------------- */
  const renderImage = (src, alt = "") => {
    if (!src)
      return (
        <div className="w-full h-48 bg-gray-700 flex items-center justify-center text-gray-400">
          No image
        </div>
      );

    return <img src={src} alt={alt} className="w-full h-48 object-cover" />;
  };

  /* ---------------------------
     Loading Screen
     --------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-white text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  /* ---------------------------
     Extract about fields
     --------------------------- */
  const name = about?.name || "Your Name";
  const title = about?.title || "Developer";
  const bio = about?.bio || "";
 const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  /**
   * UNIVERSAL IMAGE RESOLVER
   * Handles: Base64, Full URLs, /uploads/path, and raw filenames
   */
  const getResolvedImageUrl = useCallback((imgData) => {
    if (!imgData) return null;
    if (imgData.startsWith("data:")) return imgData;
    if (imgData.startsWith("http")) return imgData;

    // Remove leading slash from imgData to avoid double slashes with BASE_URL/uploads/
    const cleanData = imgData.startsWith("/") ? imgData.substring(1) : imgData;

    // If the string already contains 'uploads', don't add it again
    if (cleanData.includes("uploads/")) {
      return `${BASE_URL}/${cleanData}`;
    }

    // Default to the uploads folder
    return `${BASE_URL}/uploads/${cleanData}`;
  }, [BASE_URL]);

  const profileImageURL = about?.profileImage
    ? `${BASE_URL}/uploads/${about.profileImage}`
    : null;

  const resumeURL = about?.resume
    ? `${BASE_URL}/uploads/${about.resume}`
    : null;
  const heroImageUrl = media.hero
    ? `${BASE_URL}${media.hero.url}`
    : null;
  const servicesImageUrl = media.services
    ? `${BASE_URL}${media.services.url}`
    : null;
  const experienceImageUrl = media.experience
    ? `${BASE_URL}${media.experience.url}`
    : null;
  const testimonialsImageUrl = media.testimonials
    ? `${BASE_URL}${media.testimonials.url}`
    : null;

  console.log("Hero image URL:", heroImageUrl);

  return (
    <div className="w-full font-sans antialiased bg-gray-900 text-white overflow-x-hidden">
      {/* HERO SECTION */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center text-center px-6 overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: heroImageUrl ? `url(${heroImageUrl})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh", // example height
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-0"></div>
        <div className="relative z-10">
          <motion.h1
            className="font-playfair text-5xl sm:text-6xl font-bold mb-4"
            {...fadeUp}
            transition={{ duration: 1 }}
          >
            {name}
          </motion.h1>
          <motion.p
            className="text-lg sm:text-2xl font-light opacity-95 max-w-2xl mx-auto"
            {...fadeUp}
            transition={{ delay: 0.5, duration: 1 }}
          >
            {title}
          </motion.p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() =>
                window.scrollTo({
                  top: document.getElementById("projects")?.offsetTop || 0,
                  behavior: "smooth",
                })
              }
              className="px-8 py-3 bg-[#00b7c7] text-gray-900 font-semibold rounded-full shadow-xl hover:translate-y-[-2px] transition-transform"
            >
              View Projects
            </button>
            <button
              onClick={() =>
                window.scrollTo({
                  top: document.getElementById("contact")?.offsetTop || 0,
                  behavior: "smooth",
                })
              }
              className="px-6 py-3 border border-white/30 rounded-full text-white hover:bg-white/10 transition"
            >
              Contact Me
            </button>
          </div>
        </div>

        <div
          onClick={() =>
            document
              .getElementById("about")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer group"
        >
          <span className="w-[1px] h-12 bg-white/40 block group-hover:bg-[#00b7c7] transition-colors duration-300"></span>
          <span className="w-3 h-3 rounded-full border-[2px] border-white/50 mt-2 flex items-center justify-center relative overflow-hidden">
            <span className="w-2 h-2 bg-white rounded-full absolute animate-bounce opacity-80"></span>
          </span>
          <span className="text-white/70 mt-3 text-sm tracking-wider group-hover:text-[#00b7c7] transition-colors">
            scroll down
          </span>
        </div>
      </section>

      {/* ABOUT ME */}
      <section id="about" className="py-20 bg-[#0a0a0a] text-gray-100">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row gap-8 items-center">
          {/* Profile Image */}
          <motion.div className="w-full md:w-1/3" {...fadeUp}>
            <div className="rounded-xl overflow-hidden bg-gray-800 p-2">
              {profileImageURL ? (
                <img
                  src={profileImageURL}
                  alt={name}
                  className="w-full h-72 object-cover"
                />
              ) : (
                <div className="w-full h-72 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>
          </motion.div>

          {/* About Info */}
          <div className="w-full md:w-2/3">
            <motion.h2
              className="font-playfair text-4xl sm:text-5xl font-bold mb-6 text-left"
              {...fadeUp}
            >
              About Me
            </motion.h2>
            <div className="w-24 h-[2px] bg-[#00b7c7] mb-8"></div>

            <motion.p
              className="text-lg sm:text-xl leading-relaxed text-gray-200 mb-6"
              {...fadeUp}
              transition={{ delay: 0.3 }}
            >
              {bio}
            </motion.p>

            {/* Contact info */}
            {about?.email || about?.phone || about?.location ? (
              <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-300 mb-6">
                {about?.email && (
                  <div>
                    <strong>Email:</strong> {about.email}
                  </div>
                )}
                {about?.phone && (
                  <div>
                    <strong>Phone:</strong> {about.phone}
                  </div>
                )}
                {about?.location && (
                  <div>
                    <strong>Location:</strong> {about.location}
                  </div>
                )}
              </div>
            ) : null}

            {/* Resume and Social Links */}
            <div className="mt-6 flex flex-wrap gap-4">
              {resumeURL ? (
                <motion.a
                  href={resumeURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-[#00b7c7] text-gray-900 font-semibold rounded-full"
                  whileHover={{
                    y: -3,
                    scale: 1.05,
                    boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
                  }}
                  transition={{ type: "spring", stiffness: 120 }}
                >
                  View Resume
                </motion.a>
              ) : (
                <span className="px-8 py-3 bg-gray-700 text-gray-300 font-semibold rounded-full cursor-not-allowed">
                  Resume Not Available
                </span>
              )}

              {about?.socialLinks?.linkedin && (
                <motion.a
                  href={about.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-white/30 rounded-full text-white"
                  whileHover={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    y: -2,
                    scale: 1.03,
                  }}
                  transition={{ type: "spring", stiffness: 120 }}
                >
                  LinkedIn
                </motion.a>
              )}

              {about?.socialLinks?.github && (
                <motion.a
                  href={about.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-white/30 rounded-full text-white"
                  whileHover={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    y: -2,
                    scale: 1.03,
                  }}
                  transition={{ type: "spring", stiffness: 120 }}
                >
                  GitHub
                </motion.a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* WHAT I DO / SERVICES */}
      <section
        id="services"
        className="relative py-20 overflow-hidden"
        style={{
          backgroundImage: servicesImageUrl
            ? `url(${servicesImageUrl})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Background overlay – brighter */}
        <div className="absolute inset-0 bg-[#020c1b]/40"></div>

        {/* Soft radial glow (Brittany style) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(100,255,218,0.08),transparent_45%)]"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <motion.h2
            className="font-playfair text-4xl sm:text-5xl font-bold text-[#e6f1ff] text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            What I Do
          </motion.h2>

          <motion.div
            className="w-24 h-[2px] bg-[#64ffda] mt-6 mb-16 mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          />

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 gap-12">
            {services.length ? (
              services.map((s, i) => {
                const Icon = FaIcons[s.icon] || FaIcons.FaServicestack;

                return (
                  <motion.div
                    key={s._id || i}
                    custom={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: i * 0.15,
                      duration: 0.7,
                      ease: "easeOut",
                    }}
                    whileHover={{
                      y: -8,
                      scale: 1.03,
                      boxShadow: "0 25px 50px rgba(100,255,218,0.25)",
                    }}
                    className="group relative flex gap-6 items-start
                         bg-[#111827]/85 backdrop-blur-xl
                         p-8 rounded-2xl shadow-2xl
                         border border-white/5
                         transition-all"
                  >
                    {/* Hover Glow Border */}
                    <div className="absolute inset-0 rounded-2xl border border-[#64ffda]/0 group-hover:border-[#64ffda]/40 transition-all duration-300 pointer-events-none" />

                    {/* Icon */}
                    <Icon className="w-12 h-12 text-[#64ffda] flex-shrink-0 mt-1" />

                    {/* Content */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-[#e6f1ff]">
                        {s.title}
                      </h3>
                      <p className="text-[#ccd6f6] leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-2 text-center text-[#8892b0]">
                No services available
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="py-20 bg-[#0a0a0a] text-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            className="font-playfair text-4xl sm:text-5xl font-bold mb-6 text-left"
            {...fadeUp}
          >
            Skills
          </motion.h2>
          <div className="w-24 h-[2px] bg-[#00b7c7] mb-12"></div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {skills.length ? (
              skills.map((skill, i) => {
                const Icon = FaIcons[skill.icon] || FaIcons.FaTools;
                return (
                  <motion.div
                    key={skill._id || i}
                    className="bg-gray-900/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-white/10 flex flex-col items-center text-center cursor-pointer transition-colors duration-300"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.2, duration: 0.8 }}
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                      backgroundColor: "#111827", // slightly lighter/darker background on hover
                      boxShadow: "0 20px 30px rgba(0,0,0,0.5)",
                    }}
                  >
                    <Icon className="w-12 h-12 text-[#00b7c7] mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {skill.name}
                    </h3>
                    <p className="text-gray-400">{skill.level}</p>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-gray-400 col-span-full text-center">
                No skills added yet
              </div>
            )}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section
        id="experience"
        className="relative py-20 overflow-hidden"
        style={{
          backgroundImage: experienceImageUrl
            ? `url(${experienceImageUrl})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Navy overlay (brighter than black) */}
        <div className="absolute inset-0 bg-[#020c1b]/45"></div>

        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(100,255,218,0.08),transparent_45%)]"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-[#ccd6f6]">
          {/* Section Title */}
          <motion.h2
            className=" font-playfair text-4xl sm:text-5xl font-bold mb-6 text-[#e6f1ff]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Experience
          </motion.h2>

          <motion.div
            className="w-24 h-[2px] bg-[#64ffda] mb-16"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          />

          {/* Timeline */}
          <div className="relative pl-12">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 w-[2px] h-full bg-[#64ffda]/60"></div>

            {experience.length ? (
              experience.map((exp, i) => (
                <motion.div
                  key={exp._id || i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: i * 0.15, duration: 0.7 }}
                  whileHover={{
                    y: -6,
                    scale: 1.02,
                    boxShadow: "0 25px 45px rgba(100,255,218,0.25)",
                  }}
                  className="group relative mb-14
                       bg-[#111827]/85 backdrop-blur-xl
                       p-8 rounded-2xl shadow-2xl
                       border border-white/5
                       transition-all"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[34px] top-8 w-5 h-5 rounded-full bg-[#64ffda] border-4 border-[#0a192f]"></div>

                  {/* Glow Border */}
                  <div className="absolute inset-0 rounded-2xl border border-[#64ffda]/0 group-hover:border-[#64ffda]/40 transition-all duration-300 pointer-events-none" />

                  <h3 className="text-2xl font-semibold text-[#e6f1ff]">
                    {exp.title}
                    <span className="text-[#8892b0] font-normal">
                      {" "}
                      @ {exp.company}
                    </span>
                  </h3>

                  <span className="block mt-1 text-sm text-[#64ffda]">
                    {exp.year}
                  </span>

                  <p className="mt-4 text-[#ccd6f6] leading-relaxed">
                    {exp.description}
                  </p>
                </motion.div>
              ))
            ) : (
              <div className="text-[#8892b0]">No experience entries</div>
            )}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="relative py-20 bg-[#0a0a0a] text-white">
        <div className="relative z-10 max-w-6xl mx-auto text-center px-6">
          <motion.h2 className="font-playfair text-4xl sm:text-5xl font-bold mb-10">
            Projects
          </motion.h2>
          <div className="w-24 h-[2px] bg-[#00b7c7] my-8 mx-auto"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {projects.length ? (
              projects.map((project, i) => (
                <motion.div
                  key={project._id || i}
                  className="bg-gray-900/90 backdrop-blur-sm p-10 rounded-xl shadow-2xl hover:scale-105 hover:shadow-[#00b7c7]/50 transition-transform border border-white/10 cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ delay: 0.3 + i * 0.2, duration: 0.8 }}
                >
                  <h3 className="text-xl font-semibold text-white">
                    {project.title}
                  </h3>
                  <p className="mt-4 text-gray-300">{project.description}</p>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00b7c7] mt-4 inline-block font-medium hover:underline"
                    >
                      View Project
                    </a>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="text-gray-300 col-span-3">No projects found</div>
            )}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS + BLOGS */}
      <section
        id="testimonials-blogs"
        className="relative py-24"
        style={{
          backgroundImage: testimonialsImageUrl
            ? `url(${testimonialsImageUrl})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70 pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-14">
          {/* ================= TESTIMONIALS ================= */}
          <div className="flex flex-col">
            <motion.h2
              className="font-playfair text-4xl font-semibold mb-4 text-center md:text-left text-white"
              {...fadeUp}
            >
              Testimonials
            </motion.h2>

            <div className="w-20 h-[2px] bg-[#00b7c7] mb-10 mx-auto md:mx-0" />

            {testimonials.length ? (
              <Swiper
                modules={[Pagination, A11y, Autoplay]}
                slidesPerView={1}
                loop
                autoplay={{ delay: 4500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                className="w-full"
              >
                {testimonials.map((t, i) => (
                  <SwiperSlide key={t._id || i}>
                    <motion.div
                      className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl
             h-[380px] p-8 flex flex-col"
                      {...fadeUp}
                      transition={{ duration: 0.8 }}
                    >
                      {/* Quote */}
                      <div className="flex-1 flex items-center">
                        <p
                          className="italic text-lg md:text-xl text-gray-100 leading-relaxed text-center
                  line-clamp-5 mx-auto"
                        >
                          “{t.text || t.quote || t.message}”
                        </p>
                      </div>

                      {/* Author */}
                      <div className="pt-6 text-center">
                        <p className="font-semibold text-[#00b7c7]">
                          {t.author || t.name || "Anonymous"}
                        </p>
                        {t.role && (
                          <p className="text-sm text-gray-300 mt-1">{t.role}</p>
                        )}
                      </div>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p className="text-gray-300">No testimonials yet</p>
            )}
          </div>

          {/* ================= BLOGS ================= */}
          <div className="flex flex-col">
            <motion.h2
              className="font-playfair text-4xl font-semibold mb-4 text-center md:text-left text-white"
              {...fadeUp}
            >
              Blogs
            </motion.h2>

            <div className="w-20 h-[2px] bg-[#00b7c7] mb-10 mx-auto md:mx-0" />

            {blogs.length ? (
              <Swiper
                modules={[Pagination, A11y, Autoplay]}
                slidesPerView={1}
                loop
                autoplay={{ delay: 4500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                className="w-full"
              >
                {blogs.map((b, i) => (
                  <SwiperSlide key={b._id || i}>
                    <motion.div
                      className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl
                           h-[380px] p-6 md:p-8 flex flex-col justify-between"
                      {...fadeUp}
                      transition={{ duration: 0.8 }}
                    >
                      {b.image && (
                        <img
                          src=""
                          alt={b.title}
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                      )}

                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {b.title}
                        </h3>

                        <p className="text-gray-200 text-sm line-clamp-3 mb-4">
                          {b.description}
                        </p>

                        <a
                          href={b.link || "#"}
                          className="text-[#00b7c7] font-medium hover:underline"
                        >
                          Read more →
                        </a>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p className="text-gray-300">No blog posts yet</p>
            )}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="relative py-16 bg-[#0a0a0a] text-white">
        <div className="relative z-10 max-w-xl mx-auto px-6">
          <motion.h2
            className="font-playfair text-4xl sm:text-5xl font-bold mb-10 text-center"
            {...fadeUp}
          >
            Contact Me
          </motion.h2>

          {/* Divider */}
          <div className="w-24 h-[2px] bg-[#00b7c7] mb-8 mx-auto "></div>

          <p className="text-gray-400 text-center mb-8">
            Reach out to collaborate or just say hi!
          </p>

          <motion.form
            className="flex flex-col gap-6"
            {...fadeUp}
            transition={{ duration: 0.8 }}
            onSubmit={handleContactSubmit}
          >
            {/* Name */}
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                placeholder=" "
                className="peer w-full bg-transparent border-b-2 border-dashed border-white/70 text-white font-bold p-2 focus:outline-none focus:border-[#00b7c7] 
             [&::-webkit-autofill]:bg-transparent [&::-webkit-autofill]:text-white [&::-webkit-autofill]:shadow-none"
                autoComplete="off"
              />
              <label
                htmlFor="name"
                className="absolute left-0 -top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base"
              >
                Name
              </label>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                placeholder=" "
                className="peer w-full bg-transparent border-b-2 border-dashed border-white/70 text-white font-bold p-2 focus:outline-none focus:border-[#00b7c7] 
             [&::-webkit-autofill]:bg-transparent [&::-webkit-autofill]:text-white [&::-webkit-autofill]:shadow-none"
                autoComplete="off"
              />

              <label
                htmlFor="email"
                className="absolute left-0 -top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base"
              >
                Email
              </label>
            </div>

            {/* Subject */}
            <div className="relative">
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder=" "
                className="peer w-full bg-transparent border-b-2 border-dashed border-white/70 text-white font-semibold p-2 focus:outline-none focus:border-[#00b7c7]"
              />
              <label
                htmlFor="subject"
                className="absolute left-0 -top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base"
              >
                Subject (Optional)
              </label>
            </div>

            {/* Message */}
            <div className="relative">
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder=" "
                className="peer w-full bg-transparent border-b-2 border-dashed border-white/70 text-white font-semibold p-2 focus:outline-none focus:border-[#00b7c7]"
                required
              ></textarea>
              <label
                htmlFor="message"
                className="absolute left-0 -top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base"
              >
                Message
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="px-6 py-3 bg-[#00b7c7] text-gray-900 font-semibold rounded-full hover:translate-y-[-2px] transition-transform disabled:opacity-50"
              disabled={sendingContact}
            >
              {sendingContact ? "Sending..." : "Send Message"}
            </button>
          </motion.form>

          {/* Toast Notification */}
          {contactResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`mt-6 px-4 py-3 rounded-lg text-sm font-medium max-w-sm mx-auto text-center ${
                contactResult.ok
                  ? "bg-green-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              {contactResult.msg}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
