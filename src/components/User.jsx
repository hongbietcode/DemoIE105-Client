import React from "react";
import lion from "../images/lion.png";
import "./User.css";

export default function User(props) {
	const {user} = props;
	return (
		<div className="user">
			<div className="user__images">
				<img src={lion} alt="avatar" style={{height: "40px"}} />
			</div>
			<div className="user__name">{user.name}</div>
			<input type="text" value={user.userId} hidden />
		</div>
	);
}
