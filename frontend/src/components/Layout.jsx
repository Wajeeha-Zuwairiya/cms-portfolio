import { useState, useEffect } from "react";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import api from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* ============================
     LOAD ADMIN PROFILE
  ============================ */
  useEffect(() => {
    const loadAdmin = async () => {
      try {
        const res = await api.getMe();
        setAdmin(res.data);
        setUsername(res.data.username);
        setEmail(res.data.email);
      } catch {
        navigate("/admin/login");
      }
    };
    loadAdmin();
  }, [navigate]);

  /* ============================
     LOGOUT
  ============================ */
  const handleLogout = async () => {
  try {
    await api.logout(); // clears cookies
  } catch {}

  navigate("/admin/login", { replace: true }); // 🔥 IMPORTANT
  toast.success("Logged out successfully");
};

  /* ============================
     UPDATE PROFILE
  ============================ */
  const handleUpdate = async () => {
    if (!username.trim() || !email.trim()) {
      toast.error("Username and email are required");
      return;
    }

    if (newPassword && !currentPassword) {
      toast.error("Current password is required");
      return;
    }

    setLoading(true);
    try {
      await api.updateAdmin({
        username,
        email,
        ...(newPassword && { currentPassword, newPassword }),
      });

      setAdmin((prev) => ({ ...prev, username, email }));
      setCurrentPassword("");
      setNewPassword("");
      setShowModal(false);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!admin) return null;

  return (
    <div className="font-inter flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        {/* ================= TOP BAR ================= */}
        <header className="h-16 flex items-center justify-end px-6 bg-gradient-to-r from-gray-800 to-gray-900 shadow">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 text-white hover:text-gray-200 transition"
            >
              <FaUserCircle className="text-2xl" />
              <span className="text-sm font-medium">{admin.username}</span>
            </button>

            <span className="h-6 w-px bg-gray-600" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 transition"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </header>

        {/* ================= CONTENT ================= */}
        <main className="flex-1 p-8">{children}</main>

        {/* ================= MODAL ================= */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-[420px] rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
              
              <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                Update Profile
              </h2>

              <div className="space-y-4">
                {/* Username */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                {/* Current Password */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="rounded-lg bg-cyan-500 hover:bg-cyan-600 px-5 py-2 font-medium text-white shadow-md transition"
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Layout;
