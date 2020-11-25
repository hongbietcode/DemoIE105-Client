import socketIOClient from "socket.io-client";
import {useEffect, useState} from "react";

export const useReceive = (socket) => {
	const [message, setMessage] = useState("");
	useEffect(() => {
		// console.log("Listen server");
		socket.on("SERVER", (data) => {
			setMessage(data);
			console.log(data);
		});
	}, [socket]);

	return message;
};

class SocketIO {
	_socket;
	constructor(userId, aes) {
		this._socket = socketIOClient(process.env.REACT_APP_SERVER_BASE);
		this._socket.emit("USER_ID", userId);
	}

	SendMessage(message, aes) {
		// socket.emit("CLIENT", message);
		this._socket.emit("CLIENT", {
			aes: aes,
			user: message.user,
			userId: message.userId,
			payload: message.payload,
		});
	}

	Disconnect(userId) {
		this._socket.emit("WILL_DISCONNECT", userId).close();
	}
}

export default SocketIO;
