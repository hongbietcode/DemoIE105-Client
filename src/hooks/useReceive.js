import socketIOClient from "socket.io-client";
import {useEffect, useState} from "react";
import {serverBaseUrl} from "../constants/Server";

export const useReceive = () => {
	const [message, setMessage] = useState("");

	useEffect(() => {
		const socket = socketIOClient(serverBaseUrl);
		socket.on("FromAPI", (data) => {
			setMessage(data);
		});
	}, []);

	return message;
};
