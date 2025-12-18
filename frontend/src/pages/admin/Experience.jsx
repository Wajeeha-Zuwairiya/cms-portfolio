import { useState, useEffect } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import FileUploader from "../../components/FileUploader";

const Experience = () => {
  const [experience, setExperience] = useState([]);
  const [form, setForm] = useState({
    title: "",
    company: "",
    year: "",
    description: "",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch experience
  const fetchExperience = async () => {
    try {
      const res = await api.getExperience();
      setExperience(res.data || []);
    } catch (err) {
      toast.error("Failed to load experiences");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.company.trim()) {
      toast.error("Title & Company are required");
      return;
    }

    try {
      if (editingId) {
        await api.updateExperience(editingId, form); // ✅ FIXED
        toast.success("Experience updated!");
      } else {
        await api.createExperience(form); // ✅ FIXED
        toast.success("Experience added!");
      }

      resetForm();
      fetchExperience();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save experience");
    }
  };

  // Reset
  const resetForm = () => {
    setForm({
      title: "",
      company: "",
      year: "",
      description: "",
      image: "",
    });
    setEditingId(null);
    setModalOpen(false);
  };

  // Edit
  const handleEdit = (item) => {
    setForm({
      title: item.title,
      company: item.company,
      year: item.year,
      description: item.description,
      image: item.image || "",
    });
    setEditingId(item._id);
    setModalOpen(true);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this experience?")) return;

    try {
      await api.deleteExperience(id);
      toast.success("Experience deleted");
      fetchExperience();
    } catch (err) {
      toast.error("Failed to delete");
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Experience</h2>

      <button
        onClick={() => setModalOpen(true)}
        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded mb-4"
      >
        Add Experience
      </button>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
              onClick={resetForm}
            >
              ✕
            </button>

            <h3 className="text-xl font-bold mb-4">
              {editingId ? "Edit Experience" : "Add Experience"}
            </h3>

            <form onSubmit={handleSubmit} className="grid gap-4">

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Job Title"
                className="p-2 border rounded"
                required
              />

              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company"
                className="p-2 border rounded"
                required
              />

              <input
                type="text"
                name="year"
                value={form.year}
                onChange={handleChange}
                placeholder="Year (e.g., 2021–2023)"
                className="p-2 border rounded"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="p-2 border rounded"
              />

              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded"
              >
                {editingId ? "Update Experience" : "Add Experience"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Experience Table */}
      <div className="bg-white p-4 rounded shadow-md mt-4">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Company</th>
              <th className="p-2 border">Year</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {experience.map((item) => (
              <tr key={item._id} className="border-b">
                

                <td className="p-2 text-center">{item.title}</td>
                <td className="p-2 text-center">{item.company}</td>
                <td className="p-2 text-center">{item.year}</td>
                <td className="p-2 text-center">
                  {item.description?.slice(0, 70)}...
                </td>

                <td className="p-2 text-center flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-2 py-1 rounded"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}

            {experience.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No experience found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Experience;
