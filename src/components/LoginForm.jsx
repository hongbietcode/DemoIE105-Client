/* eslint-disable react-hooks/exhaustive-deps */
import Cookie from "js-cookie";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {BASE_SERVER_URL, DIFFIE_HELLMAN_GROUP} from "../config";
import logo from "../images/tiger-head.png";
import {AESDecrypt, AESGenerateSecretKey, randomClientKey} from "../service/AESCrypto";
import DF_Client from "../service/DiffieHellman";
import {RsaEncrypt} from "../service/RSACrypto";
import "./LoginForm.css";

const axios = require("axios");

export default function LoginForm(props) {
	const {setMode} = props;

	const DF = useMemo(() => new DF_Client(DIFFIE_HELLMAN_GROUP), []);

	const [checked, setChecked] = useState(false);
	const [error, setError] = useState({isError: false, message: null});
	const [key, setKey] = useState({rsaPublicKey: null, dfServerPublicKey: null});

	const usernameRef = useRef(null);
	const passwordRef = useRef(null);

	useEffect(() => {
		if (checked) {
			axios.get(BASE_SERVER_URL + "/api/key").then((res) => {
				const KeyServer = {
					rsaPublicKey: res.data.rsaPublicKey,
					dfServerPublicKey: res.data.dfServerPublicKey,
				};
				setKey(KeyServer);
				alert(`Server → public key RSA: \n${KeyServer.rsaPublicKey}`);
				alert(`Server → public key Diffie-Hellman: \n${KeyServer.dfServerPublicKey}`);

				const DF_Client = {
					prime: DF.getPrime(),
					generator: DF.getGenerator(),
					privateKey: DF.getPrivateKey(),
					publicKey: DF.getPublicKey(),
				};
				console.log("DF_Client[Base64]", DF_Client);

				const AESKey = AESGenerateSecretKey(DF, KeyServer.dfServerPublicKey);
				console.log("Generate AES key with Diffie-Hellman", AESKey);
			});
		}
	}, [checked]);

	const submitHandler = (event) => {
		event.preventDefault();
		var data = {
			username: usernameRef.current.value,
			password: passwordRef.current.value,
		};

		if (checked) {
			const clientKey = randomClientKey(DF);
			//them client key vao du lieu gui di
			data = {
				...data,
				clientKey: clientKey,
			};

			//gui du lieu bang ma hoa rsa
			data = {
				rsa: RsaEncrypt(key.rsaPublicKey, 1024, JSON.stringify(data)),
			};
		}

		axios
			.post(BASE_SERVER_URL + "/api/login", data)
			.then((response) => {
				if (response.status === 200) {
					setError({
						isError: false,
						message: null,
					});

					//safe mode AES crypto
					if (checked) {
						response.data = AESDecrypt(response.data.aes);
					}

					const token = response.data.token;
					const user = response.data.user.name;
					const userId = response.data.user.id;

					console.log("Login successful", response.data);
					if (user && token) {
						Cookie.set("quochoi", token);
						Cookie.set("user", user);
						Cookie.set("userId", userId);
						setMode("login");
					} else {
						setError({
							isError: true,
							message: "Secret key incorrect",
						});
					}
				}
			})
			.catch(() => {
				setError({
					isError: true,
					message: "Username or password is incorrect",
				});
			});
	};

	return (
		<div id="login-container">
			<div
				id="login-form"
				className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
				<img src={logo} alt="logo" style={{height: "80px"}} className="mb-5" />
				<form onSubmit={submitHandler}>
					<div className="field">
						<p className="control has-icons-left has-icons-right">
							<input
								ref={usernameRef}
								className="input"
								type="text"
								placeholder="Username"
								required
							/>
							<span className="icon is-small is-left">
								<i className="fas fa-user"></i>
							</span>
							{/* <span className="icon is-small is-right">
							<i className="fas fa-check"></i>
						</span> */}
						</p>
					</div>
					<div className="field">
						<p className="control has-icons-left">
							<input
								ref={passwordRef}
								className="input"
								type="password"
								placeholder="Password"
								required
							/>
							<span className="icon is-small is-left">
								<i className="fas fa-lock"></i>
							</span>
						</p>
					</div>
					<div className="mb-3">
						<input
							type="checkbox"
							id="safe"
							className="mr-2"
							value="true"
							checked={checked}
							onChange={() => setChecked(!checked)}
						/>
						<label htmlFor="safe">SafeMode</label>
					</div>
					<button className="button is-primary is-fullwidth">Login</button>
					{error.isError && <span className="has-text-danger">{error.message}</span>}
				</form>
			</div>
		</div>
	);
}
