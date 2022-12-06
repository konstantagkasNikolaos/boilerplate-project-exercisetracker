const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const db = require("./db");
const User = require("./model/User");
const Exercise = require("./model/Exercise");

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select({ _id: 1, username: 1 }).exec();

    res.json(users);
  } catch (error) {
    return res.send(error);
  }
});

app.post("/api/users", async (req, res) => {
  const { username } = req.body;

  try {
    const user = new User({ username });
    const response = await user.save();

    res.json({ _id: response._id, username: response.username });
  } catch (error) {
    res.send(error);
  }
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  try {
    const user = await User.findById(_id).exec();

    if (user.name === "CastError") res.json({ error: "User NOT FOUND" });

    const { username, _id: userId } = user;
    const newExercise = new Exercise({ userId, description, duration, date });

    user.exercises.push(newExercise);

    const savedExercise = await newExercise.save();
    await user.save();

    res.json({
      _id: savedExercise.userId,
      username: username,
      description: savedExercise.description,
      duration: savedExercise.duration,
      date: savedExercise.date.toDateString(),
    });
  } catch (error) {
    res.send(error);
  }
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  try {
    const user = await User.findById(_id).exec();

    if (user.name === "CastError") res.json({ error: "User NOT FOUND" });

    const prepareQuery = { userId: _id };

    if (from && to) {
      prepareQuery.date = { $gte: from, $lte: to };
    } else {
      if (from) {
        prepareQuery.date = { $gte: from };
      }

      if (to) {
        prepareQuery.date = { $lte: to };
      }
    }

    const exercises = await Exercise.find(prepareQuery).limit(limit).exec();

    const log = exercises.map((exercise) => ({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString(),
    }));

    const { username } = user;

    const count = log.length;

    res.json({ _id, username, count, log });
  } catch (error) {
    res.send(error);
  }
});

db.connect();

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
