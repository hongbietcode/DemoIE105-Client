import React from "react";
import LoginForm from "../components/LoginForm";
import "./MainPage.css";

export default function MainPage(props) {
	const {mode, setMode} = props;
	return (
		<div id="main-page" className="hero is-light">
			{mode === "login" && <LoginForm setMode={setMode} />}
			{mode === "main" && <p className="is-size-1">Home</p>}
		</div>
	);
}
