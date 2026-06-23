const Machine = require("../models/Machine");
const SensorData = require("../models/SensorData");
const Prediction = require("../models/Prediction");
const Maintenance = require("../models/Maintenance");
const Alert = require("../models/Alert");

const handleAssistantChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "I didn't receive any message. How can I help you today?" });
    }

    const cleanedMsg = message.toLowerCase().trim();

    // Fetch data context
    const allMachines = await Machine.find({});
    
    // Get latest telemetry for each machine
    const latestTelemetry = await SensorData.aggregate([
      { $sort: { timestamp: -1 } },
      { $group: { _id: "$machineId", doc: { $first: "$$ROOT" } } },
      { $replaceRoot: { newRoot: "$doc" } }
    ]);

    // Get latest prediction for each machine
    const latestPredictions = await Prediction.aggregate([
      { $sort: { timestamp: -1 } },
      { $group: { _id: "$machineId", doc: { $first: "$$ROOT" } } },
      { $replaceRoot: { newRoot: "$doc" } }
    ]);

    // Get scheduled maintenance
    const scheduledMaintenance = await Maintenance.find({ status: "Scheduled" });

    // Identify target machine if mentioned
    let targetMachine = null;
    let machineName = "";
    for (const m of allMachines) {
      if (cleanedMsg.includes(m.machineId.toLowerCase()) || cleanedMsg.includes(m.machineName.toLowerCase())) {
        targetMachine = m;
        machineName = m.machineName;
        break;
      }
    }

    // Helper to get machine telemetry
    const getTelemetryOf = (machineId) => latestTelemetry.find(t => t.machineId === machineId);
    // Helper to get machine prediction
    const getPredictionOf = (machineId) => latestPredictions.find(p => p.machineId === machineId);

    // Context response generators
    // 1. Specific Machine query
    if (targetMachine) {
      const tel = getTelemetryOf(targetMachine.machineId);
      const pred = getPredictionOf(targetMachine.machineId);
      const mSchedules = scheduledMaintenance.filter(s => s.machineId === targetMachine.machineId);

      let reply = `### **${targetMachine.machineName} (${targetMachine.machineId}) Diagnostic Report**\n\n`;
      reply += `* **Operating Status:** \`${targetMachine.status}\`\n`;
      
      if (pred) {
        reply += `* **Failure Probability:** \`${pred.failureProbability}%\` (${pred.healthStatus} Risk)\n`;
        reply += `* **Remaining Useful Life (RUL):** \`${pred.remainingUsefulLife} Hours\`\n`;
        reply += `* **Recommendation:** *${pred.recommendation}*\n\n`;
      }

      if (tel) {
        reply += `#### **Current Telemetry Metrics:**\n`;
        reply += `* **Temperature:** ${tel.temperature} °C\n`;
        reply += `* **Pressure:** ${tel.pressure} PSI\n`;
        reply += `* **Vibration:** ${tel.vibration} mm/s\n`;
        reply += `* **Voltage:** ${tel.voltage} V\n`;
        reply += `* **RPM:** ${tel.rpm} RPM\n`;
        reply += `* **Power Draw:** ${tel.powerConsumption} kW\n`;
        reply += `* **Total Runtime:** ${tel.runtimeHours.toLocaleString()} Hours\n\n`;
      }

      if (mSchedules.length > 0) {
        reply += `#### **Scheduled Maintenance:**\n`;
        mSchedules.forEach(s => {
          reply += `* **Date:** ${new Date(s.scheduledDate).toLocaleDateString()} | **Type:** ${s.type} | **Technician:** ${s.technician}\n`;
        });
      } else {
        reply += `*No maintenance scheduled for this unit currently.*`;
      }

      return res.status(200).json({ reply });
    }

    // 2. Querying "which machine is at risk" / "predictions" / "critical" / "warning"
    if (cleanedMsg.includes("risk") || cleanedMsg.includes("fail") || cleanedMsg.includes("critical") || cleanedMsg.includes("warning") || cleanedMsg.includes("health")) {
      const highRisk = latestPredictions.filter(p => p.failureProbability >= 80);
      const medRisk = latestPredictions.filter(p => p.failureProbability >= 40 && p.failureProbability < 80);

      let reply = `### **Plant Risk Assessment Profile**\n\n`;
      
      if (highRisk.length === 0 && medRisk.length === 0) {
        return res.status(200).json({ reply: reply + "✅ **All systems operational.** No machines are currently flagged at warning or critical risk levels." });
      }

      if (highRisk.length > 0) {
        reply += `⚠️ **CRITICAL RISK UNITS (Immediate Attention Needed):**\n`;
        highRisk.forEach(hr => {
          const m = allMachines.find(mac => mac.machineId === hr.machineId);
          reply += `- **${m ? m.machineName : hr.machineId}**: \`${hr.failureProbability}%\` failure probability (RUL: \`${hr.remainingUsefulLife} hrs\`). Recommendation: *${hr.recommendation}*\n`;
        });
        reply += `\n`;
      }

      if (medRisk.length > 0) {
        reply += `⚡ **MODERATE RISK UNITS (Schedule Preventive Runs):**\n`;
        medRisk.forEach(mr => {
          const m = allMachines.find(mac => mac.machineId === mr.machineId);
          reply += `- **${m ? m.machineName : mr.machineId}**: \`${mr.failureProbability}%\` failure probability (RUL: \`${mr.remainingUsefulLife} hrs\`). Recommendation: *${mr.recommendation}*\n`;
        });
      }

      return res.status(200).json({ reply });
    }

    // 3. Querying "maintenance schedule" / "maintenance"
    if (cleanedMsg.includes("maintenance") || cleanedMsg.includes("schedule") || cleanedMsg.includes("scheduler")) {
      let reply = `### **Upcoming Maintenance Calendar**\n\n`;
      if (scheduledMaintenance.length === 0) {
        reply += "No upcoming maintenance tasks scheduled in the system. You can add one using the **Maintenance Scheduler** page.";
      } else {
        scheduledMaintenance.forEach(s => {
          const m = allMachines.find(mac => mac.machineId === s.machineId);
          reply += `- **${m ? m.machineName : s.machineId}**:\n`;
          reply += `  - **Type:** ${s.type} Inspection\n`;
          reply += `  - **Date:** ${new Date(s.scheduledDate).toLocaleDateString()} at ${new Date(s.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}\n`;
          reply += `  - **Assigned Tech:** ${s.technician}\n`;
          if (s.notes) reply += `  - **Details:** *${s.notes}*\n`;
          reply += `\n`;
        });
      }
      return res.status(200).json({ reply });
    }

    // 4. Querying telemetry variables like "temperature", "pressure", "vibration", "voltage", "power"
    if (cleanedMsg.includes("temp") || cleanedMsg.includes("vibration") || cleanedMsg.includes("pressure") || cleanedMsg.includes("rpm") || cleanedMsg.includes("power") || cleanedMsg.includes("voltage")) {
      let metric = "";
      let checkField = "";
      let unit = "";

      if (cleanedMsg.includes("temp")) { metric = "Temperature"; checkField = "temperature"; unit = "°C"; }
      else if (cleanedMsg.includes("vibration")) { metric = "Vibration"; checkField = "vibration"; unit = "mm/s"; }
      else if (cleanedMsg.includes("pressure")) { metric = "Pressure"; checkField = "pressure"; unit = "PSI"; }
      else if (cleanedMsg.includes("rpm")) { metric = "RPM"; checkField = "rpm"; unit = "RPM"; }
      else if (cleanedMsg.includes("voltage")) { metric = "Voltage"; checkField = "voltage"; unit = "V"; }
      else { metric = "Power Draw"; checkField = "powerConsumption"; unit = "kW"; }

      let reply = `### **Current Plant Telemetry Profile: ${metric}**\n\n`;
      latestTelemetry.forEach(t => {
        const m = allMachines.find(mac => mac.machineId === t.machineId);
        reply += `- **${m ? m.machineName : t.machineId}**: \`${t[checkField]} ${unit}\`\n`;
      });

      return res.status(200).json({ reply });
    }

    // 5. Default generic message
    const defaultReply = `Hi! I am the **SteelSense AI Assistant**. I have live access to the steel plant's database, predictions, alerts, and maintenance logs.

You can ask me questions like:
- *"What is the current status of CNC Machine A12?"*
- *"Which machines are currently at risk of failing?"*
- *"Show me the upcoming maintenance schedule."*
- *"List the temperature values of all machines."*
- *"Why is the vibration level on Conveyor Motor C21 abnormal?"*

How can I help you support Vizag Steel Plant operations today?`;

    return res.status(200).json({ reply: defaultReply });

  } catch (error) {
    res.status(500).json({ reply: "I encountered an error querying the system records: " + error.message });
  }
};

module.exports = {
  handleAssistantChat
};
