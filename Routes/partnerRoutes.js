import express from "express";
import PartnerRequest from "../schema/PartnerRequest.js";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/request-partnership", async (req, res) => {
  const { name, company, email, phone, message } = req.body;

  try {
    const newRequest = new PartnerRequest({ name, company, email, phone, message });
    await newRequest.save();

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_RECEIVER,
      subject: `New Partnership Request from ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Company:</strong> ${company}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone}</p>
             <p><strong>Message:</strong> ${message}</p>`,
    });

    res.status(201).json({ msg: "Request submitted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error." });
  }
});

export default router;
