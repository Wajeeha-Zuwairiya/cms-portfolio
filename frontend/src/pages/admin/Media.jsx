import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

const Media = () => {
  const [media, setMedia] = useState([]);
  const [file, setFile] = useState(null);
  const [section, setSection] = useState("hero");

  const sections = ["hero", "services", "experience", "testimonials"];

  const fetchMedia = async () => {
    try {
      const res = await api.getMedia();
      setMedia(res.data);
    } catch {
      toast.error("Failed to load media");
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async () => {
    if (!file) return toast.error("Select an image");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("section", section);

    try {
      await api.uploadMedia(formData);
      toast.success("Image uploaded");
      setFile(null);
      fetchMedia();
    } catch {
      toast.error("Upload failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      await api.deleteMedia(id);
      toast.success("Deleted");
      fetchMedia();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Media</h2>

      {/* Upload Card (same style as Blogs) */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <div className="flex gap-4 items-center">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="border p-2 rounded"
          >
            {sections.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={handleUpload}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
          >
            Upload
          </button>
        </div>
      </div>

      {/* Media Table (same as Blogs) */}
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-center">Preview</th>
              <th className="p-2 text-center">Section</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {media.length ? (
              media.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-2 text-center">
                    <img
                      src={`http://localhost:5000${item.url}`}
                      alt={item.section}
                      className="h-16 w-28 object-cover mx-auto rounded"
                    />
                  </td>
                  <td className="p-2 text-center capitalize">
                    {item.section}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No media found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Media;
