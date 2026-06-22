const SensorData = require("../models/SensorData");
const Prediction = require("../models/Prediction");
const Alert = require("../models/Alert");
const Machine = require("../models/Machine");

const machines = [
  { id: "CNC-A12", name: "CNC Machine A12", type: "CNC" },
  { id: "HYD-B07", name: "Hydraulic Press B07", type: "Hydraulic" },
  { id: "CON-C21", name: "Conveyor Motor C21", type: "Motor" },
  { id: "BOI-D04", name: "Boiler Pump D04", type: "Pump" },
  { id: "COO-E09", name: "Cooling Compressor E09", type: "Compressor" },
  { id: "PKG-F11", name: "Packaging Unit F11", type: "Packaging" },
  { id: "ROB-G05", name: "Robotic Arm G05", type: "Robot" },
  { id: "STE-H02", name: "Steel Furnace H02", type: "Furnace" }
];

// Generate random sensor data walks
const generateSensorData = async () => {
  try {
    for (const m of machines) {
      let temp = 60;
      let pressure = 20;
      let vibration = 3;
      let runtimeHours = 250;

      // Query historical data for baseline
      const lastSensor = await SensorData.findOne({ machineId: m.id }).sort({ timestamp: -1 });
      if (lastSensor) {
        temp = lastSensor.temperature;
        pressure = lastSensor.pressure;
        vibration = lastSensor.vibration;
        runtimeHours = lastSensor.runtimeHours + 1; // runtime increments
      } else {
        runtimeHours = Math.floor(Math.random() * 2000) + 500;
        // set starting baselines
        if (m.id === "CNC-A12") { temp = 95; pressure = 12; vibration = 8.2; }
        else if (m.id === "HYD-B07") { temp = 48; pressure = 54; vibration = 2.1; }
        else if (m.id === "CON-C21") { temp = 55; pressure = 11; vibration = 15.4; }
        else if (m.id === "BOI-D04") { temp = 81; pressure = 88; vibration = 4.5; }
        else if (m.id === "COO-E09") { temp = 36; pressure = 23; vibration = 2.3; }
        else if (m.id === "PKG-F11") { temp = 44; pressure = 9; vibration = 1.7; }
        else if (m.id === "ROB-G05") { temp = 72; pressure = 6; vibration = 6.2; }
        else if (m.id === "STE-H02") { temp = 1150; pressure = 1.3; vibration = 0.6; }
      }

      // Small random walk to simulate active live telemetry
      const walk = (val, maxDelta, minVal = 0, maxVal = 1500) => {
        const delta = (Math.random() * 2 - 1) * maxDelta;
        return Math.max(minVal, Math.min(maxVal, parseFloat((val + delta).toFixed(1))));
      };

      if (m.id === "CNC-A12") {
        temp = walk(temp, 1.5, 90, 100);
        pressure = walk(pressure, 0.5, 10, 15);
        vibration = walk(vibration, 0.4, 7.5, 9.0);
      } else if (m.id === "HYD-B07") {
        temp = walk(temp, 1.0, 42, 52);
        pressure = walk(pressure, 2.0, 48, 58);
        vibration = walk(vibration, 0.2, 1.5, 2.8);
      } else if (m.id === "CON-C21") {
        temp = walk(temp, 1.0, 50, 60);
        pressure = walk(pressure, 0.5, 8, 14);
        vibration = walk(vibration, 1.5, 13.0, 17.5);
      } else if (m.id === "BOI-D04") {
        temp = walk(temp, 1.2, 75, 85);
        pressure = walk(pressure, 3.0, 80, 95);
        vibration = walk(vibration, 0.3, 3.5, 5.5);
      } else if (m.id === "COO-E09") {
        temp = walk(temp, 0.8, 32, 40);
        pressure = walk(pressure, 0.8, 20, 26);
        vibration = walk(vibration, 0.2, 1.8, 2.8);
      } else if (m.id === "PKG-F11") {
        temp = walk(temp, 0.8, 40, 48);
        pressure = walk(pressure, 0.4, 7, 11);
        vibration = walk(vibration, 0.2, 1.2, 2.2);
      } else if (m.id === "ROB-G05") {
        temp = walk(temp, 1.5, 68, 78);
        pressure = walk(pressure, 0.2, 4, 8);
        vibration = walk(vibration, 0.5, 5.0, 7.5);
      } else if (m.id === "STE-H02") {
        temp = walk(temp, 10.0, 1130, 1170);
        pressure = walk(pressure, 0.1, 1.0, 1.6);
        vibration = walk(vibration, 0.1, 0.4, 0.8);
      }

      // Save telemetry reading
      const sensor = new SensorData({
        machineId: m.id,
        temperature: temp,
        pressure: pressure,
        vibration: vibration,
        runtimeHours: runtimeHours
      });
      await sensor.save();

      // Compute dynamic failure probability, status, recommendation
      let failureProbability = 5;
      let healthStatus = "Healthy";
      let recommendation = "Operating normally.";

      // Base probability from runtime
      let prob = Math.min(20, runtimeHours / 100);
      
      let tempPenalty = 0;
      let pressPenalty = 0;
      let vibPenalty = 0;

      // Calculate penalties based on machine type general thresholds
      if (temp > 85) tempPenalty = (temp - 85) * 1.5;
      if (temp > 100) tempPenalty += (temp - 100) * 2;
      
      if (pressure > 60) pressPenalty = (pressure - 60) * 1.2;
      if (pressure > 85) pressPenalty += (pressure - 85) * 2;
      
      if (vibration > 6) vibPenalty = (vibration - 6) * 4;
      if (vibration > 10) vibPenalty += (vibration - 10) * 5;

      // Special case for furnace which runs hot
      if (m.id === "STE-H02") {
        tempPenalty = temp > 1200 ? (temp - 1200) * 0.5 : 0;
        pressPenalty = pressure > 2 ? (pressure - 2) * 20 : 0;
        vibPenalty = vibration > 1.5 ? (vibration - 1.5) * 30 : 0;
      }

      prob += tempPenalty + pressPenalty + vibPenalty;
      failureProbability = Math.min(98, Math.max(2, Math.round(prob)));

      if (failureProbability >= 80) {
        healthStatus = "Critical";
        if (tempPenalty > pressPenalty && tempPenalty > vibPenalty) recommendation = "Critical overheating. Immediate shutdown and cooling required.";
        else if (pressPenalty > vibPenalty) recommendation = "Critical pressure instability. Inspect valves and seals immediately.";
        else recommendation = "Severe vibration detected. Impending mechanical failure. Stop and inspect bearings.";
      } else if (failureProbability >= 40) {
        healthStatus = "Warning";
        if (tempPenalty > pressPenalty && tempPenalty > vibPenalty) recommendation = "Temperature running high. Monitor cooling systems.";
        else if (pressPenalty > vibPenalty) recommendation = "Pressure fluctuating above normal limits. Schedule maintenance.";
        else recommendation = "Abnormal vibration pattern detected. Inspect shaft alignment and mountings.";
      } else {
        healthStatus = "Healthy";
        recommendation = "Operating normally. All metrics within acceptable ranges.";
      }

      // Sync status back to the Machine collection
      await Machine.updateOne({ machineId: m.id }, { status: healthStatus });

      // Save prediction
      const prediction = new Prediction({
        machineId: m.id,
        failureProbability,
        healthStatus,
        recommendation
      });
      await prediction.save();

      // Save alert for anomalies if not spammed
      if (healthStatus === "Critical" || healthStatus === "Warning") {
        const lastAlert = await Alert.findOne({ machineId: m.id }).sort({ timestamp: -1 });
        const needsAlert = !lastAlert || (Date.now() - lastAlert.timestamp.getTime() > 2 * 60 * 1000);
        
        if (needsAlert) {
          const alert = new Alert({
            machineId: m.id,
            alertType: healthStatus === "Critical" ? "Machine Failure Risk" : "Warning Alert",
            severity: healthStatus === "Critical" ? "High" : "Medium",
            message: recommendation
          });
          await alert.save();
        }
      }
    }
  } catch (error) {
    console.error("Error generating sensor data walk:", error.message);
  }
};

const seedMachines = async () => {
  try {
    // Clear old seeded machines & dependencies to wipe out old M001 records
    await Machine.deleteMany({});
    await SensorData.deleteMany({});
    await Prediction.deleteMany({});
    await Alert.deleteMany({});
    console.log("Cleared existing Machine, SensorData, Prediction, and Alert collections.");

    for (const m of machines) {
      await Machine.create({
        machineId: m.id,
        machineName: m.name,
        machineType: m.type,
        status: m.id === "CNC-A12" || m.id === "BOI-D04" ? "Critical" : m.id === "CON-C21" || m.id === "ROB-G05" ? "Warning" : "Active"
      });
      console.log(`Seeded machine ${m.id}`);
    }

    // Seed initial historical readings
    const lastSensor = await SensorData.findOne({});
    if (!lastSensor) {
      console.log("Seeding initial telemetry data walks...");
      await generateSensorData();
    }
  } catch (err) {
    console.error("Failed to seed machines:", err.message);
  }
};

module.exports = { generateSensorData, seedMachines };