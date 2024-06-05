import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Note from "../components/Note";
import axios from "axios";
import style from "./NotesPage.module.scss";
import Modal from "../components/Modal";

const NotesPage = () => {
	const [notes, setNotes] = useState([]);
	const [newNote, setNewNote] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [editingNote, setEditingNote] = useState(null);
	const [isNewNote, setIsNewNote] = useState(false);

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
		setEditingNote({
			title: "",
			text: "",
			date: new Date().toISOString(),
			isEditable: true,
		});
		setIsNewNote(true);
		setModalOpen(true);
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
				setModalOpen(false);
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

	const handleEditNote = async (noteId, newTitle, newText) => {
		const userId = localStorage.getItem("userId");
		try {
			const response = await axios.put(
				`http://localhost:5173/notes/${noteId}`,
				{
					userId,
					title: newTitle,
					text: newText,
					date: new Date().toISOString(),
				}
			);

			if (response.data) {
				setNotes(
					notes.map((note) => (note._id === noteId ? response.data : note))
				);
				setModalOpen(false);
			} else {
				console.error("API response is not an object:", response.data);
			}
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
							onDelete={() => handleDeleteNote(note._id)}
							onSave={(newTitle, newText) =>
								handleEditNote(note._id, newTitle, newText)
							}
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
			{newNote && (
				<Note
					{...newNote}
					onSave={(newTitle, newText) => {
						handleSaveNote(newTitle, newText);
						setNewNote(null);
					}}
				/>
			)}
			{modalOpen && (
				<Modal
					note={editingNote}
					onSave={(newTitle, newText) => {
						if (isNewNote) {
							handleSaveNote(newTitle, newText);
						} else {
							handleEditNote(editingNote._id, newTitle, newText);
						}
						setModalOpen(false);
					}}
					onClose={() => setModalOpen(false)}
				/>
			)}
			<section className={style.buttonContainer}>
				<button className={style.create} onClick={handleCreateNote}>
					Create Note
				</button>
			</section>
		</>
	);
};

export default NotesPage;
