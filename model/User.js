const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = Schema({
  username: String,
  exercises: [{ type: Schema.Types.ObjectId, ref: "Exercise" }],
});

module.exports = mongoose.model("User", userSchema);
