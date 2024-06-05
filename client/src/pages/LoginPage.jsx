import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const LoginPage = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleSubmit = (event) => {
		event.preventDefault();
		localStorage.setItem("userId", JSON.stringify({ username }));
		navigate("/notes");
	};

	return (
		<>
			<Header />
			<form onSubmit={handleSubmit}>
				<label>
					Username:
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</label>
				<label>
					Password:
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</label>
				<button type="submit">Login</button>
			</form>
		</>
	);
};

export default LoginPage;
