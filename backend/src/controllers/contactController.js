const Contact = require("../models/Contact");

exports.getContacts = async (req, res) => {
  const messages = await Contact.find().sort({ createdAt: -1 });
  res.json(messages);
};



exports.deleteContact = async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
