import { useState, useEffect } from "react";
import api from "../../api/api";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as FaIcons from "react-icons/fa";
import { FaTools, FaEdit, FaTrash } from "react-icons/fa";

// List of available icons for selection
const availableIcons = [
  { name: "FaReact", label: "React" },
  { name: "FaNodeJs", label: "Node.js" },
  { name: "FaPython", label: "Python" },
  { name: "FaHtml5", label: "HTML5" },
  { name: "FaCss3Alt", label: "CSS3" },
  { name: "FaJs", label: "JavaScript" },
  { name: "FaDatabase", label: "Database" },
];

const SkillIcon = ({ iconName }) => {
  const IconComponent = FaIcons[iconName];
  if (!IconComponent) return <FaTools size={24} />;
  return <IconComponent size={24} />;
};

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [editingSkill, setEditingSkill] = useState(null);

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
  } = useForm();
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
  } = useForm();

  const fetchSkills = async () => {
    try {
      const res = await api.getSkills();
      setSkills(res.data);
    } catch (err) {
      toast.error("Failed to load skills");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // --- Add Skill ---
  const onSubmitAdd = async (data) => {
    try {
      await api.createSkill(data);
      toast.success("Skill added");
      resetAdd();
      fetchSkills();
    } catch (err) {
      toast.error("Error adding skill");
      console.error(err);
    }
  };

  // --- Edit Skill ---
  const openEditModal = (skill) => {
    setEditingSkill(skill);
    resetEdit({
      name: skill.name,
      level: skill.level,
      icon: skill.icon || "",
    });
  };

  const handleUpdate = async (data) => {
    try {
      await api.updateSkill(editingSkill._id, data);
      toast.success("Skill updated");
      setEditingSkill(null);
      fetchSkills();
    } catch (err) {
      toast.error("Error updating skill");
      console.error(err);
    }
  };

  // --- Delete Skill ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;

    try {
      await api.deleteSkill(id);
      toast.success("Skill deleted");
      fetchSkills();
    } catch (err) {
      toast.error("Error deleting skill");
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-6">Skills</h2>

      {/* Add Skill Form */}
      <form
        onSubmit={handleSubmitAdd(onSubmitAdd)}
        className="bg-white p-4 shadow rounded mb-6 grid grid-cols-4 gap-4 items-end"
      >
        <input
          {...registerAdd("name", { required: true })}
          placeholder="Skill name"
          className="border p-2 rounded col-span-1"
        />
        <select
          {...registerAdd("level")}
          className="border p-2 rounded col-span-1"
        >
          <option value="">Select Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Expert">Expert</option>
        </select>
        <select
          {...registerAdd("icon")}
          className="border p-2 rounded col-span-1"
        >
          <option value="">Select Icon</option>
          {availableIcons.map((icon) => (
            <option key={icon.name} value={icon.name}>
              {icon.label}
            </option>
          ))}
        </select>
        <button className="bg-cyan-500 hover:bg-cyan-600 text-white rounded px-4 py-2 w-full transition">
          Add
        </button>
      </form>

      {/* Skills Table */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mt-4">
        <table className="min-w-full bg-white shadow rounded overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-center border">Icon</th>
              <th className="p-3 text-center border">Name</th>
              <th className="p-3 text-center border">Level</th>
              <th className="p-3 text-center border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <tr key={skill._id} className="border-b">
                <td className="p-3 flex items-center justify-center">
                  <SkillIcon iconName={skill.icon} />
                </td>
                <td className="p-3 text-center">{skill.name}</td>
                <td className="p-3 text-center">{skill.level}</td>
                <td className="flex gap-4 justify-center p-3">
                  <button
                    className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-1 px-2 rounded"
                    onClick={() => openEditModal(skill)}
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => handleDelete(skill._id)}
                  >
                    <FaTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Skill Modal */}
      {editingSkill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Skill</h3>
            <form
              onSubmit={handleSubmitEdit(handleUpdate)}
              className="space-y-3"
            >
              <input
                {...registerEdit("name", { required: true })}
                className="border p-2 w-full rounded"
                placeholder="Skill name"
              />
              <select
                {...registerEdit("level")}
                className="border p-2 w-full rounded"
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
              <select
                {...registerEdit("icon")}
                className="border p-2 w-full rounded"
              >
                <option value="">Select Icon</option>
                {availableIcons.map((icon) => (
                  <option key={icon.name} value={icon.name}>
                    {icon.label}
                  </option>
                ))}
              </select>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 rounded"
                  onClick={() => setEditingSkill(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;
