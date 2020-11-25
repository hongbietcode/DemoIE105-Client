import React from "react";
import Chart from "../components/Chart";
import LoginForm from "../components/LoginForm";
import SocketIO from "../hooks/socketIO";
import "./MainPage.css";
import Cookie from "js-cookie";

export default function MainPage(props) {
	const {mode, setMode} = props;
	const safeMode = localStorage.getItem("AESKey") ? true : false;

	return (
		<div id="main-page" className="hero is-light">
			{mode === "do-login" && <LoginForm setMode={setMode} />}
			{/* {mode === "main" && ""} */}
			{(mode === "login" || mode === "logout") && (
				<Chart
					socket={new SocketIO(Cookie.get("userId"), safeMode)}
					mode={mode}
					setMode={setMode}
				/>
			)}
		</div>
	);
}
