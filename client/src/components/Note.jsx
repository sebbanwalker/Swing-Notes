import React, { useState } from "react";
import style from "./Note.module.scss";
import Modal from "../components/Modal";

const Note = ({ title, description, date, modifiedAt, onSave, onDelete }) => {
	const [showModal, setShowModal] = useState(false);

	return (
		<section className={style.note}>
			{showModal ? (
				<section className={style.modalOverlay}>
					<Modal
						note={{ title, text: description }}
						onSave={(newTitle, newDescription) => {
							if (newTitle !== title || newDescription !== description) {
								onSave(newTitle, newDescription, new Date().toISOString());
							} else {
								onSave(newTitle, newDescription);
							}
							setShowModal(false);
						}}
						onClose={() => setShowModal(false)}
					/>
				</section>
			) : (
				<>
					<h2 className={style.title}>{title}</h2>
					<p className={style.description}>{description}</p>
					<p className={style.date}>
						Created at: {new Date(date).toLocaleString()}
					</p>
					<p className={style.date}>
						{modifiedAt &&
							`Modified at: ${new Date(modifiedAt).toLocaleString()}`}
					</p>
					<section className={style.buttons}>
						<button
							className={style.editButton}
							onClick={() => setShowModal(true)}>
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
