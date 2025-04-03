// Import required modules
const http = require("http");
const express = require("express");
const WebSocket = require("ws");
const osc = require("node-osc");
require("dotenv").config();

// Initialize Express app
const app = express();
app.use(express.static("public"));

// Define server port
const serverPort = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

const oscClient = new osc.Client("127.0.0.1", 10000); // Default TouchDesigner OSC port

// Initialize WebSocket server
const wss =
  process.env.NODE_ENV === "production"
    ? new WebSocket.Server({ server }) // Attach WebSocket server to HTTP server in production
    : new WebSocket.Server({ port: 5001 }); // Use standalone WebSocket server in development


console.log(
  `WebSocket server is running on ${process.env.NODE_ENV === "production"
    ? `ws://localhost:${serverPort}`
    : "ws://localhost:5001"
  }`
);
// Start HTTP server
server.listen(serverPort, () => {
  console.log(
    `Server started on URL: http://localhost:${serverPort} in stage ${process.env.NODE_ENV}`
  );
});

// Variable to store keep-alive interval ID
let keepAliveId;

// WebSocket server connection event
wss.on("connection", (ws) => {
  console.log("Connection Opened");
  console.log("Client size: ", wss.clients.size);

  // Start keep-alive if this is the first connection
  if (wss.clients.size === 1) {
    console.log("First connection. Starting keep-alive.");
    startKeepAlive();
  }

  // Handle incoming messages from clients
  ws.on("message", (data) => {
    const message = data.toString();

    // Handle keep-alive pong response
    if (message === "pong") {
      console.log("Keep-alive pong received");
      return;
    }

    // Send OSC message to TouchDesigner

    // Parse the message and send it as an OSC message
    try {
      const oscMessage = JSON.parse(message);
      console.log("Received OSC message:", oscMessage.value);
      oscClient.send('/' + oscMessage.key, parseFloat(oscMessage.value));
      console.log("OSC message sent:", oscMessage.key, oscMessage.value);

    } catch (error) {
      console.error("Error parsing OSC message:", error.message);
    }
    // Broadcast message to other clients
    broadcast(ws, message, false);
  });

  // Handle client disconnection
  ws.on("close", () => {
    console.log("Closing connection");

    // Stop keep-alive if all clients are disconnected
    if (wss.clients.size === 0) {
      console.log("Last client disconnected. Stopping keep-alive interval.");
      clearInterval(keepAliveId);
    }
  });
});

// Broadcast function to send messages to clients
const broadcast = (ws, message, includeSelf) => {
  wss.clients.forEach((client) => {
    if (
      (includeSelf || client !== ws) &&
      client.readyState === WebSocket.OPEN
    ) {
      client.send(message);
    }
  });
};

// Function to send a ping message to all connected clients every 50 seconds
const startKeepAlive = () => {
  keepAliveId = setInterval(() => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send("ping");
      }
    });
  }, 50000);
};

// Define a simple route for the root URL
app.get("/", (req, res) => {
  res.send("Hello World!");
});