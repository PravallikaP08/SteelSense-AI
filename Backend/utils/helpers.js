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
      let voltage = 220;
      let rpm = 0;
      let powerConsumption = 0;
      let runtimeHours = 250;

      // Query historical data for baseline
      const lastSensor = await SensorData.findOne({ machineId: m.id }).sort({ timestamp: -1 });
      if (lastSensor) {
        temp = lastSensor.temperature;
        pressure = lastSensor.pressure;
        vibration = lastSensor.vibration;
        voltage = lastSensor.voltage || 220;
        rpm = lastSensor.rpm || 0;
        powerConsumption = lastSensor.powerConsumption || 0;
        runtimeHours = lastSensor.runtimeHours + 1; // runtime increments
      } else {
        runtimeHours = Math.floor(Math.random() * 2000) + 500;
        // set starting baselines
        if (m.id === "CNC-A12") { temp = 95; pressure = 12; vibration = 8.2; voltage = 222; rpm = 1800; powerConsumption = 8.5; }
        else if (m.id === "HYD-B07") { temp = 48; pressure = 54; vibration = 2.1; voltage = 415; rpm = 0; powerConsumption = 12.0; }
        else if (m.id === "CON-C21") { temp = 55; pressure = 11; vibration = 15.4; voltage = 220; rpm = 1450; powerConsumption = 4.2; }
        else if (m.id === "BOI-D04") { temp = 81; pressure = 88; vibration = 4.5; voltage = 415; rpm = 950; powerConsumption = 15.5; }
        else if (m.id === "COO-E09") { temp = 36; pressure = 23; vibration = 2.3; voltage = 220; rpm = 2800; powerConsumption = 6.8; }
        else if (m.id === "PKG-F11") { temp = 44; pressure = 9; vibration = 1.7; voltage = 220; rpm = 600; powerConsumption = 3.1; }
        else if (m.id === "ROB-G05") { temp = 72; pressure = 6; vibration = 6.2; voltage = 24; rpm = 0; powerConsumption = 1.8; }
        else if (m.id === "STE-H02") { temp = 1150; pressure = 1.3; vibration = 0.6; voltage = 480; rpm = 0; powerConsumption = 85.0; }
      }

      // Small random walk to simulate active live telemetry
      const walk = (val, maxDelta, minVal = 0, maxVal = 1500) => {
        const delta = (Math.random() * 2 - 1) * maxDelta;
        return Math.max(minVal, Math.min(maxVal, parseFloat((val + delta).toFixed(1))));
      };

      if (m.id === "CNC-A12") {
        temp = walk(temp, 1.5, 90, 105);
        pressure = walk(pressure, 0.5, 10, 15);
        vibration = walk(vibration, 0.4, 7.5, 9.5);
        voltage = walk(voltage, 2.0, 215, 230);
        rpm = walk(rpm, 50, 1700, 2000);
        powerConsumption = walk(powerConsumption, 0.5, 7.5, 10.0);
      } else if (m.id === "HYD-B07") {
        temp = walk(temp, 1.0, 42, 55);
        pressure = walk(pressure, 2.0, 48, 65);
        vibration = walk(vibration, 0.2, 1.5, 3.5);
        voltage = walk(voltage, 3.0, 405, 425);
        rpm = 0;
        powerConsumption = walk(powerConsumption, 0.8, 10.5, 14.0);
      } else if (m.id === "CON-C21") {
        temp = walk(temp, 1.0, 50, 62);
        pressure = walk(pressure, 0.5, 8, 14);
        vibration = walk(vibration, 1.5, 13.0, 19.5);
        voltage = walk(voltage, 2.0, 215, 225);
        rpm = walk(rpm, 30, 1400, 1500);
        powerConsumption = walk(powerConsumption, 0.3, 3.8, 5.0);
      } else if (m.id === "BOI-D04") {
        temp = walk(temp, 1.2, 75, 90);
        pressure = walk(pressure, 3.0, 80, 102);
        vibration = walk(vibration, 0.3, 3.5, 6.2);
        voltage = walk(voltage, 3.0, 405, 425);
        rpm = walk(rpm, 20, 900, 1000);
        powerConsumption = walk(powerConsumption, 1.0, 14.0, 18.0);
      } else if (m.id === "COO-E09") {
        temp = walk(temp, 0.8, 32, 42);
        pressure = walk(pressure, 0.8, 20, 28);
        vibration = walk(vibration, 0.2, 1.8, 3.2);
        voltage = walk(voltage, 2.0, 215, 225);
        rpm = walk(rpm, 60, 2700, 2900);
        powerConsumption = walk(powerConsumption, 0.4, 6.0, 8.0);
      } else if (m.id === "PKG-F11") {
        temp = walk(temp, 0.8, 40, 50);
        pressure = walk(pressure, 0.4, 7, 12);
        vibration = walk(vibration, 0.2, 1.2, 2.5);
        voltage = walk(voltage, 2.0, 215, 225);
        rpm = walk(rpm, 15, 550, 650);
        powerConsumption = walk(powerConsumption, 0.2, 2.7, 3.8);
      } else if (m.id === "ROB-G05") {
        temp = walk(temp, 1.5, 68, 82);
        pressure = walk(pressure, 0.2, 4, 9);
        vibration = walk(vibration, 0.5, 5.0, 8.0);
        voltage = walk(voltage, 0.5, 23.5, 24.5);
        rpm = 0;
        powerConsumption = walk(powerConsumption, 0.2, 1.5, 2.5);
      } else if (m.id === "STE-H02") {
        temp = walk(temp, 10.0, 1130, 1180);
        pressure = walk(pressure, 0.1, 1.0, 1.8);
        vibration = walk(vibration, 0.1, 0.4, 0.9);
        voltage = walk(voltage, 4.0, 470, 490);
        rpm = 0;
        powerConsumption = walk(powerConsumption, 3.0, 80.0, 95.0);
      }

      // Save telemetry reading
      const sensor = new SensorData({
        machineId: m.id,
        temperature: temp,
        pressure: pressure,
        vibration: vibration,
        voltage: voltage,
        rpm: rpm,
        powerConsumption: powerConsumption,
        runtimeHours: runtimeHours
      });
      await sensor.save();

      // Compute dynamic failure probability, status, recommendation
      let failureProbability = 5;
      let healthStatus = "Healthy";
      let recommendation = "Operating normally.";
      let alertMsg = "";
      let alertType = "Warning Alert";
      let alertSeverity = "Medium";

      // Base probability from runtime
      let prob = Math.min(20, runtimeHours / 100);
      
      let tempPenalty = 0;
      let pressPenalty = 0;
      let vibPenalty = 0;

      // CNC machine: High temp or vibration risk
      if (m.id === "CNC-A12") {
        if (temp > 100) { tempPenalty = (temp - 100) * 4; alertMsg = `CNC A12 temperature is critical (${temp}°C). Overheating risk.`; alertType = "Overheating Alarm"; alertSeverity = "Critical"; }
        if (vibration > 8.5) { vibPenalty = (vibration - 8.5) * 15; if(!alertMsg) { alertMsg = `CNC A12 spindle vibration abnormal (${vibration} mm/s).`; alertType = "High Vibration"; alertSeverity = "High"; } }
      } 
      // Hydraulic Press: Critical Pressure
      else if (m.id === "HYD-B07") {
        if (pressure > 60) { pressPenalty = (pressure - 60) * 3; alertMsg = `Hydraulic Press B07 pressure exceeding safety threshold (${pressure} PSI).`; alertType = "Pressure Instability"; alertSeverity = "High"; }
        if (temp > 53) { tempPenalty = (temp - 53) * 5; if(!alertMsg) { alertMsg = `Hydraulic oil temperature warning (${temp}°C).`; alertType = "Oil Overheating"; alertSeverity = "Medium"; } }
      }
      // Conveyor Motor: Extreme Vibration
      else if (m.id === "CON-C21") {
        if (vibration > 17.0) { vibPenalty = (vibration - 17.0) * 12; alertMsg = `Conveyor motor C21 structural vibration critical (${vibration} mm/s). Bearings check required.`; alertType = "High Vibration"; alertSeverity = "Critical"; }
      }
      // Boiler Pump: Pressure and Temperature
      else if (m.id === "BOI-D04") {
        if (pressure > 95) { pressPenalty = (pressure - 95) * 5; alertMsg = `Boiler Pump D04 pressure warning (${pressure} PSI). Cavitation risk.`; alertType = "Pressure Instability"; alertSeverity = "High"; }
        if (temp > 86) { tempPenalty = (temp - 86) * 6; if(!alertMsg) { alertMsg = `Boiler Pump temperature warning (${temp}°C).`; alertType = "Overheating Alarm"; alertSeverity = "Medium"; } }
      }
      // Cooling Compressor: Temperature
      else if (m.id === "COO-E09") {
        if (temp > 40) { tempPenalty = (temp - 40) * 10; alertMsg = `Cooling Compressor E09 discharge temperature high (${temp}°C).`; alertType = "Overheating Alarm"; alertSeverity = "High"; }
      }
      // Packaging Unit
      else if (m.id === "PKG-F11") {
        if (temp > 48) { tempPenalty = (temp - 48) * 8; alertMsg = `Packaging unit heat sealer temperature warning (${temp}°C).`; alertType = "Overheating Alarm"; alertSeverity = "Medium"; }
      }
      // Robotic Arm: Servo/Voltage/Vibration
      else if (m.id === "ROB-G05") {
        if (vibration > 7.2) { vibPenalty = (vibration - 7.2) * 20; alertMsg = `Robotic Arm G05 joint vibration critical (${vibration} mm/s). Axis calibration needed.`; alertType = "High Vibration"; alertSeverity = "High"; }
      }
      // Steel Furnace: High Temp
      else if (m.id === "STE-H02") {
        if (temp > 1170) { tempPenalty = (temp - 1170) * 1.5; alertMsg = `Steel Furnace H02 core temperature critical (${temp}°C). Refractory lining stress.`; alertType = "Overheating Alarm"; alertSeverity = "Critical"; }
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

      // Dynamically calculate Remaining Useful Life (RUL) in hours
      let remainingUsefulLife = 2000;
      if (healthStatus === "Critical") {
        remainingUsefulLife = Math.max(2, Math.round((100 - failureProbability) * 0.8 + Math.random() * 5));
      } else if (healthStatus === "Warning") {
        remainingUsefulLife = Math.max(24, Math.round((100 - failureProbability) * 6 + Math.random() * 50));
      } else {
        remainingUsefulLife = Math.max(500, Math.round((100 - failureProbability) * 35 + Math.random() * 200));
      }

      // Save prediction
      const prediction = new Prediction({
        machineId: m.id,
        failureProbability,
        healthStatus,
        recommendation,
        remainingUsefulLife
      });
      await prediction.save();

      // Save alert for anomalies if not spammed
      if (healthStatus === "Critical" || healthStatus === "Warning") {
        const lastAlert = await Alert.findOne({ machineId: m.id }).sort({ timestamp: -1 });
        const needsAlert = !lastAlert || (Date.now() - lastAlert.timestamp.getTime() > 2 * 60 * 1000);
        
        if (needsAlert && alertMsg) {
          const alert = new Alert({
            machineId: m.id,
            alertType: alertType || (healthStatus === "Critical" ? "Machine Failure Risk" : "Warning Alert"),
            severity: alertSeverity || (healthStatus === "Critical" ? "High" : "Medium"),
            message: alertMsg || recommendation
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
    // Clear old seeded machines & dependencies to wipe out old records
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
        status: m.id === "CNC-A12" || m.id === "BOI-D04" ? "Critical" : m.id === "CON-C21" || m.id === "ROB-G05" ? "Warning" : "Healthy"
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