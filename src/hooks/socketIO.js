import socketIOClient from "socket.io-client";
import {useEffect, useState} from "react";
import Cookie from "js-cookie";
import {BASE_SERVER_URL} from "../baseURL";

export const useReceive = (socket) => {
	const [message, setMessage] = useState("");
	useEffect(() => {
		socket.on("SERVER", (data) => {
			setMessage(data);
		});
	}, [socket]);

	return message;
};

export const useSyncUser = (socket) => {
	const [users, setUsers] = useState();
	useEffect(() => {
		socket.on("ACTIVE_USER", (data) => {
			setUsers(data);
		});
		socket.on("UN_ACTIVE_USER", (data) => {
			setUsers(data);
		});
	});
	return users;
};

class SocketIO {
	_socket;
	constructor(userId) {
		this._socket = socketIOClient(BASE_SERVER_URL);

		const user = {
			user: Cookie.get("user"),
			userId: userId,
		};
		this._socket.emit("USER_ID", user);
	}

	SendMessage(data, aes) {
		const message = {
			aes: aes,
			user: data.user,
			userId: data.userId,
			payload: data.payload,
		};
		console.log("send-message :", message);
		this._socket.emit("CLIENT", message);
	}

	Logout(userId) {
		this._socket.emit("LOGOUT", userId);
	}

	Disconnect(userId) {
		this._socket.close();
	}
}

export default SocketIO;
