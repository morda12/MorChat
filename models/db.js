const mongoose = require("mongoose");

// connect MongoDB
function moongoseConnectDB(uri) {

    mongoose.connection.on("connecting", () => {
        console.log('DB connecting...');
      });
      mongoose.connection.on("connected", () => {
        console.log('DB successfully connected');
      });
      mongoose.connect(uri);
}

module.exports = moongoseConnectDB;
