// backend/routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// POST /contact
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, msg: "All fields are required." });
  }

  try {
    // Create a test account on Ethereal
    const testAccount = await nodemailer.createTestAccount();

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    // Email options
    const mailOptions = {
      from: `"Portfolio Contact" <${email}>`,
      to: testAccount.user, // receive email in Ethereal
      subject: "New Contact Form Submission",
      text: `You have a new message from ${name} (${email}):\n\n${message}`,
      html: `<p>You have a new message from <strong>${name}</strong> (${email}):</p><p>${message}</p>`,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.json({
      success: true,
      msg: "Message sent successfully!",
      previewURL: nodemailer.getTestMessageUrl(info), // useful for testing
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Something went wrong." });
  }
});

module.exports = router;
