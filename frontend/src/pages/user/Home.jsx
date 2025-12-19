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
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8 }
};

export default function Home() {
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

  /**
   * 🛠️ UNIVERSAL IMAGE RESOLVER
   * Prevents CORB/404 by ensuring correct pathing for all DB formats.
   */
  const getImg = useCallback((path) => {
    if (!path) return null;
    if (path.startsWith("data:")) return path; // Handle Base64
    if (path.startsWith("http")) return path; // Handle external links

    // 1. Clean the path (remove leading slash)
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;

    // 2. Avoid double /uploads/ if already present in DB string
    if (cleanPath.includes("uploads/")) {
      return `${BASE_URL}/${cleanPath}`;
    }

    // 3. Default: Add the /uploads/ directory
    return `${BASE_URL}/uploads/${cleanPath}`;
  }, [BASE_URL]);

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      try {
        setLoading(true);
        const [aboutRes, servicesRes, skillsRes, expRes, projectRes, blogsRes, testiRes, mediaRes] = 
          await Promise.all([
            api.getAbout(), api.getServices(), api.getSkills(),
            api.getExperience(), api.getProjects(), api.getBlogs(),
            api.getTestimonials(), api.getMedia()
          ]);

        if (cancelled) return;

        setAbout(aboutRes.data || null);
        setServices(servicesRes.data || []);
        setSkills(skillsRes.data || []);
        setExperience(expRes.data || []);
        setProjects(projectRes.data || []);
        setBlogs(blogsRes.data || []);
        setTestimonials(testiRes.data || []);
        
        // Map media by section name (e.g., media.hero)
        const mediaBySection = (mediaRes.data || []).reduce((acc, item) => {
          if (item.section) acc[item.section] = item;
          return acc;
        }, {});
        setMedia(mediaBySection);

      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactResult(null);
    const form = e.target;
    const body = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
    };
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

  return (
    <div className="w-full font-sans antialiased bg-gray-900 text-white overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section id="home" className="relative h-screen flex items-center justify-center px-6 overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: media.hero?.url ? `url(${getImg(media.hero.url)})` : "none",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        <div className="relative z-10 text-center">
          <motion.h1 {...fadeUp} className="text-5xl md:text-7xl font-bold mb-4">{about?.name || "Your Name"}</motion.h1>
          <motion.p {...fadeUp} transition={{delay: 0.2}} className="text-xl md:text-2xl font-light text-cyan-400 mb-8">{about?.title}</motion.p>
          <div className="flex justify-center gap-4">
            <button onClick={() => document.getElementById('projects').scrollIntoView({behavior:'smooth'})} className="px-8 py-3 bg-cyan-500 text-gray-900 font-bold rounded-full hover:scale-105 transition shadow-lg shadow-cyan-500/20">View Projects</button>
            <button onClick={() => document.getElementById('contact').scrollIntoView({behavior:'smooth'})} className="px-8 py-3 border border-white/20 rounded-full hover:bg-white/10 transition">Contact Me</button>
          </div>
        </div>
      </section>

      {/* 2. ABOUT ME */}
      <section id="about" className="py-24 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-12 items-center">
          <motion.div className="w-full md:w-1/3" {...fadeUp}>
             <img 
               src={getImg(about?.profileImage)} 
               alt="Profile" 
               className="w-full h-96 object-cover rounded-2xl border-2 border-cyan-500/20 shadow-2xl" 
               onError={(e) => { e.target.src = "https://via.placeholder.com/400x600?text=Profile"; }}
             />
          </motion.div>
          <div className="w-full md:w-2/3">
            <motion.h2 {...fadeUp} className="text-4xl font-bold mb-6">About Me</motion.h2>
            <div className="w-20 h-1 bg-cyan-500 mb-8"></div>
            <motion.p {...fadeUp} transition={{delay: 0.3}} className="text-gray-400 text-lg leading-relaxed mb-6">{about?.bio}</motion.p>
            <div className="flex flex-wrap gap-4">
               {about?.resume && (
                 <a href={getImg(about.resume)} target="_blank" rel="noreferrer" className="px-6 py-2 bg-cyan-500 text-gray-900 font-bold rounded-lg hover:bg-cyan-400 transition">View Resume</a>
               )}
               {about?.email && <p className="text-gray-400 flex items-center gap-2"><FaIcons.FaEnvelope className="text-cyan-500"/> {about.email}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES */}
      <section 
        id="services" 
        className="relative py-24 bg-fixed bg-cover" 
        style={{ backgroundImage: media.services?.url ? `url(${getImg(media.services.url)})` : 'none' }}
      >
        <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Services</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((s, i) => {
              const Icon = FaIcons[s.icon] || FaIcons.FaCode;
              return (
                <motion.div key={i} {...fadeUp} className="p-8 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:border-cyan-500/50 transition-all group">
                  <Icon className="text-4xl text-cyan-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{s.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. PROJECTS */}
      <section id="projects" className="py-24 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Selected Projects</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((p, i) => (
              <motion.div key={i} {...fadeUp} className="bg-gray-900 rounded-xl overflow-hidden border border-white/5 group hover:shadow-2xl hover:shadow-cyan-500/10 transition-all">
                <div className="h-52 overflow-hidden">
                  <img src={getImg(p.image)} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt={p.title} />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-white">{p.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{p.description}</p>
                  <a href={p.link} target="_blank" rel="noreferrer" className="text-cyan-500 text-sm font-semibold hover:underline">Explore Project →</a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS & BLOGS */}
      <section 
        className="relative py-24 bg-fixed bg-cover" 
        style={{ backgroundImage: media.testimonials?.url ? `url(${getImg(media.testimonials.url)})` : 'none' }}
      >
        <div className="absolute inset-0 bg-black/85"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">
          {/* Testimonials */}
          <div>
            <h2 className="text-3xl font-bold mb-10 text-cyan-500 border-l-4 border-cyan-500 pl-4">Testimonials</h2>
            <Swiper modules={[Autoplay, Pagination]} autoplay={{delay:4000}} pagination={{clickable:true}} className="pb-12">
              {testimonials.map((t, i) => (
                <SwiperSlide key={i}>
                  <div className="bg-white/5 p-8 rounded-2xl border border-white/5 min-h-[200px] flex flex-col justify-between">
                    <p className="italic text-gray-200 text-lg leading-relaxed">"{t.text || t.message || t.quote}"</p>
                    <div className="mt-6">
                      <p className="font-bold text-white">— {t.author || t.name}</p>
                      <p className="text-cyan-500 text-xs uppercase tracking-widest">{t.role}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          {/* Blogs */}
          <div>
            <h2 className="text-3xl font-bold mb-10 text-cyan-500 border-l-4 border-cyan-500 pl-4">Latest Blogs</h2>
            <Swiper modules={[Autoplay, Pagination]} autoplay={{delay:5000}} pagination={{clickable:true}} className="pb-12">
              {blogs.map((b, i) => (
                <SwiperSlide key={i}>
                  <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-6 border border-white/5 hover:bg-white/10 transition-colors">
                    <img src={getImg(b.image)} className="w-24 h-24 rounded-lg object-cover flex-shrink-0" alt="blog" />
                    <div>
                      <h4 className="font-bold text-white mb-2 line-clamp-2">{b.title}</h4>
                      <a href={b.link} className="text-cyan-500 text-xs font-bold hover:tracking-widest transition-all">READ ARTICLE →</a>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* 6. CONTACT */}
      <section id="contact" className="py-24 bg-[#0a0a0a]">
        <div className="max-w-xl mx-auto px-6">
          <motion.h2 {...fadeUp} className="text-4xl font-bold text-center mb-12">Get In Touch</motion.h2>
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <input name="name" placeholder="Name" className="bg-gray-900 border border-white/10 p-4 rounded-xl focus:border-cyan-500 outline-none transition" required />
                <input name="email" type="email" placeholder="Email" className="bg-gray-900 border border-white/10 p-4 rounded-xl focus:border-cyan-500 outline-none transition" required />
            </div>
            <textarea name="message" rows="5" placeholder="Your Message" className="w-full bg-gray-900 border border-white/10 p-4 rounded-xl focus:border-cyan-500 outline-none transition" required></textarea>
            <button type="submit" disabled={sendingContact} className="w-full py-4 bg-cyan-500 text-gray-900 font-black rounded-xl hover:bg-cyan-400 transition transform active:scale-95 disabled:opacity-50">
              {sendingContact ? "SENDING..." : "SEND MESSAGE"}
            </button>
            {contactResult && (
                <p className={`text-center text-sm p-4 rounded-lg ${contactResult.ok ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{contactResult.msg}</p>
            )}
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center border-t border-white/5 bg-[#0a0a0a] text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} {about?.name}. All rights reserved.</p>
      </footer>
    </div>
  );
}
