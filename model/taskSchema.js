const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema({
  activity: { type: String, required: true, unique: true },
  status: { type: String, default: "Pending" },
  startTime: { type: String },
  endTime: { type: String },
  totalTime: { type: String },
  userid: { type: mongoose.Types.ObjectId, ref: "users", required: true },
});
module.exports = mongoose.model("Tasks", TaskSchema);
