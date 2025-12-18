import { useState } from "react";
import axios from "axios";

const AdminProfile = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/admin/update", form, {
        withCredentials: true,
      });
      alert("Profile updated successfully");
    } catch (err) {
      alert(err.response?.data?.msg || "Update failed");
    }
  };

  return (
    <div className="max-w-xl bg-white dark:bg-gray-800 p-8 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-6">Update Admin Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          placeholder="New Username"
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />
        <input
          name="email"
          placeholder="New Email"
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />
        <input
          name="currentPassword"
          type="password"
          placeholder="Current Password"
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />
        <input
          name="newPassword"
          type="password"
          placeholder="New Password"
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default AdminProfile;
