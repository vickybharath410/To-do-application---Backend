const taskRoutes = require("express").Router();

const Task = require("../model/taskSchema");
taskRoutes.get("/alltask/:id", async (req, res) => {
  try {
    const existingTask = await Task.find({ userid: req.params.id });
    res.send(existingTask);
  } catch (error) {
    res.send(error);
  }
});
taskRoutes.post("/newtask/:id", async (req, res) => {
  try {
    const newTask = await Task.create({
      activity: req.body.activity,
      userid: req.params.id,
    });
    res.status(200).send({
      status: "Activity created",
      taskDetails: newTask,
    });
  } catch (error) {
    res.send(error);
  }
});

taskRoutes.put("/start/:id", async (req, res) => {
  try {
    const newDate = new Date();
    const activity = await Task.findByIdAndUpdate(
      req.params.id,
      {
        status: "Ongoing",
        startTime:
          newDate.getHours() +
          ":" +
          newDate.getMinutes() +
          ":" +
          newDate.getSeconds(),
      },
      { new: true }
    );
    console.log(activity);
    res.send(activity);
  } catch (error) {
    res.send(error);
  }
});
function getTimeInSeconds(str) {
  let curr_time = [];

  curr_time = str.split(":");
  for (let i = 0; i < curr_time.length; i++) {
    curr_time[i] = parseInt(curr_time[i]);
  }

  let t = curr_time[0] * 60 * 60 + curr_time[1] * 60 + curr_time[2];

  return t;
}

// Function to convert seconds back to hh::mm:ss
// format
function convertSecToTime(t) {
  let hours = Math.floor(t / 3600);
  let hh = hours < 10 ? "0" + hours.toString() : hours.toString();
  let min = Math.floor((t % 3600) / 60);
  let mm = min < 10 ? "0" + min.toString() : min.toString();
  let sec = (t % 3600) % 60;
  let ss = sec < 10 ? "0" + sec.toString() : sec.toString();
  let ans = hh + ":" + mm + ":" + ss;
  return ans;
}

// Function to find the time gap
function timeGap(st, et) {
  let t1 = getTimeInSeconds(st);
  let t2 = getTimeInSeconds(et);

  let time_diff = t1 - t2 < 0 ? t2 - t1 : t1 - t2;

  return convertSecToTime(time_diff);
}

taskRoutes.put("/end/:id", async (req, res) => {
  try {
    const updateTask = await Task.findById({ _id: req.params.id });
    const newDate = new Date();
    const endtime =
      newDate.getHours() +
      ":" +
      newDate.getMinutes() +
      ":" +
      newDate.getSeconds();
    const totalTime = timeGap(updateTask.startTime, endtime);
    const activity = await Task.findByIdAndUpdate(
      req.params.id,
      {
        status: "Completed",
        endTime: endtime,
        totalTime: totalTime,
      },
      { new: true }
    );
    res.status(200).send(activity);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = taskRoutes;
