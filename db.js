const databaseURL = process.env["MONGO_URI"];
const mongoose = require("mongoose");

const connect = () => {
  try {
    mongoose.connect(databaseURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    throw error;
  }

  console.log("...Mongo Database Connected...");
};

module.exports = { connect };
