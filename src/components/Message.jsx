import React from "react";
import "./Message.css";

const classNames = require("classnames");

export default function Message(props) {
	const {value, user, current} = props;

	return (
		<div
			className={classNames("message", {"my-message": current})}
			style={{backgroundColor: "transparent", margin: "10px"}}>
			<div className="message__user">
				<div>{user}</div>
			</div>
			<div className="message__content">{value}</div>
		</div>
	);
}
