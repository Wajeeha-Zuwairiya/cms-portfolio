import { useState, useEffect } from "react";
import * as FaIcons from "react-icons/fa";
import api from "../../api/api";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";

const iconOptions = [
  "FaServicestack",
  "FaLaptopCode",
  "FaPenFancy",
  "FaSearch",
  "FaMobileAlt",
  "FaPaintBrush",
];

const Services = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    icon: "FaServicestack", // default icon
  });
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch services
  const fetchServices = async () => {
    try {
      const res = await api.getServices();
      setServices(res.data);
    } catch (err) {
      toast.error("Failed to load services");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      if (editingId) {
        await api.updateService(editingId, form);
        toast.success("Service updated!");
      } else {
        await api.createService(form);
        toast.success("Service added!");
      }
      resetForm();
      fetchServices();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save service");
    }
  };

  const resetForm = () => {
    setForm({ title: "", description: "", icon: "FaServicestack" });
    setEditingId(null);
    setModalOpen(false);
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title,
      description: item.description,
      icon: item.icon,
    });
    setEditingId(item._id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      await api.deleteService(id);
      toast.success("Service deleted!");
      fetchServices();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete service");
    }
  };

  // Get icon component dynamically
  const getIconComponent = (iconName) => {
    return FaIcons[iconName] || FaIcons.FaServicestack;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Services
      </h1>

      <button
        onClick={() => setModalOpen(true)}
        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded mb-4 transition"
      >
        Add Service
      </button>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 transition"
              onClick={resetForm}
            >
              Close
            </button>

            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {editingId ? "Edit Service" : "Add Service"}
            </h3>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Service Title"
                className="p-2 border rounded"
                required
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="p-2 border rounded"
              />

              {/* Icon selector */}
              <div className="flex items-center gap-4">
                <select
                  name="icon"
                  value={form.icon}
                  onChange={handleChange}
                  className="p-2 border rounded flex-1"
                >
                  {iconOptions.map((iconName) => (
                    <option key={iconName} value={iconName}>
                      {iconName.replace("Fa", "")}
                    </option>
                  ))}
                </select>

                {/* Live icon preview */}
                <div className="text-3xl text-cyan-500">
                  {(() => {
                    const Icon = getIconComponent(form.icon);
                    return <Icon />;
                  })()}
                </div>
              </div>

              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded transition"
              >
                {editingId ? "Update Service" : "Add Service"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Services Table */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-md mt-4 overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-2 border text-center">Icon</th>
              <th className="p-2 border text-center">Title</th>
              <th className="p-2 border text-center">Description</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((item) => (
              <tr
                key={item._id}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="p-2 text-center">
                  {(() => {
                    const Icon = getIconComponent(item.icon);
                    return <Icon className="text-xl text-cyan-500 mx-auto" />;
                  })()}
                </td>
                <td className="p-2 text-center">{item.title}</td>
                <td className="p-2 text-center">{item.description || "-"}</td>
                <td className="p-2 text-center flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-white px-2 py-1 rounded bg-cyan-500 hover:bg-cyan-600 transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}

            {services.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No services found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Services;
