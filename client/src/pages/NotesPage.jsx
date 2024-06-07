import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Note from "../components/Note";
import Modal from "../components/Modal";
import style from "./NotesPage.module.scss";

const NotesPage = () => {
	const [notes, setNotes] = useState([]);
	const [filteredNotes, setFilteredNotes] = useState([]);
	const [newNote, setNewNote] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [editingNote, setEditingNote] = useState(null);
	const [isNewNote, setIsNewNote] = useState(false);
	const [error, setError] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	const userId = localStorage.getItem("userId");
	const token = localStorage.getItem("token");

	console.log("userId:", userId);
	console.log("token:", token);

	useEffect(() => {
		const fetchNotes = async () => {
			if (!userId || !token) {
				console.error("UserId or token not found in localStorage");
				setError("UserId or token not found. Please log in again.");
				return;
			}

			try {
				const response = await fetch(
					`http://localhost:5000/notes?userId=${userId}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				if (!response.ok) {
					if (response.status === 403) {
						throw new Error("Forbidden");
					}
					throw new Error(`Error: ${response.status}`);
				}
				const data = await response.json();
				if (Array.isArray(data)) {
					setNotes(data);
					setFilteredNotes(data);
				} else {
					console.error("API response is not an array:", data);
					setNotes([]);
					setFilteredNotes([]);
				}
			} catch (err) {
				console.error("API request failed:", err);
				setError("API request failed. Please log in again.");
				setNotes([]);
				setFilteredNotes([]);
			}
		};
		fetchNotes();
	}, [userId, token]);

	const handleCreateNote = () => {
		if (!userId) {
			alert("You need to log in to create a note.");
			return;
		}
		setEditingNote({
			title: "",
			text: "",
			date: new Date().toISOString(),
			isEditable: true,
		});
		setIsNewNote(true);
		setModalOpen(true);
	};

	const handleSaveNote = async (title, text, date) => {
		if (!userId || !token) {
			console.error("UserId or token not found in localStorage");
			setError("UserId or token not found. Please log in again.");
			return;
		}

		try {
			const response = await fetch("http://localhost:5000/notes", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ userId, title, text, date }),
			});

			if (!response.ok) {
				if (response.status === 403) {
					throw new Error("Forbidden");
				}
				throw new Error(`Error: ${response.status}`);
			}

			const data = await response.json();
			setNotes([...notes, data]);
			setFilteredNotes([...notes, data]);
			setNewNote(null);
			setModalOpen(false);
		} catch (err) {
			console.error("API request failed:", err);
			setError("API request failed. Please log in again.");
		}
	};

	const handleDeleteNote = async (noteId) => {
		if (!userId || !token) {
			console.error("UserId or token not found in localStorage");
			setError("UserId or token not found. Please log in again.");
			return;
		}

		try {
			const response = await fetch(`http://localhost:5000/notes/${noteId}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				if (response.status === 403) {
					throw new Error("Forbidden");
				}
				throw new Error(`Error: ${response.status}`);
			}

			const newNotes = notes.filter((note) => note._id !== noteId);
			setNotes(newNotes);
			setFilteredNotes(newNotes);
		} catch (err) {
			console.error("API request failed:", err);
			setError("API request failed. Please log in again.");
		}
	};

	const handleEditNote = async (noteId, newTitle, newText, date) => {
		if (!userId || !token) {
			console.error("UserId or token not found in localStorage");
			setError("UserId or token not found. Please log in again.");
			return;
		}

		try {
			const response = await fetch(`http://localhost:5000/notes/${noteId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ userId, title: newTitle, text: newText, date }),
			});

			if (!response.ok) {
				if (response.status === 403) {
					throw new Error("Forbidden");
				}
				throw new Error(`Error: ${response.status}`);
			}

			const data = await response.json();
			const updatedNotes = notes.map((note) =>
				note._id === noteId ? data : note
			);
			setNotes(updatedNotes);
			setFilteredNotes(updatedNotes);
			setModalOpen(false);
		} catch (err) {
			console.error("API request failed:", err);
			setError("API request failed. Please log in again.");
		}
	};

	const handleSearch = (event) => {
		const query = event.target.value.toLowerCase();
		setSearchQuery(query);
		const filtered = notes.filter((note) =>
			note.title.toLowerCase().includes(query)
		);
		setFilteredNotes(filtered);
	};

	return (
		<>
			<Header />
			{error && <p style={{ color: "red" }}>{error}</p>}
			{userId ? (
				<>
					<input
						type="text"
						placeholder="Search by title..."
						value={searchQuery}
						onChange={handleSearch}
						className={style.searchInput}
					/>
					{filteredNotes.length > 0 ? (
						<section className={style.notes}>
							{filteredNotes.map((note) => (
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
					) : searchQuery ? (
						<section className={style.message}>
							<p>No notes found with the title "{searchQuery}"</p>
							<button className={style.create} onClick={handleCreateNote}>
								Create Note
							</button>
						</section>
					) : (
						<section className={style.message}>
							<p>No notes available. Create one?</p>
							<button className={style.create} onClick={handleCreateNote}>
								Create Note
							</button>
						</section>
					)}
				</>
			) : (
				<section className={style.message}>
					<p>You need to log in to see notes.</p>
				</section>
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
