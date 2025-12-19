import axios from "axios";

// This checks if a server URL exists; otherwise, it defaults to localhost
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Axios instance
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // ✅ REQUIRED for cookies
});

// Auto refresh access token on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // 1. Check if the error is 401 and not already retried
    if (err.response?.status === 401 && !originalRequest._retry) {
      
      // 2. CRITICAL: If the request that failed WAS the refresh call, stop looping!
      if (originalRequest.url.includes("/auth/refresh")) {
        window.location.href = "/admin/login"; 
        return Promise.reject(err);
      }

      originalRequest._retry = true;

      try {
        // Use the instance to refresh
        await api.post("/auth/refresh");
        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // 3. If refresh fails (e.g., refresh token expired), go to login
        console.error("Refresh failed, redirecting to login...");
        window.location.href = "/admin/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(err);
  }
);

export default {
  // ================= AUTH =================
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  updateAdmin: (data) => api.put("/auth/update", data),

  // ================= ABOUT =================
  getAbout: () => api.get("/about"),
  createAbout: (data) =>
    api.post("/about", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteAbout: (id) => api.delete(`/about/${id}`),

  // ================= SKILLS =================
  getSkills: () => api.get("/skills"),
  createSkill: (data) => api.post("/skills", data),
  updateSkill: (id, data) => api.put(`/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/skills/${id}`),

  // ================= PROJECTS =================
  getProjects: () => api.get("/projects"),
  createProject: (data) => api.post("/projects", data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),

  // ================= BLOGS =================
  getBlogs: () => api.get("/blogs"),
  createBlog: (data) => api.post("/blogs", data),
  updateBlog: (id, data) => api.put(`/blogs/${id}`, data),
  deleteBlog: (id) => api.delete(`/blogs/${id}`),

  // ================= SERVICES =================
  getServices: () => api.get("/services"),
  createService: (data) => api.post("/services", data),
  updateService: (id, data) => api.put(`/services/${id}`, data),
  deleteService: (id) => api.delete(`/services/${id}`),

  // ================= TESTIMONIALS =================
  getTestimonials: () => api.get("/testimonials"),
  createTestimonial: (data) => api.post("/testimonials", data),
  updateTestimonial: (id, data) => api.put(`/testimonials/${id}`, data),
  deleteTestimonial: (id) => api.delete(`/testimonials/${id}`),

  // ================= EXPERIENCE =================
  getExperience: () => api.get("/experience"),
  createExperience: (data) => api.post("/experience", data),
  updateExperience: (id, data) => api.put(`/experience/${id}`, data),
  deleteExperience: (id) => api.delete(`/experience/${id}`),

  // ================= CONTACT =================
  getContacts: () => api.get("/contact"),
  deleteContact: (id) => api.delete(`/contact/${id}`),
  sendContact: (data) => api.post("/contact", data),

  // ================= MEDIA =================
  getMedia: () => api.get("/media"),
  uploadMedia: (formData) =>
    api.post("/media", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteMedia: (id) => api.delete(`/media/${id}`),
};
