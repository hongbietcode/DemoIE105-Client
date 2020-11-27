import Cookie from "js-cookie";
import React, {useEffect, useState} from "react";
import {BASE_SERVER_URL} from "../config";
import Chart from "../components/Chart";
import LoginForm from "../components/LoginForm";
import "./MainPage.css";

const axios = require("axios");

export default function MainPage(props) {
	const {mode, setMode} = props;
	const [users, setUsers] = useState([]);
	const userId = Cookie.get("userId");

	useEffect(() => {
		axios.get(BASE_SERVER_URL + "/api/users", {params: {id: userId}}).then((res) => {
			setUsers(res.data);
		});
	}, [userId]);
	return (
		<div id="main-page" className="hero is-light">
			{mode === "do-login" && <LoginForm setMode={setMode} />}
			{/* {mode === "main" && ""} */}
			{(mode === "login" || mode === "logout") && (
				<Chart mode={mode} setMode={setMode} users={users} />
			)}
		</div>
	);
}
