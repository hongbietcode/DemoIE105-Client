/* eslint-disable react-hooks/exhaustive-deps */
import Cookie from "js-cookie";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {BASE_SERVER_URL} from "../config";
import {AESDecrypt, AESDecryptMessage, AESEncryptMessage} from "../cryptos/AESCrypto";
import SocketIO, {useReceive} from "../hooks/socketIO";
import "./Chart.css";
import Message from "./Message";
import User from "./User";

const axios = require("axios");
const classNames = require("classnames");

function Chart(props) {
	const safeMode = localStorage.getItem("AESKey") ? true : false;
	const userId = Cookie.get("userId");
	const user = Cookie.get("user");

	const socket = useMemo(() => new SocketIO(userId, safeMode), []);

	const {mode, setMode, users} = props;
	const [message, setMessage] = useState([]);
	const messageRef = useRef(null);
	const receive = useReceive(socket._socket);

	const enterHandler = (e) => {
		if (e.key === "Enter") {
			sendMessage();
		}
	};

	const sendButtonHandler = (e) => {
		sendMessage();
	};

	const sendMessage = () => {
		if (messageRef.current.value !== "") {
			var newMessage = {
				userId: userId,
				payload: messageRef.current.value,
				user: user,
			};
			setMessage([newMessage, ...message]);
			//Safe mode
			if (localStorage.getItem("AESKey")) {
				newMessage = {
					...newMessage,
					payload: AESEncryptMessage(newMessage.payload),
				};
				socket.SendMessage(newMessage, true);
			}
			//Unsafe mode
			else {
				socket.SendMessage(newMessage, false);
			}
			//clear input
			messageRef.current.value = null;
		}
	};

	useEffect(() => {
		if (safeMode) {
			axios
				.get(BASE_SERVER_URL + "/api/messages", {
					headers: {
						"x-auth-token": Cookie.get("quochoi"),
					},
				})
				.then((response) => {
					try {
						response.data = AESDecrypt(response.data);
						setMessage(response.data);
						console.log("Messages :", response.data);
					} catch {}
				});
		}
	}, []);

	useEffect(() => {
		if (receive !== "") {
			console.log("receive-message: ", receive);
			//Safe mode
			if (localStorage.getItem("AESKey")) {
				var newMessage;
				if (receive.aes === true) {
					newMessage = {
						...receive,
						payload: AESDecryptMessage(receive.payload),
					};
				} else {
					newMessage = receive;
				}

				setMessage([newMessage, ...message]);
			}
			//Unsafe mode
			else {
				setMessage([receive, ...message]);
			}
		}
	}, [receive]);

	useEffect(() => {
		if (mode === "logout") {
			Cookie.remove("userId");
			setMode("main");
		}
		return () => {
			socket.Logout(userId);
			socket.Disconnect(userId);
		};
	}, [mode]);

	return (
		<div className="chart">
			<div className="chart--user">
				<div className="user--container">
					{users &&
						users.map((user) => <User key={user.userId} user={user} socket={socket} />)}
				</div>
			</div>
			<div className="chart--message">
				<div className={classNames("message-box", {unsafe: !safeMode})}>
					{message.map((mes, index) => (
						<Message
							value={mes.payload}
							user={mes.user === user ? "me" : mes.user}
							current={mes.userId === userId}
							key={index}
						/>
					))}
				</div>
				<div className="control">
					<input
						ref={messageRef}
						className="input message-input"
						placeholder="Textarea"
						style={{resize: "none"}}
						onKeyUp={enterHandler}></input>
					<button
						onClick={sendButtonHandler}
						className="button is-primary"
						style={{top: "100%", transform: "translateY(-100%)"}}>
						Send
					</button>
				</div>
			</div>
		</div>
	);
}
export default React.memo(Chart);
