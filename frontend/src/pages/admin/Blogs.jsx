import { useState, useEffect } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";

const initialForm = {
  title: "",
  description: "",
  link: "",
  image: null,
};

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch blogs from backend
  const fetchBlogs = async () => {
    try {
      const res = await api.getBlogs();
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch blogs");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // File input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setForm((prev) => ({ ...prev, image: file }));
  };

  // Submit form
 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    let imageUrl = form.image;

    // Upload to Cloudinary if it's a new file
    if (form.image instanceof File) {
      const data = new FormData();
      data.append("file", form.image);
      const res = await api.uploadImage(data);
      imageUrl = res.data.url;
    }

    const payload = { ...form, image: imageUrl };

    if (editingId) {
      await api.updateBlog(editingId, payload);
    } else {
      await api.createBlog(payload);
    }
    
    setModalOpen(false);
    fetchBlogs();
    toast.success("Blog saved!");
  } catch (err) {
    toast.error("Save failed");
  }
};  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setModalOpen(false);
  };

  const handleEdit = (blog) => {
    setForm({
      title: blog.title,
      description: blog.description,
      link: blog.link,
      image: null, // cannot prefill file input
    });
    setEditingId(blog._id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await api.deleteBlog(id);
      toast.success("Blog deleted!");
      fetchBlogs();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete blog");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Blogs</h2>

      <button
        onClick={() => setModalOpen(true)}
        className="bg-cyan-500 text-white px-6 py-3 rounded mb-4 hover:bg-cyan-600"
      >
        {editingId ? "Edit Blog" : "Add Blog"}
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
                placeholder="Blog Title"
                className="p-2 border rounded"
                required
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Blog Description"
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                name="link"
                value={form.link}
                onChange={handleChange}
                placeholder="Blog URL"
                className="p-2 border rounded"
              />

              {/* Image input with preview */}
              <div>
                <label className="block mb-1">Blog Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {form.image && (
                  <img
                    src={URL.createObjectURL(form.image)}
                    alt="Preview"
                    className="h-16 w-24 object-cover rounded mt-2"
                  />
                )}
              </div>

              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded"
              >
                {editingId ? "Update Blog" : "Add Blog"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Blogs Table */}
      <div className="bg-white p-4 rounded shadow mt-4">
        <table className="min-w-full bg-white shadow rounded overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-center">Image</th>
              <th className="border p-2 text-center">Title</th>
              <th className="border p-2 text-center">Description</th>
              <th className="border p-2 text-center">Link</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length ? (
              blogs.map((blog) => (
                <tr key={blog._id} className="border-b">
                  <td className="p-2 text-center">
                   <img
                       src={blog.image || "https://via.placeholder.com/120x80?text=No+Image"}
                       alt={blog.title}
                       className="h-16 w-24 object-cover mx-auto rounded"
                   />
                  </td>
                  <td className="p-2 text-center">{blog.title}</td>
                  <td className="p-2 text-center">
                    {blog.description.length > 60
                      ? blog.description.slice(0, 60) + "..."
                      : blog.description}
                  </td>
                  <td className="p-2 text-center">
                    {blog.link ? (
                      <a
                        href={blog.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-600 hover:underline"
                      >
                        View Post
                      </a>
                    ) : (
                      "No Link"
                    )}
                  </td>
                  <td className="p-2 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white py-1 px-2 rounded"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded"
                    >
                      <FaTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No blogs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Blogs;
