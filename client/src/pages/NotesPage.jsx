import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Note from "../components/Note";
import axios from "axios";
import style from "./NotesPage.module.scss";

const NotesPage = () => {
	const [notes, setNotes] = useState([]);
	const [newNote, setNewNote] = useState(null);

	useEffect(() => {
		const fetchNotes = async () => {
			try {
				const userId = localStorage.getItem("userId");
				const response = await axios.get(`http://localhost:5173/notes`, {
					params: { userId },
				});
				if (Array.isArray(response.data)) {
					setNotes(response.data);
				} else {
					console.error("API response is not an array:", response.data);
					setNotes([]);
				}
			} catch (err) {
				console.error("API request failed:", err);
				setNotes([]);
			}
		};
		fetchNotes();
	}, []);

	const handleCreateNote = () => {
		setNewNote({
			title: "",
			text: "",
			date: new Date().toISOString(),
			isEditable: true,
		});
	};

	const handleSaveNote = async (title, text) => {
		const userId = localStorage.getItem("userId");
		try {
			const response = await axios.post("http://localhost:5173/notes", {
				userId,
				title,
				text,
				date: new Date().toISOString(),
			});

			if (response.data) {
				setNotes([...notes, response.data]);
				setNewNote(null);
			} else {
				console.error("API response is not an object:", response.data);
			}
		} catch (err) {
			console.error("API request failed:", err);
		}
	};

	const handleDeleteNote = async (noteId) => {
		const userId = localStorage.getItem("userId");
		try {
			await axios.delete(`http://localhost:5173/notes/${noteId}`, {
				params: { userId },
			});

			setNotes(notes.filter((note) => note._id !== noteId));
		} catch (err) {
			console.error("API request failed:", err);
		}
	};

	return (
		<>
			<Header />
			{notes && notes.length > 0 ? (
				<section className={style.notes}>
					{notes.map((note) => (
						<Note
							key={note._id}
							title={note.title}
							description={note.text}
							date={note.createdAt}
							isEditable={false}
							onDelete={() => handleDeleteNote(note._id)}
						/>
					))}
				</section>
			) : (
				<section className={style.message}>
					<p>There are no notes here :( Create one?</p>
					<button className={style.create} onClick={handleCreateNote}>
						Create Note
					</button>
				</section>
			)}
			{newNote && <Note {...newNote} onSave={handleSaveNote} />}
		</>
	);
};

export default NotesPage;
