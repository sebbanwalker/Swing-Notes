const mongoose = require("mongoose");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

mongoose
  .connect("mongodb://localhost:27017/SwingNotes", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

const noteSchema = new mongoose.Schema({
  title: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", noteSchema);

//GET Endpoint
app.get("/api/notes/", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//POST Endpoint
app.post("/api/notes/", async (req, res) => {
  try {
    const { title, text } = req.body;
    const newNote = new Note({ title, text });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//PUT Endpoint
app.put("/api/notes/:id", async (req, res) => {
  try {
    const { title, text } = req.body;
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, text, modifiedAt: new Date() },
      { new: true }
    );

    if (note) {
      res.json(note);
    } else {
      res.status(404).send("Note not found");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//DELETE Endpoint
app.delete("/api/notes/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndRemove(req.params.id);

    if (note) {
      res.status(204).send();
    } else {
      res.status(404).send("Note not found");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);

//Sign Up Endpoint
app.post("/api/notes/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).send("Account created successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//Login Endpoint
const jwt = require("jsonwebtoken");

app.post("/api/notes/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user._id }, jwtSecret, {
        expiresIn: "1h",
      });
      res.json({ token });
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//Search Endpoint
app.get("/api/notes/search", async (req, res) => {
  try {
    const { title } = req.query;
    const notes = await Note.find({ title: new RegExp(title, "i") });
    res.json(notes);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
