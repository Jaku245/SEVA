module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("Socket connected");

    socket.on("refreshAddress", (data) => {
      io.emit("refreshAddressPage", {});
    });
  });
};