import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";  // Admin route protection
import Layout from "./components/Layout";  // Admin Layout

// Admin Pages
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import About from "./pages/admin/About";
import Skills from "./pages/admin/Skills";
import Projects from "./pages/admin/Projects";
import Blogs from "./pages/admin/Blogs";
import Services from "./pages/admin/Services";
import Testimonials from "./pages/admin/Testimonials";
import Experience from "./pages/admin/Experience";
import Media from "./pages/admin/Media"; // import your Media page

// User Pages
import Home from "./pages/user/Home";
import PublicLayout from "./components/PublicLayout";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
           {/* PUBLIC — ONLY ONE PAGE NOW */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />

          {/* -------------------- */}
          {/* Admin Routes (Protected) */}
          {/* -------------------- */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Routes - Protected */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/about"
            element={
              <ProtectedRoute>
                <Layout>
                  <About />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/skills"
            element={
              <ProtectedRoute>
                <Layout>
                  <Skills />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute>
                <Layout>
                  <Projects />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blogs"
            element={
              <ProtectedRoute>
                <Layout>
                  <Blogs />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute>
                <Layout>
                  <Services />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/testimonials"
            element={
              <ProtectedRoute>
                <Layout>
                  <Testimonials />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/experience"
            element={
              <ProtectedRoute>
                <Layout>
                  <Experience />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/media"
            element={
              <ProtectedRoute>
                <Layout>
                  <Media />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* -------------------- */}
          {/* Catch-all route */}
          {/* -------------------- */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
