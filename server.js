import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define Booking Schema
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  service: String,
  date: String,
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

// API Routes
app.get("/", (req, res) => {
  res.send("Pronet Services API is running...");
});

// Create a new booking
app.post("/bookings", async (req, res) => {
  try {
    const { name, email, service, date } = req.body;

    if (!name || !email || !service || !date) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    const newBooking = new Booking({ name, email, service, date });
    await newBooking.save();

    res.status(201).json({ message: "Réservation enregistrée avec succès !" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur. Veuillez réessayer plus tard." });
  }
});

// Get all bookings
app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
