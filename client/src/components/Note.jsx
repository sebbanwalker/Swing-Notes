import React, { useState } from "react";
import style from "./Note.module.scss";

const Note = ({ title, description, date, isEditable, onSave, onDelete }) => {
	const [noteTitle, setNoteTitle] = useState(title);
	const [noteDescription, setNoteDescription] = useState(description);

	const handleSave = () => {
		onSave(noteTitle, noteDescription);
	};

	return (
		<section className={style.note}>
			{isEditable ? (
				<>
					<input
						className={style.editTitle}
						type="text"
						value={noteTitle}
						onChange={(e) => setNoteTitle(e.target.value)}
					/>
					<textarea
						className={style.editDescription}
						value={noteDescription}
						onChange={(e) => setNoteDescription(e.target.value)}
					/>
					<button className={style.saveButton} onClick={handleSave}>
						Save Note
					</button>
				</>
			) : (
				<>
					<h2 className={style.title}>{title}</h2>
					<p className={style.description}>{description}</p>
					<p className={style.date}>{new Date(date).toLocaleString()}</p>
					<section className={style.buttons}>
						<button
							className={style.editButton}
							onClick={() => setIsEditable(true)}>
							Edit Note
						</button>
						<button className={style.deleteButton} onClick={onDelete}>
							Delete Note
						</button>
					</section>
				</>
			)}
		</section>
	);
};

export default Note;
