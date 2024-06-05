import React, { useState } from "react";
import style from "./Modal.module.scss";

const Modal = ({ note, onSave, onClose }) => {
	const [noteTitle, setNoteTitle] = useState(note.title);
	const [noteDescription, setNoteDescription] = useState(note.text);

	const handleSave = () => {
		onSave(noteTitle, noteDescription);
		onClose();
	};

	return (
		<section className={style.modalOverlay}>
			<section className={style.modal}>
				<section className={style.content}>
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
						SAVE NOTE
					</button>
					<button className={style.closeButton} onClick={onClose}>
						CLOSE
					</button>
				</section>
			</section>
		</section>
	);
};

export default Modal;
