import React, { useState } from "react";
import style from "./NoteModal.module.scss";

const Modal = ({ note, onSave, onClose }) => {
	const [noteTitle, setNoteTitle] = useState(note.title);
	const [noteDescription, setNoteDescription] = useState(note.text);

	const handleSave = () => {
		onSave(noteTitle, noteDescription);
		onClose();
	};

	return (
		<div className={style.modal}>
			<div className={style.content}>
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
				<button className={style.closeButton} onClick={onClose}>
					Close
				</button>
			</div>
		</div>
	);
};

export default Modal;
