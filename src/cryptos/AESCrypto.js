const CryptoJS = require("crypto-js");

export const randomClientKey = (DF) => {
	var clientKey = DF.getPublicKey();

	return clientKey;
};

//generate key AES
export const AESGenerateSecretKey = (DF, serverPublicKey) => {
	const AESKey = DF.generateSecretKey(serverPublicKey);
	window.localStorage.setItem("AESKey", AESKey);
	return AESKey;
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
