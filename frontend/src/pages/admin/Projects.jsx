import { useState, useEffect } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", link: "" });
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const res = await api.getProjects();
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateProject(editingId, form);
        toast.success("Project updated!");
      } else {
        await api.createProject(form);
        toast.success("Project added!");
      }
      resetForm();
      fetchProjects();
    } catch (err) {
      console.error(err);
      toast.error("Error saving project");
    }
  };

  const resetForm = () => {
    setForm({ title: "", description: "", link: "" });
    setEditingId(null);
    setModalOpen(false);
  };

  // Edit a project
  const handleEdit = (project) => {
    setForm({
      title: project.title || "",
      description: project.description || "",
      link: project.link || "",
    });
    setEditingId(project._id);
    setModalOpen(true);
  };

  // Delete a project
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await api.deleteProject(id);
        toast.success("Project deleted!");
        fetchProjects();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete project");
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Projects</h2>

      <button
        onClick={() => setModalOpen(true)}
        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded mb-4 "
      >
        Add Project
      </button>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={resetForm}
            >
              ✕
            </button>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Project Title"
                className="p-2 border rounded"
                required
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Project Description"
                className="p-2 border rounded"
                required
              />
              <input
                type="url"
                name="link"
                value={form.link}
                onChange={handleChange}
                placeholder="Project Link (URL)"
                className="p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              >
                {editingId ? "Update Project" : "Add Project"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-white p-4 rounded shadow mt-4">
        <table className="min-w-full bg-white shadow rounded overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-center">Title</th>
              <th className="border p-2 text-center">Description</th>
              <th className="border p-2 text-center">Link</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id} className="border-b">
                <td className=" p-2 text-center">{project.title || "-"}</td>
                <td className=" p-2 text-center">{project.description || "-"}</td>
                <td className=" p-2 text-center">
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-600 hover:underline"
                    >
                      {project.link}
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className=" p-2 flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white py-1 px-2 rounded"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded"
                  >
                    <FaTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No projects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Projects;
