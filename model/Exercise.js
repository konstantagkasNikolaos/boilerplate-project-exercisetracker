const mongoose = require("mongoose");
const { Schema } = mongoose;

const exerciseSchema = Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  description: String,
  duration: Number,
  date: Date,
});

module.exports = mongoose.model("Exercise", exerciseSchema);
