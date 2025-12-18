import api from "../api/api";
import { toast } from "react-toastify";

const FileUploader = ({ onUpload }) => {
  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const res = await api.uploadImage(file);

      // 🔥 send filename to backend
      if (onUpload) onUpload(res.data.filename);

      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    }
  };

  return (
    <input
      type="file"
      onChange={uploadFile}
      className="border p-2 rounded bg-white"
    />
  );
};

export default FileUploader;
