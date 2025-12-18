import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";

const Contact = () => {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const res = await api.get("/contact");
      setMessages(res.data);
    } catch {
      toast.error("Failed to fetch messages");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/contact/${id}`);
      toast.success("Message deleted!");
      fetchMessages();
    } catch {
      toast.error("Failed to delete message");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Contact Messages</h1>

      {messages.length === 0 ? (
        <p className="text-gray-500">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg._id} className="bg-white p-4 rounded shadow space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{msg.name}</h2>
                <button
                  onClick={() => handleDelete(msg._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
              <p className="text-sm text-gray-600">{msg.email}</p>
              {msg.subject && <p className="font-medium">{msg.subject}</p>}
              <p>{msg.message}</p>
              <p className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contact;
