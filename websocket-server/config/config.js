require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  OSC_HOST: "127.0.0.1",
  OSC_PORT: 10000,
  WS_PORT: process.env.NODE_ENV === "production" ? process.env.PORT : 5001
};
