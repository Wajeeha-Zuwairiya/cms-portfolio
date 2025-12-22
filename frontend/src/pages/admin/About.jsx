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
        // Form uses null for file inputs, savedData keeps the URLs
        setForm({ ...data, profileImage: null, resume: null });
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
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setForm((p) => ({ ...p, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 1. Create payload using text fields from form and existing URLs from savedData
      const payload = {
        name: form.name,
        title: form.title,
        bio: form.bio,
        email: form.email,
        phone: form.phone,
        location: form.location,
        linkedin: form.linkedin,
        github: form.github,
        profileImage: savedData.profileImage, 
        resume: savedData.resume,
      };

      // 2. Upload Profile Image if a new file was selected
      if (form.profileImage instanceof File) {
        const data = new FormData();
        data.append("file", form.profileImage);
        const res = await api.uploadImage(data);
        payload.profileImage = res.data.url;
      }

      // 3. Upload Resume if a new file was selected
      if (form.resume instanceof File) {
        const data = new FormData();
        data.append("file", form.resume);
        const res = await api.uploadImage(data);
        payload.resume = res.data.url;
      }

      // 4. Send the flattened payload to the backend
      await api.createAbout(payload);
      
      toast.success("About section updated successfully!");
      // Refresh to sync everything from DB
      fetchAbout();

      if(profileRef.current) profileRef.current.value = "";
      if(resumeRef.current) resumeRef.current.value = "";
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setForm({ ...savedData, profileImage: null, resume: null });
    if(profileRef.current) profileRef.current.value = "";
    if(resumeRef.current) resumeRef.current.value = "";
    toast.info("Form reset to saved data");
  };

  if (loading) return <p className="p-6 text-white">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-white">About Me</h2>

      <div className="bg-white p-6 rounded shadow">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["name", "title", "email", "phone", "location", "linkedin", "github"].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="capitalize text-sm font-semibold mb-1">{field}</label>
                <input
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={field.toUpperCase()}
                  className="border p-2 rounded focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us about yourself..."
              className="border p-2 rounded focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
            <div>
              <label className="font-bold block mb-2">Profile Image</label>
              <input
                ref={profileRef}
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-2"
              />
              {savedData.profileImage && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                  <img
                    src={savedData.profileImage}
                    alt="Profile"
                    className="h-32 w-32 rounded object-cover border"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="font-bold block mb-2">Resume (PDF)</label>
              <input
                ref={resumeRef}
                type="file"
                name="resume"
                accept="application/pdf"
                onChange={handleFileChange}
                className="mb-2"
              />
              {savedData.resume && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Current File:</p>
                  <a
                    href={savedData.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-600 font-medium hover:underline flex items-center gap-2"
                  >
                    View Current Resume
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="bg-cyan-500 text-white px-6 py-2 rounded font-bold hover:bg-cyan-600 disabled:bg-gray-400 transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded font-bold hover:bg-gray-300 transition"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default About;
