import axios from "axios";

// This checks if a server URL exists; otherwise, it defaults to localhost
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL, // Use the variable here
  withCredentials: true,
});

// Auto refresh access token on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {

      if (
        originalRequest.url.endsWith("/auth/refresh") ||
        originalRequest.url.endsWith("/auth/login")
      ) {
        window.location.href = "/admin/login";
        return Promise.reject(err);
      }

      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch {
        window.location.href = "/admin/login";
        return Promise.reject(err);
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
  uploadImage: (data) =>
  api.post("/upload/image", data, {
    headers: { "Content-Type": "multipart/form-data" },
  }),

uploadMedia: (data) =>
  api.post("/media", data),
deleteMedia: (id) => api.delete(`/media/${id}`),
};
