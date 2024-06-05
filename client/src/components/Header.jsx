import React, { useState, useEffect } from "react";
import HeaderImage from "../assets/logo-large.svg";
import style from "./Header.module.scss";
import { useNavigate } from "react-router-dom";

const Header = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [username, setUsername] = useState("");
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			const user = JSON.parse(storedUser);
			setUsername(user.username);
			setIsLoggedIn(true);
		}
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("user");
		setIsLoggedIn(false);
		setUsername("");
		navigate("/login");
	};

	return (
		<section className={style.headerContainer}>
			<img src={HeaderImage} className={style.headerImage}></img>
			<article className={style.headerButtonContainer}>
				<button
					className={style.headerButton}
					onClick={() => navigate("/notes")}>
					Notes
				</button>
				<button
					className={style.headerButton}
					onClick={() => navigate("/signup")}>
					Sign Up
				</button>
				{isLoggedIn ? (
					<div className={style.dropdown}>
						<button
							className={style.headerButton}
							onClick={() => setDropdownOpen(!dropdownOpen)}>
							{username}
						</button>
						{dropdownOpen && (
							<div className={style.dropdownContent}>
								<button onClick={handleLogout}>Logout</button>
							</div>
						)}
					</div>
				) : (
					<button
						className={style.headerButton}
						onClick={() => navigate("/login")}>
						Login
					</button>
				)}
			</article>
		</section>
	);
};

export default Header;
