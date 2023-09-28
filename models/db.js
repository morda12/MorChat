const mongoose = require("mongoose");

function getUri(user, password, url){
  return `mongodb+srv://${user}:${password}@${url}/?retryWrites=true&w=majority`
}

// connect MongoDB
function moongoseConnectDB() {
  const uri = getUri(process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_URL)
  mongoose.connection.on("connecting", () => {
    console.log('DB connecting...');
  });
  mongoose.connection.on("connected", () => {
    console.log('DB successfully connected');
  });
  mongoose.connect(uri);
}

module.exports = moongoseConnectDB;
