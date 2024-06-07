import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import styles from "./SignUpPage.module.scss";
import axios from "axios";

const SignUpPage = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (password !== confirmPassword) {
			alert("Passwords do not match.");
			return;
		}

		try {
			const response = await axios.post("http://localhost:5000/notes/signup", {
				username,
				password,
			});

			localStorage.setItem("token", response.data.token);
			localStorage.setItem("username", username); // Store username
			localStorage.setItem("userId", response.data.userId); // Store userId if returned from server

			navigate("/notes");
		} catch (error) {
			console.error("Error signing up:", error);
			if (error.response) {
				if (error.response.data.includes("duplicate key error")) {
					alert("Username already exists. Please choose another one.");
				} else {
					alert(error.response.data);
				}
			} else if (error.request) {
				alert("Server did not respond. Please try again.");
			} else {
				alert("Request failed. Please try again.");
			}
		}
	};

	return (
		<>
			<Header />
			<form onSubmit={handleSubmit} className={styles.form}>
				<label className={styles.inputContainer}>
					<p className={styles.label}>Username:</p>
					<input
						className={styles.input}
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</label>
				<label className={styles.inputContainer}>
					<p className={styles.label}>Password:</p>
					<input
						className={styles.input}
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</label>
				<label className={styles.inputContainer}>
					<p className={styles.label}>Confirm password:</p>
					<input
						className={styles.input}
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</label>
				<button className={styles.submit} type="submit">
					Sign Up
				</button>
			</form>
		</>
	);
};

export default SignUpPage;
