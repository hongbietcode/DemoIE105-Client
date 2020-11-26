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
	if (key) return CryptoJS.AES.encrypt(JSON.stringify(jsonData), key).toString();
	return "😀";
};

export const AESDecrypt = (encrypt) => {
	const key = window.localStorage.getItem("AESKey");
	if (key) return JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(encrypt, key)));
	return encrypt;
};

export const AESEncryptMessage = (message) => {
	const key = window.localStorage.getItem("AESKey");
	if (key) return CryptoJS.AES.encrypt(message, key).toString();
	return "😀";
};

export const AESDecryptMessage = (encrypt) => {
	const key = window.localStorage.getItem("AESKey");
	if (key) return CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(encrypt, key));
	return encrypt;
};
