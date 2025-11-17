const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const registerRoute = require("./routes/registerRoute");
const adminRoutes = require("./routes/adminRoutes");
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/register", registerRoute);
app.use("/api/admin", adminRoutes);
// Database Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
