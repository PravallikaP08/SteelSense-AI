const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
connectDB();

const app = express();

// Import routes
const machineRoutes = require("./routes/machineRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const alertRoutes = require("./routes/alertRoutes");
const generateSensorData = require("./utils/helpers");
const dashboardRoutes = require("./routes/dashboardRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const analyticsRoutes = require("./routes/analyticsRoutes");


// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/machines", machineRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/alerts", alertRoutes);

app.use("/api/dashboard", dashboardRoutes);
app.use(errorHandler);
app.use("/api/analytics", analyticsRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("SteelSenseAI Backend Running...");
});

const PORT = process.env.PORT || 5000;
setInterval(() => {
  generateSensorData();
}, 5000);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});