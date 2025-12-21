import { useEffect, useState, useRef } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";

const emptyForm = {
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
  const [form, setForm] = useState(emptyForm);
  const [savedData, setSavedData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const profileRef = useRef(null);
  const resumeRef = useRef(null);

  // ---------------- FETCH ABOUT ----------------
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
          profileImage: res.data.profileImage || "",
          resume: res.data.resume || "",
        };

        setForm({ ...data, profileImage: null, resume: null });
        setSavedData(data);
      }
    } catch {
      toast.error("Failed to load About data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  // ---------------- HANDLERS ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setForm((p) => ({ ...p, [name]: files[0] }));
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = { ...savedData, ...form };

      // Upload Profile Image
      if (form.profileImage instanceof File) {
        const data = new FormData();
        data.append("file", form.profileImage);
        const res = await api.uploadImage(data);
        payload.profileImage = res.data.url;
      }

      // Upload Resume
      if (form.resume instanceof File) {
        const data = new FormData();
        data.append("file", form.resume);
        const res = await api.uploadImage(data);
        payload.resume = res.data.url;
      }

      const saved = await api.createAbout(payload);

      const synced = {
        name: saved.data.name,
        title: saved.data.title,
        bio: saved.data.bio,
        email: saved.data.email,
        phone: saved.data.phone,
        location: saved.data.location,
        linkedin: saved.data.socialLinks?.linkedin || "",
        github: saved.data.socialLinks?.github || "",
        profileImage: saved.data.profileImage || "",
        resume: saved.data.resume || "",
      };

      setSavedData(synced);
      setForm({ ...synced, profileImage: null, resume: null });

      profileRef.current.value = "";
      resumeRef.current.value = "";

      toast.success("About section updated successfully!");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  // ---------------- CLEAR ----------------
  const handleClear = () => {
    setForm({ ...savedData, profileImage: null, resume: null });
    profileRef.current.value = "";
    resumeRef.current.value = "";
    toast.info("Form reset to saved data");
  };

  if (loading) return <p className="p-6">Loading...</p>;

  // ---------------- UI ----------------
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">About Me</h2>

      <div className="bg-white p-6 rounded shadow">
        <form onSubmit={handleSubmit} className="grid gap-4">

          {["name","title","email","phone","location","linkedin","github"].map((field) => (
            <input
              key={field}
              name={field}
              value={form[field]}
              onChange={handleChange}
              placeholder={field.toUpperCase()}
              className="border p-2 rounded"
            />
          ))}

          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            placeholder="Bio"
            className="border p-2 rounded"
          />

          {/* PROFILE IMAGE */}
          <div>
            <label className="font-medium">Profile Image</label>
            <input
              ref={profileRef}
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleFileChange}
            />
            {savedData.profileImage && (
              <img
                src={savedData.profileImage}
                alt="Profile"
                className="h-32 w-32 rounded object-cover mt-2"
              />
            )}
          </div>

          {/* RESUME */}
          <div>
            <label className="font-medium">Resume (PDF)</label>
            <input
              ref={resumeRef}
              type="file"
              name="resume"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            {savedData.resume && (
              <a
                href={savedData.resume}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline block mt-1"
              >
                View Resume
              </a>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600"
            >
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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
