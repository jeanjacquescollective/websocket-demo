const express = require("express");
const http = require("http");
const { setupWebSocket } = require("./websocket");
const { setupOSC } = require("./oscClient");
// const { setupWebRTC } = require("./webrtcServer");

const app = express();
const server = http.createServer(app);
app.use(express.static("public"));

// Setup OSC and WebSocket
const { sendOSCMessage } = setupOSC();
const io = setupWebSocket(server, sendOSCMessage);

// Setup WebRTC
// setupWebRTC(io);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = { app, server };
