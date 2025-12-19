// src/pages/user/Home.jsx
import React, { useEffect, useState, useCallback } from "react";
import * as FaIcons from "react-icons/fa";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, A11y } from "swiper/modules";

// Swiper Styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/a11y";

import api from "../../api/api"; 

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function Home() {
  // --- States ---
  const [about, setAbout] = useState(null);
  const [services, setServices] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [media, setMedia] = useState({}); 

  const [loading, setLoading] = useState(true);
  const [sendingContact, setSendingContact] = useState(false);
  const [contactResult, setContactResult] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // --- Image Resolver Helper ---
  // This handles Base64 data, full URLs, and relative paths
  const getResolvedImageUrl = useCallback((imgData) => {
    if (!imgData) return null;
    if (imgData.startsWith("data:")) return imgData; // Base64
    if (imgData.startsWith("http")) return imgData; // Full URL
    if (imgData.startsWith("/")) return `${BASE_URL}${imgData}`; // Relative path
    return `${BASE_URL}/uploads/${imgData}`; // Default upload folder
  }, [BASE_URL]);

  // --- Fetch Data ---
  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      try {
        setLoading(true);
        const [
          aboutRes, servicesRes, skillsRes, expRes, 
          projectRes, blogsRes, testiRes, mediaRes
        ] = await Promise.all([
          api.getAbout(),
          api.getServices(),
          api.getSkills(),
          api.getExperience(),
          api.getProjects(),
          api.getBlogs(),
          api.getTestimonials(),
          api.getMedia(),
        ]);

        if (cancelled) return;

        setAbout(aboutRes.data || null);
        setServices(servicesRes.data || []);
        setSkills(skillsRes.data || []);
        setExperience(expRes.data || []);
        setProjects(projectRes.data || []);
        setBlogs(blogsRes.data || []);
        setTestimonials(testiRes.data || []);
        
        const mediaBySection = (mediaRes.data || []).reduce((acc, item) => {
          if (item.section) acc[item.section] = item;
          return acc;
        }, {});
        setMedia(mediaBySection);
      } catch (err) {
        console.error("Failed to fetch homepage data", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  // --- Contact Form Handler ---
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactResult(null);
    const form = e.target;
    const body = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
    };

    if (!body.name || !body.email || !body.message) {
      setContactResult({ ok: false, msg: "Please fill all fields." });
      return;
    }

    try {
      setSendingContact(true);
      await api.sendContact(body);
      setContactResult({ ok: true, msg: "Message sent successfully!" });
      form.reset();
    } catch (err) {
      setContactResult({ ok: false, msg: "Failed to send message." });
    } finally {
      setSendingContact(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // --- Resolve Section Images ---
  const profileImageURL = getResolvedImageUrl(about?.profileImage);
  const heroImageUrl = getResolvedImageUrl(media.hero?.url);
  const servicesImageUrl = getResolvedImageUrl(media.services?.url);
  const experienceImageUrl = getResolvedImageUrl(media.experience?.url);
  const testimonialsImageUrl = getResolvedImageUrl(media.testimonials?.url);

  return (
    <div className="w-full font-sans antialiased bg-gray-900 text-white overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section id="home" className="relative h-screen flex items-center justify-center text-center px-6">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: heroImageUrl ? `url(${heroImageUrl})` : "none" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90"></div>
        
        <div className="relative z-10">
          <motion.h1 className="text-5xl sm:text-7xl font-bold mb-4" {...fadeUp} transition={{ duration: 0.8 }}>
            {about?.name || "Your Name"}
          </motion.h1>
          <motion.p className="text-xl sm:text-2xl font-light opacity-90 mb-8" {...fadeUp} transition={{ delay: 0.2 }}>
            {about?.title || "Developer"}
          </motion.p>
          <div className="flex justify-center gap-4">
            <button onClick={() => document.getElementById('projects').scrollIntoView({behavior:'smooth'})} className="px-8 py-3 bg-cyan-500 text-gray-900 font-bold rounded-full hover:bg-cyan-400 transition">View Work</button>
            <button onClick={() => document.getElementById('contact').scrollIntoView({behavior:'smooth'})} className="px-8 py-3 border border-white/30 rounded-full hover:bg-white/10 transition">Contact</button>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-12 items-center">
          <motion.div className="w-full md:w-1/3" {...fadeUp}>
            <div className="rounded-2xl overflow-hidden border-4 border-cyan-500/20 shadow-2xl">
              {profileImageURL ? (
                <img src={profileImageURL} alt="Profile" className="w-full h-96 object-cover" />
              ) : (
                <div className="w-full h-96 bg-gray-800 flex items-center justify-center">No Image</div>
              )}
            </div>
          </motion.div>
          <div className="w-full md:w-2/3">
            <h2 className="text-4xl font-bold mb-4">About Me</h2>
            <div className="w-20 h-1 bg-cyan-500 mb-8"></div>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">{about?.bio}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-400">
              {about?.email && <p><strong>Email:</strong> {about.email}</p>}
              {about?.location && <p><strong>Location:</strong> {about.location}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="relative py-24 bg-fixed bg-cover" style={{ backgroundImage: `url(${servicesImageUrl})` }}>
        <div className="absolute inset-0 bg-gray-900/90"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((s, i) => {
              const Icon = FaIcons[s.icon] || FaIcons.FaCode;
              return (
                <motion.div key={i} className="p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-cyan-500/50 transition" {...fadeUp} transition={{ delay: i * 0.1 }}>
                  <Icon className="text-4xl text-cyan-400 mb-6" />
                  <h3 className="text-xl font-bold mb-4">{s.title}</h3>
                  <p className="text-gray-400">{s.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROJECTS GRID */}
      <section id="projects" className="py-24 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Selected Projects</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((p, i) => (
              <motion.div key={i} className="group relative bg-gray-900 rounded-xl overflow-hidden border border-white/5" {...fadeUp}>
                <div className="h-48 bg-gray-800 overflow-hidden">
                   {p.image ? (
                     <img src={getResolvedImageUrl(p.image)} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt={p.title} />
                   ) : <div className="w-full h-full flex items-center justify-center text-gray-500">Project Image</div>}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{p.description}</p>
                  {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="text-cyan-400 text-sm font-bold hover:underline">View Project →</a>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS & BLOGS */}
      <section className="relative py-24 bg-fixed bg-cover" style={{ backgroundImage: `url(${testimonialsImageUrl})` }}>
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">
          
          {/* Testimonials Swiper */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Testimonials</h2>
            <Swiper modules={[Autoplay, Pagination, A11y]} spaceBetween={30} autoplay={{ delay: 5000 }} pagination={{ clickable: true }}>
              {testimonials.map((t, i) => (
                <SwiperSlide key={i}>
                  <div className="bg-white/5 p-8 rounded-2xl italic text-gray-300">
                    "{t.text || t.message}"
                    <p className="mt-4 not-italic font-bold text-cyan-400">- {t.author || t.name}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Blogs Swiper */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Latest Blogs</h2>
            <Swiper modules={[Autoplay, Pagination]} spaceBetween={30} autoplay={{ delay: 6000 }} pagination={{ clickable: true }}>
              {blogs.map((b, i) => (
                <SwiperSlide key={i}>
                  <div className="bg-white/5 p-6 rounded-2xl flex gap-4 items-center">
                    {b.image && <img src={getResolvedImageUrl(b.image)} className="w-20 h-20 rounded-lg object-cover" alt="blog" />}
                    <div>
                      <h3 className="font-bold line-clamp-1">{b.title}</h3>
                      <a href={b.link} className="text-cyan-400 text-sm">Read Post →</a>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="contact" className="py-24 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-8">Get In Touch</h2>
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <input name="name" type="text" placeholder="Name" className="w-full bg-gray-900 border border-white/10 p-4 rounded-lg focus:border-cyan-500 outline-none" required />
              <input name="email" type="email" placeholder="Email" className="w-full bg-gray-900 border border-white/10 p-4 rounded-lg focus:border-cyan-500 outline-none" required />
            </div>
            <textarea name="message" rows="5" placeholder="Your Message" className="w-full bg-gray-900 border border-white/10 p-4 rounded-lg focus:border-cyan-500 outline-none" required></textarea>
            <button type="submit" disabled={sendingContact} className="w-full py-4 bg-cyan-500 text-gray-900 font-bold rounded-lg hover:bg-cyan-400 transition disabled:opacity-50">
              {sendingContact ? "Sending..." : "Send Message"}
            </button>
            {contactResult && <p className={`text-center ${contactResult.ok ? 'text-green-400' : 'text-red-400'}`}>{contactResult.msg}</p>}
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} {about?.name}. All rights reserved.</p>
      </footer>
    </div>
  );
}
