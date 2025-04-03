const setupWebRTC = (server) => {
    let broadcaster = null;
  
    server.on("connectservern", (socket) => {
      console.log("📡 WebRTC connectservern:", socket.id);
  
      socket.on("broadcaster", () => {
        broadcaster = socket.id;
        console.log("🎥 Broadcaster connected:", socket.id);
      });
  
      socket.on("viewer", () => {
        console.log("👀 Viewer joined:", socket.id);
        if (broadcaster) {
          server.to(broadcaster).emit("viewer-joined", socket.id);
        }
      });
  
      socket.on("offer", (data) => {
        server.to(data.viewerId).emit("offer", { sdp: data.sdp, from: socket.id });
      });
  
      socket.on("answer", (data) => {
        server.to(data.broadcasterId).emit("answer", { sdp: data.sdp, from: socket.id });
      });
  
      socket.on("candidate", (data) => {
        server.to(data.to).emit("candidate", data);
      });
  
      socket.on("disconnect", () => {
        if (socket.id === broadcaster) {
          broadcaster = null;
        }
      });
    });
  };
  
  module.exports = { setupWebRTC };
  