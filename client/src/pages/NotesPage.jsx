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

	const userId = localStorage.getItem("userId");
	console.log("userId:", userId);

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
		const userId = localStorage.getItem("userId");
		if (userId === null) {
			alert("You need to log in to create a note.");
			return;
		} else {
			setEditingNote({
				title: "",
				text: "",
				date: new Date().toISOString(),
				isEditable: true,
			});
			setIsNewNote(true);
			setModalOpen(true);
		}
	};

	const handleSaveNote = async (title, text, date) => {
		const userId = localStorage.getItem("userId");
		try {
			const response = await axios.post("http://localhost:5173/notes", {
				userId,
				title,
				text,
				date,
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

	const handleEditNote = async (noteId, newTitle, newText, date) => {
		const userId = localStorage.getItem("userId");
		try {
			const response = await axios.put(
				`http://localhost:5173/notes/${noteId}`,
				{
					userId,
					title: newTitle,
					text: newText,
					date,
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
			{userId !== null ? (
				notes && notes.length > 0 ? (
					<section className={style.notes}>
						{notes.map((note) => (
							<Note
								key={note._id}
								title={note.title}
								description={note.text}
								date={note.createdAt}
								onDelete={() => handleDeleteNote(note._id)}
								onSave={(newTitle, newText) =>
									handleEditNote(
										note._id,
										newTitle,
										newText,
										new Date().toISOString()
									)
								}
								modifiedAt={note.modifiedAt}
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
				)
			) : (
				<section className={style.message}>
					<p>You need to log in to see notes.</p>
				</section>
			)}
			{newNote && (
				<Note
					{...newNote}
					onSave={(newTitle, newText) => {
						handleSaveNote(newTitle, newText, new Date().toISOString());
						setNewNote(null);
					}}
				/>
			)}
			{modalOpen && (
				<Modal
					note={editingNote}
					onSave={(newTitle, newText) => {
						if (isNewNote) {
							handleSaveNote(newTitle, newText, new Date().toISOString());
						} else {
							handleEditNote(
								editingNote._id,
								newTitle,
								newText,
								new Date().toISOString()
							);
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
