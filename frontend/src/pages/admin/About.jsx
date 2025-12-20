import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";

const initialForm = {
  name: "",
  title: "",
  bio: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  profileImage: null,
  resume: null,
};

const About = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedData, setSavedData] = useState(initialForm);

  // Fetch About (singleton)
  const fetchAbout = async () => {
    try {
      const res = await api.getAbout();
      if (res?.data) {
        const data = {
          name: res.data.name || "",
          title: res.data.title || "",
          bio: res.data.bio || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          location: res.data.location || "",
          linkedin: res.data.socialLinks?.linkedin || "",
          github: res.data.socialLinks?.github || "",
          profileImage: null,
          resume: null,
        };
        setForm(data);
        setSavedData(data);
      }
    } catch (err) {
      toast.error("Failed to load About data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
  try {
    // 1. Create a copy of the current form text data
    const finalData = { ...form };

    // 2. Check if a NEW Profile Image was selected
    if (form.profileImage instanceof File) {
      const imgData = new FormData();
      imgData.append("file", form.profileImage);
      // We call the general upload endpoint we made in index.js
      const imgRes = await api.uploadImage(imgData); 
      finalData.profileImage = imgRes.data.url; // Save the Cloudinary HTTPS link
    }

    // 3. Check if a NEW Resume PDF was selected
    if (form.resume instanceof File) {
      const resData = new FormData();
      resData.append("file", form.resume);
      const resRes = await api.uploadImage(resData);
      finalData.resume = resRes.data.url; // Save the Cloudinary HTTPS link
    }

    // 4. Send the final data (which now contains URLs, not Files) to MongoDB
    await api.createAbout(finalData);
    
    toast.success("About & Resume updated successfully!");
    fetchAbout(); // Refresh data
  } catch (err) {
    console.error(err);
    toast.error("Error saving profile data");
  } finally {
    setSaving(false);
  }
};

  const handleClear = () => {
    setForm(savedData);
    toast.info("Form reset to saved data");
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">About Me</h2>

      <div className="bg-white p-6 rounded shadow">
        <form onSubmit={handleSubmit} className="grid gap-4">

          <div>
            <label className="block mb-1 font-medium" htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Bio"
              rows={5}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location"
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" htmlFor="linkedin">LinkedIn URL</label>
            <input
              id="linkedin"
              type="url"
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="LinkedIn URL"
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" htmlFor="github">GitHub URL</label>
            <input
              id="github"
              type="url"
              name="github"
              value={form.github}
              onChange={handleChange}
              placeholder="GitHub URL"
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" htmlFor="profileImage">Profile Image</label>
            <input
              id="profileImage"
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" htmlFor="resume">Resume (PDF)</label>
            <input
              id="resume"
              type="file"
              name="resume"
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex gap-4 mt-2">
            <button
              type="submit"
              disabled={saving}
              className={`py-2 px-4 rounded text-white ${
                saving ? "bg-gray-400" : "bg-cyan-500 hover:bg-cyan-600"
              }`}
            >
              {saving ? "Saving..." : "Save About"}
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="py-2 px-4 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Clear
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default About;
