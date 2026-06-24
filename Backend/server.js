const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const app = express();

// Import routes
const machineRoutes = require("./routes/machineRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const alertRoutes = require("./routes/alertRoutes");
const authRoutes = require("./routes/authRoutes");
const { generateSensorData, seedMachines } = require("./utils/helpers");
const dashboardRoutes = require("./routes/dashboardRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const analyticsRoutes = require("./routes/analyticsRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const assistantRoutes = require("./routes/assistantRoutes");


// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://steelsense-ai-y5cb.onrender.com"],
  credentials: true
}));
app.use(express.json());

// API routes
app.use("/api/machines", machineRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/assistant", assistantRoutes);

app.use(errorHandler);

// Test route
app.get("/", (req, res) => {
  res.send("SteelSenseAI Backend Running...");
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  seedMachines();
  setInterval(() => {
    generateSensorData();
  }, 3000);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});