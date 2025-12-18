import { useState, useEffect } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import FileUploader from "../../components/FileUploader";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({
    name: "",
    role: "",
    message: "",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch testimonials
  const fetchTestimonials = async () => {
    try {
      const res = await api.getTestimonials();
      setTestimonials(res.data || []);
    } catch (err) {
      toast.error("Failed to load testimonials");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.message.trim()) {
      toast.error("Name & Message are required");
      return;
    }

    try {
      if (editingId) {
        await api.updateTestimonial(editingId, form);
        toast.success("Testimonial updated!");
      } else {
        await api.createTestimonial(form);
        toast.success("Testimonial added!");
      }

      resetForm();
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save testimonial");
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      name: "",
      role: "",
      message: "",
      image: "",
    });
    setEditingId(null);
    setModalOpen(false);
  };

  // Edit testimonial
  const handleEdit = (item) => {
    setForm({
      name: item.name,
      role: item.role,
      message: item.message,
      image: item.image || "",
    });
    setEditingId(item._id);
    setModalOpen(true);
  };

  // Delete testimonial
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;

    try {
      await api.delete(id);
      toast.success("Deleted");
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete testimonial");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Testimonials</h2>

      <button
        onClick={() => setModalOpen(true)}
        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded mb-4"
      >
        Add Testimonial
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
              {editingId ? "Edit Testimonial" : "Add Testimonial"}
            </h3>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="p-2 border rounded"
                required
              />

              <input
                type="text"
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="Role"
                className="p-2 border rounded"
              />

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Message"
                className="p-2 border rounded"
                required
              />


              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded"
              >
                {editingId ? "Update Testimonial" : "Add Testimonial"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white p-4 rounded shadow-md mt-4">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Message</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {testimonials.map((item) => (
              <tr key={item._id} className="border-b">
                <td className="p-2 text-center">{item.name}</td>
                <td className="p-2 text-center">{item.role || "-"}</td>
                <td className="p-2 text-center">
                  {item.message?.slice(0, 60)}...
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

            {testimonials.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No testimonials found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Testimonials;
