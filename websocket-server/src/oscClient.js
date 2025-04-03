const osc = require("node-osc");
const { OSC_HOST, OSC_PORT } = require("../config/config");

const setupOSC = (server) => {
  const oscClient = new osc.Client(OSC_HOST, OSC_PORT);
  const oscServer = new osc.Server(OSC_PORT + 1, "0.0.0.0"); // Receiving OSC

  console.log(`🎵 OSC Server listening on ${OSC_PORT + 1}`);

  oscServer.on("message", (msg) => {
    console.log("🔹 Received OSC message:", msg);
    server.emit("oscMessage", msg); // Send OSC data to WebSockets
  });

  const sendOSCMessage = (address, value) => {
    oscClient.send(address, value);
    console.log(`🚀 Sent OSC message: ${address}, ${value}`);
  };

  return { sendOSCMessage };
};

module.exports = { setupOSC };
