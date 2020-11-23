const CryptoJS = require("crypto-js");

export const randomClientKey = () => {
	var clientKey = CryptoJS.lib.WordArray.random(128 / 8).toString();
	window.localStorage.setItem("clientKey", clientKey);
	return clientKey;
};

//generate key AES
export const AESGenerateSecretKey = (secretKey, clientKey) => {
	const AESKey128Bits = CryptoJS.PBKDF2(secretKey, clientKey, {
		keySize: 128 / 32,
	}).toString();

	window.localStorage.setItem("AESKey", AESKey128Bits);
	return AESKey128Bits;
};

export const AESEncrypt = (jsonData) => {
	const key = window.localStorage.getItem("AESKey");
	return CryptoJS.AES.encrypt(JSON.stringify(jsonData), key).toString();
};

export const AESDecrypt = (encrypt) => {
	const key = window.localStorage.getItem("AESKey");
	return JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(encrypt, key)));
};
