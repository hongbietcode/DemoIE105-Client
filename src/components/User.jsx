/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from "react";
import {useSyncUser} from "../hooks/socketIO";
import "./User.css";

const classNames = require("classnames");

export default function User(props) {
	const {user, socket} = props;
	const syncUsers = useSyncUser(socket._socket);
	const [active, setActive] = useState(user.online);

	useEffect(() => {
		if (syncUsers) {
			if (syncUsers.userId === user.userId) {
				if (syncUsers.state === "active") {
					setActive(true);
				} else if (syncUsers.state === "disconnect") {
					setActive(false);
				}
			}
		}
	}, [JSON.stringify(syncUsers)]);
	return (
		<div className="user">
			<div className="user__images">
				<div className={classNames({user__active: active})}></div>
				<img src={user.avatar} alt="avatar" style={{height: "40px"}} />
			</div>
			<div className="user__name">{user.name}</div>
			<input type="hidden" value={user.userId} />
		</div>
	);
}
