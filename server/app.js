const express = require("express");
const history = require("express-history-api-fallback");
const mongoose = require("mongoose");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

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
	userId: mongoose.Schema.Types.ObjectId,
	date: { type: Date, default: Date.now },
	createdAt: { type: Date, default: Date.now },
	modifiedAt: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", noteSchema);

app.use((req, res, next) => {
	console.log(`${req.method} ${req.path}`);
	next();
});

app.get("/notes", async (req, res) => {
	try {
		const notes = await Note.find();
		res.status(200).json(notes);
	} catch (err) {
		console.error(err);
		res.status(500).send(err.message);
	}
});

app.get("/notes/search", async (req, res) => {
	try {
		const { title } = req.query;
		const notes = await Note.find({ title: new RegExp(title, "i") });
		res.json(notes);
	} catch (err) {
		console.error(err);
		res.status(500).send(err.message);
	}
});

app.post("/notes", async (req, res) => {
	try {
		const { title, text, userId } = req.body;
		const newNote = new Note({ title, text, userId });
		await newNote.save();
		res.status(201).json(newNote);
	} catch (err) {
		res.status(500).send(err.message);
	}
});

app.put("/notes/:id", async (req, res) => {
	try {
		const { title, text, date } = req.body;
		const note = await Note.findByIdAndUpdate(
			req.params.id,
			{ title, text, modifiedAt: new Date(date) },
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

app.delete("/notes/:id", async (req, res) => {
	try {
		const note = await Note.findByIdAndDelete(req.params.id);

		if (note) {
			console.log("Successful deletion");
			res.status(204).send();
		} else {
			res.status(404).send("Note not found");
		}
	} catch (err) {
		console.error(err);
		res.status(500).send(err.message);
	}
});

const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
	username: { type: String, unique: true, required: true },
	password: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
	if (this.isModified("password") || this.isNew) {
		this.password = await bcrypt.hash(this.password, 10);
	}
	next();
});

const User = mongoose.model("User", userSchema);

app.post("/notes/signup", async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = new User({ username, password });
		await user.save();
		res.status(201).send("Account created successfully");
	} catch (err) {
		res.status(500).send(err.message);
	}
});

const jwt = require("jsonwebtoken");

app.post("/notes/login", async (req, res) => {
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
		console.error(err);
		res.status(500).send(err.message);
	}
});

app.get("/notes/search", async (req, res) => {
	try {
		const { title } = req.query;
		const notes = await Note.find({ title: new RegExp(title, "i") });
		res.json(notes);
	} catch (err) {
		console.error(err);
		res.status(500).send(err.message);
	}
});

const root = path.join(__dirname, "client", "public");
app.use(express.static(root));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "client", "public", "index.html"));
});

app.use(history("index.html", { root }));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
