import React, {useEffect, useState} from "react";
import Chart from "../components/Chart";
import LoginForm from "../components/LoginForm";
import SocketIO from "../hooks/socketIO";
import "./MainPage.css";
import Cookie from "js-cookie";
import { BASE_SERVER_URL } from "../baseURL";

const axios = require("axios");

export default function MainPage(props) {
	const {mode, setMode} = props;
	const safeMode = localStorage.getItem("AESKey") ? true : false;
	const [users, setUsers] = useState([]);
	const UserId = Cookie.get("userId");

	useEffect(() => {
		axios
			.get(BASE_SERVER_URL + "/api/users", {params: {id: UserId}})
			.then((res) => {
				setUsers(res.data);
			});
	}, [UserId]);
	return (
		<div id="main-page" className="hero is-light">
			{mode === "do-login" && <LoginForm setMode={setMode} />}
			{/* {mode === "main" && ""} */}
			{(mode === "login" || mode === "logout") && (
				<Chart
					socket={new SocketIO(UserId, safeMode)}
					mode={mode}
					setMode={setMode}
					users={users}
				/>
			)}
		</div>
	);
}
